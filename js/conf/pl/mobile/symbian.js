/**
 * @author qbaty | yuheng@staff.sina.com.cn
 *
 * @id STK.pl.mobile.symbian
 */
$Import('comp.mobile.symbian');

STK.pageletM.register("pl.mobile.symbian", function($) {
	var node = $.E("pl_mobile_symbian");
	var that = $.comp.mobile.symbian(node);
	return that;
});