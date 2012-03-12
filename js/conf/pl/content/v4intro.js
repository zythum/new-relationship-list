/**
 * @author chenjian2 | chenjian2@staff.sina.com.cn
 * 
 * 求邀请码页：v3用户向v4用户提出私信邀请码请求
 * @id STK.pl.content.topic
 */
$Import('comp.content.v4intro');
STK.pageletM.register('pl.content.v4intro', function($) {
	var node = $.E('pl_content_v4intro');
	return $.comp.content.v4intro(node);
});