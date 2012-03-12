/**
 * @author lianyi | lianyi@staff.sina.com.cn
 * profile页体系-游戏页面-游戏列表
 * @id pl.profile.gamelist
 */
$Import('comp.profile.gamelist');

STK.pageletM.register("pl.profile.gamelist", function($) {
	var node = $.E("pl_profile_gamelist");
	var that = $.comp.profile.gamelist(node);
	return that;
});