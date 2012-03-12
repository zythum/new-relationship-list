
/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @id STK.core.json.merge
 * @alias STK.core.json.merge
 * @param {Object} origin
 * @param {Object} cover
 * @return {Object} opts{isDeep:true/false}
 */

$Import("core.arr.inArray");
$Import("core.arr.isArray");
$Import("core.dom.isNode");
$Import("core.obj.parseParam");
STK.register('core.json.merge',function($){
	var checkOriginObj = function(obj){
		if(obj === undefined){
			return true;
		}
		if(obj === null){
			return true;
		}
		if($.core.arr.inArray(['number','string','function'], (typeof obj))){
			return true;
		}
		if($.core.arr.isArray(obj)){
			return true;
		}
		if($.core.dom.isNode(obj)){
			return true;
		}
		return false;
	};
	var merge = function(origin, cover, isDeep){
		var ret = {};
		for(var k in origin){
			if(cover[k] === undefined){
				ret[k] = origin[k];
			}else{
				if(!checkOriginObj(origin[k]) && !checkOriginObj(cover[k]) && isDeep){
					ret[k] = arguments.callee(origin[k], cover[k]);
				}else{
					ret[k] = cover[k];
				}
			}
		}
		for(var l in cover){
			if(ret[l] === undefined){
				ret[l] = cover[l];
			}
		}
		return ret;
	};
	return function(origin, cover, opts){
		var conf = $.core.obj.parseParam({
			'isDeep' : false
		}, opts);
		
		return merge(origin, cover, conf.isDeep);
	};
});