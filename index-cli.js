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

  
let cohortInfo;

let cohortQuestion = {
  type: 'rawlist',
  name: 'menuChoice',
  message: 'Select a cohort',
  cohortInfo
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
      case 'exit':
        process.exit();
      default:
        console.log("...I'm not sure what you are looking for.");
        console.log(`Auth token: ${authToken}`);
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
  })
}

function readAFile (path) {
  fs.readFileSync(path, (err, data) => {
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
      getCohortList();
      resolve();
    })
    .catch(function (error) {
      console.log(error);
      reject();
    });
  });
}

function getCohortList() {
    let cohortArray = [];
    axios.get(`${baseUrl}/me`, {
      headers: {
          'Content-Type': 'application/json',
          'authToken': authToken
      }
    })
    .then(function (response) {
        for (let i = 0; i < response.data.enrollments.length; i++) {
          cohortArray.push(
              {'Cohort Name': response.data.enrollments[i].course.cohort.program.name,
              'value': response.data.enrollments[i].course.cohortId
              }
          )
        }
        writeToFile(cohortArray, './cohorts.json');
        cohortInfo = readAFile('./cohorts.json');
      })
}

function cohortsMenu() {
  console.log(cohortInfo);
  // inquirer.prompt([cohortQuestion])
  // .then(({menuChoice}) => {
  //     console.log(`TODO: Do something with cohort choice ${menuChoice} here.`);
  //     mainMenu();
  // })
}

init();