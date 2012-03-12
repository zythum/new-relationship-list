/**
 * @author xinglong1@staff.sina.com.cn
 * 
 * 左导（用户自定义应用层）
 * @id STK.pl.leftNav.game
 */
$Import('comp.leftNav.game');

STK.pageletM.register("pl.leftNav.game", function($) {
	var node = $.E("pl_leftNav_game");
	var that = $.comp.leftNav.game(node);
	return that;
});