/**
 * 他人profile页面引荐模块
 * lianyi@staff.sina.com.cn
 */
$Import('comp.content.profilerecommend');
STK.pageletM.register('pl.content.profilerecommend',function($){
	var node = $.E('pl_content_profilerecommend');
	var that = $.comp.content.profilerecommend(node);
	return that;
});
