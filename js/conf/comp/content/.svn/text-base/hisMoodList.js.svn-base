/**
 * hisFeed组件
 * 
 * @id STK.comp.content.hisFeed
 * @author guoqing5 | guoqing5@staff.sina.com.cn
 * @param {Object} node 组件最外节点
 * @return {Object} 实例 
 * @example 
 * 
 */
$Import("kit.dom.parseDOM");
$Import("kit.extra.language");
$Import("common.listener");
$Import("common.channel.topTip");
$Import("common.channel.feed");
$Import('common.feed.inter.hisFeedInter');
$Import('common.feed.feedList.hisFeedList');
$Import('common.mood.moodCalendar');
$Import('common.feed.groupAndSearch.hisFeed');
$Import("kit.extra.parseURL");

STK.register("comp.content.hisMoodList", function($) {
	
	//---常量定义区---------------------------------- 
//	var THISCHANNEL = 'common.channel.demoTV', ONEVT = 'on', OFFEVT = 'off', SCREENIMGURL = "./style/images/backpic/img ([n]).jpg";
	//-------------------------------------------
	
	return function(node, opts) {
		var that = {};
		var $L = $.kit.extra.language;
		//---变量定义区----------------------------------
		var hisFeedInter,groupAndSearch,feedList;
		var nodes;
		var pageQuery;
		//心情日历控件
		var moodCalendar , moodCalendarCustObj = {};
		// 当前是不是在全部过滤器下
		var isFilterAll;
		
		// 当前是否支持 bigPipe
		var isBigPipe = ($CONFIG != null && $CONFIG.bigpipe != null && ($CONFIG.bigpipe === 'true' || $CONFIG.bigpipe === true));
		
		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			
		};
		//----------------------------------------------
		
		
		
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
				throw "[comp.centent.hisFeed]:argsCheck()-The param node is not a DOM node.";
			}
			opts = $.core.obj.parseParam({
				html: ''
			}, opts);
			// 从地址栏获取参数
			pageQuery = (function(){
				var url = $.kit.extra.parseURL();
				var query = $.core.json.queryToJson(url.query);
				isFilterAll = (query.is_ori != 1 && query.is_pic != 1 && query.is_video != 1 && query.is_music != 1
								 && query.is_foward != 1 && query.is_text != 1 && query.key_word == null
								 && query.start_time == null && query.end_time == null);
				return query;
			})();
			//因为心情这个东西有短链，php在这个页面，本身就做了302跳转，为了加ismood=1，再加一个302跳转，他们不干，所以用js写死了。
			pageQuery.ismood=1;
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
				'feedList': $.core.dom.sizzle('[node-type="feed_list"]', node)[0],
				'moodNode' : $.core.dom.sizzle('[node-type="mood_calendar"]' , node)[0]
			};

			if (!nodes.feedNav || !nodes.feedList) {
				throw '[comp.centent.hisFeed]:parseDOM()-You should provide the nodes required.';
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
			// Feed切换按钮
			 	groupAndSearch = $.common.feed.groupAndSearch.hisFeed(nodes.feedNav, {
				'pageQuery' : pageQuery,
				'isBigPipe' : isBigPipe
			});

			// Feed分组及搜索的相关功能
			hisFeedInter = $.common.feed.inter.hisFeedInter({
				'pageQuery' : pageQuery,
				'isBigPipe' : isBigPipe
			});
			// 页面初始化时候的页码： pageQuery.page
			
			feedList = $.common.feed.feedList.hisFeedList(nodes.feedList, {
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
			
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvtFuncs = {
			/**
			 * 绑定自定义事件
			 * 用来进行切换列表模式和心情模式
			 */
			calendarMood : function(evt, data , spec) {
				/**
				 * 进行简单的div的显示和隐藏，如果第一次显示日历的时候
				 * 调用日历控件，告诉是profile页面使用（传递style:big）
				 * 传递额外参数spec.data,php需要知道uid，因为有我的心情profile和他人心情profile
				 */
				if (data == "listMood") {
					nodes.feedList.style.display = "";
					nodes.moodNode.style.display = "none";
				}
				else if (data == "calendarMood") {
					nodes.feedList.style.display = "none";
					nodes.moodNode.style.display = "";
					var tmpNodes = $.kit.dom.parseDOM($.builder(nodes.moodNode).list);
					tmpNodes.contentArea.style.height = "275px";
					/**
					 * 添加loading文案
					 */
					tmpNodes.contentArea.innerHTML = $L('<div class="W_loading"><span>#L{正在加载，请稍候}...</span></div>');
					if (!moodCalendar) {
						moodCalendar = $.common.mood.moodCalendar({
							nodeOuter :  nodes.moodNode,
							style : "big",
							requestData : spec.data,
							custObj : moodCalendarCustObj
						});
						$.custEvent.define(moodCalendarCustObj , ["setHeightFree"]);
						$.custEvent.add(moodCalendarCustObj , "setHeightFree" , function() {
							tmpNodes.contentArea.style.height = "";						
						});
					} else {
						moodCalendar.reset();
					}
				}
			}
		};
		var bindCustEvt = function() {
			/*
			 * 已约定好的自定义事件
			 * 1、search				分组切换、分类搜索的时候触发给 Inter
			 * 2、request			分页、点黄条、lazyload时候触发给 Inter
			 * 自定义事件:request
			 * 参数: function(event, type, data){
			 * 	type: newFeed/backToAll/page/lazyload
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
			   // 搜索等，抛出自定义事件给 Inter
			$.core.evt.custEvent.add(groupAndSearch, "search", function(){
				feedList.showWait("search");
				var status = arguments[3];
				if(status != null){
					isFilterAll = status.isFilterAll;
				}
				hisFeedInter.evtSearch.apply(hisFeedInter, arguments);
			});

			// Feed 区域操作的事件监听
			$.core.evt.custEvent.add(feedList, "request", function(){
					hisFeedInter.evtRequest.apply(hisFeedInter, arguments);
			});
//			// 搜索成功的自定义事件监听
			$.core.evt.custEvent.add(hisFeedInter, "success", function(){
				var args = arguments;
				var html, type;
				if(args.length < 3){
					throw new Error("[comp.content.hisFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				} else {
					html = args[1];
					type = args[2];
				}
				feedList.updateFeed.apply(hisFeedInter, [html, type]);
			});
//			// 搜索失败的自定义事件监听
			$.core.evt.custEvent.add(hisFeedInter, "failure", function(){
				if(arguments.length < 3) {
					throw new Error("[comp.content.hisFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				}
				var type = arguments[2];
				feedList.showError(type);
			});
			$.core.evt.custEvent.add(groupAndSearch,'mood' , bindCustEvtFuncs.calendarMood);
		};
		//-------------------------------------------
		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {

		};
		//-------------------------------------------
		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {

		};
		//-------------------------------------------
		
		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			groupAndSearch && groupAndSearch.destroy && groupAndSearch.destroy();
			feedList && feedList.destroy && feedList.destroy();
			moodCalendar && moodCalendar.destroy && moodCalendar.destroy();
			$.custEvent.undefine(moodCalendarCustObj);
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
