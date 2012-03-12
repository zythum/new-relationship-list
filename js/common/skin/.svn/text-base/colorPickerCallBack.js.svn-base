/**
 * 颜色选择器回调函数
 * @author 非反革命|zhaobo@staff.sina.com.cn
 * @example
 */

$Import("common.channel.colorPick");
STK.register("common.skin.colorPickerCallBack", function($) {
	//---常量定义区----------------------------------


	//-------------------------------------------
	return function(dom, callBack) {
		var that = {};
		$.common.channel.colorPick.fire("setting", [dom, callBack]);
		//-------------------------------------------
		return that;
	};
});
