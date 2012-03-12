/**
 * 判断对象类型
 * @param {Object} oObject 需要判断类型的对象,可以是任意对象
 * @return {String} 传入对象的类型,取值全部为小写
 * @author FlashSoft | flashsoft@live.com
 */
STK.register('core.func.getType', function($){
	return function(oObject){
		var _t;
		return ((_t = typeof(oObject)) == "object" ? oObject == null && "null" || Object.prototype.toString.call(oObject).slice(8, -1) : _t).toLowerCase();
	};
});
