/**
 * @author qbaty | yuheng@staff.sina.com.cn
 *
 * @id STK.pl.mobile.android
 */
$Import('comp.mobile.android');

STK.pageletM.register("pl.mobile.android", function($) {
	var node = $.E("pl_mobile_android");
	var that = $.comp.mobile.android(node);
	return that;
});