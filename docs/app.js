/**
 * app.js - Frontend logic for Blockchain Student Attendance Management System
 * Uses Ethers.js v5.7.2 to interact with Ethereum smart contract via MetaMask.
 */

// Application State
let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;
let instructorAddress = null;
let currentNetwork = null;

// DOM Elements
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletDetails = document.getElementById("walletDetails");
const accountDisplay = document.getElementById("accountDisplay");
const networkDisplay = document.getElementById("networkDisplay");
const roleDisplay = document.getElementById("roleDisplay");
const rolePill = document.getElementById("rolePill");
const courseDisplay = document.getElementById("courseDisplay");
const contractAddressInput = document.getElementById("contractAddressInput");
const loadContractBtn = document.getElementById("loadContractBtn");

const registerStudentForm = document.getElementById("registerStudentForm");
const markAttendanceForm = document.getElementById("markAttendanceForm");
const queryStudentForm = document.getElementById("queryStudentForm");
const btnRefreshDirectory = document.getElementById("btnRefreshDirectory");
const btnClearConsole = document.getElementById("btnClearConsole");
const consoleLog = document.getElementById("consoleLog");

// Console logger function
function logConsole(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const line = document.createElement("div");
  line.className = `console-line ${type}`;
  line.innerHTML = `[${timestamp}] ${message}`;
  consoleLog.prepend(line);
}

// Format Ethereum address for display (e.g. 0x1234...5678)
function formatAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// Initialize Provider & check if MetaMask is available
async function init() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    logConsole("MetaMask detected. Click 'Connect MetaMask' to link your wallet.", "info");

    // Listen for accounts change
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        currentAccount = accounts[0];
        accountDisplay.textContent = formatAddress(currentAccount);
        logConsole(`MetaMask account changed to: ${currentAccount}`, "info");
        checkInstructorRole();
      }
    });

    // Listen for chain/network change
    window.ethereum.on("chainChanged", (_chainId) => {
      window.location.reload();
    });

    // Check if already connected
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      await setupAccount(accounts[0]);
    }
  } else {
    logConsole("MetaMask extension not found. Please install MetaMask to interact with the blockchain.", "warning");
    connectWalletBtn.textContent = "MetaMask Not Installed";
    connectWalletBtn.disabled = true;
  }
}

// Connect MetaMask wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed. Please install it to use this DApp.");
    return;
  }
  try {
    logConsole("Requesting MetaMask connection...", "info");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length > 0) {
      await setupAccount(accounts[0]);
      logConsole(`MetaMask connected successfully! Account: ${accounts[0]}`, "success");
    }
  } catch (err) {
    console.error(err);
    logConsole(`MetaMask connection rejected or failed: ${err.message}`, "error");
  }
}

// Setup connected account details
async function setupAccount(account) {
  currentAccount = account;
  signer = provider.getSigner();
  
  // Get network
  const network = await provider.getNetwork();
  currentNetwork = network;

  accountDisplay.textContent = formatAddress(currentAccount);
  networkDisplay.textContent = network.name === "unknown" ? `Chain ID: ${network.chainId}` : network.name;
  
  connectWalletBtn.classList.add("hidden");
  walletDetails.classList.remove("hidden");

  // If contract address already provided in input or localStorage, load it
  const savedAddress = localStorage.getItem("attendance_contract_address") || contractAddressInput.value.trim();
  if (savedAddress) {
    contractAddressInput.value = savedAddress;
    await loadContract(savedAddress);
  }
}

// Disconnect handling
function handleDisconnect() {
  currentAccount = null;
  signer = null;
  contract = null;
  instructorAddress = null;
  connectWalletBtn.classList.remove("hidden");
  walletDetails.classList.add("hidden");
  roleDisplay.textContent = "Viewer";
  courseDisplay.textContent = "Course: Not Connected";
  logConsole("Wallet disconnected.", "warning");
}

