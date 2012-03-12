/**
 * 删除超出数目的feed的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */

$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.delOverFeeds", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var FEEDOUTNUM = 1000;
	
	/**
	 * 删除多于上限的feed
	 */
	var delOverFeeds = function(node, feedOverNum) {
		var _feeds = utils.getFeeds(node, 'action-type="feed_list_item"');
		for(var i = _feeds.length; i > feedOverNum; i--) {
			node.removeChild(_feeds[i - 1]);
		}
		_feeds = undefined;
	};
	
	return function(base, opts) {
		if (!base) {
			$.log("delOverFeeds : need object of the baseFeedList Class");
			return;
		}
		
		opts = $.parseParam({
			feedOverNum: FEEDOUTNUM
		}, opts);
		
		var that = {};
		var node = base.getNode();
		
		var delOverFeedsFn = function() {
			delOverFeeds(node, opts.feedOverNum);
		};
		
		base.regCustEvent("delOverFeeds", delOverFeedsFn);
		
		that.destroy = function() {
			$.custEvent.remove(base, "delOverFeeds", delOverFeedsFn);
			that = node = undefined;
		};
		
		return that;
	};
		
});


