$Import('comp.content.explorer');
STK.pageletM.register("pl.content.explorer", function($) {
	var node = $.E("pl_content_explorer");
	var that = $.comp.content.explorer(node);
	return that;
});