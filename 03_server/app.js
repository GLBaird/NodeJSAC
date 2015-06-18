// get modules
var http = require("http");
var url  = require("url");
var path = require("path");
var fs   = require("fs");

// variables
var portnumber = process.env.PORT || 3000;

for (var i in process.argv) {
    var val = process.argv[i];
    if (typeof val == "string" && val.indexOf("-port:") >= 0) {
        var port = parseInt( val.split(":").pop() );
        if (!isNaN(port) && port >= 1000) {
            portnumber = port;
        }
    }
}

// logging
function logData(data) {
    console.log(Math.floor(Date.now()/1000)+": "+data);
}

var server = http.createServer(function (req, res) {
    logData("Request for "+req.method+" URL: "+req.url);

    var fileURL = __dirname+"/public"+req.url.split("?")[0];
    fs.exists(fileURL, function(exists) {
        if (exists) {
            fs.readFile(fileURL, function(err, data) {
                if (err) {
                    var msg =
                        "<h1>Server error #500</h1>"+
                        "<p>Error reading and parsing file "+req.url+"</p>";
                    res.writeHead(500, {
                        "Content-Size": msg.length,
                        "Content-Type": "text/html"
                    });
                    res.end(msg);
                    logData("Error 500: File failed lot load or parse "+fileURL);
                } else {
                    var mimetype;
                    switch (fileURL.split(".").pop()) {
                        case "jpg":
                        case "jpeg":
                            mimetype = "image/jpeg";
                            break;
                        case "png":
                            mimetype = "image/png";
                            break;
                        case "gif":
                            mimetype = "image/gif";
                            break;
                        case "css":
                            mimetype = "text/css";
                            break;
                        case "js":
                            mimetype = "text/js";
                            break;
                        case "html":
                        case "htm":
                            mimetype = "text/html";
                            break;
                        case "json":
                            mimetype = "application/json";
                            break;
                        case "txt":
                        case "rtf":
                            mimetype = "text/plain";
                        default:
                            mimetype = "application/file";
                    }

                    res.writeHead(200, {
                        "Content-Size": data.length,
                        "Content-Type": mimetype
                    });

                    res.write(data);
                    res.end();

                    logData("Filetype: "+mimetype+" delivered from URL: "+fileURL);
                }
            });
        } else {
            var msg =
                "<h1>Server Error #404</h1>" +
                "<p>File "+req.uri+" not found.</p>";
            res.writeHead(404, {
                "Content-Size": msg.length,
                "Content-Type": "text/html"
            });

            res.end(msg);
            logData("Error 404: Not Found "+fileURL);
        }
    });

});

server.listen(portnumber, function(){
    console.log("Server is running on http://localhost:"+portnumber);
});