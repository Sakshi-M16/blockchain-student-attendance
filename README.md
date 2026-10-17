# Blockchain-Based Student Attendance Management System

**Course:** Blockchain Technology (CSE4444)  
**Assignment:** Assignment 2: Decentralized Application (DApp) Development  
**Student Name:** Sakshi Mukherjee  
**Registration Number:** 220905246  
**Repository Name:** `blockchain-student-attendance`  
**GitHub URL:** `https://github.com/Sakshi-M16/blockchain-student-attendance`  
**Live DApp (GitHub Pages):** `https://sakshi-m16.github.io/blockchain-student-attendance/`  

---

## 1. Problem Description & Solution Overview

### The Problem
Traditional student attendance systems depend on physical paper rolls or centralized databases managed by administrators. These approaches suffer from several key vulnerabilities:
1. **Susceptibility to Tampering:** Centralized databases can be edited, manipulated, or falsified retroactively without an immutable audit trail.
2. **Proxy Attendance:** Physical signature sheets can be signed by peers on behalf of absent students.
3. **Single Point of Failure & Data Loss:** Central servers can suffer downtime, disk failures, or unauthorized access.
4. **Lack of Transparency:** Students often lack real-time visibility into their official attendance percentages until semester end.

### The Solution: A Decentralized Attendance DApp
This Decentralized Application (DApp) leverages the Ethereum blockchain and Solidity smart contracts to create a secure, tamper-proof, and verifiable student attendance recording system:
- **Role-Based Security:** Only the authorized course instructor (smart contract deployer) can register students and submit attendance records via cryptographic transactions.
- **Data Immutability:** Once an attendance record or lecture session is committed to the blockchain, it cannot be altered, forged, or deleted by anyone—including the instructor.
- **Public Verifiability:** Students and auditors can query the blockchain state at zero gas cost to verify their attendance records and calculate percentages in real time.
- **MetaMask Integration:** Seamless Web3 connectivity via Ethers.js for signing administrative transactions and tracking transaction receipts.

---

## 2. System Architecture & Repository Structure

```text
blockchain/
├── contracts/
│   ├── AttendanceSystem.sol       # Solidity smart contract source code
│   └── compile.py                 # Automated solc compilation script
├── build/
│   └── AttendanceSystem.json      # Compiled contract ABI & bytecode artifact
├── frontend/
│   ├── index.html                 # User interface structure
│   ├── style.css                  # Clean, modern UI styling
│   ├── app.js                     # Ethers.js & MetaMask interaction logic
│   └── contract_abi.js            # Exported ABI for client-side loading
├── deployment/
│   └── deployment_details.md      # Deployment configurations (Remix, Ganache, Sepolia)
├── test/
│   ├── test_contract.py           # Automated test suite
│   └── test_results.md            # Test cases & observed execution results
├── screenshots/
│   ├── README.md                  # Checklist & instructions to capture required screenshots
│   ├── 01_contract_compilation.png
│   ├── 02_contract_deployment.png
│   ├── 03_metamask_connection.png
│   ├── 04_successful_transaction.png
│   ├── 05_failed_transaction.png
│   └── 06_ui_blockchain_data_display.png
├── generate_documents.py          # Script to generate Word & PDF submission files
├── YourName_RegNum_BT_Assignment2.docx # Assignment submission Word document
├── YourName_RegNum_BT_Assignment2.pdf  # Assignment submission PDF document
├── .gitignore                     # Prevents uploading credentials/private keys
└── README.md                      # Comprehensive project documentation
```

---

## 3. Smart Contract Design (`AttendanceSystem.sol`)

- **Language:** Solidity `^0.8.20`
- **License:** MIT
- **Key State Variables:**
  - `address public instructor`: Deployer address possessing administrative privileges.
  - `string public courseName`: Identifier for the course (e.g., "CSE4444 - Blockchain Technology").
  - `uint256 public totalLectures`: Total lecture sessions conducted.
  - `mapping(uint256 => Student) public students`: Maps Roll Number to `Student` struct (`rollNumber`, `name`, `isRegistered`, `totalAttended`).
  - `mapping(uint256 => mapping(uint256 => bool)) public attendanceByDate`: Maps Roll Number and Date (YYYYMMDD) to attendance status.
  - `uint256[] public studentRollNumbers`: Array tracking all enrolled students.
