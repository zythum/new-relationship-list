/**
 * make the object's function be cascaded
 * @id STK.core.obj.cascade
 * @alias STK.core.obj.cascade
 * @param {Object} obj
 * @param {Array} fList
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
	var obj = {'f1':function(){},'f2':function(){}};
	STK.core.obj.cascade(obj,['f1','f2']);
	obj.f1().f2()
 */
STK.register('core.obj.cascade', function($){
	return function(obj, fList){
		for (var i = 0, len = fList.length; i < len; i += 1) {
			if (typeof obj[fList[i]] !== 'function') {
				throw 'cascade need function list as the second paramsters';
			}
			obj[fList[i]] = (function(fun){
				return function(){
					fun.apply(obj, arguments);
					return obj;
				};
			})(obj[fList[i]]);
		}
	};
});
