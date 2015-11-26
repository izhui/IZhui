var Class = require("osr-class");
var rd = require("rd");
var Model = require("./model");
var Controller = require("./controller");
var Service = require("./service");
var debug = require("debug")("iZhui")
var iZhui = Class.extends({
	$ : function(){
		this.models = {};
		this.controllers = {};
		this.services = {};
		this.modellist = [];
		this.controllerlist = [];
		this.servicelist = [];
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
		});
		this.init();
	},

	init: function(){
		var _this = this;
		this.modellist.forEach(function(item,index){
			_this.loadModel( item.paths, item.file );
		});
		this.controllerlist.forEach(function(item,index){
			_this.loadController( item.paths, item.file );
		});
		this.servicelist.forEach(function(item,index){
			_this.loadService( item.paths, item.file );
		});
	},
	
	loadScript: function( paths, file ){
		var method = paths.shift();
		if( "models" === method ){
			//this.loadModel( paths, file );
			this.modellist.push({ paths: paths, file: file });
		}else if( "controllers" === method ){
			//this.loadController( paths, file );
			this.controllerlist.push({ paths: paths, file: file });
		}else if( "services" === method ){
			//this.loadService( paths, file );
			this.servicelist.push({ paths: paths, file: file });
		}
	},

	loadModel: function( paths, file ){
		// console.log("model",paths,file);
		var modelSource = require(file);
		var name = paths.join(".");
		// console.log(modelSource);
		var model = Model.define( name, modelSource.schema, modelSource.before, modelSource.after , modelSource.collection , modelSource.toJSON );
		// console.log("===>",model.prototype);
		this.models[name] = model;
		debug("loadModel",name,file);
	},

	loadController: function( paths, file ){
		// console.log("controller",paths,file);
		var controllerSource = require(file);
		var name = paths.join(".");
		var controller = Controller.define( controllerSource , name, this );
		this.controllers[name] = controller;
		debug("loadController",name,file);
	},

	loadService: function( paths, file ){
		// console.log("service",paths,file);
		var serviceSource = require(file);
		var name = paths.join(".");
		var service = Service.define( serviceSource , name, this );
		this.services[name] = service;
		debug("loadService",name,file);
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

module.exports = new iZhui;