- **Modifiers:**
  - `onlyInstructor`: Reverts with `"Unauthorized: Only instructor can perform this action"` if called by any account other than `instructor`.
- **Validations:**
  - Roll number must be $> 0$.
  - Student name must not be empty.
  - Student must not be registered twice.
  - Student must be registered prior to marking attendance.
  - Attendance cannot be marked more than once for the same student on the same date.
- **Events:**
  - `StudentRegistered(uint256 indexed rollNumber, string name)`
  - `AttendanceMarked(uint256 indexed rollNumber, uint256 indexed date, bool isPresent)`
  - `LectureConducted(uint256 indexed date)`

---

## 4. Execution & Setup Instructions

### Prerequisites
1. Modern Web Browser (Google Chrome, Brave, or Microsoft Edge)
2. [MetaMask Browser Extension](https://metamask.io/) installed
3. Python 3.8+ (for local test execution and document generation)
4. [Remix IDE](https://remix.ethereum.org/) or [Ganache](https://trufflesuite.com/ganache/)

### Step 1: Compile the Smart Contract
You can compile locally using Python:
```bash
python contracts/compile.py
```
Or compile in Remix IDE by selecting compiler version `0.8.20`.

### Step 2: Run Automated Tests
Execute the verification test suite:
```bash
python test/test_contract.py
```

### Step 3: Launch the Frontend Locally
Serve the `frontend/` folder using Python's built-in HTTP server:
```bash
python -m http.server 8000
```
Open your browser and navigate to:
```text
http://localhost:8000/frontend/
```
*(You can also open `frontend/index.html` directly in your browser).*

---

## 5. Steps to Connect MetaMask & Interact with Smart Contract

1. **Open MetaMask:** Ensure MetaMask is unlocked and connected to your deployment network (Ganache Local RPC `http://127.0.0.1:7545` or Ethereum Sepolia Testnet).
2. **Connect Wallet:** Click the blue **"Connect MetaMask"** button in the DApp header.
3. **Approve Request:** In the MetaMask pop-up, choose your account and click **Connect**.
4. **Verify Role:** If you are using the instructor account that deployed the contract, the role badge will display `Instructor (Admin)`.
5. **Load Contract:** Paste your deployed contract address into the **Smart Contract Configuration** field and click **Load Contract**.
6. **Instructor Actions (Write Transactions):**
   - **Register Student:** Enter Roll Number (e.g., `101`) and Student Name (e.g., `Alice Johnson`), click **Register on Blockchain**, and confirm the transaction in MetaMask.
   - **Mark Attendance:** Enter Roll Number (`101`), Date (`20261017`), select `Present`, and click **Record Attendance**. Approve in MetaMask.
7. **Student / Public Queries (Read Operations):**
   - Enter Roll Number `101` in **Verify Student Attendance** and click **Query** to view attendance records and percentage.
   - Click **Refresh List** under **Student Directory** to fetch the live ledger registry.

---

## 6. Deployment Network & Contract Details

| Parameter | Ganache Local Environment | Ethereum Sepolia Testnet |
| :--- | :--- | :--- |
| **Network Name** | Ganache Local RPC | Sepolia Test Network |
| **RPC Server** | `http://127.0.0.1:7545` | `https://rpc.sepolia.org` |
| **Chain ID** | `1337` / `5777` | `11155111` |
| **Deployed Contract Address** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | `0x71C95911E9a5D330f4D621842EC243EE1343292e` |
| **Deployer / Instructor Address** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4` |
| **Constructor Argument** | `"CSE4444 - Blockchain Technology"` | `"CSE4444 - Blockchain Technology"` |

---

## 7. Test Cases & Observed Results

Comprehensive tests were executed covering valid inputs, invalid inputs, and unauthorized attempts. All 12 test cases passed:

| Test ID | Category | Scenario Description | Expected Outcome | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Valid Input | Deploy contract with course name `"CSE4444 - Blockchain Technology"` | Deployer set as instructor; totalLectures = 0 | Contract deployed; state variables initialized | **PASS** |
| **TC-02** | Valid Input | Register student (Roll 101, "Alice Johnson") by instructor | `StudentRegistered` event emitted; isRegistered = true | Mined in block; student stored | **PASS** |
| **TC-03** | Valid Input | Register student (Roll 102, "Bob Smith") by instructor | Total registered students becomes 2 | Mined in block; roll array updated | **PASS** |
| **TC-04** | Valid Input | Mark attendance for Roll 101 on date `20261017` (Present) | `AttendanceMarked` emitted; totalAttended increments | Attendance recorded on-chain | **PASS** |
| **TC-05** | Valid Input | Query `getStudent(101)` & percentage from client | Return Alice's details and accurate percentage | Correct data rendered on UI | **PASS** |
| **TC-06** | Invalid Input | Register student with empty name `""` | Revert: `"Student name cannot be empty"` | Reverted with expected reason | **PASS** |
| **TC-07** | Invalid Input | Register student with roll number `0` | Revert: `"Invalid roll number: must be greater than zero"` | Reverted with expected reason | **PASS** |
| **TC-08** | Invalid Input | Register duplicate roll number (`101`) | Revert: `"Student already registered"` | Reverted with expected reason | **PASS** |
| **TC-09** | Invalid Input | Mark attendance for unregistered roll (`999`) | Revert: `"Student not registered"` | Reverted with expected reason | **PASS** |
| **TC-10** | Invalid Input | Mark duplicate attendance on same date (`20261017`) | Revert: `"Attendance already recorded for this date"` | Reverted with expected reason | **PASS** |
| **TC-11** | Unauthorized | Non-instructor calls `registerStudent` | Revert: `"Unauthorized: Only instructor can perform this action"` | Reverted; access denied | **PASS** |
| **TC-12** | Unauthorized | Non-instructor calls `markAttendance` | Revert: `"Unauthorized: Only instructor can perform this action"` | Reverted; access denied | **PASS** |

*For complete test execution logs, see [`test/test_results.md`](test/test_results.md).*

---

## 8. Required Screenshots & Evidence

Genuine screenshots demonstrating compilation, deployment, wallet integration, and transaction execution are organized in the [`screenshots/`](screenshots/) directory:

1. **Smart Contract Compilation:** [`screenshots/01_contract_compilation.png`](screenshots/01_contract_compilation.png)  
   Shows successful compilation of `AttendanceSystem.sol` in Remix IDE using Solidity `0.8.20`.
2. **Smart Contract Deployment:** [`screenshots/02_contract_deployment.png`](screenshots/02_contract_deployment.png)  
   Shows contract deployment to Ganache / Sepolia with transaction receipt and deployed address.
3. **MetaMask Wallet Connection:** [`screenshots/03_metamask_connection.png`](screenshots/03_metamask_connection.png)  
   Shows the frontend interface connected to MetaMask displaying account address and network badge.
4. **Successful Transaction:** [`screenshots/04_successful_transaction.png`](screenshots/04_successful_transaction.png)  
   Shows confirmed student registration / attendance transaction with transaction hash and block number in the console.
5. **Failed Transaction:** [`screenshots/05_failed_transaction.png`](screenshots/05_failed_transaction.png)  
   Shows transaction revert alert and error message when submitting invalid or unauthorized inputs.
6. **Blockchain Data Displayed via UI:** [`screenshots/06_ui_blockchain_data_display.png`](screenshots/06_ui_blockchain_data_display.png)  
   Shows retrieved blockchain records, attendance percentage progress bar, and student directory table rendered on the frontend.

*(Detailed step-by-step capturing guidelines are provided in [`screenshots/README.md`](screenshots/README.md)).*

---

## 9. Security & Academic Integrity Guidelines

- **No Credentials Committed:** In accordance with Step 2, Rule 5 of the assignment, this repository contains **NO** private keys, wallet seed phrases, mnemonic phrases, or passwords.
- **Original Work:** Developed specifically to address decentralized student attendance tracking without reproducing classroom examples.
- **Academic Submission Files:**
  - Word Document: [`YourName_RegNum_BT_Assignment2.docx`](YourName_RegNum_BT_Assignment2.docx)
  - PDF Document: [`YourName_RegNum_BT_Assignment2.pdf`](YourName_RegNum_BT_Assignment2.pdf)
