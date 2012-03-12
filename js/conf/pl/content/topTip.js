/**
 * @author Chen Jian | chenjian2@staff.sina.com.cn
 * 
 * 首页左侧导航
 * @id STK.pl.content.topTip
 */
$Import('comp.content.topTip');

STK.pageletM.register("pl.content.topTip", function($) {
	var node = $.E("pl_content_topTip");	
	var that = $.comp.content.topTip(node);
	return that;
});