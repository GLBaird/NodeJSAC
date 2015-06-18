var http = require('http');
var fs   = require('fs');

function sendFileToResponse(res, fileRef) {
//setup for html
    res.writeHead(200, {"Content-Type": "text/html"});

    fs.readFile(fileRef, "utf-8", function (err, data) {
        if (err) {
            console.log("Failed to load client html\n" + err);
            res.setHeader("Content-Size", data.length);
            res.write(
                "<h2>Error</h2>" +
                "<p>There has been a server error and can't read file: "+fileRef+"<br />" +
                err + "</p>"
            );
            res.end();
        } else {
            res.write(data);
            res.end();
        }
    });
}

var server = http.createServer(function(req, res) {
    console.log("Request for "+req.url);

    if(req.url == "/client.html") {
        sendFileToResponse(res, "public/client.html");
    } else if(req.url == "/client.js") {
        sendFileToResponse(res, "public/client.js");
    } else {
        //setup for html
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write(
            "<h2>Server error 404</h2>"+
            "<p>File has not been found!</p>"
        );
        res.end();
    }
});

server.listen(3000, function() {
    console.log("Server running on localhost:3000");
});