/**
 * 顶托接口管理
 * @author qiyuheng | yuheng@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.mobile',function($){
	var t = $.kit.io.inter();
	var g = t.register;

	g('bind',{'url':'/aj/mobile/bind'});
	g('unbind',{'url':'/aj3/mobile/aj_cancelbind_v4.php'});
	g('check',{'url':'/aj/mobile/check'});
	g('notice',{'url':'/aj/mobile/notice','method': 'post'});
	g('privacy',{'url':'/aj/mobile/privacy','method':'post'});
	g('download',{'url':'/aj/mobile/download'});

	return t;
});