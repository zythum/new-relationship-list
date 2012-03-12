/**
 *  新手引导页
 * @id pl.guide.guide
 * @return {Object} 实例
 * @example
 */
$Import('comp.guide.accessdeny');

STK.pageletM.register('pl.guide.accessdeny',function($){
	var node = $.E('pl_guide_accessdeny');
	var that = $.comp.guide.accessdeny(node);
	return that;
});
