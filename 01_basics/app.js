// get modules
var demo = require("./modules/demo");

console.log("Username is: "+demo.getUsername());

demo.setUsername("Bob");

console.log("Username is: "+demo.getUsername());