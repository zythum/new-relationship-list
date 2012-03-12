/**
 * @tag num update
 * 事件代理
 * @author runshi@staff.sina.com.cn
 */
$Import('common.channel.feed');
STK.register("common.feed.groupAndSearch.tagListener", function($){
	return function(filterObject){
		$.common.channel.feed.register('feedTagUpdate', function(ret){
			filterObject.tagUpdateChange.call(filterObject, ret);
		});
	};
});
