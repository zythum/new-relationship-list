/**
 * author Robin Young | yonglin@staff.sina.com.cn
 * 
 */

STK.register('kit.extra.reuse', function($){
	return function(createFn,spec){
		var conf, that, cache;
		conf = $.parseParam({}, spec);
		cache = [];
		var create = function(){
			var ret = createFn();
			cache.push({
				'store' : ret,
				'used' : true
			});
			return ret;
		};
		var setUsed = function(obj){
			$.foreach(cache,function(item, index){
				if(obj === item['store']){
					item['used'] = true;
					return false;
				}
			});
		};
		var setUnused = function(obj){
			$.foreach(cache,function(item, index){
				if(obj === item['store']){
					item['used'] = false;
					return false;
				}
			});
		};
		var getOne = function(){
			for(var i = 0, len = cache.length; i < len; i += 1){
				if(cache[i]['used'] === false){
					cache[i]['used'] = true;
					return cache[i]['store'];
				}
			};
			return create();
		};
		that = {};
		that.setUsed = setUsed;
		that.setUnused = setUnused;
		that.getOne = getOne;
		that.getLength = function(){
			return cache.length;
		};
		return that;
	};
});