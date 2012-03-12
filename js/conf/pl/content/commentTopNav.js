/**
 * @author qiyuheng | yuheng@staff.sina.com.cn
 */
$Import('comp.content.commentTopNav');

STK.pageletM.register("pl.content.commentTopNav", function($) {
	var node = $.E("pl_content_commentTopNav");
	var that = $.comp.content.commentTopNav(node);

	return that;
});