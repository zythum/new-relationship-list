/**
 * 全局接口管理
 * @author wk@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.global',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('language', {'url': '/aj/user/lang', 'method': 'post'});
	g('followList', {'url': '/aj/mblog/attention'});//at功能
	g('topicList', {'url': '/aj/mblog/topic'});//#功能
	g('myFollowList', {'url': '/aj/relation/attention'});//我的关注页搜索功能
	//多个页面上，抽奖举报黄条 的关闭状态
	/**
	 * 私信页面 2
	 * @我的页面 3
	 * 评论页面 4
	 * 邀请起泡关闭标示 5
	 */
	g('closetipsbar' , {'url' : '/aj/tipsbar/closetipsbar' , 'method' : 'post'});
	//微群未读数接口
	g('weiqunnew' , {'url' : '/ajm/weiqun?action=aj_remindunread'});
	
	//悄悄关注页
	g('quiet_suggest',{'url' : '/aj/f/lenovo?ct=10' , 'method' : 'get'});
	return t;
});

