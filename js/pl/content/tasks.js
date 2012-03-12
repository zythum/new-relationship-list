/**
 * 微博宝典
 * @id pl.guide.tasks
 * @return {Object} 实例
 * @example
 */
$Import('comp.tasks.panel');

STK.pageletM.register('pl.content.tasks',function($){
	var node = $.E('pl_content_tasks');
	var that = $.comp.tasks.panel(node);
	return that;
});
