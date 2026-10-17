"""
generate_placeholder_guides.py - Generates clearly labeled guide cards
for the screenshots directory so that the folder is organized and files
match the README references until the user pastes their actual captures.
"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_guide_image(filename, title, subtitle, details):
    width, height = 900, 500
    image = Image.new("RGB", (width, height), color="#0F172A")
    draw = ImageDraw.Draw(image)

    # Outer border
    draw.rectangle([10, 10, width - 10, height - 10], outline="#38BDF8", width=3)
    draw.rectangle([18, 18, width - 18, height - 18], outline="#1E293B", width=2)

    # Title Banner
    draw.rectangle([20, 20, width - 20, 80], fill="#1E293B")
    draw.text((35, 38), f"SCREENSHOT EVIDENCE: {title.upper()}", fill="#38BDF8")

    # Body Content
    draw.text((40, 110), f"File Target: {filename}", fill="#94A3B8")
    draw.text((40, 140), f"Requirement: {subtitle}", fill="#F8FAFC")

    y = 190
    draw.text((40, y), "Checklist & Guidelines to Capture:", fill="#38BDF8")
    y += 30
    for line in details:
        draw.text((60, y), f"• {line}", fill="#E2E8F0")
        y += 28

    # Bottom notice
    draw.rectangle([20, height - 85, width - 20, height - 20], fill="#1E3A8A")
    draw.text((35, height - 70), "INSTRUCTION: Replace this placeholder with your genuine screenshot capture", fill="#FDE047")
    draw.text((35, height - 48), "Reference: See screenshots/README.md for exact step-by-step instructions.", fill="#E2E8F0")

    image.save(filename)
    print(f"Created: {filename}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))

    items = [
        (
            os.path.join(base_dir, "01_contract_compilation.png"),
            "1. Smart Contract Compilation",
            "Remix IDE Solidity Compilation",
            [
                "Open Remix IDE (https://remix.ethereum.org)",
                "Create contracts/AttendanceSystem.sol and paste contract code",
                "Select Solidity Compiler tab and choose version 0.8.20",
                "Click 'Compile AttendanceSystem.sol'",
                "Capture screenshot showing green checkmark and compiler details"
            ]
        ),
        (
            os.path.join(base_dir, "02_contract_deployment.png"),
            "2. Smart Contract Deployment",
            "Deploy to Ganache / Sepolia Testnet",
            [
                "Select 'Deploy & Run Transactions' tab in Remix",
                "Choose Environment: Dev - Ganache Provider or Injected Provider - MetaMask",
                "Provide constructor argument: 'CSE4444 - Blockchain Technology'",
                "Click 'transact' to deploy",
                "Capture screenshot showing deployed contract instance and terminal receipt"
            ]
        ),
        (
            os.path.join(base_dir, "03_metamask_connection.png"),
            "3. MetaMask Wallet Connection",
            "Frontend Wallet Linkage",
            [
                "Open frontend/index.html in your browser",
                "Click 'Connect MetaMask' in the top right",
                "Approve connection in MetaMask popup",
                "Capture screenshot showing connected address pill, network name, and role badge"
            ]
        ),
        (
            os.path.join(base_dir, "04_successful_transaction.png"),
            "4. Successful Transaction",
            "Student Registration / Attendance Marked",
            [
                "Load deployed contract address in the frontend config bar",
                "Fill in Roll Number (e.g. 101) and Name ('Alice Johnson')",
                "Click 'Register on Blockchain' and confirm transaction in MetaMask",
                "Capture screenshot showing transaction hash and confirmed status in the DApp console"
            ]
        ),
        (
            os.path.join(base_dir, "05_failed_transaction.png"),
            "5. Failed / Reverted Transaction",
            "Input Validation / Unauthorized Revert",
            [
                "Attempt to register roll 101 again (duplicate) or mark attendance for roll 999",
                "Alternatively, attempt to register from a non-instructor account",
                "Observe transaction revert / error notification",
                "Capture screenshot showing the red revert error alert in console or MetaMask"
            ]
        ),
        (
            os.path.join(base_dir, "06_ui_blockchain_data_display.png"),
            "6. Blockchain Data Displayed on UI",
            "Data Retrieval & Student Directory",
            [
                "Under '3. Verify Student Attendance', query Roll 101",
                "Observe retrieved student name, sessions attended, and attendance percentage bar",
                "Click 'Refresh List' under '4. Student Directory' to display all enrolled students",
                "Capture screenshot showing verified ledger records displayed in the UI"
            ]
        )
    ]

    for filename, title, subtitle, details in items:
        create_guide_image(filename, title, subtitle, details)

if __name__ == "__main__":
    main()
