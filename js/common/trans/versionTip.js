/**
 *
 * @author zhaobo@staff.sina.com.cn
 * 版本提示
 */
$Import('kit.io.inter');
STK.register('common.trans.versionTip',function($){
	var t = $.kit.io.inter();
	var g = t.register;

	g('save', {'url':'/aj/guide/versiontip',	'method':'post'});
    g('userGuider', {'url':'/aj/bubble/add',	'method':'post'});
    g('closeBubble',{'url':'/aj/bubble/closebubble','method':'get'});


	
	return t;
});