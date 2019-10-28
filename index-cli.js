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
        console.log("TODO: Show all cohorts here.");
        mainMenu();
        break;
      case 'ungraded':
        console.log("TODO: Show all ungraded assignments here.");
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

init();