var router = require("express").Router();
var dbController = require("../modules/db-controller");

router.use("*", function(req, res, next) {
    console.log("Incoming request "+req.originalUrl);
    next();
});

router.get("/", function(req, res, next) {
    console.log("Render Index");
    dbController.getAllCategories(function(err, docs) {
        if (err) {
            next(new Error("Failed to load data from DB"));
        } else {
            res.render("index", { pageTitle: "Welcome Forum", categories: docs });
        }
    });
});

router.get("/posts/:category", function(req, res, next) {
    var cat = req.params.category;
    dbController.getPostsForCategory(cat, function(err, docs) {
        if (err) {
            next(new Error("Error loading posts from DB Category"));
        } else {
            res.render("posts", { pageTitle: "Category posts", category: cat, posts: docs });
        }
    });
});

router.all("*", function(req, res) {
    res.status(404);
    res.render("error", {
        pageTitle: "Routing Error",
        error: "Error 404 - file not found",
        message: "Please check your url"
    });
});


router.use(function(error, req, res, next) {
    res.status(500);
    res.render("error", {
        pageTitle: "Server Error",
        error: "Error 500 - problem with server app",
        message: "Error output: "+error
    });
});



module.exports = router;