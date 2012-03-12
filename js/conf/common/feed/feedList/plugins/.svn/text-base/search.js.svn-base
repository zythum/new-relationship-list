
/**
 * 搜索的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */

STK.register("common.feed.feedList.plugins.search", function($) {
	return function(base) {
		if (!base) {
			$.log("search : need object of the baseFeedList Class");
			return;
		}
		var that = {};
		base.setRequestAction("search", {
			top: true,
			center: true,
			bottom: true
		});
		base.setRequestData("search", {
			count: 15
		});
		$.custEvent.add(base, "updateFeed", function(evt, type) {
			if (type == "search") {
				base.setCurrentPage(1);
				$.custEvent.fire(base, "updateEndId");
				$.custEvent.fire(base, "lazyload");
			}
		});
		return that;
	};
});
