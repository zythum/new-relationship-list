/**
 * @author  zhaobo | zhaobo@staff.sina.com.cn
 * 
 * 版本提示
 * @id STK.pl.content.versionTip
 * 
 */
$Import('comp.content.versionTip');

STK.pageletM.register("pl.content.versionTip", function($) {
	var node = $.E("pl_content_versionTip");
	var that = $.comp.content.versionTip(node);
	return that;
});