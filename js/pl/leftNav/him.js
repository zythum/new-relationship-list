/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 他的微博左侧导航
 * @id STK.pl.leftNav.him
 */
$Import('comp.leftNav.him');

STK.pageletM.register("pl.leftNav.him", function($) {
	var node = $.E("pl_leftNav_him");
	var that = $.comp.leftNav.him(node);
	return that;
});