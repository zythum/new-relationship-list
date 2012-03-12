/**
 * @fileoverview
 * 事件代理
 * @author guoqing5@staff.sina.com.cn
 * @
 */
$Import('common.channel.feed');
STK.register("common.feed.groupAndSearch.groupListener", function($){
	var that = {};
	that.fireGroupRefresh = function(){
		$.common.channel.feed.register('refresh', function(){
			window.location.reload();
		});
	};
	
	return that;
});
