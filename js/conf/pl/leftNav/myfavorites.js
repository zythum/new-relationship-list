/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 我的收藏左侧导航
 * @id STK.pl.leftNav.myfavorites
 */
$Import('comp.leftNav.myfavorites');

STK.pageletM.register("pl.leftNav.myfavorites", function($) {
	var node = $.E("pl_leftNav_myfavorites");
	var that = $.comp.leftNav.myfavorites(node);
	return that;
});