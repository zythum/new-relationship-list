/**
 * homeFeed组件
 * 
 * @id STK.comp.content.groupFeed
 * @param {Object} node 组件最外节点
 * @return {Object} 实例 
 * @example 
 * 
 */
$Import("common.listener");
$Import("common.channel.topTip");
$Import("common.channel.feed");
$Import("common.trans.global");
$Import("common.trans.relation");
$Import("common.dialog.inviteFollow");
$Import('common.feed.groupAndSearch.homeFeed');
$Import('common.feed.inter.groupFeedInter');
$Import('common.feed.feedList.groupFeedList');
$Import('common.relation.followPrototype');
$Import('kit.extra.parseURL');
STK.register("comp.relation.groupFeed", function($) {
	return function(node, opts) {
		var that = {};
		var groupAndSearch;
		var groupFeedInter;
		var feedList;
		var nodes;
		var pageQuery;
		var isGroupAll;
		var isFilterAll;
		var isBigPipe = ($CONFIG != null && $CONFIG.bigpipe != null && ($CONFIG.bigpipe === 'true' || $CONFIG.bigpipe === true));
		var newFeedControl = {
			display : false			
		};
		var dEvent;
		var ioFollow= $.common.relation.followPrototype;
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
			bindCustEvt();
			bindListener();
			bindDOM();
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
				throw "[comp.centent.groupFeed]:argsCheck()-The param node is not a DOM node.";
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
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			if (nodes.feedNav && nodes.feedList) {
				groupAndSearch = $.common.feed.groupAndSearch.homeFeed(nodes.feedNav, {
					'pageQuery': pageQuery,
					'isBigPipe': isBigPipe,
					'newFeedControl': newFeedControl,
					'hideTipWhenInterest': custFuncs.hideNewWhenInterest
				});
				groupAndSearch.searchToggle(true);
				feedList = $.common.feed.feedList.groupFeedList(nodes.feedList, {
					'page': pageQuery.page,
					'end_id': pageQuery.end_id
				});
				groupFeedInter = $.common.feed.inter.groupFeedInter({
					'pageQuery' : pageQuery,
					'isBigPipe' : isBigPipe
				});
			}
			
		};
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
				
				arguments[2].uid = $CONFIG['oid'];
				groupFeedInter.evtSearch.apply(groupFeedInter, arguments);
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
					arguments[2].uid = $CONFIG['oid'];
					groupFeedInter.evtRequest.apply(groupFeedInter, arguments);
				}
			});
			// 搜索成功的自定义事件监听
			$.custEvent.add(groupFeedInter, "success", function(){
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
			$.custEvent.add(groupFeedInter, "failure", function(){
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
		};
		var bindDOM = function(){
			if (!nodes.feedNav || !nodes.feedList) {
				var quesTrans = $.common.trans.relation.getTrans('questions', {
					'onSuccess': function(spec, parm){
						$.common.dialog.inviteFollow({
							'name': $CONFIG['onick'],
							'uid': $CONFIG['oid'],
							'questionList': spec.data
						});
					},
					'onError': function(spec, parm){
						$.ui.alert(spec.msg);
					}
				});
				dEvent = $.delegatedEvent(node);
				dEvent.add('inviteFollow', 'click', function(){
					quesTrans.request({'uid': $CONFIG['oid']});
				});
				dEvent.add('follow', 'click', function(spec){
					var conf = $.parseParam({
						'uid': '',
						'fnick': '',
						'f': 1,
						'onSuccessCb': function(rs){
							window.location.reload();
						}
					}, spec.data || {});
					ioFollow.follow(conf);
				});
			}
		}
		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			dEvent && dEvent.destroy();
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
