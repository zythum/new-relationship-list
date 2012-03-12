/**
 *  新手引导页
 * @id pl.guide.guide
 * @return {Object} 实例
 * @example
 */
$Import('comp.guide.guide');


STK.pageletM.register('pl.guide.guide',function($){
	var node = $.E('pl_guide_guide');
	var that = $.comp.guide.guide(node);
	return that;
});
