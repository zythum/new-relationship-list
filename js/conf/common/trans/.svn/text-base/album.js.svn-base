/**
 * 相册
 * @author zhaobo@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.album',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('publish',	{'url':'/aj/mblog/add','method':'post'});
	g('getDetail', {'url':'/aj/photo/show'});
	g('like', {'url':'/aj/photo/like', 'method':'post'});
	return t;
});