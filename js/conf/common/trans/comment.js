/**
 * 评论接口管理
 * @author liusong@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.comment',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('smallList'  ,	{'url':'/aj/comment/small','method':'get'});
	g('add'  ,	{'url':'/aj/comment/add','method':'post'});
	g('delete',	{'url':'/aj/comment/del','method':'post'});
//	g('outBoxList', {'url':'/ajax/comment/search/outbox', 'method':'get'});
//	g('inBoxList', {'url':'/ajax/comment/search/Inbox', 'method':'get'});
	g('hotChange',{'url':'/aj/comment/hotchange'});
	//设置评论隐私状态
	g('privateSetting' , {'url' : '/aj/account/setcommentprivacy' , 'method' : 'post'});
	//7天之内不再显示隐私弹出框
	g('privateNoMore' , {'url' : '/aj/bubble/closebubble' , 'method' : 'get'});
	g('cfilter',	{'url':'/aj/comment/small','method':'get'});

	//判断用户是否有权限回复或者评论
	g('isComment',{'url':'/aj/comment/privacy','method':'get'});
	// 评论查询接口
	g('getIn',{'url':'/aj/commentbox/in','method':'get'});
	g('getOut',{'url':'/aj/commentbox/out','method':'get'});
	g('getComment',{'url':'/aj/at/comment/comment','method':'get'});
	//评论对话列表
	g('dialogue',	{'url':'/aj/comment/conversation','method':'get'});
	return t;
});
