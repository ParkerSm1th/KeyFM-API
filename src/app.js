const express = require('express')
const statsRouter = require('./routers/stats')
const discordRouter = require('./routers/discord')
var bodyParser = require('body-parser');
const port = 3200;
const host = '45.82.72.86';
const logger = require('./utils/loggerUtil');
const history = require('./utils/historyUtil');


/*
  App init
*/
var cors = require("cors");
const app = express()

app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json())
app.use(statsRouter)
app.use(discordRouter)

/*
  Start-up
*/
app.listen(port, host, () => {
  logger.info(`Server starting up - Running on ${host}:${port}`);
  history.startSongHistory();
  history.startListenerHistory();
})
