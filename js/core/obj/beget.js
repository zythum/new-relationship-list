/**
 * 对象继承函数
 * @id STK.core.obj.beget
 * @alias STK.core.obj.beget
 * @param {Object} o
 * @return {Object} result
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var obj = STK.core.obj.beget({'test':'test'});
 */
STK.register('core.obj.beget',function($){
	var F = function(){};
	return function(o){
		F.prototype = o;
		return new F();
	};
});