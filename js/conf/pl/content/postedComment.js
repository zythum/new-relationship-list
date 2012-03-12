/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('comp.content.postedComment');

STK.pageletM.register("pl.content.postedComment", function($) {
	var node = $.E("pl_content_postedComment");
	var that = $.comp.content.postedComment(node);
	return that;
});