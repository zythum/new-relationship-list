
/**
 * 首页feed列表
 * 
 * 自定义事件:request
 * 
 *  参数: function(event, type, data){
 *  	type: newFeed/backToAll/backToHome/page/lazyload
 *  	data: {
 *  		firstFeedId:最前的feedid since_id
 *  		lastFeedId:最后的feedid  pre_page_lmid max_id
 *  		targetPage:目标页码   page
 *  		currentPage:当前页码  pre_page
 *  		count:吞出的条数 
 *  		showPage:是否吞出分页  pagebar
 *  		end_id
 *  	}
 *  }
 *  
 * @id STK.common.feed.feedList.homeFeedList
 * @param {Node} node 最外节点
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */

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
$Import('common.feed.feedList.plugins.newFeed');
$Import('common.feed.feedList.plugins.backToAll');
$Import('common.feed.feedList.plugins.backToHome');
$Import('common.feed.feedList.plugins.search');
$Import('common.feed.feedList.plugins.imgAdvLoading');
$Import('common.feed.feedList.plugins.lazyload');
$Import('common.feed.feedList.plugins.tag');
$Import('common.feed.feedList.plugins.mood');
$Import('common.feed.feedList.plugins.collect');
$Import('common.feed.feedList.plugins.publishTo');

STK.register("common.feed.feedList.myFeedList", function($) {
	
	return function(node, opts) {
		if (!node) {
			$.log("in homeFeedList: node is not defined!");
			return;
		}
		var shorter = $.common.feed.feedList,
			deleteFeed, favorite,
			pluginList = [];
		
		var that = shorter.baseFeedList(node, opts);
		//插件的初始化
		pluginList.push((shorter = shorter.plugins).forward(that, {
			forwardStyleId: "0"
		}));
		pluginList.push(deleteFeed = shorter.deleteFeed(that));
		pluginList.push(favorite = shorter.favorite(that));
		pluginList.push(shorter.comment(that));
		pluginList.push(shorter.media(that));
		pluginList.push(shorter.page(that, {
			loadCount: 50
		}));
		pluginList.push(shorter.map(that));
		pluginList.push(shorter.updateTime(that));
		pluginList.push(shorter.delOverFeeds(that));
		pluginList.push(shorter.newFeed(that));
		pluginList.push(shorter.backToAll(that));
		pluginList.push(shorter.backToHome(that));
		pluginList.push(shorter.search(that));
		pluginList.push(shorter.imgAdvLoading(that));
		pluginList.push(shorter.lazyload(that));
		pluginList.push(shorter.tag(that));
		pluginList.push(shorter.mood(that));
		pluginList.push(shorter.publishTo(that));
		pluginList.push(shorter.collect(that));

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
		};
		return that;
	};
});
