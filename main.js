const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express(); 
const fetch = require('node-fetch');
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/home'));
app.use(express.static(path.join(__dirname, '/')));

app.get('/home', (request,response) => response.sendFile(path.resolve('index.html')));
app.get('/', (request,response) => response.redirect('/home'));

app.get('/city/:search', async (req, res) => {
  var search = req.params['search'];
  try {
    let result = await getCities(search);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
    res.status(200).send();
  } catch(e){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({}));
    res.status(500).send();
  }
});

async function getCities(search) {
  let url = encodeURI(`${process.env.HOST}/6.2/geocode.json?app_id=${process.env.APP_ID}&app_code=${process.env.APP_CODE}&jsonattributes=1&gen=9&searchtext=${search}`);
  return ((await fetch(url)).json());
}

app.listen(process.env.PORT || 8080);