/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 
 * 我的首页: 个人信息
 * 实现微博增删时，微博数动态改变
 * @id STK.pl.content.litePersonInfo
 * node内需要有包含[node-type="weibo"]的节点实例 
 */
$Import('comp.content.litePersonInfo');
STK.pageletM.register('pl.content.liteFacePersonInfo', function($) {
	var node = $.E('pl_content_liteFacePersonInfo');
	return $.comp.content.litePersonInfo(node);
});