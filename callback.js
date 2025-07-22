// File: routes/authCallback.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error) {
    return res.status(400).send('Authorization failed: ' + error);
  }

  try {
    // Exchange code for access token
    const response = await axios.post('https://graph.facebook.com/v19.0/oauth/access_token', null, {
      params: {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: 'https://localhost:3000/auth/callback',
        code: code
      }
    });

    const { access_token } = response.data;

    // Save token or proceed
    res.send(`✅ Access token received: ${access_token}`);
  } catch (err) {
    console.error('Token exchange failed', err.response?.data || err.message);
    res.status(500).send('Token exchange failed');
  }
});

module.exports = router;
