/**
 * @非反革命
 *  微博单条页 JS
 * @id pl.content.weiboDetail
 * @author zhaobo | zhaobo@staff.sina.com.cn
 * @history
 */
$Import("comp.content.weiboDetail");

STK.pageletM.register("pl.content.weiboDetail", function($) {
	var node = $.E("pl_content_weiboDetail");
	return $.comp.content.weiboDetail(node);
});