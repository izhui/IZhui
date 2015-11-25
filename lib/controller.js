var Class = require("osr-class");

var Controller = Class.extends({
	$ : function( name , config ){
		this.name = name;
		this.config = config;
	}
});

Controller.define = function( fns , name ){
	var ControllerCalss =  Controller.extends( fns );
	return new ControllerCalss( name );
}

module.exports = Controller;