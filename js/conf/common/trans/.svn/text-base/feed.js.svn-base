/**
 * feed操作接口管理
 * @author wangzheng4@staff.sina.com.cn
 * 范例：http://10.210.74.52/t4/home/_html/common/trans.html
 * 
 * 使用此接口的范例：
		// 提交接口			
			var trans = $.common.trans.feed;
			var t = trans.getTrans('groupAdd',{
				'onComplete' : function(ret, params){
					alert(ret.data);
				}
			});
			t.request({});
 */
$Import("kit.io.inter");
STK.register('common.trans.feed',function($){
	
		var t = $.kit.io.inter();
		var g = t.register;
		//发布
		g('publish',	{'url':'/aj/mblog/add','method':'post'});
		g('delete',		{'url':'/aj/mblog/del',	'method':'post'});
		g('forward',	{'url':'/aj/mblog/forward',	'method':'post'});
		// 多媒体展示
		g('mediaShow',		{'url':'http://api.weibo.com/widget/show.jsonp', 'varkey':'jsonp', 'method':'get', 'requestMode': 'jsonp'});
		//qing微博
		g('qingShow' , {'url' : 'http://api.t.sina.com.cn/widget/show.json?source=3818214747' , 'varkey' : 'callback' , 'method' : 'get' , 'requestMode' : 'jsonp'});
//		g('voteShow',       {'url':'/aj/mblog/show', 'method':'get'});
		g('profileSearch',	{'url':'/aj/mblog/mbloglist',	'method':'get'});
		g('homeSearch',		{'url':'/aj/mblog/fsearch',	'method':'get'});
		g('groupSearch',	{'url':'/aj/relation/status',	'method':'get'});
		g('atMeSearch',		{'url':'/aj/at/mblog/list',	'method':'get'});
		g('atMeShield',		{'url':'/aj/at/mblog/shield',	'method':'post'});
		g('widget',		{'url':'/aj/mblog/showinfo',	'method':'post'});
		g('third_rend',		{'url':'/aj/mblog/renderfeed',	'method':'post'});
		//屏蔽
		g('feedShield', {'url':'/aj/user/block',	'method':'post'});
		//TAG过滤
		g('feedTagList', {'url':'/aj/mblog/tag/mytaglist', 'method':'post'});
		g('feedTagUpdate', {'url':'/aj/mblog/tag/updatetags', 'method':'post'});
		g('feedTagDel', {'url':'/aj/mblog/tag/destroy', 'method':'post'});
		g('feedTagEdit', {'url':'/aj/mblog/tag/update', 'method':'post'});

		//查询的接口
		g('getAtmeComment', {'url':'/aj/at/comment/comment', 'method':'get'});
		g('getAtmeBlog', {'url':'/aj/at/mblog/mblog', 'method':'get'});

		return t;
});
