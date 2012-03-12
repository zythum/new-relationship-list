/**
 * @author wangliang3@
 */
$Import('comp.content.scrollToTop');
STK.pageletM.register("pl.content.scrollToTop", function($) {
	return $.comp.content.scrollToTop($.E("base_scrollToTop"));
});