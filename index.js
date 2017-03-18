console.log('here')

// Load the http module to create an http server.
var http = require('http');
console.log('here')

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
console.log('here')
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

console.log('here')
// Listen on port 80, IP defaults to 127.0.0.1
server.listen(80);
console.log('here')

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:80/");
console.log('here')
