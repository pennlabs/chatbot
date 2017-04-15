const constants = require('./config');
const fs = require('fs');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const express = require('express');
const axios = require('axios');
const $ = require('jquery');
const responses = require('./getResponse.js');
const keywords = require('./keywords.js');
const app = express();

keywords.init();

const dining_keywords = ['houston', 'commons', 'kings court', '1920', 'hill', 'english', 'falk', 'kosher', 'marks', 'accenture'
, 'e-cafe', 'ecafe', 'joes', 'nch', 'new college house', 'beefsteak', 'gourmet grocer', 'frontera', 'starbucks'];

const laundry_keywords = ['harnwell', 'harrison', 'rodin', 'quad', 'craig', 'bishop white', 'kings court', 'english house', 'gregory'
, 'class of 1925', 'DuBois', 'mayer', 'morgan', 'butcher', 'hill', 'norteastern', 'stouffer', 'northwest', 'magee', 'sansom place'
,'east', 'west', 'van pelt manor', 'southeast', 'class of 1928', 'southwest'];

app.use(bodyParser.json({type: '*/*'})); //parses incoming requests into JSON

app.get('/', function(req, res) {
  res.send('hello, world!');
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' /*&& req.query['hub.verify_token'] === <VERIFY_TOKEN> */) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});
app.post('/webhook', function(req, res) {
  const data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched

    data.entry.forEach(function(entry) {
      const pageID = entry.id;
      const timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  const messageId = message.mid;

  let messageText = message.text;
  const messageAttachments = message.attachments;

  if (messageText) {

    let printed = false;

    messageText = keywords.closestMatch(messageText);

    axios('https://api.pennlabs.org/dining/venues')
      .then(({ data }) => {
        const response = responses.getResponse(messageText, data);
        console.log(response);
        if(response.length > 0) {
          printed = true;
          for(let i = 0; i < response.length; i++) {
            sendTextMessage(senderID, response[i]);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
    case 'laundry':
      axios('https://api.pennlabs.org/laundry/halls')
      .then(({ data }) => {
        const response = data;
        const hallsArray = response['halls'];
        for (let i = 0; i < hallsArray.length; i++) {
          const dryers_available = hallsArray[i]['dryers_available'];
          const name = hallsArray[i]['name'];
          const washers_available = hallsArray[i]['washers_available'];
          const ret =`${name}: There are ${dryers_available} available dryers and ${washers_available} washers available!`;
          sendTextMessage(senderID, ret);
        }
      }).catch(err => {
        console.log(err);
      });
      break;

    case 'dining':
      axios('https://api.pennlabs.org/dining/venues')
      .then(({ data }) => {
        const info = data;
        const names = [];
        for (let i = 0; i < info.document.venue.length; i++) {
          const name = info.document.venue[i].name;
          names.push(name);
        }
        for (let j = 0; j < names.length; j++) {
          const response = responses.getResponse(names[j], data);
          if(response.length > 0) {
            printed = true;
            for(let i = 0; i < response.length; i++) {
              sendTextMessage(senderID, response[i]);
            }
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
      break;

    case 'hello world':
      sendTextMessage(senderID, "hello to you too");
      break;

    default:
      if(printed === false) {
        sendTextMessage(senderID, messageText);
      }

    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendTextMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  axios({
    method: 'post',
    url: `https://graph.facebook.com/v2.6/me/messages?${querystring.stringify({access_token: 'EAAEQEjXxPH8BAHuDLhgA1f8CQOlY5jU1yvYleRKZA3ZAlO4xc7JJMF1XJvRysX4tm9GxAjVTBpivZC4EL8hAZAW5MJA0khY0YKlmZBUJI8BF87aS0Lgl0C6Ynak7GRZBKOAbm0XZB7YxI6oS2MtlSuANPrSG6EZBRlbveZCAQd2aO5gZDZD'})}`,
    data: messageData
  })

  .catch(myErr => {
    console.log(myErr);
  });
}

// Listen on port 80, IP defaults to 127.0.0.1
app.listen(process.env.PORT || constants.PORT);

// Put a friendly message on the terminal
console.log("Server running");
