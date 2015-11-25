var ofc = require("../");

var mongoose = require("mongoose");

var conn = mongoose.createConnection("mongodb://127.0.0.1/o4c");

ofc.start(__dirname+"\\logic");

var UserClass = ofc.model("user");

var User = new UserClass(conn);


// User.on("save",function(){
	// console.log("===heloo",arguments);
// });

User.create({ uname: "Hello", upass: "hello" },function(err,u){
	if(err){
		console.log(err.message);
		console.log(err.stack);
	}
	console.log(u.toJSON());
});
