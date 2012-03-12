/**
 * 新feed的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('kit.extra.setPlainHash');
$Import('common.feed.feedList.utils');
$Import('common.feed.feedList.feedTemps');

STK.register("common.feed.feedList.plugins.newFeed", function($) {
	var utils = $.common.feed.feedList.utils;
	var feedTemps = $.common.feed.feedList.feedTemps;
	var $firstChild = $.kit.dom.firstChild;
	return function(base) {
		if (!base) {
			$.log("newFeed : need object of the baseFeedList Class ");
			return;
		}
		var that = {};
		var node = base.getNode();
		var isGroupAll = true, isFilterAll = true, newCount = 0,
			newFeedStep = 0;//0：未点击时或 点击加载完成30秒后 1.点击newFeed提醒后到加载完成30秒之间
		base.setRequestAction("newFeed", {
			top: true
		});
		/**
		 * 只有当newFeed加载完成30秒后再显示newFeed提醒
		 * @param {Object} 
		 */
		base.setExtraFunction("showNewFeedTip", function(opts) {
			if(newFeedStep != 0) return;
			opts = $.parseParam({
				count: 0,
				isGroupAll: false,
				isFilterAll: false
			}, opts);
			newCount = opts.count;
			if(base.isTopWaiting() || !newCount) return;
			isGroupAll = !!opts.isGroupAll;
			isFilterAll = !!opts.isFilterAll;
			base.removeTopNode();
			$.insertHTML(node, feedTemps.newFeedTipHTML.replace("[n]", newCount), "AfterBegin");
			base.setTopNode($firstChild(node));
		});
		$.custEvent.add(base, "updateFeed", function(evt, type) {
			if (type == "newFeed") {
				var newDl = $.sizzle("dl.feed_list_new", node)[1];
				newDl && $.removeClassName(newDl, "feed_list_new");
				$.custEvent.fire(that, "delOverFeeds");
				setTimeout(function() {
					newFeedStep = 0;
				}, 30000);
			}
		});
		$.custEvent.add(base, "showError", function(evt, type) {
			if (type == "newFeed") {
				setTimeout(function() {
					newFeedStep = 0;
				}, 30000);
			}
		});
		$.custEvent.add(base, "request", function(evt, type) {
			if (type == "newFeed") {
				newFeedStep = 1;
			}
		});
		base.getDEvent().add("feed_list_newBar", "click", function(obj) {
			$.custEvent.fire(base, "clearTips", "newFeed");
			if(isGroupAll && isFilterAll && newCount <=  50) {
				if(base.getCurrentPage() == 1) {
					var data = {
						since_id: base.getFirstFeedId()
					};
					base.setRequestData("newFeed", data);
					base.showWait("newFeed");
					$.custEvent.fire(base, "request", ["newFeed", $.parseParam(data)]);
				} else {
					$.custEvent.fire(base, "toFirstPage");
				}
				
				$.kit.extra.setPlainHash((+new Date()).toString());
			} else {
				$.custEvent.fire(base, "backToHome");
			}
			try{
				SUDA.log();
			}catch(e){}
			return utils.preventDefault(obj.evt);
		});
		//绑定快捷键刷新feed
		$.hotKey.add(document.documentElement , ['r'] , function(){
			var bar = base.getYellowNode();
			if(bar){
				$.fireEvent(bar, 'click');
			}
		} , {type : 'keyup' , 'disableInInput' : true});
		return that;
	};
});
