/**
 * @author wangliang3
 */
$Import('comp.content.medalwithajax');
STK.pageletM.register("pl.content.medalwithajax", function($) {
	var node = $.E("pl_leftNav_medal");
	var that = $.comp.content.medalwithajax(node,{column:4, autohidden:1});
	return that;
});