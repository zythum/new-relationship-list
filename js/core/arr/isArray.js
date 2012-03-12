/**
 * Check Array
 * @id STK.core.arr.isArray
 * @alias STK.core.arr.isArray
 * @param {Array} o
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = [1,2,3]
 * var bl2 = STK.core.arr.isArray(li1);
 * bl2 == TRUE
 */
STK.register('core.arr.isArray', function($){
	return function(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	};
});
