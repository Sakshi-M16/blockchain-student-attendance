# Test Results Report: Blockchain-Based Student Attendance Management System

**Course:** Blockchain Technology (CSE4444)  
**Assignment:** Assignment 2  
**Contract:** `AttendanceSystem.sol`  
**Solidity Compiler:** `v0.8.20`  
**Execution Environment:** EVM / Remix IDE / Local Test Environment  

---

## 1. Overview
The `AttendanceSystem` smart contract was subjected to rigorous testing covering all categories mandated by the assignment guidelines:
- **Valid Inputs**: Proper deployment, student registration, attendance recording, and data queries.
- **Invalid Inputs**: Handling empty inputs, negative or zero values, duplicate registrations, non-existent student lookups, and duplicate records.
- **Unauthorized Inputs**: Role-based access control verification ensuring only the designated instructor can invoke administrative functions.

---

## 2. Test Execution Summary

| Total Test Cases | Passed | Failed | Pass Rate |
| :--- | :--- | :--- | :--- |
| **12** | **12** | **0** | **100%** |

---

## 3. Detailed Test Cases & Observed Results

### Category A: Valid Inputs

#### Test Case 1 (TC-01): Contract Deployment & Initialization
- **Function:** `constructor(string _courseName)`
- **Input Parameters:** `_courseName = "CSE4444 - Blockchain Technology"`
- **Caller Address:** `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4` (Instructor)
- **Expected Outcome:** Contract deploys successfully; `instructor` is assigned to deployer address; `totalLectures` initialized to 0; `courseName` set properly.
- **Observed Result:** **PASS**. Contract successfully deployed. State verified: `instructor = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`, `courseName = "CSE4444 - Blockchain Technology"`, `totalLectures = 0`.

#### Test Case 2 (TC-02): Register Valid Student (Single)
- **Function:** `registerStudent(uint256 _rollNumber, string memory _name)`
- **Input Parameters:** `_rollNumber = 101`, `_name = "Alice Johnson"`
- **Caller Address:** `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4` (Instructor)
- **Expected Outcome:** Transaction executes; event `StudentRegistered(101, "Alice Johnson")` emitted; student record created with `isRegistered = true`, `totalAttended = 0`.
- **Observed Result:** **PASS**. Transaction mined. Event emitted. Student retrieved: `("Alice Johnson", true, 0)`.

#### Test Case 3 (TC-03): Register Additional Student
- **Function:** `registerStudent(uint256 _rollNumber, string memory _name)`
- **Input Parameters:** `_rollNumber = 102`, `_name = "Bob Smith"`
- **Caller Address:** `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4` (Instructor)
- **Expected Outcome:** Roll number 102 added to registry; `getTotalStudents()` returns 2.
- **Observed Result:** **PASS**. Array updated. `getAllStudents()` returns `[101, 102]`.

#### Test Case 4 (TC-04): Mark Attendance for Registered Student
- **Function:** `markAttendance(uint256 _rollNumber, uint256 _date, bool _isPresent)`
- **Input Parameters:** `_rollNumber = 101`, `_date = 20261017`, `_isPresent = true`
- **Caller Address:** `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4` (Instructor)
- **Expected Outcome:** `attendanceByDate[101][20261017] = true`; student's `totalAttended` increments from 0 to 1; event `AttendanceMarked(101, 20261017, true)` emitted.
- **Observed Result:** **PASS**. State updated. `totalAttended` is now 1. Event `AttendanceMarked` emitted with topics.

#### Test Case 5 (TC-05): Retrieve Student Attendance & Percentage
- **Function:** `getStudent(101)` and `getAttendancePercentage(101)`
- **Input Parameters:** `_rollNumber = 101`
- **Caller Address:** Any address (Public Query)
- **Expected Outcome:** Returns student name "Alice Johnson", registered status `true`, attended count `1`.
- **Observed Result:** **PASS**. Correct data returned and displayed cleanly on UI without gas cost (view call).

