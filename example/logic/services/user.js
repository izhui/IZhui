module.exports = {
	init: function(){
		this.User = this.context.controller("user");
	},
	register : function( uname, upass ,callback ){
		return this.User.register( uname, upass, callback );
	},
	login: function( uname, upass, callback ){
		return this.User.login( uname, upass, callback );
	},
	getUserInfo: function( uname, callback ){
		return this.User.getUserInfo( uname, callback );
	}
}