/**
 * @author lianyi@staff.sina.com.cn
 * 
 * 左导（用户自定义应用层）
 * @id STK.pl.leftNav.app
 */
$Import('comp.leftNav.app');

STK.pageletM.register("pl.leftNav.app", function($) {
	var node = $.E("pl_leftNav_app");
	var that = $.comp.leftNav.app(node);
	return that;
});