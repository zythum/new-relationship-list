/**
 * 活动接口
 * @author runshi@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.activity',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	
	//右侧模块allInOne
	g('allInOne', {'url':'/aj/allinone/addjoin', 'method': 'get'});
	g('listAllInOne', {'url':'/aj/allinone/list', 'method': 'get'});
	return t;
});
