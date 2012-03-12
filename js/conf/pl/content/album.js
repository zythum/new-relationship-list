/**
 * @author  zhaobo | zhaobo@staff.sina.com.cn
 * 
 * profile页相册
 * @id STK.pl.content.album
 * 
 */
$Import('comp.content.album');

STK.pageletM.register("pl.content.album", function($) {
	var node = $.E("pl_content_album");
	var that = $.comp.content.album(node);
	return that;
});