/**
 * @id STK.pl.mobile.voice
 * @author Runshi Wang | runshi@staff.sina.com.cn
 */

$Import('comp.mobile.voice');

STK.pageletM.register("pl.mobile.voice", function($) {
	var node = $.E("pl_mobile_voice");
	var that = $.comp.mobile.voice(node);
	return that;
});