var ObjectId = require("mongoose").Schema.ObjectId;
var crypto = require("crypto");

module.exports = {
	// collection: "MyUser",
	schema: {
		uname : { type: String, index: true, required: true , unique: true  },
		upass : { type: String, required: true },
		detail: { type: ObjectId, ref : "user.detail" }
	},
	before: {
		save : function( next ){
			//保存，双重加密
			this.upass =  crypto.createHash("md5").update(this.upass).digest("hex");
			this.upass = crypto.createHash('sha256').update(this.upass).digest("base64");
			next();
		},
		findOne : function( next ){
			//筛选, 如果通过密码查找，自动加密
			if(this._conditions["upass"]){
				var pass = this._conditions["upass"];
				pass = crypto.createHash("md5").update(pass).digest("hex")
				this._conditions["upass"] = crypto.createHash('sha256').update(pass).digest("base64");
			}
			next();
		}
	},
	toJSON: function(){
		return { uname: this.uname, upass: crypto.createHash("md5").update(this.upass).digest("hex") , userid: this._id , detail: this.detail.toJSON ? this.detail.toJSON(): this.detail };
	}
}