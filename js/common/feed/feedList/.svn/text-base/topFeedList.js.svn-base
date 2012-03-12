
/**
 * 热门转发与热门评论微博页feed列表
 * 自定义事件:request
 *  参数: function(event, type, data){
 *  	type: newFeed/backToAll/page/lazyload
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
 * @id STK.common.feed.feedList.topFeedList
 * @param {Node} node 最外节点
 * @author ChenJian|chenjian2@staff.sina.com.cn
 * @example
 * //
 */


$Import('common.feed.feedList.baseFeedList');
$Import('common.feed.feedList.plugins.forward');
$Import('common.feed.feedList.plugins.favorite');
$Import('common.feed.feedList.plugins.comment');
$Import('common.feed.feedList.plugins.media');
$Import('common.feed.feedList.plugins.page');
$Import('common.feed.feedList.plugins.map');
$Import('common.feed.feedList.plugins.updateTime');
$Import('common.feed.feedList.plugins.delOverFeeds');
$Import('common.feed.feedList.plugins.backToAll');
$Import('common.feed.feedList.plugins.search');
$Import('common.feed.feedList.plugins.imgAdvLoading');
$Import('common.feed.feedList.plugins.lazyload');

STK.register("common.feed.feedList.topFeedList", function($) {
	
	return function(node, opts) {
		if (!node) {
			$.log("in topFeedList: node is not defined!");
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
		pluginList.push(favorite = shorter.favorite(that));
		pluginList.push(shorter.comment(that));
		pluginList.push(shorter.media(that));
		pluginList.push(shorter.page(that, {
			loadCount: 50
		}));
		pluginList.push(shorter.map(that));
		pluginList.push(shorter.updateTime(that));
		pluginList.push(shorter.delOverFeeds(that));
		pluginList.push(shorter.backToAll(that));
		pluginList.push(shorter.search(that));
		pluginList.push(shorter.imgAdvLoading(that));
		pluginList.push(shorter.lazyload(that));
		
		$.custEvent.add(that, "clearTips", function(evt, type) {
			//if(type == "favorite") {
				//deleteFeed.hideTip();
			//} else if(type == "deleteFeed") {
			//	favorite.hideTip();
			//} else {
				favorite.hideTip(type == "base");
				//deleteFeed.hideTip(type == "base");
			//}
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
