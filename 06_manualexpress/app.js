var express = require("express");
var path    = require("path");

// make app
var app = express();

// setup app

// add middleware
app.use( express.static( path.join(__dirname, "public") ) );

// add routes
app.use("*", function (req, res, next) {
    console.log("Request from IP: "+req.ip+" for URL: "+req.originalUrl);
    next();
});

app.get("/data", function (req, res) {
    res.send("Hello, data from GET");
});

app.post("/data", function (req, res) {
    res.send("Hello, data from POST");
});

app.all("*", function (req, res, next) {
    res.status(404)
       .send("#404 We do not have whatever you're looking for!");
})

// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Server running on localhost:"+port);
});