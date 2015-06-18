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