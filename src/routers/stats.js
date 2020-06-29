const express = require('express');
const router = express.Router();
const logger = require('../utils/loggerUtil');
const axios = require('axios');
const db = require('../utils/db');


/* ------------------ User Management  ------------------ */

router.get('/stats', async (req, res) => {
  // Grab Stats
  axios.get('http://dj.keyfm.net:8223/status-json.xsl')
    .then(function (response) {
      try {
        let obj = response.data.icestats;
        if (obj == undefined) {
          let newStat = JSON.parse(response.data.replace('"title": -', '"title": "Unknown"'));
          obj = newStat.icestats;
        }
        let stats = obj.source[0];
        let autoDJ = false;
        if (stats === undefined) {
          stats = obj.source;
          autoDJ = true;
        }
        if (!autoDJ) {
            if (obj.source[1].genre !== undefined) {
            stats = obj.source[1];
            autoDJ = false;
          } else {
            autoDJ = true;
          }
        }



        // DJ Data
        let currentDJ;
        if (autoDJ) {
          currentDJ = {
            autoDJ: true
          }
          let playing;
          if (stats.title == undefined) {
            playing = {
              error: true
            };
          }else if (stats.title !== "Unknown") {
            let titleArray = stats.title.split(" - ");
            let artist = titleArray[0];
            let song = titleArray[1];
            playing = {
              artist: artist,
              song: song,
              error: false
            };
          } else {
            playing = {
              error: true
            };
          }
          let listeners = stats.listeners;
          let peakListeners = stats.listener_peak;

          return res.status(201).json({
            success: true,
            currentDJ: currentDJ,
            playing: playing,
            listeners: {
              current: stats.listeners,
              peak: peakListeners
            }

          });
        } else {
          let id = stats.genre;
          if (isNaN(id)) {
            currentDJ = {
              username: "Setup Wrong",
              id: 0,
              avatar: null,
              autoDJ: false
            }
            let playing;
            if (stats.title == undefined) {
              playing = {
                error: true
              };
            }else if (stats.title !== "Unknown") {
              let titleArray = stats.title.split(" - ");
              let artist = titleArray[0];
              let song = titleArray[1];
              playing = {
                artist: artist,
                song: song,
                error: false
              };
            } else {
              playing = {
                error: true
              };
            }
            let listeners = stats.listeners;
            let peakListeners = stats.listener_peak;

            return res.status(201).json({
              success: true,
              currentDJ: currentDJ,
              playing: playing,
              listeners: {
                current: stats.listeners,
                peak: peakListeners
              }

            });
            return true;
          }
          db.con.query(`SELECT * FROM users WHERE id = ${id}`, (err,rows) => {
            if(err) throw err;
            let avatar;
            let username;
            if (rows[0] !== undefined) {
              avatar = rows[0].avatarURL;
              username = rows[0].username;
            } else {
              avatar = "";
              username = "Error";
              id = 0;
            }
            if (avatar == "") {
              currentDJ = {
                username: username,
                id: id,
                avatar: null,
                autoDJ: false
              }
            } else {
              currentDJ = {
                username: username,
                id: id,
                avatar: avatar,
                autoDJ: false
              }
            }
            let playing;
            if (stats.title == undefined) {
              playing = {
                error: true
              };
            }else if (stats.title !== "Unknown") {
              let titleArray = stats.title.split(" - ");
              let artist = titleArray[0];
              let song = titleArray[1];
              playing = {
                artist: artist,
                song: song,
                error: false
              };
            } else {
              playing = {
                error: true
              };
            }
            let listeners = stats.listeners;
            let peakListeners = stats.listener_peak;

            return res.status(201).json({
              success: true,
              currentDJ: currentDJ,
              playing: playing,
              listeners: {
                current: stats.listeners,
                peak: peakListeners
              }

            });
          });
        }



      } catch (e) {
        logger.error(new Error(e))
        res.status(400).json({
          success: false,
          message: "Could not load stats"
        });
      }
    })
    .catch(function (error) {
      logger.error(new Error(error))
      res.status(400).json({
        success: false,
        message: "Could not load stats"
      });
    });
})


module.exports = router
