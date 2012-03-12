/**
 * Created by IntelliJ IDEA.
 * User: xionggq
 * Date: 11-11-10
 * Time: 上午11:39
 * 首页帮助手机切换的dom功能。
 */
$Import('comp.content.help');

STK.pageletM.register("pl.content.help", function($) {
	var node = $.E("pl_common_help");
	var that = $.comp.content.help(node);
	return that;
});