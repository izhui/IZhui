var ofc = require("../");

ofc.start(__dirname+"\\logic");

// ofc.service("user").register("iamee","hello");

// ofc.service("user").login("iamee","hello",console.log);

ofc.service("user").getUserInfo("iamee",function(err,user){
	if(user){
		console.log(user.toJSON());
	}
});

