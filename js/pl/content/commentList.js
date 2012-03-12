/**
 * @author qiyuheng | yuheng@staff.sina.com.cn
 */
$Import('comp.content.commentList');

STK.pageletM.register("pl.content.commentList", function($) {
	var node = $.E("pl_content_commentList");
	var that = $.comp.content.commentList(node);

	return that;
});