/**
 * 暂存对象的函数
 * @id STK.core.obj.sup
 * @alias STK.core.obj.sup
 * @param {Object} obj
 * @param {Array} fList
 * @return {Object}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
	var obj = {'f1':function(){},'f2':function(){}};
	var sup = STK.core.obj.sup(obj,['f1','f2']);
	sup.f1();
	sup.f2();
 */
STK.register('core.obj.sup', function($){
	return function(obj, fList){
		var that = {};
		for (var i = 0, len = fList.length; i < len; i += 1) {
			if (typeof obj[fList[i]] !== 'function') {
				throw 'super need function list as the second paramsters';
			}
			that[fList[i]] = (function(fun){
				return function(){
					return fun.apply(obj, arguments);
				};
			})(obj[fList[i]]);
		}
		return that;
	};
});
