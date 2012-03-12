/**
 * 分页的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.page", function($) {
	var utils = $.common.feed.feedList.utils;
	var	bigpipe = typeof $CONFIG != "undefined" && $CONFIG['bigpipe'] == 'true'
	
	return function(base, opts) {
		
		if (!base) {
			$.log("page : need object of the baseFeedList Class");
			return;
		}
		opts = $.parseParam({
			style: 1, //1：带有更多列表的2:没有更多列表的
			loadCount: 15
		}, opts);
		
		var that = {};
		var node = base.getNode();
		var requestObj;
		
		var toPage = function(page) {

				$.custEvent.fire(base, "clearTips", "page");
			var data = {
				page: page,
				pre_page: base.getCurrentPage(),
				count: opts.loadCount,
				end_id: base.getEndId()
			};
			base.setCurrentPage(page);
			base.setRequestData("page", data);
			if (page == 1) {
				requestObj.top = true;
				delete data.end_id;
			} else {
				requestObj.top = false;
			}
			base.setRequestAction("page", requestObj);
			base.showWait("page");
			if ($.position(node.parentNode).t < $.scrollPos().top) {
				node.parentNode.scrollIntoView();
			}
			$.custEvent.fire(base, "request", ["page", $.parseParam(data)]);
		};
		
		base.regCustEvent("toFirstPage", function() {
			toPage(1);
		});
		
		base.setRequestAction("page", requestObj = {
			center: true,
			bottom: true
		});
		
		var pageNode, pageDEvent, _moreNode, _morelistNode, _moreListOn, _pageTimer;
		var bindFuns = {
			pageMoreOver: function(obj){
				if (_moreListOn == undefined) {
					_morelistNode.style.display = "";
				}
				_moreListOn = 1;
				return utils.preventDefault(obj.evt);
			},
			pageMoreOut: function(obj){
				_moreListOn = 0;
				clearTimeout(_pageTimer);
				_pageTimer = setTimeout(function() {
					if (_moreListOn == 0) {
						_morelistNode && (_morelistNode.style.display = "none");
						_moreListOn = undefined;
					}
				}, 500);
				return utils.preventDefault(obj.evt);
			},
			pageNClick: function(obj) {
				var _el = obj.el;
				if (_el.className != "current") {
					toPage(parseInt(obj.data.page));
				}
				return utils.preventDefault(obj.evt);
			}
		};

		var bindPage = function() {
			pageNode = $.sizzle('div[node-type="feed_list_page"]', node)[0];
			if(!pageNode) return;
			if(bigpipe) {
				pageDEvent = $.core.evt.delegatedEvent(pageNode);
				pageDEvent.add("feed_list_page_n", "click", bindFuns.pageNClick);
				pageDEvent.add("feed_list_page_first", "click", bindFuns.pageNClick);
				pageDEvent.add("feed_list_page_pre", "click", bindFuns.pageNClick);
				pageDEvent.add("feed_list_page_next", "click", bindFuns.pageNClick);
			}
			if((_morelistNode = $.sizzle('div[action-type="feed_list_page_morelist"]', pageNode)[0]) && 
				(_moreNode = $.sizzle('a[action-type="feed_list_page_more"]', pageNode)[0])) {
				$.addEvent(_moreNode, "mouseover", bindFuns.pageMoreOver);
				$.addEvent(_morelistNode, "mouseover", bindFuns.pageMoreOver);
				$.addEvent(_moreNode, "mouseout", bindFuns.pageMoreOut);
				$.addEvent(_morelistNode, "mouseout", bindFuns.pageMoreOut);
				/*
				pageDEvent.add("feed_list_page_more", "mouseover", bindFuns.pageMoreOver);
				pageDEvent.add("feed_list_page_morelist", "mouseover", bindFuns.pageMoreOver);
				pageDEvent.add("feed_list_page_more", "mouseout", bindFuns.pageMoreOut);
				pageDEvent.add("feed_list_page_morelist", "mouseout", bindFuns.pageMoreOut);
				 */
			}
		};
		var unbindPage = function() {
			if(pageNode) {
				clearTimeout(_pageTimer);
				//清理工作
				pageDEvent && pageDEvent.destroy && pageDEvent.destroy();
				if(_moreNode) {
					$.removeEvent(_moreNode, "mouseover", bindFuns.pageMoreOver);
					$.removeEvent(_morelistNode, "mouseover", bindFuns.pageMoreOver);
					$.removeEvent(_moreNode, "mouseout", bindFuns.pageMoreOut);
					$.removeEvent(_morelistNode, "mouseout", bindFuns.pageMoreOut);
				}
				_moreNode = _morelistNode = _moreListOn = undefined;
			}
		};
		var updateFeedFn = function(evt, type) {
			if(type == "page") {
				$.custEvent.fire(base, "lazyload");
				if(base.getCurrentPage() == 1) {
					$.custEvent.fire(base, "updateEndId");
				}
			}
			unbindPage();
			bindPage();
		};
		$.custEvent.add(base, "updateFeed", updateFeedFn);
		bindPage();
		that.destroy = function() {
			$.custEvent.remove(base, "updateFeed", updateFeedFn);
			unbindPage();
		};
		return that;
	};
});