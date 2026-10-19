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

  app.post('/update-cobj', async (req, res) => {
    const values = {
      name: String(req.body.name || '').trim(),
      genre: String(req.body.genre || '').trim(),
      platform: String(req.body.platform || '').trim()
    };

    if (Object.values(values).some((value) => !value)) {
      return res.status(400).render('updates', {
        title: pageTitle,
        values,
        error: 'All three fields are required.'
      });
    }

    if (!token || !objectType) {
      return res.status(500).render('updates', {
        title: pageTitle,
        values,
        error: 'HubSpot is not configured. Check your local .env file.'
      });
    }

    try {
      await client.post(
        `https://api.hubapi.com/crm/v3/objects/${encodeURIComponent(objectType)}`,
        { properties: values },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return res.redirect('/');
    } catch (error) {
      console.error('HubSpot create request failed:', error.response?.status || error.message);
      return res.status(502).render('updates', {
        title: pageTitle,
        values,
        error: 'HubSpot could not create the game. Check the app configuration and try again.'
      });
    }
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(3000, () => console.log('Listening on http://localhost:3000'));
}

module.exports = { createApp };
