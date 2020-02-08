
// load modules
const express = require('express');
const request = require('request-promise-native');

// webservice request parameters
const requestUrl = 'https://feiertage-api.de/api/?jahr=2020';

// app parameters
const port = 3000;
const host = 'localhost';
const title = "Olli's Feiertags - Server mit Mops (Pug)";

const app = express(); // create express instance
app.set('views', './views'); // define templates path
app.set('view engine', 'pug'); // set template engine

// safer/cleaner request implementation needing promises
app.get('/:region?', (req, response) => {
  let region = req.params.region;
  if (!region) {
    region = 'NATIONAL';
  }

  // get data from webservice
  request(requestUrl)
    .then(jsonString => { // got data
      var data = JSON.parse(jsonString)[region]; // string to data object
      if (data) {
        response.render('index', {title: title, region: region, data: Object.entries(data) });
      } else {
        response.render('error', {title: title, error: 'unbekanntes Bundesland abgefragt.'});
      }
    })
    .catch(err => { // got error
      response.render('error', {title: title, error: err});
    });
});

// OBSOLETE: callbacks may lead to a 'callback hell'
/*
app.get('/:region', (req, res) => {
  let response = res;
  let region = req.params.region;
  if (!region) region = 'NATIONAL';
  request({url: requestUrl, timeout: timeoutInMilliseconds}, function (err, res, body) {
    if (response.statusCode === 200) {
      var data = JSON.parse(body)[region];
      if (data) {
        response.render('index', {title: title, region: region, data: Object.entries(data) });
      } else {
        response.render('error', {title: title, error: 'unbekanntes Bundesland abgefragt.'});
      }
    }
 });
});
*/

app.listen(port, host, () => {
  console.log(`Server started at ${host} port ${port}`);
});
