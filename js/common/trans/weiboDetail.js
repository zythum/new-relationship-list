/**
 * 微博单条页接口管理
 * @author zhaobo | zhaobo@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.weiboDetail',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('delete',		{'url':'/aj/comment/del',	'method':'post'});
	g('deleteWeibo',		{'url':'/aj/mblog/del',	'method':'post'});
	g('delmblog',		{'url':'/aj/mblog/del',	'method':'post'});
	g('feedlist',		{'url':'/aj/comment/big',	'method':'get'});
	g('forward',		{'url':'/aj/mblog/info/big',	'method':'get'});
	g('mediaShow',		{'url':'http://api.weibo.com/widget/show.jsonp', 'varkey':'jsonp', 'method':'get', 'requestMode': 'jsonp'});
	//qing微博
	g('qingShow' , {'url' : 'http://api.t.sina.com.cn/widget/show.json?source=3818214747' , 'varkey' : 'callback' , 'method' : 'get' , 'requestMode' : 'jsonp'});
//	g('voteShow',		{'url':'/aj/mblog/show', 'method':'get'});
	g('widget',		{'url':'/aj/mblog/showinfo',	'method':'post'});
	g('third_rend',		{'url':'/aj/mblog/renderfeed',	'method':'post'});
	return t;
});
