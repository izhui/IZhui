var Class = require("osr-class");
var _ = require("osr-utils");
var Controller = Class.extends({
	$ : function( name , context ){
		this.name = name;
		this.context = context;
		if(_.isFunction(this.init)){
			this.init();
		}
	}
});

Controller.define = function( fns , name, context ){
	var ControllerCalss =  Controller.extends( fns );
	return new ControllerCalss( name , context );
}

module.exports = Controller;