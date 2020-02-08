/*
  Sample Express app consuming a webservice
  async handling done with async await pattern
 */

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

async function consumeService(url, region) {
  const body = await request(url);
  return JSON.parse(body)[region];
}

app.get('/:region?', (req, response) => {
  let region = req.params.region;
  if (!region) {
    region = 'NATIONAL';
  }

  const data = consumeService(requestUrl, region);
  if (data) {
    response.render('index', {title: title, region: region, data: Object.entries(data) });
  } else {
    response.render('error', {title: title, error: 'unbekanntes Bundesland abgefragt.'});
  }
});

app.listen(port, host, () => {
  console.log(`Server started at ${host} port ${port}`);
});
