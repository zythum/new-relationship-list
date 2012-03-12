/**
 * Make the items of Array unique
 * @id STK.core.arr.unique
 * @alias STK.core.arr.unique
 * @param {Array} o
 * @return {Array} result
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = STK.core.arr.unique(li1);
 * li2 === ['a','b','c']
 */
$Import('core.arr.isArray');
$Import('core.arr.indexOf');
STK.register('core.arr.unique', function($) {
	return function(o) {
		if (!$.core.arr.isArray(o)) {
			throw 'the unique function needs an array as first parameter';
		}
		var result = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if ($.core.arr.indexOf(o[i], result) === -1) {
				result.push(o[i]);
			}
		}
		return result;
	};
});