/**
 * @author chenjian2 | chenjian2@staff.sina.com.cn
 * 
 * V4热门转发与热门评论
 * @id STK.pl.content.topmblog
 */
$Import('comp.content.topmblog');
STK.pageletM.register('pl.content.topmblog', function($) {
	var node = $.E('pl_content_topmblog');
	return $.comp.content.topmblog(node);
});