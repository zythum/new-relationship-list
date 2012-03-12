/**
 * Copy an array
 * @id STK.core.arr.copy
 * @alias STK.core.arr.copy
 * @param {Array} o
 * @return {Array} result
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = [1,2,3]
 * var li2 = STK.core.arr.copy(li1);
 * li2 === [1,2,3];
 * li2 !== li1;
 */
$Import('core.arr.isArray');
STK.register('core.arr.copy', function($){
	return function(o){
		if (!$.core.arr.isArray(o)) {
			throw 'the copy function needs an array as first parameter';
		}
		return o.slice(0);
	};
});
