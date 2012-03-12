/**
 *  我的个人资料模块
 * @id pl.content.myPersonalInfo
* @return {Object} 实例
* @example
 */
$Import('comp.leftNav.homePersonal');
STK.pageletM.register("pl.leftNav.homePersonal", function($) {
	var node = $.E("pl_leftNav_homePersonal");
	var that = $.comp.leftNav.homePersonal(node);
	return that;
});