const constants = require('./config');
const fs = require('fs');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const express = require('express');
const axios = require('axios');
var $ = require('jquery');
const app = express();

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

  const messageText = message.text;
  const messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
    case 'dining':
      sendTextMessage(senderID, "here");
      let json;
      $.getJSON('https://api.pennlabs.org/dining/venues',
      function (data) {
        json = data;
      });
      let info = JSON.parse(json);
      let names = [];
      for (let i = 0; i < info.document.venue.length; i++) {  
        let name = info.document.venue[i].name;
        names.push(name);
      }
      let allNames = "";
      for (let j = 0; j < names.length -1; j++) {
        allNames = allNames + names[j] + ", ";
      }
      allNames = allNames + names[names.length - 1];
      sendTextMessage(senderID, allNames);
      break;

    case 'hello world':
      sendTextMessage(senderID, "hello to you too");
      break;

    default:
      sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
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