---

### Category B: Invalid Inputs

#### Test Case 6 (TC-06): Register Student with Empty Name
- **Function:** `registerStudent(uint256 _rollNumber, string memory _name)`
- **Input Parameters:** `_rollNumber = 103`, `_name = ""`
- **Caller Address:** Instructor
- **Expected Outcome:** Transaction reverts with message `"Student name cannot be empty"`.
- **Observed Result:** **PASS**. Transaction reverted with exact reason string: `"Student name cannot be empty"`. No state modification.

#### Test Case 7 (TC-07): Register Student with Invalid Roll Number (0)
- **Function:** `registerStudent(uint256 _rollNumber, string memory _name)`
- **Input Parameters:** `_rollNumber = 0`, `_name = "Charlie"`
- **Caller Address:** Instructor
- **Expected Outcome:** Transaction reverts with `"Invalid roll number: must be greater than zero"`.
- **Observed Result:** **PASS**. Reverted as expected.

#### Test Case 8 (TC-08): Register Duplicate Roll Number
- **Function:** `registerStudent(uint256 _rollNumber, string memory _name)`
- **Input Parameters:** `_rollNumber = 101`, `_name = "Alice Duplicate"`
- **Caller Address:** Instructor
- **Expected Outcome:** Transaction reverts with `"Student already registered"`.
- **Observed Result:** **PASS**. Reverted with `"Student already registered"`. Roll 101 remains assigned to original student.

#### Test Case 9 (TC-09): Mark Attendance for Unregistered Student
- **Function:** `markAttendance(uint256 _rollNumber, uint256 _date, bool _isPresent)`
- **Input Parameters:** `_rollNumber = 999`, `_date = 20261017`, `_isPresent = true`
- **Caller Address:** Instructor
- **Expected Outcome:** Transaction reverts with `"Student not registered"`.
- **Observed Result:** **PASS**. Revert confirmed with message `"Student not registered"`.

#### Test Case 10 (TC-10): Mark Attendance Twice on the Same Date
- **Function:** `markAttendance(uint256 _rollNumber, uint256 _date, bool _isPresent)`
- **Input Parameters:** `_rollNumber = 101`, `_date = 20261017`, `_isPresent = true` (previously recorded)
- **Caller Address:** Instructor
- **Expected Outcome:** Transaction reverts with `"Attendance already recorded for this date"`.
- **Observed Result:** **PASS**. Reverted with `"Attendance already recorded for this date"`. Prevents double-counting attendance.

---

### Category C: Unauthorized Inputs

#### Test Case 11 (TC-11): Non-Instructor Attempts Student Registration
- **Function:** `registerStudent(uint256 _rollNumber, string memory _name)`
- **Input Parameters:** `_rollNumber = 104`, `_name = "Unauthorized Entry"`
- **Caller Address:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (Non-instructor / unauthorized student account)
- **Expected Outcome:** Transaction reverts due to `onlyInstructor` modifier with `"Unauthorized: Only instructor can perform this action"`.
- **Observed Result:** **PASS**. Transaction reverted cleanly. Error decoded: `"Unauthorized: Only instructor can perform this action"`.

#### Test Case 12 (TC-12): Non-Instructor Attempts Attendance Modification
- **Function:** `markAttendance(uint256 _rollNumber, uint256 _date, bool _isPresent)`
- **Input Parameters:** `_rollNumber = 101`, `_date = 20261018`, `_isPresent = true`
- **Caller Address:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (Unauthorized Account)
- **Expected Outcome:** Transaction reverts with `"Unauthorized: Only instructor can perform this action"`.
- **Observed Result:** **PASS**. Transaction reverted. Attendance tampering strictly prohibited.

---

## 4. Conclusion
All validation rules, input constraints, and role-based access restrictions functioned exactly as intended. The smart contract provides complete integrity, tamper-resistance, and defense against unauthorized or erroneous updates.
