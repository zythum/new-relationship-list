/**
 * 时间更新插件
 * 可以根据首个feed距离当前的时间进行两个更新频率的处理
 * @id STK.common.feed.feedList.plugins.updateTime
 * @param {Object} base baseFeedList的实现
 * @author wangzheng4@staff.sina.com.cn
 */

$Import('common.feed.formatFeedTime');

STK.register('common.feed.feedList.plugins.updateTime', function($){
	
	var $formatFeedTime = $.common.feed.formatFeedTime;
	var IMEDIFF = (typeof $CONFIG != "undefined" && "timeDiff" in $CONFIG) ? $CONFIG.timeDiff : 0;
	
	/**
	 * 更新时间的具体实现
	 */
	var updateListTime = function(node) {
		var dateNodes = $.sizzle('a[node-type="feed_list_item_date"]', node);
		var serverDate = new Date();
		serverDate.setTime(serverDate.getTime() - IMEDIFF);
		var isSecond;
		for(var i = 0; i < dateNodes.length; i++) {
			var dateNode = dateNodes[i];
//			if(dateNode.getAttribute("node-type") != "feed_list_item_date") continue;
			var dateStr = dateNode.getAttribute("date");
			if(!/^\s*\d+\s*$/.test(dateStr)) {
				continue;
			}
			var feedDate = new Date();
			feedDate.setTime(parseInt(dateStr , 10));
			dateNode.innerHTML = $formatFeedTime(serverDate, feedDate);
			if(isSecond == undefined) {
				isSecond = (serverDate.getTime() - feedDate.getTime()) < 60000;
			}
		}
		return isSecond;
	};
	
	return function(base) {
		
		if (!base) {
			$.log("updateTime : need object of the baseFeedList Class");
			return;
		}
		var node = base.getNode(),
			updateTimer,//时间对象
			runner = function(outTime) {
				clearTimeout(updateTimer);
				updateTimer = setTimeout(function() {
					if(updateListTime(node)) {
						runner(10000);
					} else {
						runner(60000);
					}
				}, outTime);
			},
			updateFeedFn = function() {
				runner(10000);
			};
		runner(10000);
		
		$.custEvent.add(base, "updateFeed", updateFeedFn);
		
		var that = {
			destroy: function() {
				clearTimeout(updateTimer);
				$.custEvent.remove(base, "updateFeed", updateFeedFn);
				that = base = node = updateTimer = runner = updateFeedFn = null;
			}
		};
		
		return that;
	};
	
});