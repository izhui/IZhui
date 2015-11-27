// 'use strict';
var Class =         require("osr-class");
var rd =            require("rd");
var Model =         require("./model");
var Controller =    require("./controller");
var Service =       require("./service");
var debug =         require("debug")("iZhui");
var Gaze =          require("gaze").Gaze;
var Path =          require("path");
var mkdirp =        require("mkdirp");
var fs =            require("fs");
var iZhui = Class.extends({
    $ : function(){
        this.models = {};
        this.controllers = {};
        this.services = {};
        this.modellist = [];
        this.controllerlist = [];
        this.servicelist = [];
        this.cachedir = null;
        // this.gaze.on("change",function(file){
            // console.log("change",file);
        // });
    },

	start: function( path ){
        this.path = path;
        var self = this;
        this.gaze = new Gaze(Path.join(path,"/**/*.js"));
        this.cachedir = Path.join(path,"../.tmp");
        mkdirp.sync(this.cachedir);
        this.gaze.on("changed",function(file){
            // console.log(arguments);
            // console.log(require.cache[file]);
            require.cache[file] = null;
            delete require.cache[file];
            self.load(path,file);
            self.init();
        });
        rd.eachFileFilterSync(this.path,/\.js$/,function(f,s){
            self.load(path,f);
        });
        this.init();
    },
	
	load: function(path,f){
        // console.log(f.replace(path,""));
        var file = f.replace(path+"\\",'');
        // console.log(Path.dirname(file));
        var dirname = Path.dirname(file);
        var sdir = dirname.split(Path.sep);
        var base = Path.basename(f,".js");
        // console.log(sdir,base);
        // var sfile = file.split("\\");
        // console.log(sfile);
        var item = null;
        var temp = [];
        // while((item = sfile.shift()) != null){
            // if("index.js" != item){
                // temp.push(item.replace(".js",""));
            // }
        // }
        this.loadScript( sdir, base, f );
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
    init: function(){
        var self = this;
        this.modellist.forEach(function(item,index){
            self.loadModel( item.paths, item.file );
        });
        this.controllerlist.forEach(function(item,index){
            self.loadController( item.paths, item.file );
        });
        this.servicelist.forEach(function(item,index){
            self.loadService( item.paths, item.file );
        });
    },
    
    loadScript: function( paths, base, file ){
        var dir = Path.join(this.cachedir,paths.join("/"));
        var method = paths.shift();
        if("index" !== base){
            paths.push(base);
        }
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
        // this.gaze.add(file);
        // console.log(file);
        // var dir = Path.dirname(this.cachedir);
        debug("mkdirp",dir,base);
        mkdirp.sync(dir);
        var readable = fs.createReadStream( file );
        var to = Path.join(dir,base+".js");
        var writable = fs.createWriteStream( to );
        readable.pipe(writable);
        debug("copy-file",file,"->",to);
        // console.log(dir);
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
process.on("uncaughtException",function(err){
	debug("error",err.message);
	debug("error",err.stack);
});
module.exports = new iZhui;
