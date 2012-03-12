/**
 * @author wangliang3 | wangliang3@staff.sina.com.cn
 * 
 * 侧边栏： 话题
 * @id STK.pl.content.topic
 */
$Import('comp.content.topic');
STK.pageletM.register('pl.content.topic', function($) {
	var node = $.E('pl_content_topic');
	return $.comp.content.topic(node);
});