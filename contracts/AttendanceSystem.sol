// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AttendanceSystem
 * @dev Smart contract for managing student attendance on the Ethereum blockchain.
 * Provides immutable, tamper-proof attendance logging with role-based access control.
 */
contract AttendanceSystem {
    // --- State Variables ---

    // Address of the authorized course instructor/admin
    address public instructor;

    // Name/code of the course
    string public courseName;

    // Total number of lectures conducted
    uint256 public totalLectures;

    // Struct representing student details
    struct Student {
        uint256 rollNumber;
        string name;
        bool isRegistered;
        uint256 totalAttended;
    }

    // Mapping from roll number to Student record
    mapping(uint256 => Student) public students;

    // Mapping: rollNumber => (date integer YYYYMMDD => attended status)
    mapping(uint256 => mapping(uint256 => bool)) public attendanceByDate;

    // Array of all registered roll numbers for iteration and listing
    uint256[] public studentRollNumbers;

    // --- Events ---

    event StudentRegistered(uint256 indexed rollNumber, string name);
    event AttendanceMarked(uint256 indexed rollNumber, uint256 indexed date, bool isPresent);
    event LectureConducted(uint256 indexed date);

    // --- Modifiers ---

    /**
     * @dev Restricts access strictly to the instructor who deployed the contract.
     */
    modifier onlyInstructor() {
        require(msg.sender == instructor, "Unauthorized: Only instructor can perform this action");
        _;
    }

    // --- Constructor ---

    /**
     * @dev Initializes the contract with course name and assigns deployer as instructor.
     * @param _courseName Name or code of the course (e.g., "CSE4444 - Blockchain Technology")
     */
    constructor(string memory _courseName) {
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        instructor = msg.sender;
        courseName = _courseName;
        totalLectures = 0;
    }

    // --- Instructor Functions ---

    /**
     * @dev Registers a new student into the system.
     * @param _rollNumber Unique student roll number
     * @param _name Full name of the student
     */
    function registerStudent(uint256 _rollNumber, string memory _name) external onlyInstructor {
        require(_rollNumber > 0, "Invalid roll number: must be greater than zero");
        require(bytes(_name).length > 0, "Student name cannot be empty");
        require(!students[_rollNumber].isRegistered, "Student already registered");

        students[_rollNumber] = Student({
            rollNumber: _rollNumber,
            name: _name,
            isRegistered: true,
            totalAttended: 0
        });

        studentRollNumbers.push(_rollNumber);

        emit StudentRegistered(_rollNumber, _name);
    }

    /**
     * @dev Marks attendance for a specific student on a given date.
     * @param _rollNumber Roll number of the student
     * @param _date Date represented as integer in YYYYMMDD format (e.g. 20261017)
     * @param _isPresent True if student was present, false otherwise
     */
    function markAttendance(
        uint256 _rollNumber,
        uint256 _date,
        bool _isPresent
    ) external onlyInstructor {
        require(_rollNumber > 0, "Invalid roll number");
        require(_date > 0, "Invalid date format");
        require(students[_rollNumber].isRegistered, "Student not registered");
        require(!attendanceByDate[_rollNumber][_date], "Attendance already recorded for this date");

        attendanceByDate[_rollNumber][_date] = true;

        if (_isPresent) {
            students[_rollNumber].totalAttended += 1;
        }

        emit AttendanceMarked(_rollNumber, _date, _isPresent);
    }

    /**
     * @dev Records conducting a lecture and increments total lecture count.
     * @param _date Date of lecture session (YYYYMMDD)
     */
    function recordLecture(uint256 _date) external onlyInstructor {
        require(_date > 0, "Invalid date format");
        totalLectures += 1;
        emit LectureConducted(_date);
    }

    /**
     * @dev Marks attendance for multiple registered students at once for a given date.
     * Automatically registers a lecture session.
     * @param _presentRollNumbers Array of roll numbers who attended
     * @param _date Date in YYYYMMDD format
     */
    function markBatchAttendance(
        uint256[] calldata _presentRollNumbers,
        uint256 _date
    ) external onlyInstructor {
        require(_date > 0, "Invalid date format");
        totalLectures += 1;

        for (uint256 i = 0; i < _presentRollNumbers.length; i++) {
            uint256 r = _presentRollNumbers[i];
            require(students[r].isRegistered, "One or more students not registered");
            require(!attendanceByDate[r][_date], "Attendance already recorded for this date");

            attendanceByDate[r][_date] = true;
            students[r].totalAttended += 1;

            emit AttendanceMarked(r, _date, true);
        }

        emit LectureConducted(_date);
    }

    // --- View / Retrieval Functions ---

    /**
     * @dev Retrieves details of a specific student.
     * @param _rollNumber Student roll number
     */
    function getStudent(uint256 _rollNumber)
        external
        view
        returns (
            string memory name,
            bool isRegistered,
            uint256 totalAttended
        )
    {
        Student memory s = students[_rollNumber];
        return (s.name, s.isRegistered, s.totalAttended);
    }

    /**
     * @dev Checks if a student attended on a specific date.
     * @param _rollNumber Student roll number
     * @param _date Date (YYYYMMDD)
     */
    function isAttendedOnDate(uint256 _rollNumber, uint256 _date) external view returns (bool) {
        return attendanceByDate[_rollNumber][_date];
    }

    /**
     * @dev Calculates and returns attendance percentage (0 - 100).
     * @param _rollNumber Student roll number
     */
    function getAttendancePercentage(uint256 _rollNumber) external view returns (uint256) {
        require(students[_rollNumber].isRegistered, "Student not registered");
        if (totalLectures == 0) {
            return 0;
        }
        return (students[_rollNumber].totalAttended * 100) / totalLectures;
    }

    /**
     * @dev Returns total number of registered students.
     */
    function getTotalStudents() external view returns (uint256) {
        return studentRollNumbers.length;
    }

    /**
     * @dev Returns list of all registered student roll numbers.
     */
    function getAllStudents() external view returns (uint256[] memory) {
        return studentRollNumbers;
    }
}
