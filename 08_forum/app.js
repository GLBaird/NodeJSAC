var express      = require("express");
var path         = require("path");
var bodieParser  = require("body-parser");
var cookieParser = require("cookie-parser");

var router = require("./routes");

var app = express();

app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/lib/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));

app.use(cookieParser());
app.use(bodieParser.json());
app.use(bodieParser.urlencoded( {extended: false} ));

app.use("/", router);

app.listen(3000, function() {
    console.log("Running on port 3000");
});