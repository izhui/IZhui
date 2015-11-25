var Class = require("osr-class");

var Service = Class.extends({
	$ : function( name , config ){
		this.name = name;
		this.config = config;
	}
});

Service.define = function( fns , name ){
	var ServiceClass =  Service.extends( fns );
	return new ServiceClass( name );
}

module.exports = Service;