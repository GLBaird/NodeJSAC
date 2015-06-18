// get modules
var http = require("http");

// make server
var server = http.createServer(function (req, res) {
    console.log("URL Requested: "+req.url);

    var responseData = "Hello World from NodeJS";

    res.writeHead(200, {
        "Content-Length": responseData.length,
        "Content-Type": "text/plain"
    });

    res.write(responseData);
    res.end();
});

server.listen(3000, function() {
    console.log("Server running on http://localhost:3000");
});