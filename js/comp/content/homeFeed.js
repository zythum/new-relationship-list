/**
 * homeFeed组件
 * 
 * @id STK.comp.content.homeFeed
 * @author L.Ming | liming1@staff.sina.com.cn
 * @param {Object} node 组件最外节点
 * @return {Object} 实例 
 * @example 
 * 
 */
$Import("common.listener");
$Import("common.channel.topTip");
$Import("common.channel.feed");
$Import("common.trans.global");

$Import('common.feed.groupAndSearch.homeFeed');
$Import('common.feed.inter.homeFeedInter');
$Import('common.feed.feedList.homeFeedList');
$Import('kit.extra.parseURL');
STK.register("comp.content.homeFeed", function($) {
	
	//---常量定义区---------------------------------- 
//	var THISCHANNEL = 'common.channel.demoTV', ONEVT = 'on', OFFEVT = 'off', SCREENIMGURL = "./style/images/backpic/img ([n]).jpg";
	//-------------------------------------------
	return function(node, opts) {
		var that = {};
		
		//---变量定义区----------------------------------
		var groupAndSearch;
		var homeFeedInter;
		var feedList;
		var nodes;
		var pageQuery;
		// 当前是不是在全部分组下
		var isGroupAll;
		// 当前是不是在全部过滤器下
		var isFilterAll;
		
		// 当前是否支持 bigPipe
		var isBigPipe = ($CONFIG != null && $CONFIG.bigpipe != null && ($CONFIG.bigpipe === 'true' || $CONFIG.bigpipe === true));
		
		//20110919 新需求 我的微博页显示新微博黄条题型
		//              踩你喜欢页面不显示新微黄条博题型
		//要把变量传到点击行为的地方赋值.
		//在feedList.extra.showNewFeedTip地方进行判断，是否显示首页feed黄条，默认值为true
		var newFeedControl = {
			display : true			
		};
		//如果进页面的时候就是http://weibo.com/habaishi3?hotmblog=1猜你喜欢的状态，则置为false
		if($CONFIG['groupfeed'] == '2') {
			newFeedControl.display = false;			
		}
				
		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			
		};
		//----------------------------------------------
		
		var custFuncs = {
			weiqunTrans : null,
			//每隔5分钟调用一次新微群接口，用来清掉timer，因为刷新左导的时候整个页面不会刷新，需要清掉这个计数器
			weiqunTimer : null,
			weiqunTimer30 : null,
			//我的微群里面的新消息"小坨坨"
			weiqunNewNode : null,
			//全部微博里面的新消息"小坨坨"
			newFeedNode : null,
			//显示新消息"小坨坨"当处在猜你喜欢的状态时
			showNewWhenInterest : function() {
				if(!custFuncs.newFeedNode) {
					var insertNode = $.sizzle('[node-type="feed_group_tab"]' , nodes.feedNav)[0];
					custFuncs.newFeedNode = $.insertHTML(insertNode , '<sup class="newinfo"></sup>');	 
				} else {
					custFuncs.newFeedNode.style.display = '';						
				}
			},
			//隐藏新消息"小坨坨"当处在猜你喜欢的状态时
			hideNewWhenInterest : function() {
				custFuncs.newFeedNode && (custFuncs.newFeedNode.style.display = 'none');				
			},
			//显示新消息"小坨坨"给微群
			showNewForWeiqun : function() {
				if(!custFuncs.weiqunNewNode) {
					var insertNode = $.sizzle('[node-type="order_by_weiqun"]' , nodes.feedNav)[0];
					custFuncs.weiqunNewNode = $.insertHTML(insertNode , '<sup class="newinfo"></sup>');					
				} else {
					custFuncs.weiqunNewNode.style.display = '';
				}			
			},
			//隐藏新消息"小坨坨"给微群
			hideNewForWeiqun : function() {
				custFuncs.weiqunNewNode && (custFuncs.weiqunNewNode.style.display = 'none');				
			},
			//调用接口去请求微群未读数
			refreshWeiqun : function() {
				if(!custFuncs.weiqunTrans) {
					custFuncs.weiqunTrans = $.common.trans.global.getTrans('weiqunnew' , {
						onSuccess : custFuncs.refreshSuccess						
					});					
				}
				custFuncs.weiqunTrans.request();		
			},
			refreshSuccess : function(data) {
				var total = parseInt(data.data.total);
				if(total > 0) {
					custFuncs.showNewForWeiqun();					
				} else {
					custFuncs.hideNewForWeiqun();					
				}
			}
		};
		
		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {
			'newFeed' : function (nFeedCount){
				groupAndSearch.newFeedNotify(nFeedCount);
				//如果不需要显示黄签提醒，则
				if(!newFeedControl.display) {
					//根据有没有新feed显示新
					var total = nFeedCount.feed;
					if(total > 0) {
						custFuncs.showNewWhenInterest();						
					} else {
						custFuncs.hideNewWhenInterest();						
					}
				}
			},
			'fakeFeed' : function (html){
				// L.Ming 2011.06.18 全部分组的全部类型下，且不在高级搜索状态才假写
				if(isGroupAll && isFilterAll && (groupAndSearch && groupAndSearch.isAdvSearched != true)) {
					if(typeof html != "string"){
						html = (html != null) ? html.html : "";
					}
					feedList.insertFakeFeed(html);
				}
			}
		};
		//-------------------------------------------
		
		//---组件的初始化方法定义区-------------------------
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function() {
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
			//绑定刷新微群新题型的"小坨坨"，5分钟一次
			bindInterval();
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			if (node == null || (node != null && !$.core.dom.isNode(node))) {
				throw "[comp.centent.homeFeed]:argsCheck()-The param node is not a DOM node.";
			}
			opts = $.core.obj.parseParam({
				html: ''
			}, opts);
			// 从地址栏获取参数
			pageQuery = (function(){
				var url = $.kit.extra.parseURL();
				var query = $.core.json.queryToJson(url.query);
				isGroupAll = (query.gid == null);
				isFilterAll = (query.is_ori != 1 && query.is_pic != 1 && query.is_video != 1 && query.is_music != 1
								 && query.is_foward != 1 && query.is_text != 1 && query.key_word == null
								 && query.start_time == null && query.end_time == null);
				return query;
			})();
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			if(opts.html) {
				node.innerHTML = opts.html;
			}
			nodes = {
				//内部dom规则
				'feedNav' : $.core.dom.sizzle('[node-type="feed_nav"]', node)[0],
				'feedList': $.core.dom.sizzle('[node-type="feed_list"]', node)[0]
			};
			if (!nodes.feedNav || !nodes.feedList) {
				throw '[comp.centent.homeFeed]:parseDOM()-You should provide the nodes required.';
			}
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			// Feed分组及搜索的相关功能
			groupAndSearch = $.common.feed.groupAndSearch.homeFeed(nodes.feedNav, {
				'pageQuery' : pageQuery,
				'isBigPipe' : isBigPipe,
				'newFeedControl' : newFeedControl,
				'hideTipWhenInterest' : custFuncs.hideNewWhenInterest
			});
			homeFeedInter = $.common.feed.inter.homeFeedInter({
				'pageQuery' : pageQuery,
				'isBigPipe' : isBigPipe
			});
			// 页面初始化时候的页码： pageQuery.page
			
			feedList = $.common.feed.feedList.homeFeedList(nodes.feedList, {
				'page': pageQuery.page,
				'end_id':  pageQuery.end_id
			});
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			//盲人项目 添加聚焦在feed列表第一条用户名称上
			//add by zhaobo 201103011749.1 fix begin
			var _fixFeedList = $.E("focus_feed_list");
			var ul = nodes.feedList;
			if (_fixFeedList) {
				_fixFeedList.onfocus = function() {
					var _a = ul.getElementsByTagName('a');
					if (_a.length > 1) {
						_a[0].focus();
					}
					return false;
				}
			}

			//add by zhaobo 201103011749.1 fix end
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {
			/*
			 * 已约定好的自定义事件
			 * 1、search				分组切换、分类搜索的时候触发给 Inter
			 * 2、request			分页、点黄条、lazyload时候触发给 Inter
			 * 自定义事件:request
			 * 参数: function(event, type, data){
			 * 	type: newFeed/backToHome/backToAll/page/lazyload
			 * 	data: {
			 * 		firstFeedId:最前的feedid
			 * 		lastFeedId:最后的feedid
			 * 		targetPage:目标页码
			 * 		currentPage:当前页码
			 * 		count:吞出的条数
			 * 		showPage:是否吞出分页
			 * 	}
			 * }
			 * 3、success/failure	接口请求成功的时候触发给 feedList
			 * 4、newFeed			分组中监听到广播后，出发给 feedList
			 */
			
			// 切换分组及搜索等，抛出自定义事件给 Inter
			$.custEvent.add(groupAndSearch, "search", function(){
				feedList.showWait("search");
				var status = arguments[3];
				if(status != null){
					isGroupAll = status.isGroupAll;
					isFilterAll = status.isFilterAll;
				}
				homeFeedInter.evtSearch.apply(homeFeedInter, arguments);
			});
			
			// Feed 区域操作的事件监听
			$.custEvent.add(feedList, "request", function(){
				var args = arguments;
				var type;
				if(args.length < 3){
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				} else {
					type = args[1];
				}
				if(type == "backToHome"){	// 返回全部分组第一页
					groupAndSearch.groupChange.call(groupAndSearch, {'data' : {'id': 0}});
				} else if(type == "backToAll"){	// 返回全部分类第一页
					if(groupAndSearch.config["hotmblog"] == 1){
						groupAndSearch.hotSection.call(groupAndSearch, null);
					} else {
						delete groupAndSearch.config.key_word;
						if(groupAndSearch.isAdvSearched){
							groupAndSearch.advSearchToggle.call(groupAndSearch, null, 1);
						} else {
							groupAndSearch.advSearchToggle.call(groupAndSearch, null, 1);
							groupAndSearch.searchFilterChange.call(groupAndSearch, null, 0);
						}
					}
				} else {
					homeFeedInter.evtRequest.apply(homeFeedInter, arguments);
				}
			});
			// 搜索成功的自定义事件监听
			$.custEvent.add(homeFeedInter, "success", function(){
				var args = arguments;
				var html, type;
				if(args.length < 3){
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				} else {
					html = args[1];
					type = args[2];
				}
				feedList.updateFeed(html, type);
			});
			// 搜索失败的自定义事件监听
			$.custEvent.add(homeFeedInter, "failure", function(){
				if(arguments.length < 3) {
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				}
				var type = arguments[2];
				feedList.showError(type);
			});
			
			// 接收全部的小黄条提醒，现在是抛出全部，因为分组的更新接口无法用，
			// 否则应该是当前分组有更新才抛出此事件
			$.custEvent.add(groupAndSearch, "newFeed", function(){
				feedList.extra.showNewFeedTip($.parseParam({
					count: 0,
					isGroupAll: isGroupAll,
					isFilterAll: isFilterAll
				}, arguments[1]));						
			});
		};
		//-------------------------------------------
		
		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {
			// 监听顶部托盘的新 Feed 通知
			// 30 秒后才开始监听顶部托盘的广播
			setTimeout(function () {
				$.common.channel.topTip.register("refresh", bindListenerFuns.newFeed);
			}, 30010);

			// 监听发表微博的广播
			$.common.channel.feed.register("publish", bindListenerFuns.fakeFeed);
			
			// 监听转发微博的广播（监听转发广播进行假写，监听转发自定义事件处理转发数+1）
			$.common.channel.feed.register("forward", bindListenerFuns.fakeFeed);
		};
				
		var bindInterval = function() {
			//刷新微群未读数接口
			custFuncs.weiqunTimer30 = setTimeout(custFuncs.refreshWeiqun , 30000);
			custFuncs.weiqunTimer = setInterval(custFuncs.refreshWeiqun , 5 * 60000);
		};
		
		//-------------------------------------------
		
		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			clearInterval(custFuncs.weiqunTimer);
			clearInterval(custFuncs.weiqunTimer30);
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		//-------------------------------------------
		
		return that;
	};
});
