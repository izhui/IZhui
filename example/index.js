var ofc = require("../");

var path = require("path");

// ofc.start(__dirname+"\\logic");

ofc.start(path.join(__dirname,"logic"));

// ofc.service("user").register("iamee","hello",console.log);

// ofc.service("user").login("iamee","hello",console.log);

// ofc.service("user").getUserInfo("iamee",function(err,user){
	// if(user){
		// console.log(user.toJSON());
	// }
// });

setInterval(function(){
    ofc.service("user").getUserInfo("iamee",function(err,user){
        if(user){
            console.log(user.toJSON());
        }
    });
},1000);