/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('comp.content.changeLanguage');

STK.pageletM.register("pl.content.changeLanguage", function($) {
	var node = $.E("pl_content_changeLanguage");
	var that = $.comp.content.changeLanguage(node);
	return that;
});