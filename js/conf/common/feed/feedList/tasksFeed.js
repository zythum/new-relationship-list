/**
 * 微博宝典用feed
 */

$Import('common.feed.feedList.baseFeedList');
$Import('common.feed.feedList.plugins.forward');
$Import('common.feed.feedList.plugins.favorite');
$Import('common.feed.feedList.plugins.media');
$Import('common.feed.feedList.plugins.map');
$Import('common.feed.feedList.plugins.updateTime');
$Import('common.feed.feedList.plugins.imgAdvLoading');
$Import('common.feed.feedList.plugins.wbtComment');
STK.register("common.feed.feedList.tasksFeed", function($) {
	
	return function(node, obj, opts) {
		if (!node) {
			$.log("in webbdFeed: node is not defined!");
			return;
		}
		
		var shorter = $.common.feed.feedList,
			deleteFeed, favorite,
			pluginList = [];
		
		var that = shorter.baseFeedList(node, opts);
		//插件的初始化
		pluginList.push((shorter = shorter.plugins).forward(that));
		pluginList.push(favorite = shorter.favorite(that));
		pluginList.push(shorter.media(that));
		pluginList.push(shorter.map(that));
		pluginList.push(shorter.updateTime(that));
		pluginList.push(shorter.imgAdvLoading(that));
		pluginList.push(shorter.wbtComment(that, obj));
		
		
		$.custEvent.add(that, "clearTips", function(evt, type) {
			if(type == "favorite") {
				deleteFeed.hideTip();
			} else if(type == "deleteFeed") {
				favorite.hideTip();
			} else {
				favorite.hideTip(type == "base");
				deleteFeed.hideTip(type == "base");
			}
		});
		
		var baseDestroy = that.destroy;
		that.destroy = function() {
			$.custEvent.remove(that, "clearTips");
			for(var i = 0; i < pluginList.length; i++) {
				pluginList[i].destroy();
			}
			baseDestroy();
			that = shorter = deleteFeed = favorite = pluginList = baseDestroy = undefined;
		};
		return that;
	};
});
