
/**
 * 返回到全部的全部的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */

$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.backToHome", function($) {
	var utils = $.common.feed.feedList.utils;
	return function(base) {
		if (!base) {
			$.log("backToHome : need object of the baseFeedList Class");
			return;
		}
		var that = {};
		var node = base.getNode();
		var backToHome = function() {
			$.custEvent.fire(base, "clearTips", "backToHome");
			var data = {count: 15};
			base.setRequestData("backToHome", data);
			base.showWait("backToHome");
			base.setCurrentPage(1);
			$.custEvent.fire(base, "request", ["backToHome", $.parseParam(data)]);
		};
		base.regCustEvent("backToHome", function() {
			backToHome();
		});
		base.setRequestAction("backToHome", {
			top: true,
			center: true,
			bottom: true
		});
		
		$.custEvent.add(base, "updateFeed", function(evt, type) {
			if (type == "backToHome") {
				$.custEvent.fire(base, "lazyload");
			}
		});
		
		base.getDEvent().add("feed_list_toHomeLink", "click", function(obj) {
			backToHome();
			return utils.preventDefault(obj.evt);
		});
		return that;
	};
});
