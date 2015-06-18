var http = require('http');
var fs   = require('fs');
var WebSocketSever = require("websocket").server;

function sendFileToResponse(res, fileRef) {
    //setup for html
    fs.readFile(fileRef, "utf-8", function (err, data) {
        if (err) {
            console.log("Failed to load client html\n" + err+"\n");
            var msg =
                "<h2>Error</h2>" +
                "<p>There has been a server error and can't read file: "+fileRef+"<br />" +
                err + "</p>";
            res.writeHead(500, {
                "Content-Type": "text/html",
                "Content-Size": msg.length
            });
            res.setHeader("Content-Size", msg.length);
            res.write( msg );
            res.end();
        } else {
            res.writeHead(200, {
                "Content-Type":
                    fileRef.indexOf(".js") >= 0
                        ? "text/javascript"
                        : "text/html",
                "Content-Size": data.length
            });
            res.write(data);
            res.end();
        }
    });
}

var server = http.createServer(function(req, res) {
    console.log("Request for "+req.url+"\n");

    if(req.url == "/" || req.url == "/client.html") {
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
    console.log("Server running on localhost:3000\n");
});

// setup websocket server
var wsServer = new WebSocketSever({
    httpServer: server
});

var clients = {};
var clientCount = 0;

wsServer.on("request", function(req) {
    // create timestamp as client ID
    var clientID = Math.floor( Date.now() / 1000 );
    var connection = req.accept("echo-protocol", req.origin);

    // send message to client to let them know their id
    var dataID = JSON.stringify({
        type: "clientid",
        message: clientID
    });
    connection.sendUTF(dataID);

    // notify other clients that we have a new person
    var notification = JSON.stringify({
        type: "newclient",
        message: clientID
    });

    for(var id in clients) {
        if (clients.hasOwnProperty(id)) {
            clients[id].sendUTF(notification);
        }
    }

    // notify new connection of exisiting clients
    var clientList  = []
    for(var id in clients) {
        if (clients.hasOwnProperty(id)) {
            clientList.push(id);
        }
    }
    var exisitingClients = JSON.stringify({
        type:"clientlist",
        message: clientList
    });
    connection.sendUTF(exisitingClients);

    // store new client
    clients[clientID] = connection; clientCount++;
    console.log(new Date().toLocaleString()+" Websocket Connection ID:"+clientID+". Number of clients = "+clientCount+"\n");

    // client send a message
    connection.on("message", function(message) {
        console.log(new Date().toLocaleString()+" Incomming message from "+clientID+"\n");

        var data = JSON.parse(message.utf8Data);

        var cl_id = data.id;
        var cl_message = data.message;

        if (typeof clients[cl_id] != "undefined") {
            var responseData = JSON.stringify({
                type: "message",
                clientID: clientID,
                message: cl_message
            });
            clients[cl_id].sendUTF(responseData);
        } else {
            console.log(new Date().toLocaleString()+" Error - message for "+id+", client not found.\n");
            var responseData = JSON.stringify({
                type: "error",
                message: "client not found"
            });
            connection.sendUTF(responseData);
        }
    });

    // client disconnects
    connection.on("close", function(reasonCode, description) {
        console.log(
            new Date().toLocaleString()
            +" Client "+clientID+" has disconnected.\n"
            +"   ReadonCode: "+reasonCode+"\n"
            +"   Desc: "+description+"\n"
            +"   Remote address: "+connection.remoteAddress
            +"\n"
        );
        clientCount--;

        // remove client from list
        delete clients[clientID];

        // pass on that client has disconnected
        var notififation = JSON.stringify({
            type: "clientclosed",
            message: clientID
        });
        for (var id in clients) {
            if (clients.hasOwnProperty(id)) {
                clients[id].sendUTF(notififation);
            }
        }
    });
});

