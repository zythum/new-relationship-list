/**
 * 延时加载的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.lazyload", function($) {
	var utils = $.common.feed.feedList.utils;
	return function(base, opts) {
		if (!base) {
			$.log("lazyload : need object of the baseFeedList Class");
			return;
		}
		var that = {};
		var node = base.getNode();
		var lazyload, lazyloadNum = 0;
		var bindLazyLoad = function() {
			if(lazyload) lazyload.destroy();
			var lazyloadNode = $.sizzle('div[node-type="lazyload"]', node)[0];
			if(!lazyloadNode) return;
			base.setBottomNode(lazyloadNode);
			lazyload = $.common.extra.lazyload([lazyloadNode], function() {
				
				var data = {
					pre_page: base.getCurrentPage(),
					page: base.getCurrentPage(),
					max_id: base.getLastFeedId(),
					end_id: base.getEndId(),
					count: lazyloadNum == 1?15:15,//1?20:15,
					pagebar: lazyloadNum == 1? 1: 0
				};
				
				base.setRequestData("lazyload", data);
				base.showWait("lazyload");
 				//$.log("lazyload")
				$.custEvent.fire(base, "request", ["lazyload", $.parseParam(data)]);
				lazyload.destroy();
				lazyload = undefined;
				
			}, {threshold: $.winSize().height * 1.5});
		};
		base.setRequestAction("lazyload", {
			bottom: true
		});
		base.regCustEvent("lazyload", function() {
			lazyloadNum = 0;
			bindLazyLoad();
		});
		$.custEvent.add(base, "updateFeed", function(evt, type) {
			if(type == "lazyload") {
				lazyloadNum = ((lazyloadNum == 0) ? 1 : 0);
				bindLazyLoad();
			}
		});
		bindLazyLoad();
		//不完整
		that.destroy = function() {
			if(lazyload) lazyload.destroy();
			base.unregCustEvent("lazyload");
			base.unregRequest("lazyload");
			that = base = node = lazyload = undefined;
		};
		return that;
	};
});
