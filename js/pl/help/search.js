/**
 * 客服 搜索
 * @author xinglong1
 * @id pl_help_search
 * @return {Object} 实例
 * @example
 */
$Import('comp.help.search');
STK.pageletM.register("pl.help.search", function($) {
	var node = $.E("pl_help_search");
	return $.comp.help.search(node);
});