require('dotenv').config();
const axios = require('axios');
const baseUrl = 'https://www.bootcampspot.com/api/instructor/v1';


axios.post(`${baseUrl}/login`, {
    email: process.env.USERNAME,
    password: process.env.PASSWORD
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


function getAboutMe() {
    axios.get({});
}