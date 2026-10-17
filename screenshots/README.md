# Screenshots Guide & Checklist

This folder contains the verification screenshots required for **Blockchain Technology (CSE4444) Assignment 2**.

As required by the assignment guidelines and academic honesty policies:
> *"Do not invent deployment details, transaction evidence, or test results. Capture genuine screenshots."*

---

## Required Screenshots Checklist

| # | File Name | Required Content Description |
|---|---|---|
| **1** | `01_contract_compilation.png` | Remix IDE compiler tab showing `AttendanceSystem.sol` compiled successfully with Solidity `0.8.20` (green checkmark). |
| **2** | `02_contract_deployment.png` | Remix IDE Deploy & Run tab showing successful deployment to Ganache / Sepolia with contract address and terminal transaction receipt. |
| **3** | `03_metamask_connection.png` | Frontend user interface showing active MetaMask popup connecting account or connected status pill with account address. |
| **4** | `04_successful_transaction.png` | Successful student registration or attendance marking transaction showing confirmed transaction hash in console/MetaMask. |
| **5** | `05_failed_transaction.png` | Reverted/failed transaction (e.g. attempting to register an existing student or unauthorized caller) displaying error revert alert in UI. |
| **6** | `06_ui_blockchain_data_display.png` | Frontend user interface retrieving and displaying live student attendance records, percentage, and directory table. |

---

## Step-by-Step Instructions to Capture Each Screenshot

### Screenshot 1: Smart Contract Compilation (`01_contract_compilation.png`)
1. Open [Remix IDE](https://remix.ethereum.org/).
2. In the File Explorer, create `AttendanceSystem.sol` and paste code from `contracts/AttendanceSystem.sol`.
3. Open the **Solidity Compiler** tab (3rd icon on the left panel).
4. Select compiler `0.8.20`.
5. Click **Compile AttendanceSystem.sol**.
6. Take a screenshot showing the green checkmark and the compiled contract details.
7. Save as `screenshots/01_contract_compilation.png`.

---

### Screenshot 2: Smart Contract Deployment (`02_contract_deployment.png`)
1. In Remix IDE, switch to the **Deploy & Run Transactions** tab (4th icon).
2. Choose **ENVIRONMENT:**
   - **"Dev - Ganache Provider"** (if using Ganache at `127.0.0.1:7545`), OR
   - **"Injected Provider - MetaMask"** (if using Sepolia testnet).
3. Select `AttendanceSystem` from the Contract dropdown.
4. In constructor parameter field `_courseName`, type `"CSE4444 - Blockchain Technology"`.
5. Click **transact**.
6. In the bottom Remix terminal, expand the green transaction receipt showing block hash, contract address, and gas used.
7. Take a screenshot of Remix showing the deployed contract under "Deployed Contracts" and the transaction log.
8. Save as `screenshots/02_contract_deployment.png`.

---

### Screenshot 3: MetaMask Wallet Connection (`03_metamask_connection.png`)
1. Open `frontend/index.html` in your browser (e.g., Chrome/Brave/Edge with MetaMask extension installed).
2. Click the **Connect MetaMask** button in the top right.
3. MetaMask will prompt for connection authorization.
4. Capture a screenshot showing the connection confirmation or the connected status pill (`0x...`, Network, Role).
5. Save as `screenshots/03_metamask_connection.png`.

---

### Screenshot 4: Successful Transaction (`04_successful_transaction.png`)
1. Paste your deployed contract address into the configuration input and click **Load Contract**.
2. Under **1. Register Student**, enter Roll Number `101` and Name `"Alice Johnson"`.
3. Click **Register on Blockchain**.
4. Confirm the transaction in the MetaMask popup.
5. Wait for block confirmation. The UI console will display:
   ```text
   [System] Transaction confirmed in block #...! Gas used: ...
   ```
6. Take a screenshot showing the confirmed transaction in the console and MetaMask notification.
7. Save as `screenshots/04_successful_transaction.png`.

---

### Screenshot 5: Failed Transaction (`05_failed_transaction.png`)
1. Enter Roll Number `101` again in the **Register Student** form (or enter an unregistered roll number like `999` in Mark Attendance).
2. Click **Register on Blockchain**.
3. The transaction will fail / revert due to contract validation (`"Student already registered"`).
4. Take a screenshot showing the red revert error message in the DApp console or MetaMask transaction alert.
5. Save as `screenshots/05_failed_transaction.png`.

---

### Screenshot 6: Blockchain Data Displayed on UI (`06_ui_blockchain_data_display.png`)
1. Under **3. Verify Student Attendance**, enter Roll Number `101` and click **Query**.
2. Notice the student's name, registered status, attended lectures count, total lectures, and attendance percentage progress bar displayed.
3. Also view the **Student Directory** table displaying the student records fetched from the blockchain.
4. Capture a screenshot of this view showing live blockchain state displayed in the interface.
5. Save as `screenshots/06_ui_blockchain_data_display.png`.
