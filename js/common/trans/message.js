/**
 * message操作接口管理
 * @author gaoyuan3@staff.sina.com.cn
 * 
 * 使用此接口的范例：
		$.common.trans.message.getTrans('delete',{
			'onSuccess': function (o) {
				$.log('delete onSuccess');
			},
			'onError': function (o) {
				$.log('delete onError');
			},
			'onFail': function (o) {
				$.log('delete onFail');
			}
		}).request(data);
 */
$Import("kit.io.inter");
STK.register('common.trans.message',function($){
	
		var t = $.kit.io.inter();
		var g = t.register;

		//删除
		g('delete',			{'url':'/aj/message/del', 'method':'post'});
		g('getMsg',			{'url':'/aj/message/getmessagedetail', 'method':'get'});
		/*
			{
				msgList[]:			要删除的message的ID列表
			}
			{
				code:				状态码
				data:				null   
				msg:					响应文案
			}
		*/


		//通过单条UID，删除与该用户的所有私信
		g('deleteUserMsg',			{'url':'/aj/message/destroy', 'method':'post'});
		/* 
			{
				UID:			要删除的用户ID
			}
			{
				code:				状态码
				data:				null
				msg:					响应文案
			}
		*/

 
		//转发私信
		//发新私信
		g('create',			{'url':'/aj/message/add',  'method':'post'});
		/* 
			{
				text:							内容  小于300字
				uid:							收信人uid (有昵称时以uid为准)
				screen_name:			收信人昵称
				fids:							附件的id,多个的话用,隔开
				id:							如果是从微博里转发过来的私信，这里是微博的id
			}
			{
				code:				状态码
				data:				html   
				msg:					响应文案
			}
		*/



		//搜索私信
		g('search',			{'url':'/message',  'method':'get'});
		/* 
			{
				is_search:			1
				[key_word]:			关键词
				[page]:					页码s
				[uid]：						用户ID
			}
			{
				html
			}
		*/
		//删除附件
		g('attachDel',{'url':'/aj/message/attach/del', 'method':'get'});
	
		//请求私信内容
		g('getDetail',{'url':'/aj/message/detail', 'method':'get'});
          //获取私信的列表
        g('getSearchList',{'url':'/aj/message/detail', 'method':'get'});
         // 获取私信详情列表
         g('getDetailList',{'url':'/aj/message/detail', 'method':'get'});
           //不再提示提示用户手机绑定的层。
         g('noConfirm',{'url':'/aj/bubble/closebubble', 'method':'get'});
		return t;
});