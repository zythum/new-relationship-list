/**
 * get result for each item
 * @id STK.core.arr.foreach
 * @alias STK.core.arr.foreach
 * @param {Array} o
 * @param {Function} insp
 * @return {Array} r
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = [1,2,3,4]
 * var li2 = STK.core.arr.foreach(li1,function(v,i){return v + i});
 * li2 === [1,3,5,7]
 */

$Import('core.arr.isArray');
STK.register('core.arr.foreach', function($){
	
	var arrForeach = function(o, insp){
		var r = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			var x = insp(o[i], i);
			if (x === false){
				break;
			} else if (x !== null) {
				r[i] = x;
			}
		}
		return r;
	};
	
	var objForeach = function(o, insp){
		var r = {};
		for (var k in o) {
			var x = insp(o[k], k);
			if (x === false){
				break;
			} else if (x !== null) {
				r[k] = x;
			}
		}
		return r;
	};
	return function(o, insp){
		if ($.core.arr.isArray(o) || (o.length && o[0] !== undefined)) {
			return arrForeach(o, insp);
		} else if (typeof o === 'object') {
			return objForeach(o, insp);
		}
		return null;
	};
});