// Load and initialize Contract instance
async function loadContract(address) {
  if (!address || !ethers.utils.isAddress(address)) {
    logConsole("Invalid contract address specified.", "error");
    alert("Please provide a valid Ethereum contract address.");
    return;
  }

  try {
    if (!signer) {
      signer = provider.getSigner();
    }

    if (typeof ATTENDANCE_SYSTEM_ABI === "undefined") {
      logConsole("Contract ABI not found. Please verify contract_abi.js is loaded.", "error");
      return;
    }

    contract = new ethers.Contract(address, ATTENDANCE_SYSTEM_ABI, signer);
    localStorage.setItem("attendance_contract_address", address);

    logConsole(`Attaching to Attendance contract at: ${address}...`, "info");

    // Fetch public state
    const courseName = await contract.courseName();
    instructorAddress = await contract.instructor();
    const totalLectures = await contract.totalLectures();

    courseDisplay.textContent = `Course: ${courseName} (Sessions: ${totalLectures.toString()})`;
    logConsole(`Contract loaded successfully! Course: "${courseName}", Instructor: ${instructorAddress}`, "success");

    checkInstructorRole();
    await refreshDirectory();
  } catch (err) {
    console.error("Contract loading error:", err);
    logConsole(`Failed to load contract at ${address}. Ensure the network matches your deployment: ${err.message}`, "error");
  }
}

// Check role of current connected account
function checkInstructorRole() {
  if (!currentAccount || !instructorAddress) return;

  if (currentAccount.toLowerCase() === instructorAddress.toLowerCase()) {
    roleDisplay.textContent = "Instructor (Admin)";
    roleDisplay.style.color = "#166534";
    logConsole("Authenticated as Instructor. Write functions enabled.", "success");
  } else {
    roleDisplay.textContent = "Student / Viewer";
    roleDisplay.style.color = "#64748b";
    logConsole("Connected as Viewer. Instructor functions will reject if called.", "info");
  }
}

// 1. Register Student
registerStudentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!contract) {
    alert("Please load a deployed contract first!");
    return;
  }

  const rollNumber = parseInt(document.getElementById("regRoll").value);
  const studentName = document.getElementById("regName").value.trim();

  if (!rollNumber || rollNumber <= 0) {
    logConsole("Validation Error: Roll number must be greater than 0.", "error");
    return;
  }
  if (!studentName) {
    logConsole("Validation Error: Student name cannot be empty.", "error");
    return;
  }

  try {
    logConsole(`Initiating transaction: Registering Roll #${rollNumber} (${studentName})...`, "info");
    const tx = await contract.registerStudent(rollNumber, studentName);
    logConsole(`Transaction submitted! Hash: ${tx.hash}. Waiting for block confirmation...`, "info");

    const receipt = await tx.wait();
    logConsole(`Transaction confirmed in block #${receipt.blockNumber}! Gas used: ${receipt.gasUsed.toString()}`, "success");

    // Reset inputs & refresh directory
    registerStudentForm.reset();
    await refreshDirectory();
  } catch (err) {
    console.error("Registration error:", err);
    const reason = extractErrorMessage(err);
    logConsole(`Transaction Failed / Reverted: ${reason}`, "error");
    alert(`Registration Failed: ${reason}`);
  }
});

// 2. Mark Attendance
markAttendanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!contract) {
    alert("Please load a deployed contract first!");
    return;
  }

  const rollNumber = parseInt(document.getElementById("attRoll").value);
  const dateVal = parseInt(document.getElementById("attDate").value);
  const statusRadios = document.getElementsByName("attStatus");
  let isPresent = true;
  for (const r of statusRadios) {
    if (r.checked) {
      isPresent = (r.value === "present");
      break;
    }
  }

  if (!rollNumber || rollNumber <= 0) {
    logConsole("Validation Error: Invalid roll number.", "error");
    return;
  }
  if (!dateVal || dateVal <= 0) {
    logConsole("Validation Error: Invalid date format. Use integer YYYYMMDD.", "error");
    return;
  }

  try {
    logConsole(`Initiating transaction: Mark Attendance for Roll #${rollNumber} on ${dateVal} as ${isPresent ? "Present" : "Absent"}...`, "info");
    const tx = await contract.markAttendance(rollNumber, dateVal, isPresent);
    logConsole(`Transaction submitted! Hash: ${tx.hash}. Waiting for block confirmation...`, "info");

    const receipt = await tx.wait();
    logConsole(`Attendance recorded on blockchain! Block #${receipt.blockNumber}, Gas used: ${receipt.gasUsed.toString()}`, "success");

    markAttendanceForm.reset();
    await refreshDirectory();
  } catch (err) {
    console.error("Attendance error:", err);
    const reason = extractErrorMessage(err);
    logConsole(`Transaction Failed / Reverted: ${reason}`, "error");
    alert(`Attendance Recording Failed: ${reason}`);
  }
});

