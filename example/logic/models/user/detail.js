var ObjectId = require("mongoose").Schema.ObjectId;
module.exports = {
	collection: "MyUserDetail",
	schema: {
		avatar: 	{ type: String, index: true },
		nickname: 	{ type: String, index: true },
		regtime:	{ type: Number, index: true },
	},
	before: {
		save : function( next ){
			this.regtime = Date.now();
			next();
		}
	},
	// after: {
		// save: function(){
			// console.log("after:save",arguments);
		// }
	// },
	toJSON: function(){
		return { avatar: this.avatar, regtime: this.regtime, nickname: this.nickname };
	}
}