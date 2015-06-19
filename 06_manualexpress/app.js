var express    = require("express");
var bodyParser = require("body-parser");
var path       = require("path");
var morgan     = require("morgan");
var fs         = require("fs");
var repl       = require("repl");

var routes     = require("./routes");
var dataRoute  = require("./routes/data");
var logger     = require("./modules/app-logger");

// make app
var app = express();

// setup app
app.set("x-powered-by", false);

// setup repl
var prompt = repl.start({
    prompt: "\nex=>  "
});

prompt.context.app = app;

// setup filestram for morgan
var serverLogStream = fs.createWriteStream(path.join(__dirname, "server.log"), { flags: "a" });

// add middleware
app.use( morgan("combined", { stream: serverLogStream }) );
app.use( express.static( path.join(__dirname, "public") ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

// add routes
app.use("*", routes.requestLogger);
app.use("/data", dataRoute);
app.all("*", routes.notfound404);

// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    logger.info("Server running on localhost:"+port);
});