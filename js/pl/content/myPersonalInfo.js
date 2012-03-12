/**
 *  我的个人资料模块
 * @id pl.content.myPersonalInfo
* @return {Object} 实例
* @example
 */
$Import('comp.content.myPersonalInfo');
STK.pageletM.register("pl.content.myPersonalInfo", function($) {
	var node = $.E("pl_content_myPersonalInfo");
	var that = $.comp.content.myPersonalInfo(node);
	return that;
});