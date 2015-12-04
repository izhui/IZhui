Array.prototype.toJSON = function(){
    var result = [];
    this.forEach(function(item,index){
        result.push( item.toJSON ? item.toJSON() : item );
    });
    return result;
}