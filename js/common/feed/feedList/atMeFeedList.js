$Import('common.feed.feedList.baseFeedList');
$Import('common.feed.feedList.plugins.forward');
$Import('common.feed.feedList.plugins.deleteFeed');
$Import('common.feed.feedList.plugins.favorite');
$Import('common.feed.feedList.plugins.comment');
$Import('common.feed.feedList.plugins.media');
$Import('common.feed.feedList.plugins.page');
$Import('common.feed.feedList.plugins.map');
$Import('common.feed.feedList.plugins.updateTime');
$Import('common.feed.feedList.plugins.delOverFeeds');
$Import('common.feed.feedList.plugins.lazyload');
$Import('common.feed.feedList.plugins.search');
$Import('common.feed.feedList.plugins.atMeShield');
$Import('common.feed.feedList.plugins.imgAdvLoading');
$Import('common.feed.feedList.plugins.mood');
$Import('common.feed.feedList.plugins.collect');

STK.register("common.feed.feedList.atMeFeedList", function($) {

	var _custEvent = $.core.evt.custEvent;


	return function(node, opts) {
		if (!node) {
			$.log("in atMeFeedList: node is not defined!");
			return;
		}
		var _cKey = $.custEvent.define(node, "clearTips");
		var _short = $.common.feed.feedList;
		var that = _short.baseFeedList(node, opts);
		//插件的初始化
		var _forward = (_short = _short.plugins).forward(that);
		var _deleteFeed = _short.deleteFeed(that);
		var _favorite = _short.favorite(that);
		var _comment = _short.comment(that);
		var _media = _short.media(that);
		var _page = _short.page(that);
		var _map = _short.map(that);
		var _shield = _short.atMeShield(that);
		var _mood = _short.mood(that);
		var _collect = _short.collect(that);
		var _updateTime = _short.updateTime(that);
//		var _delOverFeeds = _short.delOverFeeds(that, {
//			feedOverNum: 10//测试用
//		});
		var _lazyload = _short.lazyload(that);
//		var _newFeed = _short.newFeed(that);
		var _search = _short.search(that);
		//wangliang3 add
		_short.imgAdvLoading(that);

		_custEvent.add(that, "clearTips", function(evt, type) {
			if (type == "favorite") {
				_deleteFeed.hideTip();
			} else if (type == "deleteFeed") {
				_favorite.hideTip();
			} else {
				_favorite.hideTip(type == "base");
				_deleteFeed.hideTip(type == "base");
			}
		});

		var _destroy = that.destroy;

		that.destroy = function() {
			_custEvent.undefine(_cKey, "clearTips");
			_deleteFeed.destroy();
			_favorite.destroy();
			_map.destroy();
			_mood.destroy();
			_collect.destroy();
			_destroy();
		};
		return that;
	};
});
