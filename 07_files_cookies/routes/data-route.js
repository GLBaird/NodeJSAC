var express = require('express');
var router  = express.Router();
var multer  = require("multer");
var fs      = require("fs");

router.use(multer({
    dest: "./uploads",
    rename: function(fieldname, filename, req, res) {
        console.log("RENAME", req.body);
        var filename = "file_"+Math.floor(Date.now()/1000);
        if (typeof req.body.rename != "undefined") {
            filename = req.body.rename+"_"+Math.floor(Date.now()/1000);
            res.clearCookie("preferredName");
            res.cookie("preferredName", req.body.rename, { maxAge: 1000*60*24*32 });
        }
        return filename;
    },
    onFileUploadStart: function(file, req, res) {
        console.log("START", req.body);
    },
    onFileUploadData: function(file, data, req, res) {
        console.log("PROGRESS", req.body);
    },
    onFileUploadComplete: function(file, req, res) {
        console.log("COMPLETE", req.body);
        res.locals.success = true;
        res.locals.filename = file.path;
    },
    onError: function(error, next) {
        console.log("ERROR", req.body);
        res.locals.success = false;
        next(error);
    }
}));

router.put('/uploads', function(req, res, next) {
    console.log("PUT Request with data", req.body);
    if (res.locals.success) {
        res.send("success:"+res.locals.filename);
    } else {
        res.send("error:something weird has happened here??");
    }
});

router.get("/uploads", function(req, res) {
    fs.readdir("./uploads", function(error, files) {
        if (error) {
            res.status(500);
            res.send("Server error #500 - can't read upload folder");
        } else {
            res.json(files);
        }
    });
});

router.use("*", function(error, req, res, next) {
    res.send("error:"+error);
});

module.exports = router;
