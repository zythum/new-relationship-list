/**
 * 工具包
 *  author 赵波 zhaobo@staff.sina.com.cn
 */


STK.register("common.forward.utils", function($) {

	var that = {
		checkAtNum: function(value){
			var aNum = value.match(/@[a-zA-Z0-9\u4e00-\u9fa5_]{0,20}/g);
			var xNum = value.match(/\/\/@[a-zA-Z0-9\u4e00-\u9fa5_]{0,20}/g);
			aNum = aNum? aNum.length: 0;
			xNum = xNum? xNum.length: 0;
			return aNum - xNum;
		},
		preventDefault : function(evt){
			$.core.evt.preventDefault(evt);
			return false;
		}
	};
	return that;
});