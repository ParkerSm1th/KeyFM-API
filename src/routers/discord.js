const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const qs = require('qs');
const router = express.Router();

const CLIENT_ID = "706667108930551899";
const CLIENT_SECRET = "p9AL7gIPVyCIuZt_a0OTih1AmSo89h_y";
const redirect = encodeURIComponent('https://api.keyfm.net/discord/callback');

router.get('/discord/login', async (req, res) => {
  if (!req.query.id) return res.send("Error");
  const id = req.query.id;
  const fromURL = req.query.fromURL;
  if (fromURL !== "fromPanel1002") return;
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=706667108930551899&scope=identify&response_type=code&redirect_uri=http%3A%2F%2Fvps.parkersmith.io%3A3200%2Fdiscord%2Fcallback&state=${id}`);
});

router.get('/discord/callback', async (req, res) => {
  if (!req.query.code) return res.send("Error");
  const code = req.query.code;
  const id = req.query.state;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const params = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`;
  const response = await fetch(`https://discordapp.com/api/oauth2/token`,
    {
      method: 'POST',
      body: params,
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  const json = await response.json();
  res.redirect(`/discord/getAuth?token=${json.access_token}&userID=${id}`);
});

router.get('/discord/getAuth', async (req, res) => {
  if (!req.query.token) return res.send("Error");
  const token = req.query.token;
  const userID = req.query.userID;
  const response = await fetch(`http://discordapp.com/api/users/@me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  const json = await response.json();
  let discord = json.username + "#" + json.discriminator;
  var data = {
    api: "q1tbDYr9M4rCDM5Nos09Wrg7UlKpSunv9WM3BG9V9N5qeVE",
    user: userID,
    discord_id: json.id,
    discord_username: discord
  };
    console.log(data);
  const setDiscord = await fetch(`https://staff.keyfm.net/panel/scripts/setDiscord.php`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify(data)
    });
  const discordRes = await setDiscord.json();
  if (discordRes == 1) {
    res.send("Success! Check the panel!")
  } else {
    res.send("An error occured");
  }
});

module.exports = router;
