const mysql = require('mysql');
const logger = require('./loggerUtil');

var db_config = {
  host: 'localhost',
    user: 'keyfm',
    password: 'NxsGOH1I6Vm8tsVOAExQoiXoi17FMp',
    database: 'keyfm'
};
let con;

function handleDisconnect() {
  con = mysql.createConnection(db_config);

  con.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    setInterval(function () {
        con.query('SELECT 1');
    }, 5000);
  });

  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports.con = con;
