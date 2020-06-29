require('dotenv').config();

const AWS = require('aws-sdk');

const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
};

const SES = new AWS.SES(SESConfig);

function sendConfirmationEmail(destination, token) {
  var params = {
    Source: 'no-reply@letsverse.com',
    Destination: {
      ToAddresses: [
        destination
      ]
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
                    <link href="https://fonts.googleapis.com/css?family=Ubuntu&display=swap" rel="stylesheet">
                    <head>
                      <style>
                      h1 {
                        font-family: "ubuntu", sans-serif;
                        font-weight: bold;
                        font-size: 20px;
                        color: #34495e;
                      }
                      body {
                        font-family: "ubuntu", sans-serif;
                        background-color: #ecf0f1;
                        background-image: url(https://i.imgur.com/Qlnz9bB.png);
                      }

                      .box-bg {
                        background-color: #fff;
                        margin-left: 20%;
                        margin-right: 20%;
                        border-radius: 10px;
                        margin-top: 5%;
                        padding-left: 5%;
                        padding-right: 5%;
                        padding-top: 25px;
                        padding-bottom: 5px;
                    
                      }
                      .registration-verification {
                        color: #3498db;
                        text-decoration: underline;
                      }
                    
                      p {
                        color: #34495e;
                      }
                      a {
                        color: #3498db;
                      }
                    
                      .disclaimer {
                        color: #bdc3c7;
                        font-size: 12px;
                      }
                    
                      </style>
                    <title>Welcome to Verse!</title>
                    </head>
                    <body>
                    
                      <div class="box-bg">
                            <center><img class="logo" src="https://i.imgur.com/xBiFxvt.png"/></center>
                            <div class="box"><br/>
                              <hr/>
                              <h1>Welcome to Verse!</h1>
                              <p>Hey there! You’re mere moments away from being a part of Verse! Before you get started, we need you to verify that it's you by following <a class="reglink" href="https://letsverse.com/verify/?token=${token}">this link.</a> This link is only valid for 24 hours.</p>
                              <p> If you're having problems, copy and paste this link into your browser to complete your registration:</br>
                                <p class="registration-verification">https://letsverse.com/verify/?token=${token}</p>
                              <p> We can’t wait to welcome you to the community. If you get stuck trying to verify your account, take a look at our <a href="#knowledgebase">knowledgebase</a> for answers to frequently asked questions, or send us an email at <a href="mailto:support@letsverse.com">support@letsverse.com</a>.</p>
                                <p>Thanks,<br/>
                                  Your friends at Verse</p>
                                  <p class="disclaimer">You are receiving this email because you (or someone pretending to be you) registered for an account on Verse. If this was not you, no worries! You don't need to do anything. If the account is not verified via this email, we will not reach out again.</p>
                            </div>
                      </div>
                    
                    </body>
                    </html>`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: 'Email Confirmation - Palace Interactive'
      }
    }
  };

  SES.sendEmail(params).promise().then((res) => {
    console.log(res);
  });
}

module.exports.sendConfirmationEmail = sendConfirmationEmail;