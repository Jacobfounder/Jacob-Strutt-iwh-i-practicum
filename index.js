require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('node:path');

const pageTitle = 'Update Custom Object Form | Integrating With HubSpot I Practicum';

function createApp({
  token = process.env.HUBSPOT_PRIVATE_APP_TOKEN,
  objectType = process.env.HUBSPOT_OBJECT_TYPE,
  client = axios
} = {}) {
  const app = express();

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));

  app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: pageTitle });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(3000, () => console.log('Listening on http://localhost:3000'));
}

module.exports = { createApp };
