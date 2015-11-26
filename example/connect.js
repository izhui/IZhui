var Mongoose = require("mongoose");
var conn = Mongoose.createConnection("mongodb://127.0.0.1/iZhui");
module.exports = conn;