/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 通知左侧导航
 * @id STK.pl.leftNav.notice
 */
$Import('comp.leftNav.notice');

STK.pageletM.register("pl.leftNav.notice", function($) {
	var node = $.E("pl_leftNav_notice");
	var that = $.comp.leftNav.notice(node);
	return that;
});