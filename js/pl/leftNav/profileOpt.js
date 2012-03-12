/**
 * @author lianyi@staff.sina.com.cn
 * 
 * 左导（profile页面左导 最下面的 不实信息曝光，拉黑，举报）
 * @id STK.pl.leftNav.profileOpt
 */
$Import('comp.leftNav.profileOpt');
STK.pageletM.register("pl.leftNav.profileOpt", function($) {
	var node = $.E("pl_leftNav_profileOpt");
	var that = $.comp.leftNav.profileOpt(node);
	return that;
});