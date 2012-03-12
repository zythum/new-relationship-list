/**
 * @author qbaty | yuheng@staff.sina.com.cn
 *
 * @id STK.pl.mobile.blackberry
 */
$Import('comp.mobile.blackberry');

STK.pageletM.register("pl.mobile.blackberry", function($) {
	var node = $.E("pl_mobile_blackberry");
	var that = $.comp.mobile.blackberry(node);
	return that;
});