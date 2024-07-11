const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                try {
                    const students = JSON.parse(studentData);
                    const courses = JSON.parse(courseData);
                    dataCollection = new Data(students, courses);
                    resolve();
                } catch (parseError) {
                    reject("Error parsing data files");
                }
            });
        });
    });
}

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students || dataCollection.students.length === 0) {
            reject("No students found");
            return;
        }

        resolve(dataCollection.students);
    });
}

module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        const filteredStudents = dataCollection.students.filter(student => student.TA === true);
        if (filteredStudents.length === 0) {
            reject("No TAs found");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.courses || dataCollection.courses.length === 0) {
            reject("No courses found");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        const foundStudent = dataCollection.students.find(student => student.studentNum == num);
        if (!foundStudent) {
            reject("Student not found");
            return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        const filteredStudents = dataCollection.students.filter(student => student.course == course);
        if (filteredStudents.length === 0) {
            reject("No students found for the given course");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        if (studentData.TA == undefined || studentData.TA == null) {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }

        studentData.studentNum = dataCollection.students.length + 1;
        studentData.course = Number(studentData.course);
        dataCollection.students.push(studentData);
        resolve(dataCollection.students);
    });
}
