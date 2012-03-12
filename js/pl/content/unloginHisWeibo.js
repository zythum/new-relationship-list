/**
 * 未登录用户查看weiboDetail页面 
 */
$Import('comp.content.unloginHisWeibo');
$Import('comp.content.suda');

STK.register('pl.content.unloginHisWeibo' , function($) {
	var that = $.comp.content.unloginHisWeibo();
	//加载sudo
	$.comp.content.suda();
	return that;
});
