/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 首页左侧导航
 * @id STK.pl.content.tips
 */
$Import('comp.content.tips');

STK.pageletM.register("pl.content.tips", function($) {
	var node = $.E("pl_content_tips");	
	var that = $.comp.content.tips(node);
	return that;
});