require('dotenv').config();
const axios = require('axios');
const router = require("express").Router();

const baseUrl = 'https://www.bootcampspot.com/api/instructor/v1';
const fs = require('fs');
let authToken = '';
let courseID = '';


router.get('/login', (req, res) => {
    axios
        .post(`${baseUrl}/login`, {
            email: process.env.USERNAME,
            password: process.env.PASSWORD
        })
        .then(function (response) {
            authToken = response.data.authenticationInfo.authToken;
            getAboutMe();
        })
        .catch(err => res.status(422).json(err));
});

// function to write to a json the reponse data received
function writeToFile (data, path) {  
  const json = JSON.stringify(data, null, 2)
  fs.writeFile(path, json, (err) => {
    if (err) {
      console.error(err)
      throw err
    }
    console.log('Saved data to file.')
  })
}

// Login to BCS
axios.post(`${baseUrl}/login`, {
    email: process.env.USERNAME,
    password: process.env.PASSWORD
  })
  .then(function (response) {
    authToken = response.data.authenticationInfo.authToken;
    getAboutMe();
  })
  .catch(function (error) {
    console.log(error);
  });

// About Me
function getAboutMe() {
    axios.get(`${baseUrl}/me`, {
        headers: {
            'Content-Type': 'application/json',
            'authToken': authToken
        }
    })
    .then(function (response) {
        console.log(`Your name is: ${response.data.userAccount.firstName} ${response.data.userAccount.lastName}`);
        console.log(`You have a total of ${response.data.enrollments.length} cohorts`);
        
        //TODO save specific fields
        // profile of the user
        // list of cohorts
        // student ids
        writeToFile(response.data, 'mynewfile.json');

      
        // for (let i = 0; i < response.data.enrollments.length; i++) {
        //     console.log(`Cohort ${i+1}: ${response.data.enrollments[i].course.cohort.program.name}`); 
        //     console.log(`End Date: ${response.data.enrollments[i].course.cohort.endDate}`);
        // };

        courseID = response.data.enrollments[0].courseId;
        getGrades(courseID);
        gradeFeeback(62650, 42541);

      })
    .catch(function (error) {
      console.log(error);
    });
}

// Grades
function getGrades(courseId) {
  axios({
    method: 'post',
    url: `/grades`,
    baseURL: `${baseUrl}`,
    data: {
      courseId: courseId
    },
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      authToken: authToken
    },
  })
  .then(function (response) {
    //console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

// Sessions

// read grade feedback
function gradeFeeback(assignmentID, studentID) {
  axios({
    method: 'post',
    url: `/grade`,
    baseURL: `https://www.bootcampspot.com/broker`,
    data: {
      assignmentId: assignmentID,
      studentId: studentID
    },
    headers: {
      'content-type': 'application/json',
      'authtoken': authToken
    }
  })
  .then(function (response) {
    console.log("Assignment: " + response.data.assignment.title);
    console.log("Student: " + response.data.submission.student.firstName);
    console.log("Grade: " + response.data.submission.submissionGrade.grade);
    console.log("Comment total: " + response.data.submission.submissionCommentList.length);
    console.log("Comment: " + response.data.submission.submissionCommentList[0].comment);
    console.log("Grade Author: " + response.data.submission.submissionCommentList[0].author.firstName);
  })
  .catch(function (error) {
    console.log(error);
  });
}

module.exports = router;

// TODO functions for the different API requests needed
// Sessions
// Session Detail
// Assignments
// Assignment Detail