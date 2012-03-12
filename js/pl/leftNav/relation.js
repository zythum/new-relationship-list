/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 关系组左侧导航
 * @id STK.pl.leftNav.relation
 */
$Import('comp.leftNav.relation');

STK.pageletM.register("pl.leftNav.relation", function($) {
	var node = $.E("pl_leftNav_relation");
	var that = $.comp.leftNav.relation(node);
	return that;
});