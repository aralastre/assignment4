/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: April Ritz Alastre ID: 151509221 Date: 10 July 2024
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

collegeData.initialize()
  .then(() => {
    // Routes
    app.get("/students", (req, res) => {
      collegeData.getAllStudents()
        .then(students => res.json(students))
        .catch(error => {
          console.error("Error fetching students:", error);
          res.status(500).json({ message: "Internal Server Error" });
        });
    });

    app.get("/tas", (req, res) => {
      collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(error => {
          console.error("Error fetching TAs:", error);
          res.status(500).json({ message: "Internal Server Error" });
        });
    });

    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(error => {
          console.error("Error fetching courses:", error);
          res.status(500).json({ message: "Internal Server Error" });
        });
    });

    app.get("/student/:num", (req, res) => {
      const num = req.params.num;
      collegeData.getStudentByNum(num)
        .then(student => res.json(student))
        .catch(error => {
          console.error("Error fetching student:", error);
          res.status(500).json({ message: "Internal Server Error" });
        });
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/home.html"));
    });

    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/about.html"));
    });

    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
    });

    app.get("/students/add", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/addStudent.html"));
    });
    
    app.post("/students/add", (req, res) => {
      collegeData.addStudent(req.body)
        .then(success => {
          res.redirect("/students");
        })
        .catch(error => {
          console.error("Error adding student:", error);
          res.status(500).json({ message: "Internal Server Error" });
        });
    });

    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch(err => {
    console.error("Error initializing collegeData:", err);
    process.exit(1); // Exit the process in case of initialization error
  });
