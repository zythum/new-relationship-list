/**
 * Bind a function on an object
 * @id STK.core.func.bind
 * @alias STK.core.func.bind
 * @param {Object} obj
 * @param {Function} fun
 * @param {Array} args
 * @return {Function} fun
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @changlog 新增第三个参数，用来传递函数参数
 * @example
 * var f2 = STK.core.func.bind(window,function(){alert(this)});
 */
$Import('core.arr.isArray');
STK.register('core.func.bind',function($){
	return function(obj,fun, args){
		args = $.core.arr.isArray(args)? args: [args];
		return function(){
			return fun.apply(obj,args);
		};
	};
});