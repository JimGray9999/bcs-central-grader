require('dotenv').config();
const axios = require('axios');
const baseUrl = 'https://www.bootcampspot.com/api/instructor/v1';
const fse = require('fse');
const inquirer = require('inquirer');
let authToken = '';
let courseID = '';
let cohortInfo = [];
let assignmentList = [];

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
      name: 'Refresh data (run if first time)',
      value: 'refresh'
    },
    {
      name: 'Exit BCS Central Grader',
      value: 'exit'
    }
  ]

  const question = {
    type: 'rawlist',
    name: 'menuChoice',
    message: 'What would you like to do?',
    choices
  };

  inquirer
  .prompt([question])
  .then(({menuChoice}) => {
    switch (menuChoice) {
      case 'cohorts': 
        cohortsMenu();
        break;
      case 'ungraded':
        console.log("TODO: Show all ungraded assignments here.");
        mainMenu();
        break;
      case 'refresh':
        getCohortList();
        mainMenu();
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
  fse.writeFile(path, json, (err) => {
    if (err) {
      console.error(err)
      throw err
    }
  })
}

function readAFile (path) {
  fse.readFileSync(path, (err, data) => {
    if (err) throw err;
    console.log(data);
    return JSON.parse(data);
  });
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

function getCohortList() {
    axios.get(`${baseUrl}/me`, {
      headers: {
          'Content-Type': 'application/json',
          'authToken': authToken
      }
    })
    .then(function (response) {
        for (let i = 0; i < response.data.enrollments.length; i++) {
          cohortInfo.push(
              {'name': response.data.enrollments[i].course.cohort.program.name,
              'value': response.data.enrollments[i].id
              }
          )
        }
        writeToFile(cohortInfo, './cohorts.json');
      })
}

function cohortsMenu() {
  let cohortQuestion = {
    type: 'rawlist',
    name: 'menuChoice',
    message: 'Select a cohort',
    choices: cohortInfo
  }
  
  inquirer.prompt([cohortQuestion])
  .then(({menuChoice}) => {
      assignments(menuChoice);
  })
}

function assignments(enrollmentId) {
  axios({
    method: 'post',
    url: `https://www.bootcampspot.com/api/instructor/v1/assignments`,
    headers: {
      'Content-Type': 'application/json',
      'authToken': authToken
    },
    data: {
      enrollmentId: enrollmentId
    }
  })
  .then(function (response) {
      console.log(response.data.currentWeekAssignments.assignmentHeader);
      response.data.currentWeekAssignments.forEach(assignment => {
        assignmentList.push(assignment);
      });
      writeToFile(assignmentList, './assignments.json');
      assignmentsMenu();
    })
  .catch(function (error) {
    console.log(error);
  });
}

function assignmentsMenu() {
  let assignmentsQuestion = {
    type: 'rawlist',
    name: 'menuChoice',
    message: 'Select an assignment',
    choices: assignmentList
  }
  
  inquirer.prompt([assignmentsQuestion])
  .then(({menuChoice}) => {
      console.log(menuChoice);
  })
}

init();