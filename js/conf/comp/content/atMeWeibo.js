/**
 *  atMeWeibo
 *
 * @history
 *  2011.03.28	L.Ming	增加一个正在处理的状态，过滤器里防止狂点“筛选”按钮造成的重复请求
 *
 *  @history
 *  2011.04.28	ZhouJiequn	1、所有跳页、搜索请求改用Bigpipe刷新，取代Ajax;
 *						  2、因为采用bigPipe跳页，所以取消正在处理的状态，过滤器里防止狂点
 *						  “筛选”按钮造成的重复请求；
 */
$Import('kit.extra.language');
$Import("common.listener");
$Import("common.channel.topTip");
$Import("common.channel.feed");
$Import('common.trans.feed');
$Import('common.feed.feedList.atMeFeedList');
$Import('common.feed.inter.atMeFeedInter');
$Import('common.comment.commentSearch');
$Import("kit.extra.parseURL");
$Import('common.channel.topTip');
$Import('comp.content.tipsBar');

STK.register('comp.content.atMeWeibo', function($) {


	return function(node, opts) {
		//对顶导的通知放到最前面，尽量减少延迟
		$.common.channel.topTip.fire("readed", {});
		var that = {};
		var sizzle = $.sizzle;
		var lang = $.kit.extra.language;
		var nodes;
		var pageQuery;
		var isBigPipe = ($CONFIG != null && $CONFIG.bigpipe != null && ($CONFIG.bigpipe === 'true' || $CONFIG.bigpipe === true));
		var by_type,//0：所有的人； 1：关注的人
				by_auth, //0：所有微博 ；1： 原创的微博
				page,isProcessing = false;
		var senSear ,auth_0 ,auth_1 ,type_0, type_1, tab_c , all ,follow;
		var searchPlugin,atMeFeedInter,feedList, items , tip, delegate,destroy;

		var doPost = function(spec) {
			if (pageQuery && pageQuery['nofilter'] === '1' && spec.deleteFilter) {
				spec.nofilter = null;
			}
			delete spec.deleteFilter;
			if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				searchComment(spec);
				return;
			}
			for (var key in spec) {
				if (spec[key] === null) {
					delete spec[key];
				}
			}
			var uri = '/at/weibo',
			query = $.jsonToQuery(spec);
			query && (uri = uri + '?' + query);
			window.location.href = uri;
		};
		var doPostfiter = function(spec) {
			if (pageQuery && pageQuery['nofilter'] === '1' && spec.deleteFilter) {
				spec.nofilter = null;
			}
			delete spec.deleteFilter;
			if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				searchCommentFilter(spec);
				return;
			}
			for (var key in spec) {
				if (spec[key] === null) {
					delete spec[key];
				}
			}
			var uri = '/at/weibo',
					query = $.jsonToQuery(spec);
			query && (uri = uri + '?' + query);
			window.location.href = uri;
		};
		var searchCommentFilter = function(spec) {
			$.common.trans.feed.getTrans('getAtmeBlog', {
				'onComplete' : function(json) {
						isProcessing = false;
						$.historyM.setQuery(spec);
						nodes.feed_list_atmeSearch.innerHTML = json.data;
						destroy();
						init();
				}
			}).request(spec);
		};
		var searchComment = function(spec) {
			$.common.trans.feed.getTrans('getAtmeBlog', {
				'onComplete' : function(json) {
					isProcessing = false;
					$.historyM.setQuery(spec);
					nodes.feed_list_atmeSearch.innerHTML = json.data;
					destroy();
					init();
				}
			}).request(spec);
		};
		/**
		 * 检测当前页面是否是通过高级搜索打开的页面
		 */
		var checkSearch = function() {
			var parseURL;
			if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				parseURL = $.historyM.parseURL()
			} else {
				parseURL = window.location.href;
			}
			var cof = {'source': parseURL.url},
					is_adv = $.core.str.queryString('is_adv', cof);
			return is_adv == '1';
		};

		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			if (node == null || (node != null && !$.core.dom.isNode(node))) {
				throw "[comp.centent.atMeWeibo]:argsCheck()-The param node is not a DOM node.";
			}
			opts = $.core.obj.parseParam({
				html: ''
			}, opts);
			// 从地址栏获取参数
			pageQuery = (function() {
				var url = $.kit.extra.parseURL();
				return $.core.json.queryToJson(url.query);
			})();
			page = pageQuery.page || 1;
			by_type = pageQuery.by_type || 0;
			by_auth = pageQuery.by_auth || 0;
			is_adv = pageQuery.is_adv || 0;
			nofilter = pageQuery.nofilter || 0;
		};


		var parseDOM = function() {
			nodes = {
				'feedList': $.core.dom.sizzle('[node-type="feed_list"]', node)[0],
				'searchkeyword': $.core.dom.sizzle('[node-type="searchkeyword"]', node)[0],
				'searchBtn'	: $.core.dom.sizzle('[node-type="searchBtn"]', node)[0],
				'feed_list_atmeSearch' :  $.core.dom.sizzle('[node-type="feed_list_atmeSearch"]', node)[0]
			};
			senSear = sizzle(".senSear", node)[0];
			//作者 单选框
			auth_0 = sizzle("#filter_ori_auth1", node)[0];
			auth_1 = sizzle("#filter_ori_auth2", node)[0];
			//类型 单选框
			type_0 = sizzle("#filter_ori_type1", node)[0];
			type_1 = sizzle("#filter_ori_type2", node)[0];

			tab_c = sizzle(".tab_c")[0];

			all = sizzle("[node-type='all']", tab_c)[0];
			follow = sizzle("[node-type='follow']", tab_c)[0];
			if (!nodes.feedList) {
				throw '[comp.centent.atMeWeibo]:parseDOM()-You should provide the nodes required.';
			}
		};

		var initPlugins = function() {
			delegate =  $.core.evt.delegatedEvent(node);

			searchPlugin = $.common.comment.commentSearch({
				'input'		: nodes['searchkeyword'],
				'searchBtn'	: nodes['searchBtn'],
				//'msg'		: lang('#L{查找作者、内容或标签}'),
				'searchCb'	: function(val) {
					doPost({'search_key': encodeURIComponent(val)});
				}
			});
			atMeFeedInter = $.common.feed.inter.atMeFeedInter({
				'pageQuery': pageQuery,
				'isBigPipe': isBigPipe
			});
			//TO-DO
			feedList = $.common.feed.feedList.atMeFeedList(nodes.feedList, {
				'page': page,
				'end_id':  pageQuery.end_id
			});
			$.custEvent.add(feedList, "request", function(evt, type, data) {

				var args = arguments;
				if (arguments.length < 3) {
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				}
				var type;
				if (args.length < 3) {
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				} else {
					type = args[1];
				}
				by_type = (type_1 && type_1.checked) ? 1 : 0;
				by_auth = (auth_1&& auth_1.checked) ? 1 : 0;
				data['filter_by_type'] = by_type;
				data['filter_by_author'] = by_auth;
				data['is_adv'] = is_adv;
				data['nofilter'] = nofilter;
				if (type == "page") {
					data['page'] = args[2].page;
				}
				var url = $.kit.extra.parseURL();
				var query = $.core.json.queryToJson(url.query);
				if(query.search_key)
				{
					data.key_word =  query.search_key;
				}
				if (type == "page") {
					data.search_key =  query.search_key;
					   $.common.trans.feed.getTrans('getAtmeBlog', {
					'onComplete' : function(json) {
						//var urlquery ={'search_key':null,'filter_by_author':null,'filter_by_type':null,'filter_by_source':null,'backallat':1};
						$.historyM.setQuery(query);
						nodes.feed_list_atmeSearch.innerHTML = json.data;
						destroy();
						init();
						//这方法好蛋疼啊。在分页的时候调用不同接口。
						feedList.setCurrentPage(args[2].page);
					}
				}).request(data);
				}
				else
				{
					atMeFeedInter.evtRequest.apply(atMeFeedInter, arguments);
				}

			});
			// 搜索成功的自定义事件监听
			$.custEvent.add(atMeFeedInter, "success", function() {
				var args = arguments;
				var html, type;
				if (args.length < 3) {
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				} else {
					html = args[1];
					type = args[2];
				}
				feedList.updateFeed(html, type);
			});
			$.custEvent.add(atMeFeedInter, "failure", function() {
				if (arguments.length < 3) {
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				}
				var type = arguments[2];
				feedList.showError(type);
			});

			//tip黄条
			items = $.sizzle('[node-type=tipsBar]', node);
			if (items.length) {
				//@我的页面关闭黄条使用的值为3，见common.trans.global的closetipsbar
				var CLOSE_TIP_TYPE = 3;
				tip = $.comp.content.tipsBar(items[0], CLOSE_TIP_TYPE);
			}
			for (var i in actionTypes) {
				delegate.add(i, 'click', actionTypes[i]);
			}
		};
		var actionTypes = {
			"all":function(obj) {
				$.preventDefault();
				if (isProcessing == true) {
					return;
				}
				if ($.hasClassName(obj.el, "current")) {
					return false;
				}
				//follow.className = '';
				//all.className = 'current  W_texta';
				/*by_type = 0;
				by_auth = 0;

				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
					STK.historyM.setQuery({
						'by_type' : by_type,
						'by_auth' :by_auth
					})
				}*/
				feedList.showWait("search");
				//isProcessing = true;
				doPostfiter(obj.data);
			},
			"follow":function(obj) {
					$.preventDefault();
					if (isProcessing == true) {
						return;
					}
					if ($.hasClassName(obj.el, "current")) {
						return false;
					}
					//all.className = '';
					//follow.className = 'current  W_texta';
					/*by_type = 0;
					by_auth = 1;
					if ($CONFIG['bigpipe'] === 'true') {
						STK.historyM.setQuery({
							'by_type' : by_type,
							'by_auth' :by_auth
						})
					}*/
					feedList.showWait("search");
					isProcessing = true;
					doPostfiter(obj.data);

			},
			"search":function() {
				$.preventDefault();
				senSear.style.display = "";
				tab_c.style.display = "none";
				doPost({
				 'filter_by_author': 0,
				 'filter_by_source': 0,
				 'filter_by_type': null,
				 'is_adv': 1,
				 'search_type': null,
				 'search_key': null,
				 'since_id': null,
				 'max_id': null,
				 'fuid': null,
				 'page': null,
				 'nofilter': null,
				'backallat':1
				 });
//				//单选框初始化
//				if (by_auth) {
//					auth_1.checked = "checked";
//				} else {
//					auth_0.checked = "checked";
//				}
			},
			"cancel":function(spec) {

				$.preventDefault();
				senSear.style.display = "none";
				tab_c.style.display = "";
				//doPost(spec.data);
				doPost({
				 'filter_by_author': 0,
				 'filter_by_source': 0,
				 'filter_by_type': null,
				 'is_adv': null,
				 'search_type': null,
				 'search_key': null,
				 'since_id': null,
				 'max_id': null,
				 'fuid': null,
				 'page': null,
				 'nofilter': null,
				'backallat':1
				 });
			}
			,"request":function(spec) {
				$.preventDefault();
				by_type =(type_1 &&  type_1.checked) ? 1 : 0;
				by_auth = (auth_1 && auth_1.checked) ? 1 : 0;
				var params = $.core.util.htmlToJson(senSear);
				params.deleteFilter = true;
				params = $.kit.extra.merge(spec.data, params);
				doPost(params);
			},"back" : function(spec) {
				$.preventDefault();
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				$.common.trans.feed.getTrans('getAtmeBlog', {
					'onComplete' : function(json) {
						var data ={'search_key':null,'filter_by_author':null,'filter_by_type':null,'filter_by_source':null,'backallat':1};
						$.historyM.setQuery(data);
						nodes.feed_list_atmeSearch.innerHTML = json.data;
						nodes.searchkeyword.value ="";
						destroy();
						init();
					}
				}).request(spec.data);

			}
			else
			{
			  window.location.href = spec.el.getAttribute("href");
			}
			}
		};


		var init = function() {
			argsCheck();
			parseDOM();
			initPlugins();
		};
		init();


		destroy = function() {
			delegate.destroy();
			feedList.destroy();
			searchPlugin.destroy();
			tip && tip.destroy();
		};

		that.destroy = destroy;

		return that;
	};

});