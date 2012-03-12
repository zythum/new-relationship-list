/**
 * 模板管理接口管理
 * @author zhaobo | zhaobo@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.custTmpl',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('save',		{'url':'/aj/skin/update',	'method':'post'});
	g('templist',		{'url':'/aj/skin/get',	'method':'get'});
	g('colorScheme',		{'url':'/aj/custTmpl/colorScheme',	'method':'post'});
	g('getCss',		{'url':'/aj/custTmpl/getCss',	'method':'get'});
	return t;
});