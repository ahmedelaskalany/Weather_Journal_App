/* Global Variables */

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=c6301dc27b95ba3b914ca474ca586efd&units=imperial';

// ('https://api.openweathermap.org/data/2.5/weather?zip={zip code}&appid={API key}');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear(); // month index start at 0, adding 1 produces the right month

// Event listener to add function to existing HTML DOM element
let btn = document.getElementById('generate');
btn.addEventListener('click', generate);

/* Function called by event listener */
// The function take input, extract data based on input, store it in localserver, and call it from localserver to display
function generate() {
  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;
  weatherData(baseUrl, zip, apiKey)
    .then((data) => {
      const info = {
        temp: data.main.temp,
        date: newDate,
        feel: feelings,
      };
      postServer('/add', info);
    })
    .then(retrieveData());
}
/* Function to GET Web API Data*/
// Web -> app.js

const weatherData = async (baseUrl, zip, apiKey) => {
  const res = await fetch(baseUrl + zip + apiKey);
  //   console.log(res);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to POST data */
// app.js -> localhost (server.js)

const postServer = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log('error: ', error);
  }
};

/* Function to GET Project Data */
// localhost (server.js) -> app.js *Note: Function is Given in Rubric*

const retrieveData = async () => {
  const request = await fetch('/add');
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log(allData);
    // Write updated data to DOM elements
    document.getElementById('temp').innerHTML =
      Math.round(allData.temp) + ' degrees';
    document.getElementById('content').innerHTML = allData.feel;
    document.getElementById('date').innerHTML = allData.date;
  } catch (error) {
    console.log('error:', error);
    // appropriately handle the error
  }
};
