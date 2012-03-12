/**
 *  新手引导页
 * @id pl.guide.guide
 * @return {Object} 实例
 * @example
 */
$Import('comp.guide.publicGroup');


STK.pageletM.register('pl.guide.publicGroup',function($){
	var node = $.E('pl_guide_publicGroup');
	var that = $.comp.guide.publicGroup(node);
	return that;
});
