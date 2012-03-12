/**
 * Find out the index of items which equal to some value.
 * @id STK.core.arr.findout
 * @alias STK.core.arr.findout
 * @param {Array} o
 * @param {String/Number} value
 * @return {Array} k
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = STK.core.arr.findout(li1,'a');
 * li2 === [0,3]
 */

$Import('core.arr.isArray');
STK.register('core.arr.findout', function($){
	return function(o, value){
		if (!$.core.arr.isArray(o)) {
			throw 'the findout function needs an array as first parameter';
		}
		var k = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (o[i] === value) {
				k.push(i);
			}
		}
		return k;
	};
});
