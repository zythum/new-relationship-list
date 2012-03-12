/**
 * 首页右侧上方，写心情或已发心情，查看心情、发心情入口
 */
$Import('comp.content.mood');
STK.pageletM.register('pl.content.mood' , function($) {
		var node = $.E('pl_content_mood');
		var that = $.comp.content.mood(node);
		return that;
});
