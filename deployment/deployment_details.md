# Smart Contract Deployment Details

**Project Title:** Blockchain-Based Student Attendance Management System  
**Course:** Blockchain Technology (CSE4444) - Assignment 2  
**Contract Source File:** `contracts/AttendanceSystem.sol`  
**Solidity Compiler Version:** `0.8.20`  

---

## 1. Compilation Details (Remix IDE)

1. Open [Remix IDE](https://remix.ethereum.org/).
2. Create a new file inside the `contracts/` directory named `AttendanceSystem.sol`.
3. Paste the contents of `contracts/AttendanceSystem.sol`.
4. Navigate to the **Solidity Compiler** tab on the left sidebar:
   - **Compiler:** `0.8.20+commit.a1b79de6` (or any `^0.8.20`)
   - **Language:** Solidity
   - **EVM Version:** Default (Cancun / Shanghai / Paris)
   - Enable Optimization: Optional (200 runs recommended)
5. Click **Compile AttendanceSystem.sol**.
6. Verify a green checkmark appears on the compiler icon indicating zero errors.

---

## 2. Deployment Configurations

You can deploy the contract to either **Ganache** (local Ethereum blockchain) or an **Ethereum Test Network** (e.g., Sepolia Testnet) via MetaMask as required by the assignment guidelines.

### Option A: Deployment using Ganache (Local Blockchain)

- **Network Name:** Ganache Local
- **RPC Server:** `http://127.0.0.1:7545` (Ganache GUI) or `http://127.0.0.1:8545` (Ganache CLI)
- **Chain ID:** `1337` or `5777`
- **Currency Symbol:** `ETH`
- **Steps in Remix:**
  1. Open Ganache on your computer.
  2. In Remix IDE, go to the **Deploy & Run Transactions** tab.
  3. Under **ENVIRONMENT**, select **"Dev - Ganache Provider"** or **"External Http Provider"** with URL `http://127.0.0.1:7545`.
  4. Ensure your account is populated with 100 ETH.
  5. Select contract: `AttendanceSystem - contracts/AttendanceSystem.sol`.
  6. In the **Deploy** constructor input, enter:
     ```text
     "CSE4444 - Blockchain Technology"
     ```
  7. Click the orange **transact** button to deploy.
  8. Copy the deployed contract address from the **Deployed Contracts** section.

### Option B: Deployment using Ethereum Sepolia Testnet (via MetaMask)

- **Network Name:** Sepolia Test Network
- **RPC URL:** `https://sepolia.infura.io/v3/<YOUR-API-KEY>` or public RPC `https://rpc.sepolia.org`
- **Chain ID:** `11155111`
- **Currency Symbol:** `SepoliaETH`
- **Block Explorer:** [Sepolia Etherscan](https://sepolia.etherscan.io/)
- **Steps in Remix:**
  1. Open MetaMask and switch network to **Sepolia**.
  2. Ensure your account has Sepolia testnet ETH (obtainable from free faucets like Google Cloud Web3 Faucet or Sepolia PoW Faucet).
  3. In Remix, select **ENVIRONMENT:** **"Injected Provider - MetaMask"**.
  4. Confirm the connection prompt in MetaMask.
  5. Under Deploy constructor input, enter `"CSE4444 - Blockchain Technology"`.
  6. Click **transact** and approve the transaction in the MetaMask popup.
  7. Note the transaction hash and the newly deployed contract address.

---

## 3. Sample Deployment Records

| Parameter | Ganache Local Record | Sepolia Testnet Record |
| :--- | :--- | :--- |
| **Network** | Ganache (Chain ID 1337) | Sepolia (Chain ID 11155111) |
| **Contract Address** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | `0x71C95911E9a5D330f4D621842EC243EE1343292e` |
| **Deployer (Instructor)** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4` |
| **Constructor Param** | `"CSE4444 - Blockchain Technology"` | `"CSE4444 - Blockchain Technology"` |
| **Gas Used (Deploy)** | 984,320 units | 984,320 units |
| **Block Number** | Block #1 | Block #6,812,490 |

*(Note: When running your own deployment in Remix, paste your exact deployed address into the UI at `frontend/index.html` to connect seamlessly).*

---

## 4. Contract Functions & Gas Consumption Reference

| Function Name | Transaction Type | Typical Gas Used |
| :--- | :--- | :--- |
| `constructor` | Deployment (Write) | ~984,320 gas |
| `registerStudent` | State Change (Write) | ~68,450 gas |
| `markAttendance` | State Change (Write) | ~45,120 gas |
| `markBatchAttendance` | State Change (Write) | ~85,000 - 150,000 gas |
| `getStudent` | Call (Read-only) | Free (0 gas) |
| `getAttendancePercentage`| Call (Read-only) | Free (0 gas) |
| `getAllStudents` | Call (Read-only) | Free (0 gas) |
