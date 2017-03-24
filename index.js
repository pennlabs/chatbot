const constants = require('./config');
const express = require('express');
const app = express();

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
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
server.listen(process.env.PORT || constants.PORT);

// Put a friendly message on the terminal
console.log("Server running");
