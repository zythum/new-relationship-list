
/**
 * 返回到全部的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */

$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.backToAll", function($) {
	var utils = $.common.feed.feedList.utils;
	return function(base) {
		if (!base) {
			$.log("backToAll : need object of the baseFeedList Class");
			return;
		}
		var that = {};
		var node = base.getNode();
		var backToAll = function() {
			$.custEvent.fire(base, "clearTips", "toAllLink");
			var data = {count: 15};
			base.setRequestData("backToAll", data);
			base.showWait("backToAll");
			base.setCurrentPage(1);
			$.custEvent.fire(base, "request", ["backToAll", $.parseParam(data)]);
		};
		base.regCustEvent("backToAll", function() {
			backToAll();
		});
		base.setRequestAction("backToAll", {
			top: true,
			center: true,
			bottom: true
		});
		
		$.custEvent.add(base, "updateFeed", function(evt, type) {
			if (type == "backToAll") {
				$.custEvent.fire(base, "lazyload");
			}
		});
		
		base.getDEvent().add("feed_list_toAllLink", "click", function(obj) {
			backToAll();
			return utils.preventDefault(obj.evt);
		});
		return that;
	};
});
