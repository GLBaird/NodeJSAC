var app = {

    // networking
    ws: null,
    identifier: null,
    clientIdentifier: null,

    // UI outlets
    clientList: null,
    log: null,
    inputText: null,

    run: function() {

        // get UI outlets
        this.log = document.getElementById("textLog");
        this.inputText = document.getElementById("chatText");
        this.clientList = document.getElementById("clientList");

        // add event listeners
        document.forms[0].addEventListener("submit", this.submitDataHandler.bind(this), false);
        this.clientList.addEventListener("change", this.changeClientHandler.bind(this), false);

        this.setupWebSocket();
    },

    setupWebSocket: function() {
        this.ws = new WebSocket(window.location.href.replace("http", "ws"), "echo-protocol");
        this.ws.addEventListener("message", this.incomingData.bind(this), false);
    },

    /**
     * Form submitted event
     * @param e {Event}
     */
    submitDataHandler: function(e) {
        e.preventDefault();
        var txt = this.inputText.value;
        this.ui.addTextToLogClient(txt);
        this.inputText.value = "";

        // send through socket
        var message = JSON.stringify({
            id: this.clientIdentifier,
            message: txt
        });
        this.ws.send(message);
    },

    /**
     * Called when the SELECT element has changed,
     * should update the client to send message
     * @param e {Event}
     */
    updateClientIdentifier: function() {
        document.getElementById("identifier").innerHTML = this.identifier;
    },

    /**
     * Called when the client list has been updated server side
     * @param type {string}  "new"|"remove"
     * @param id {string} id of client to add or remove
     */
    updateClientList: function(type, id) {
        if (type == "new") {

            var option = document.createElement("option");
            option.setAttribute("value", id);
            option.appendChild(
                document.createTextNode(id)
            );
            this.clientList.appendChild(option);

            this.ui.addTextToLogSocket("<i>** New Client "+id+" has joined...</i>");

            if (this.clientIdentifier == null) {
                this.clientIdentifier = id;
            }

        } else if (type == "remove") {
            var options = this.clientList.getElementsByTagName("option");
            for (var i=0; i < options.length; i++) {
                if(options[i].value == id) {
                    this.clientList.removeChild(options[i]);
                    this.ui.addTextToLogSocket("<i>** Client has left: "+id+"</i>");
                    break;
                }
            }
        } else if (type == "parse") {
            for(var i=0; i< id.length; i++) {
                this.updateClientList("new", id[i]);
            }
        }
    },

    changeClientHandler: function(e) {
        this.clientIdentifier = e.target.value;
        this.ui.addTextToLogClient("<i>*** Changed client to "+this.clientIdentifier+"</i>");
    },

    /**
     * Called when the socket is inputing data
     * @param e {Event} string data for UI
     */
    incomingData: function(e) {
        // check data
        var data = JSON.parse(e.data);
        switch (data.type) {
            case "clientlist":
                this.updateClientList("parse", data.message);
                break;
            case "clientid":
                this.identifier = data.message;
                this.updateClientIdentifier();
                break;
            case "message":
                this.ui.addTextToLogSocket("<b>"+data.clientID+"</b>:  "+data.message);
                break;
            case "error":
                this.ui.addTextToLogClient(data.message);
                break;
            case "newclient":
                this.updateClientList("new", data.message);
                break;
            case "clientclosed":
                this.updateClientList("remove", data.message);
                break;
            default:
                this.ui.addTextToLogError("Unknown error occured...");
        }
    },

    /**
     * UI Methods for displaying text
     */
    ui: {
        addTextToLogClient: function(txt) {
            app.log.innerHTML += "<span class='client'>"+txt+"</span>\n";
        },

        addTextToLogSocket: function(txt) {
            app.log.innerHTML += "<span class='socket'>"+txt+"</span>\n";
        },

        addTextToLogError: function(txt) {
            app.log.innerHTML += "<span class='error'>"+txt+"</span>\n";
        }
    }

}