/**
 * Memorize the function result
 * @id STK.core.func.memorize
 * @alias STK.core.func.memorize
 * @param {Function} fun
 * @param {Object} args
 * 			timeout : 毫秒为单位
 * 			context	: 函数执行时被绑定的对象
 * @return {Function} function
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var f2 = STK.core.func.memorize(function(a,b){return a+b},{'timeout':10});
 */
STK.register('core.func.memorize', function($){
	return function(fun, args){
		if(typeof fun !== 'function'){
			throw 'core.func.memorize need a function as first parameter';
		}
		args = args || {};
		var cache = {};
		
		if (args.timeout) {
			setInterval(function(){
				cache = {};
			}, args.timeout);
		};
		
		return function(){
			var key = Array.prototype.join.call(arguments, '_');
			if (!(key in cache)) {
				cache[key] = fun.apply((args.context || {}), arguments);
			}
			return cache[key];
		};
	};
});
