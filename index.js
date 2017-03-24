const constants = require('./config');
const express = require('express');
const app = express();

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

// Listen on port 80, IP defaults to 127.0.0.1
app.listen(process.env.PORT || constants.PORT);

// Put a friendly message on the terminal
console.log("Server running");
