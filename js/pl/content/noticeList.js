/**
 * 我的通知列表
 * @author bigbone || guoqing5@staff.sina.com.cn
 * @id pl_content_noticeList
 * @return object
 */
 $Import('comp.content.noticeList');
 
STK.pageletM.register('pl.content.noticeList',function($){
	var node = $.E('pl_content_noticeList'); 
	var that = $.comp.content.noticeList(node);
	return that;
});