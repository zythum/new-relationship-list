/**
 * @id STK.pl.mobile.wap
 * @author Runshi Wang | runshi@staff.sina.com.cn
 */

$Import('comp.mobile.wap');

STK.pageletM.register("pl.mobile.wap", function($) {
	var node = $.E("pl_mobile_wap");
	var that = $.comp.mobile.wap(node);
	return that;
});