// 3. Query Student Attendance
queryStudentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!contract) {
    alert("Please load a deployed contract first!");
    return;
  }

  const rollNumber = parseInt(document.getElementById("queryRoll").value);
  if (!rollNumber || rollNumber <= 0) {
    alert("Please enter a valid roll number.");
    return;
  }

  try {
    logConsole(`Querying blockchain for Roll #${rollNumber}...`, "info");
    const student = await contract.getStudent(rollNumber);
    
    if (!student.isRegistered) {
      logConsole(`Roll #${rollNumber} is NOT registered in the smart contract.`, "warning");
      alert(`Student with Roll #${rollNumber} is not registered.`);
      document.getElementById("queryResult").classList.add("hidden");
      return;
    }

    const totalLectures = await contract.totalLectures();
    let percentage = 0;
    try {
      percentage = await contract.getAttendancePercentage(rollNumber);
    } catch {
      percentage = totalLectures.toNumber() > 0 ? Math.floor((student.totalAttended.toNumber() * 100) / totalLectures.toNumber()) : 0;
    }

    // Populate UI
    document.getElementById("resStudentName").textContent = student.name;
    document.getElementById("resRollNumber").textContent = rollNumber;
    document.getElementById("resAttended").textContent = student.totalAttended.toString();
    document.getElementById("resTotal").textContent = totalLectures.toString();
    document.getElementById("resPercentage").textContent = `${percentage.toString()}%`;
    document.getElementById("resProgressBar").style.width = `${Math.min(100, percentage.toNumber())}%`;
    
    document.getElementById("queryResult").classList.remove("hidden");
    logConsole(`Data retrieved for ${student.name} (Roll #${rollNumber}): ${student.totalAttended.toString()}/${totalLectures.toString()} sessions attended (${percentage.toString()}%).`, "success");
  } catch (err) {
    console.error("Query error:", err);
    logConsole(`Error retrieving data for Roll #${rollNumber}: ${err.message}`, "error");
  }
});

// 4. Refresh Student Directory Table
async function refreshDirectory() {
  if (!contract) return;

  const tbody = document.getElementById("directoryTableBody");
  tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Loading blockchain records...</td></tr>`;

  try {
    const rollNumbers = await contract.getAllStudents();
    const totalLectures = await contract.totalLectures();

    if (rollNumbers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No students registered yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    for (const r of rollNumbers) {
      const student = await contract.getStudent(r);
      const attended = student.totalAttended.toNumber();
      const total = totalLectures.toNumber();
      const pct = total > 0 ? Math.floor((attended * 100) / total) : 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>#${r.toString()}</strong></td>
        <td>${student.name}</td>
        <td>${attended} / ${total}</td>
        <td><span class="badge ${pct >= 75 ? 'badge-public' : 'badge-admin'}">${pct}%</span></td>
      `;
      tbody.appendChild(tr);
    }
    logConsole(`Directory updated: ${rollNumbers.length} student record(s) loaded from blockchain.`, "info");
  } catch (err) {
    console.error("Directory fetch error:", err);
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to load directory.</td></tr>`;
  }
}

// Extract human-readable error from revert
function extractErrorMessage(err) {
  if (err.data && err.data.message) {
    return err.data.message;
  }
  if (err.error && err.error.message) {
    return err.error.message;
  }
  if (err.reason) {
    return err.reason;
  }
  if (err.message) {
    if (err.message.includes("User denied transaction signature")) {
      return "Transaction was rejected by user in MetaMask.";
    }
    if (err.message.includes("execution reverted:")) {
      const parts = err.message.split("execution reverted:");
      return parts[1] ? parts[1].split('"')[0].trim() : parts[1];
    }
    return err.message;
  }
  return "Unknown transaction error.";
}

// Event Listeners
connectWalletBtn.addEventListener("click", connectWallet);

loadContractBtn.addEventListener("click", () => {
  const addr = contractAddressInput.value.trim();
  if (addr) {
    loadContract(addr);
  } else {
    alert("Please enter a deployed contract address.");
  }
});

btnRefreshDirectory.addEventListener("click", refreshDirectory);

btnClearConsole.addEventListener("click", () => {
  consoleLog.innerHTML = `<div class="console-line info">[System] Console cleared.</div>`;
});

// Run init on window load
window.addEventListener("DOMContentLoaded", init);
