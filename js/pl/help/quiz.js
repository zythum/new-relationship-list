/**
 * 客服 提问
 * @author xinglong1
 * @id pl_help_quiz
 * @return {Object} 实例
 * @example
 */
$Import('comp.help.quiz');
STK.pageletM.register("pl.help.quiz", function($) {
	var node = $.E("pl_help_quiz");
	return $.comp.help.quiz(node);
});