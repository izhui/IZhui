var promise = require("promise");
module.exports = {
	conn : require("../../connect"),
	init: function(){
		var UserClass = this.context.model("user");
		var UserDetail = this.context.model("user.detail");
		this.User = new UserClass(this.conn);
		this.UserDetail = new UserDetail(this.conn);
	},
	register: function( uname, upass , callback ){
		var self = this;
		return promise.denodeify(this.User.findOne).bind(this.User)({ uname: uname }).then( function(user){
			if( user ){
				throw new Error( uname + " is already exist!");
			}
			return promise.denodeify(self.UserDetail.create).bind(self.UserDetail)({ avatar: "default.png", nickname: uname });
		}).then(function(detail){
			return promise.denodeify(self.User.create).bind(self.User)({ detail: detail._id, uname: uname, upass: upass });
		}).then(function(user){
			callback(null,user);
			return user;
		},function( err ){
			callback(err);
			throw err;
		});
	},
	login: function( uname, upass, callback ){
		this.User.findOne({ uname: uname, upass: upass }, callback );
	},
	getUserInfo: function( uname, callback ){
		// callback(null,{toJSON:function(){return "hello"}});
		// return;
		this.User.findOne({ uname: uname}).populate("detail").exec(this.User.toResult(callback));
	}
}