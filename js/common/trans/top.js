/**
 * 顶托接口管理
 * @author qiyuheng | yuheng@staff.sina.com.cn
 * @modified by lianyi | lianyi@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.top',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	var domain = (document.domain == 'www.weibo.com' ? "http://www.weibo.com" : "http://weibo.com");

	//g('setReaded',{'url':'/ajax/remind/unset','requestMode':'jsonp','method': 'get'});
	g('suggest', {'url':'http://s.weibo.com/ajax/topsuggest.php','requestMode':'jsonp','method': 'get'});
	//下述两个接口废弃，合并为一个
	//g('suggest', {'url':'http://s.weibo.com/ajax/top_suggest.php','requestMode':'jsonp','method': 'get'});
	//g('suggest_ext', {'url':'http://s.weibo.com/ajax/top_suggest_ext.php','requestMode':'jsonp','method': 'get'});
	g('setRead',{'url':domain + '/aj/remind/reset','requestMode':'jsonp','method': 'get'});

	//g('relation',{'url':domain + '/aj/top/friend','requestMode':'jsonp','method': 'get'});
	//g('notice',{'url':domain + '/aj/top/notice','requestMode':'jsonp','method': 'get'});
	//g('message',{'url':domain + '/aj/top/message','requestMode':'jsonp','method': 'get'});
	g('application',{'url':domain + '/aj/top/myapp','requestMode':'jsonp','method': 'get'});
	g('group',{'url':domain + '/aj/top/myqun','requestMode':'jsonp','method': 'get'});
	g('game',{'url':domain + '/aj/top/game','requestMode':'jsonp','method': 'get'});

	return t;
});
