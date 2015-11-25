var Class = require("osr-class");
var rd = require("rd");
var Model = require("./model");
var Controller = require("./controller");
var Service = require("./service");
var O4c = Class.extends({
	$ : function(){
		this.models = {};
		this.controllers = {};
		this.services = {};
	},
	
	start: function( path ){
		this.path = path;
		var _this = this;
		rd.eachFileFilterSync(this.path,/\.js$/,function(f,s){
			// console.log(f.replace(path,""));
			var file = f.replace(path+"\\",'');
			var sfile = file.split("\\");
			// console.log(sfile);
			var item = null;
			var temp = [];
			while((item = sfile.shift()) != null){
				if("index.js" != item){
					temp.push(item.replace(".js",""));
				}
			}
			_this.loadScript( temp, f );
		})
	},
	
	loadScript: function( paths, file ){
		var method = paths.shift();
		if( "models" === method ){
			this.loadModel( paths, file );
		}else if( "controllers" === method ){
			this.loadController( paths, file );
		}else if( "services" === method ){
			this.loadServices( paths, file );
		}
	},
	
	loadModel: function( paths, file ){
		// console.log("model",paths,file);
		var modelSource = require(file);
		var name = paths.join(".");
		var model = Model.define( name, modelSource.schema, modelSource.before, modelSource.after , modelSource.collection , modelSource.toJSON );
		this.models[name] = model;
	},
	
	loadController: function( paths, file ){
		// console.log("controller",paths,file);
		var controllerSource = require(file);
		var name = paths.join(".");
		var controller = Controller.define( name, controllerSource.config );
		this.controllers[name] = controller;
	},
	
	loadServices: function( paths, file ){
		// console.log("service",paths,file);
		var serviceSource = require(file);
		var name = paths.join(".");
		var service = Service.define( name, serviceSource.config );
		this.services[name] = service;
	},
	
	model: function( name ){
		return this.models[name];
	},
	
	service: function( name ){
		return this.services[name];
	},
	
	controller: function( name ){
		return this.controllers[name];
	}
	
});

module.exports = new O4c;