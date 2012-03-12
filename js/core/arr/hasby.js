/**
 * Find out the index of items which confirm some rules.
 * @id STK.core.arr.hasby
 * @alias STK.core.arr.hasby
 * @param {Array} o
 * @param {Function} insp
 * @return {Array} k
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = ['a','b','c','ab']
 * var li2 = STK.core.arr.hasby(li1,function(v,i){return (v.indexOf('a') !== -1)});
 * li2 === [0,3]
 */

$Import('core.arr.isArray');
STK.register('core.arr.hasby', function($){
	return function(o, insp){
		if (!$.core.arr.isArray(o)) {
			throw 'the hasBy function needs an array as first parameter';
		}
		var k = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (insp(o[i], i)) {
				k.push(i);
			}
		}
		return k;
	};
});
