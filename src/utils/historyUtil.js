const logger = require('./loggerUtil');
const axios = require('axios');
const qs = require('querystring')

let csong;
let cartist;
let cdjID;
let cdj;

async function startSongHistory() {
  logger.info("Started song history uploading..");
    setInterval(function () {
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
                if (obj.source[1].title !== undefined) {
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
            } else {
              let username = stats.server_name;
              let id = stats.genre;
              currentDJ = {
                username: username,
                id: id,
                autoDJ: false
              }
            }


            // Song Data
            let playing;
            if (stats.title == undefined) {
              playing = {
                error: true
              };
            } else if (stats.title !== "Unknown") {
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
            if (playing.error) {

            } else {
              if (cartist !== playing.artist || csong !== playing.song) {
                let dj = "Auto DJ"
                let djID = 0;
                if (currentDJ.autoDJ == false) {
                  djID = currentDJ.id;
                  dj = currentDJ.username;
                }
                let requestBody = {
                  api: "q1tbDYr9M4rCDM5Nos09Wrg7UlKpSunv9WM3BG9V9N5qeVE",
                  artist: playing.artist,
                  song: playing.song,
                  djID: djID,
                  dj: dj
                };

                const config = {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                }

                let url = "https://staff.keyfm.net/panel/scripts/logSong.php";
                axios.post(url, qs.stringify(requestBody), config)
                .then((result) => {
                  csong = playing.song;
                  cartist = playing.artist;
                  cdjID = djID;
                  cdj = dj;
                })
                .catch((err) => {
                  logger.error("FROM HISTORY " + new Error(err))
                })

              }
            }
          } catch (e) {
            logger.error(new Error(e))
          }
        })
        .catch(function (error) {
          logger.error(new Error(error))
        });
    }, 3000)
};

async function startListenerHistory() {
  logger.info("Started listener count logginng..");
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
            if (obj.source[1].title !== undefined) {
            stats = obj.source[1];
            autoDJ = false;
          } else {
            autoDJ = true;
          }
        }
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        let requestBody = {
          api: "q1tbDYr9M4rCDM5Nos09Wrg7UlKpSunv9WM3BG9V9N5qeVE",
          count: stats.listeners
        };
        let url = "https://staff.keyfm.net/panel/scripts/logListeners.php";
        axios.post(url, qs.stringify(requestBody), config)
        .then((result) => {

        })
      } catch (e) {
        logger.error(new Error(e))
      }
    })
    .catch(function (error) {
      logger.error(new Error(error))
    });
    setInterval(function () {
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
                if (obj.source[1].title !== undefined) {
                stats = obj.source[1];
                autoDJ = false;
              } else {
                autoDJ = true;
              }
            }
            const config = {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
            let requestBody = {
              api: "q1tbDYr9M4rCDM5Nos09Wrg7UlKpSunv9WM3BG9V9N5qeVE",
              count: stats.listeners
            };
            let url = "https://staff.keyfm.net/panel/scripts/logListeners.php";
            axios.post(url, qs.stringify(requestBody), config)
            .then((result) => {

            })
          } catch (e) {
            logger.error(new Error(e))
          }
        })
        .catch(function (error) {
          logger.error(new Error(error))
        });
    }, 300000)
};

module.exports.startSongHistory = startSongHistory;
module.exports.startListenerHistory = startListenerHistory;
