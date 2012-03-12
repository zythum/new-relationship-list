/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 我的微博左侧导航
 * @id STK.pl.leftNav.mine
 */
$Import('comp.leftNav.mine');

STK.pageletM.register("pl.leftNav.mine", function($) {
	var node = $.E("pl_leftNav_mine");
	var that = $.comp.leftNav.mine(node);
	return that;
});