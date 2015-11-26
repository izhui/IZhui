var Class = require("osr-class");
var _ = require("osr-utils");
var Service = Class.extends({
	$ : function( name , context ){
		this.name = name;
		this.context = context;
		if(_.isFunction(this.init)){
			this.init();
		}
	}
});

Service.define = function( fns , name, context ){
	var ServiceClass =  Service.extends( fns );
	return new ServiceClass( name, context );
}

module.exports = Service;