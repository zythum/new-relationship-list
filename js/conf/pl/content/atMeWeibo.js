/**
 *  他的个人资料模块
 * @id pl.content.atMeWeibo
* @return {Object} 实例
* @example
 */
$Import('comp.content.atMeWeibo');
STK.pageletM.register("pl.content.atMeWeibo", function($) {
	var node = $.E("pl_content_atmeWeibo");
	return $.comp.content.atMeWeibo(node);
});