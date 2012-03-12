/**
 * 基本的feed列表
 * @param {Object} node feedList列表节点
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('common.extra.lazyload');
$Import('common.feed.feedList.utils');
$Import('common.feed.feedList.feedTemps');
$Import('kit.dom.firstChild');
$Import('kit.dom.lastChild');

STK.register("common.feed.feedList.baseFeedList", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var feedTemps = $.common.feed.feedList.feedTemps;
	var $firstChild = $.kit.dom.firstChild;
	var $lastChild = $.kit.dom.lastChild;
	var $insertElement = $.core.dom.insertElement;
	
	var clearTips = function(node) {
		$.custEvent.fire(node, "clearTips", "base");
	};
	/**
	 * 根据加载状态创建加载节点
	 */
	var createNodeOfStatus = function(status, requestType) {
		var html;
		switch (status) {
			case "waiting":
				html = feedTemps.loadingHTML;
				break;
			case "retry":
				html = feedTemps.loadErrorRetryHTML;
				break;
			case "end":
				html = feedTemps.loadErrorEndHTML;
				break;
		}
		return $firstChild($.builder(html.replace("[n]", requestType)).box);
	};
	
	return function(node, opts) {
		
		if(!$.isNode(node)) {
			$.log("baseFeedList : parameter node is not a document node!");
		};
		opts = $.parseParam({
			page: 1,
			end_id: ""
		}, opts);
		var requestCache = {};
		
		//---变量定义区----------------------------------
		var dEvent = $.core.evt.delegatedEvent(node), topNode, bottomNode,
			fakeFeedNum = 0, currentPage = parseInt(opts.page), topWaiting = false;
		var requestDataCache = {};
		var endId = opts.end_id;
		if(!endId && currentPage < 2 && (endId = $firstChild(node))) {
			endId = endId.getAttribute("mid");
		}
		//-------------------------------------------
		//小黄条
		dEvent.add("feed_list_retry", "click", function(obj) {
			clearTips(node);
			var requestType = obj.el.getAttribute("requestType");
			var cache = requestCache[requestType];
			if(cache.top) {
				showTopStatus("waiting", requestType);
			} else {
				showBottomStatus("waiting", requestType);
			}
			$.custEvent.fire(that, "request", [requestType, requestDataCache[requestType].data]);
			return utils.preventDefault(obj.evt);
		});
		var updateEndId = function() {
			if(currentPage < 2) {
				var _fNode = $firstChild(node);
				_fNode && (endId = _fNode.getAttribute("mid"));
			}
		};
		//status waiting/retry/end
		var showTopStatus = function(status, requestType) {
			topWaiting = true;
			that.removeTopNode();
			$insertElement(node, topNode = createNodeOfStatus(status, requestType), "afterbegin");
		};
		//status waiting/retry/end
		var showBottomStatus = function(status, requestType) {
			that.removeBottomNode();
			node.appendChild(bottomNode = createNodeOfStatus(status, requestType));
		};
		
		var that = {
			extra: {},
			extraData: {},
			/**
			 * 得到最外节点
			 */
			getNode: function() {
				return node;
			},
			/**
			 * 返回新feed提示黄条的节点，如果没有小黄条，返回false
			*/
			getYellowNode: function(){
				var bar = $.sizzle('a[action-type="feed_list_newBar"]', node);
				return bar.length? bar[0]:false;
			},
			/**
			 * 返回所有feed dom list
			*/
			getNodeList: function(){
				var list = $.sizzle('dl[action-type="feed_list_item"]', node);
				return list.length? list:false;
			},
			/**
			 * 返回基于最外节点的delegatedEvent实例
			 */
			getDEvent: function() {
				return dEvent;
			},
			/**
			 * 删除上节点
			 */
			removeTopNode: function() {
				$.removeNode(topNode);
				topNode = null;
			},
			/**
			 * 设置上节点
			 */
			setTopNode: function(tNode) {
				topNode = tNode;
			},
			/**
			 * 删除下节点
			 */
			removeBottomNode: function() {
				$.removeNode(bottomNode);
				bottomNode = null;
			},
			/**
			 * 设置下节点
			 */
			setBottomNode: function(bNode) {
				bottomNode = bNode;
			},
			/**
			 * 返回第一页时的第一条feed的ID
			 */
			getEndId: function() {
				return endId;
			},
			/**
			 * 检测上部是否为等待状态
			 */
			isTopWaiting: function() {
				return topWaiting;
			},
			/**
			 * 返回当前页码
			 */
 			getCurrentPage: function() {
				return currentPage;
			},
			/**
			 * 设置当前页码
			 */
			setCurrentPage: function(page) {
				currentPage = page;
			},
			/**
			 * 等到feed条数
			 */
			getFeedCount: function() {
				return utils.getFeeds(node, 'action-type="feed_list_item"').length;
			},
			/**
			 * 设置请求方式 用于对请求响应后的feed操作
			 */
			setRequestAction: function(type, opts) {
				requestCache[type] = $.parseParam({
					top: false,
					center: false,
					bottom: false
				}, opts);
			},
			/**
			 * 设置请求中用到的数据
			 * baseFeedList为开发者提供了请求重试功能，所以需要用户提供参数供重试使用
			 * 一个type在同一时刻只会有一个请求
			 */
			setRequestData: function(type, data) {
				requestDataCache[type] = {
					data: data, 
					time: 0
				}
			},
			/**
			 * 得到扩展数据
			 */
			getExtraData: function(type) {
				return that.extraData[type];
			},
			/**
			 * 设置扩展数据
			 */
			setExtraData: function(type, value) {
				that.extraData[type] = value;
			},
			/**
			 * 设置扩展函数
			 */
			setExtraFunction: function(type, fn) {
				that.extra[type] = fn;
			},
			/**
			 * 设置自定义事件 用于其他组件与某组件沟通
			 */
			regCustEvent: function(type, fn) {
				$.custEvent.define(that, type);
				$.custEvent.add(that, type, fn);
			},
			/**
			 * 得到feed列表的第一条feed的mid
			 */
			getFirstFeedId: function() {
				var firstFeed = topNode ? $.core.dom.next(topNode): $firstChild(node);
				if(firstFeed) {
					for(var i = 0; i < fakeFeedNum && firstFeed; i++) {
						firstFeed = $.core.dom.next(firstFeed);
					}
					if(firstFeed) return firstFeed.getAttribute("mid");
				}
			},
			/**
			 * 得到feed列表的最后一条feed的mid
			 */
			getLastFeedId: function() {
				var lastFeed = bottomNode ? $.core.dom.prev(bottomNode) : $lastChild(node);
				if(lastFeed) {
					return lastFeed.getAttribute("mid");
				}
			},
			showZeroTip: function() {
				var zeroDiv = $.sizzle('div[node-type="feed_list_zero"]', node)[0];
				if(zeroDiv) {
					zeroDiv.style.display = "";
				}
			},
			hideZeroTip: function() {
				var zeroDiv = $.sizzle('div[node-type="feed_list_zero"]', node)[0];
				if(zeroDiv) {
					zeroDiv.style.display = "none";
				}
			},
			/**
			 * 插入一条假数据
			 */
			insertFakeFeed: function(feedHtml) {
				if (typeof feedHtml != "string") {
					$.log("insertFakeFeed feedHtml is not String!");
					return;
				}
				that.hideZeroTip();
				fakeFeedNum++;
				if(topNode) {
					$.insertHTML(topNode, feedHtml, "afterend");
				} else {
					$.insertHTML(node, feedHtml, "afterbegin");
				}
				/*
				$.insertHTML(hdLoadDiv, feedHtml);
				var tempNode = $lastChild(hdLoadDiv);
				setTimeout(function() {
					if(topNode) {
						$insertElement(topNode, tempNode, "afterend");
					} else {
						$insertElement(node, tempNode, "afterbegin");
					}
					//假写动画
					var tempHeight = $.getStyle(tempNode, "height");
					tempNode.style.cssText = "height:0px;overflow:hidden;";
					$.tween(tempNode, "height", tempHeight +"px", 0.3, 'easeinoutquad', {
						end: function() {
							tempNode.style.cssText = "";
							tempNode = null;
						}
					});
				}, 1500);
				*/
			},
			/**
			 * 更新feed数据
			 */
			updateFeed: function(feedHtml, type) {
				if (feedHtml && type && requestCache[type]) {
					that.hideZeroTip();
					var opts = requestCache[type];
					if(opts.top) {
						topWaiting = false;
						that.removeTopNode();
						for(var i = 0; i < fakeFeedNum; i++) {
							$.removeNode($firstChild(node));
						}
						fakeFeedNum = 0;
						$.insertHTML(node, feedHtml, "afterbegin");
					} else if(opts.bottom) {
						that.removeBottomNode();
						$.insertHTML(node, feedHtml);
					}
					$.custEvent.fire(that, "updateFeed", [type, feedHtml]);
				}
			},
			/**
			 * 显示等待状态
			 */
			showWait: function(type) {
				if(type && requestCache[type]) {
					var opts = requestCache[type];
					if(opts.top) {
						showTopStatus("waiting", type);
						opts.bottom && that.removeBottomNode();
					} else if(opts.bottom) {
						showBottomStatus("waiting", type);
					}
					if(opts.center) {
						topNode && $.core.util.hideContainer.appendChild(topNode);
						bottomNode && $.core.util.hideContainer.appendChild(bottomNode);
						node.innerHTML = "";
						topNode && node.appendChild(topNode);
						bottomNode && node.appendChild(bottomNode);
					}
					requestDataCache[type].time = 0;
				}
			},
			/**
			 * 显示错误状态
			 */
			showError: function(type) {
				if(type && requestCache[type]) {
					var opts = requestCache[type];
					var dataCache = requestDataCache[type];
					var action;
					if (dataCache.time >= 3) {
						dataCache.time = 0;
						action = "end";
					} else {
						dataCache.time++;
						action = "retry";
					}
					if (opts.top) {
						showTopStatus(action, type);
					} else if (opts.bottom) {
						showBottomStatus(action, type);
					}
					$.custEvent.fire(that, "showError", type);
				}
			}
		};
		that.destroy = function(){
			dEvent.destroy();
		};
		//默认的事件
		$.custEvent.define(that, ["request", "updateFeed", "clearTips", "updateEndId", "showError"]);
		$.custEvent.add(that, "updateEndId", updateEndId);
		
		return that;
	};
});
