/**
 * Delete empty item in array(like undefined/null/empty string)
 * @id STK.core.arr.clear
 * @alias STK.core.arr.clear
 * @param {Array} o
 * @return {Array} result
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li = STK.core.arr.clear([1,2,3,undefined]);
 * li === [1,2,3];
 * @import STK.core.arr.isArray
 * @import STK.core.arr.findout
 */
$Import('core.arr.isArray');
$Import('core.arr.findout');
STK.register('core.arr.clear', function($){
	return function(o){
		if (!$.core.arr.isArray(o)) {
			throw 'the clear function needs an array as first parameter';
		}
		var result = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (!($.core.arr.findout([undefined,null,''],o[i]).length)) {
				result.push(o[i]);
			}
		}
		return result;
	};
});
