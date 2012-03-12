/**
 * 微博广场接口管理
 * @author liusong@staff.sina.com.cn
 */

$Import('kit.io.inter');

STK.register('common.trans.plaza',function($){
		var t = $.kit.io.inter();
		var g = t.register;
		//微博精选，列表模式
		g('list', {'url':'/jx/aj_moreblogs.php','method':'get'});
		//微博精选，纯图模式
		g('image', {'url':'/jx/aj_morepics.php',	'method':'get'});
		//获取Feed内容
		g('feedInfo', {'url':'/jx/aj_onepic.php',	'method':'get'});
		//userinfo
		g('userinfo', {'url':'/jx/aj_wgx.php',	'method':'get'});
		return t;
	return t;
});