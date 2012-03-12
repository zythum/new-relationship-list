/**
 * 我的通知列表
 * @author bigbone || guoqing5@staff.sina.com.cn
 * @id pl_content_noticeList
 * @return object
 */
 $Import('common.vote.textVote');
 
STK.pageletM.register('pl.content.textVote',function($){

	var node = $.E('pl_content_textVote');
	var that = $.common.vote.textVote(node,{max:2,poll_id:2});
	return that;
	
});
