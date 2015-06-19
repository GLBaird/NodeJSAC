var router = require("express").Router();
var data = require("../data");
var logger = require("../modules/app-logger");

router.use(function(req, res, next) {
    logger.info("Incoming Data Route...");
    next();
});

router.get("/events", function (req, res) {
    res.send("Hello, data from GET");
});

router.post("/events", function (req, res) {
    res.json(data);
});

router.post("/events/post", function(req, res) {
    var eventName = req.body.name;
    var eventDate = req.body.date;
    console.log("Received post NAME: "+eventName);
    console.log("Received post DATE: "+eventDate);
    res.send("You have requesed event: name="+eventName+" date="+eventDate);
});

router.get("/events/:name", function (req, res) {
    var name = req.params.name;
    res.send("Hello, data from GET looking up event: "+name);
});

router.post("/events/:name", function (req, res) {
    var name = req.params.name;
    res.send("Hello, data from POST looking up event: "+name);
});


module.exports = router;