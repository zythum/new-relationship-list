$Import('comp.content.explorer_main');
STK.pageletM.register("pl.content.explorer2", function($) {
	var node = $.E("pl_content_explorer2");
	var that = $.comp.content.explorer_main(node);
	return that;
});