module.exports.collection = "MyUser";
module.exports.schema = {
	uname: { type: String, index: true, required: true },
	upass: { type: String, required: true },
}

module.exports.before = {
	save: function( next ){
		this.upass = this.uname + ":" + Date.now();
		next();
	}
}

module.exports.after = {
	save: function(){
		console.log("after:save",arguments);
	}
}

module.exports.toJSON = function(){
	return { uname: this.uname, upass: this.upass , userid: this._id };
}