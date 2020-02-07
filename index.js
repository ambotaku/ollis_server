
const express = require('express');
const app = express();

const request = require('request')
const requestUrl = 'https://feiertage-api.de/api/?jahr=2020';
const timeoutInMilliseconds = 10*1000;


const port = 3000;
const host = 'localhost';
const title = "Olli's Feiertags - Server mit Mops (Pug)";

const opts = {
  url: requestUrl,
  timeout: timeoutInMilliseconds
};

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/:region?', (req, res) => {
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

app.listen(port, host, () => {
  console.log(`Server started at ${host} port ${port}`);
});
