/**
 * 微博宝典
 * @author jiequn@staff.sina.com.cn
 */
$Import("kit.io.inter");

STK.register('common.trans.tasks',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('getTask', {'url': '/aj/tasks/get', 'method': 'get'});
	g('changeFeed', {'url': '/aj/tasks/recommblog', 'method': 'get'});
	g('inviteByTel', {'url': '/aj/tasks/sendsms', 'method': 'post'});
	
	g('addFollow', {'url': '/aj/f/followed', 'method': 'post'});
	g('getUsers', {'url': '/aj/tasks/recommuser', 'method': 'get'});
	return t;
});