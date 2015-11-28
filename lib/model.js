var Class = require("osr-class");
var Emitter = require("events").EventEmitter;
var EmitterClass = Class.extends(Emitter);
var Schema = require("mongoose").Schema;
var _ = require("osr-utils");
var Model = EmitterClass.extends({
	$ : function( conn ){
		this.conn = conn;
		this._schema = new Schema(this.schema);
		this._schema.target = this;
		//load before fns
		for(var key in this.befores){
			this.bindBefore( key, this.befores[key]);
		}
		//load after fns
		for(var key in this.afters){
			this.bindAfter( key, this.afters[key]);
		}
		//create the db
		this.db = conn.model(this.name,this._schema, this.collection || this.name);
		this.db.prototype.toJSON = this.toJSON;
	},
	
	bindAfter: function( key ,fn ){
		var _this = this;
		_this.on(key,fn);
		this._schema.post(key,function(){
			var args = [key].concat(Array.prototype.slice.call(arguments));
			_this.emit.apply(_this,args);
		});
	},
	
	bindBefore: function( key, fn ){
		this._schema.pre(key,fn);
	},
	
	findOne: function(){
		return this.db.findOne.apply(this.db,arguments);
	},
	find: function(){
		return this.db.find.apply(this.db,arguments);
	},
	update: function(){
		return this.db.update.apply(this.db,arguments);
	},
	remove: function(){
		return this.db.remove.apply(this.db,arguments);
	},
	create: function(){
		return this.db.create.apply(this.db,arguments);
	},
	findOneAndUpdate: function(){
		return this.db.findOneAndUpdate.apply(this.db,arguments);
	},
    toResult: function( callback ){
        return function( err, result ){
            if(err){
                return callback( err, null );
            }
            if(_.isArray(result)){
                var tmp = [];
                result.forEach(function(item,index){
                    if(_.isFunction(item.toJSON)){
                        tmp.push(item.toJSON());
                    }else{
                        tmp.push(item);
                    }
                });
                return callback( null, tmp );
            }else{
                if(_.isFunction(result.toJSON)){
                    return callback( null, result.toJSON());
                }
            }
            return callback(null,result);
        }
    }
});

Model.define = function( name, schema , before, after , collection , toJSON ){
	before = before || {};
	after = after || {};
	var ModelClass = Model.extends({
		name : name,
		schema: schema,
		afters : after,
		befores: before,
		collection: collection,
		toJSON: toJSON
	});
	// for(var key in before){
		// ModelClass.prototype.schema.pre( key , before[key]);
	// }
	return ModelClass;
}

module.exports = Model;