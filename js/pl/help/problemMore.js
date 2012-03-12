/**
 * 客服 搜索
 * @author xinglong1
 * @id pl_help_search
 * @return {Object} 实例
 * @example
 */
$Import('comp.help.problemMore');
STK.pageletM.register("pl.help.problemMore", function($) {
	var node = $.E("pl_help_problemMore");
	return $.comp.help.problemMore(node);
});