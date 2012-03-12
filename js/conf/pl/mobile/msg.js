/**
 * @id STK.pl.mobile.msg
 * @author Runshi Wang | runshi@staff.sina.com.cn
 */

$Import('comp.mobile.msg');

STK.pageletM.register("pl.mobile.msg", function($) {
	var node = $.E("pl_mobile_msg");
	var that = $.comp.mobile.msg(node);
	return that;
});