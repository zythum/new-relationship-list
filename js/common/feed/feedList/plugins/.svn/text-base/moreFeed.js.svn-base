/**
 * 更多的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.moreFeed", function($) {
	var utils = $.common.feed.feedList.utils;
	return function(base, opts) {
		if (!base) {
			$.log("moreFeed : need object of the baseFeedList Class");
			return;
		}
		opts = $.parseParam({
			count: 50,
			maxloadNum: 20
		}, opts);
		var that = {},
			node = base.getNode(),
			moreloadNum = 0,
			dEvent = base.getDEvent(),
			clickMoreFn = function(obj) {
				$.removeNode($.sizzle('>div[node-type="moreFeed_div"]', node)[0]);
				var data = {
					max_id: base.getLastFeedId(),
					count: opts.count,
					morebar: (++moreloadNum >= 50) ? 0 : 1
				};
				base.setRequestData("moreFeed", data);
				base.showWait("moreFeed");
				$.custEvent.fire(base, "request", ["moreFeed", $.parseParam(data)]);
				return utils.preventDefault(obj.evt);
			};
		base.setRequestAction("moreFeed", {
			bottom: true
		});
		$.custEvent.add(base, "updateFeed", function(evt, type) {
			if(type == "moreFeed") {
				lazyloadNum = ((lazyloadNum == 0) ? 1 : 0);
				bindLazyLoad();
			}
		});
		
		dEvent.add('moreFeed_button', 'click', clickMoreFn);
		//不完整
		that.destroy = function() {
			dEvent.remove('moreFeed_button', 'click', clickMoreFn);
			base.unregCustEvent("moreFeed");
			base.unregRequest("moreFeed");
			that = dEvent = base = node = undefined;
		};
		return that;
	};
});
