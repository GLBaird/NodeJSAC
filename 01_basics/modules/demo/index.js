var username = "default";

function setUsername(name) {
    username = name;
}

function getUsername() {
    return username;
}

module.exports.setUsername = setUsername;
module.exports.getUsername = getUsername;