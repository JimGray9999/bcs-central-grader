require('dotenv').config();
const axios = require('axios');
const baseUrl = 'https://www.bootcampspot.com/api/instructor/v1';
const fs = require('fs');
const inquirer = require('inquirer');
let authToken = '';
let courseID = '';

function init() {
  login()
    .then(mainMenu());
}

function mainMenu() {
  const choices = [
    {
      name: 'Show list of cohorts',
      value: 'cohorts'
    },
    {
      name: 'Show ungraded assignments',
      value: 'ungraded'
    },
    {
      name: 'Exit BCS Central Grader',
      value: 'Exit'
    }
  ]

  const question = {
    type: 'rawlist',
    name: 'menuChoice',
    message: 'What would you like to do?',
    choices
  };

  getAboutMe();

  inquirer
  .prompt([question])
  .then(({menuChoice}) => {
    switch (menuChoice) {
      case 'cohorts':
          break;
      case 'ungraded':
          break;
      case 'exit':
          process.exit();
      default:
        console.log("...I'm not sure what you are looking for.");
        mainMenu();
    }
  });
}


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
function login() {
  return new Promise((resolve, reject) => {
    axios.post(`${baseUrl}/login`, {
      email: process.env.USERNAME,
      password: process.env.PASSWORD
    })
    .then(function (response) {
      authToken = response.data.authenticationInfo.authToken;
      resolve();
    })
    .catch(function (error) {
      console.log(error);
      reject();
    });
  });
}


// About Me
function getAboutMe() {
    axios.get(`${baseUrl}/me`, {
        headers: {
            'Content-Type': 'application/json',
            'authToken': authToken
        }
    })
    .then(function (response) {
        console.log(`Welcome to BCS Central Grader ${response.data.userAccount.firstName} ${response.data.userAccount.lastName}`);
        console.log(`You have a total of ${response.data.enrollments.length} cohorts`);
        
        //TODO save specific fields
        // profile of the user
        // list of cohorts
        // student ids
        writeToFile(response.data, 'loginPayload.json');
        writeToFile(response.data.enrollments, 'enrollments.json');

      
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

init();

// TODO functions for the different API requests needed
// Sessions
// Session Detail
// Assignments
// Assignment Detail