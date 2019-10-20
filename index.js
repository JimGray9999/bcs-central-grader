require('dotenv').config();
const axios = require('axios');
const baseUrl = 'https://www.bootcampspot.com/api/instructor/v1';
let authToken = '';

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
        
        
        for (let i = 0; i < response.data.enrollments.length; i++) {
            console.log(`Cohort ${i+1}: ${response.data.enrollments[i].course.cohort.program.name}`); 
            console.log(`End Date: ${response.data.enrollments[i].course.cohort.endDate}`);
        };

      })
    .catch(function (error) {
    console.log(error);
    });
}

// TODO functions for the different API requests needed
// Grades
// Sessions
// Session Detail
// Assignments
// Assignment Detail