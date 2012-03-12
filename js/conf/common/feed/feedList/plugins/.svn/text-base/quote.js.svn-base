/**
 * 举报的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.quote", function($) {
	
	var utils = $.common.feed.feedList.utils;
	
	return function(base) {
		if (!base) {
			$.log("quote : need object of the baseFeedList Class");
			return;
		}
		var node = base.getNode();
		base.getDEvent().add("feed_list_quote", "click", function(obj) {
			return utils.preventDefault();
		});
	};
	
});