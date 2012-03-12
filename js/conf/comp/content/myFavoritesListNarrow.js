/**
 * 收藏列表组件用于：收藏的全部，收藏的搜索
 * 
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * 
 */
$Import('common.favorite.search');
$Import('common.feed.feedList.myFavoritesList');
$Import('common.content.myFavoritesLeftNav');
$Import('common.trans.favorite');
$Import('ui.alert');
$Import('kit.extra.parseURL');

STK.register('comp.content.myFavoritesListNarrow',function($){
	//---常量定义区----------------------------------
	//-------------------------------------------
	return function(node, opts){
		var that = {};
		//---变量定义区----------------------------------
		var nodes, search, myFavoritesList,myFavoritesListNarrow,dEvent;
		
		//----------------------------------------------

		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			 'back' : function(spec)
			 {
				$.preventDefault();
				 if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				 $.common.trans.favorite.getTrans('getFav',{
					 'onSuccess' : function(json) {
						$.historyM.setQuery({key:null});
						 nodes.favContent.innerHTML = json.data;
						 nodes.favInput.value = "";
						 destroy();
						 init();
					 },
					 'onFail' : bindDOMFuns.backError,
					 'onError' : bindDOMFuns.backError
				 }).request({});
				 }else
				 {
					window.location.href = spec.el.getAttribute('href');
				 }
			 },
			'backError' : function(json)
			{
			   	   $.ui.alert(json.msg);
			}
		};
		//-------------------------------------------

		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			'getSearchList' : function(data) {
				nodes.favoritesList.innerHTML = data.html;
			},
			'searchFav' : function(evt, data) {
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
					$.historyM.setQuery({'key':data.key});
				}
				nodes.favContent.innerHTML = data.html;
				destroy();
				init();
			},
			'filterTag' : function (evt,data)
			{
			 	var res = {tag : data.tag_id};
				$.common.trans.favorite.getTrans('filterTag',{
					'onSuccess' : function(json)
					{
						nodes.favoritesList.innerHTML = json.data;
						destroy();
						init();
					},
					'onError' : bindCustEvtFuns.flterError
				}).request(res);
			},
			'flterError' : function(json)
			{
				$.ui.alert(json.msg);
			}
		};
		//-------------------------------------------------

		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {
		};
		//-------------------------------------------

		//---组件的初始化方法定义区-------------------------
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function(){
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
		var argsCheck = function(){
			if (!node) {
				throw 'node没有定义';
			}
			opts = $.core.obj.parseParam({
				html: ''
			}, opts);
		};
		//-------------------------------------------

		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function(){
			nodes = {
				//内部dom规则
				'favoritesSearch' : $.core.dom.sizzle('[node-type="favorites_search"]', node)[0],
				'favoritesList': $.core.dom.sizzle('[node-type="favorites_list"]', node)[0],
                'favoritesTags' : $.core.dom.sizzle('[node-type="favoritesTags"]', node)[0],
				'favContent' : $.core.dom.sizzle('[node-type="favContent"]',node)[0],
				'favInput' : $.core.dom.sizzle('[node-type="search_key"]',node)[0]
			};
			if (!nodes.favoritesSearch) {
				$.log('[comp.content.myFavoritesList]:parseDOM()- there is not favorites_search node in node.');
			}
			if (!nodes.favoritesList) {
				$.log('[comp.content.myFavoritesList]:parseDOM()- there is not favorites_list node in node.');
			}
            if (!nodes.favoritesTags) {
				$.log('[comp.content.favoritesTags]:parseDOM()- there is not favorites_Tags node in node.');
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
			search = $.common.favorite.search(nodes.favoritesSearch);
			$.custEvent.add(search, 'success', bindCustEvtFuns.searchFav);
			myFavoritesList = $.common.feed.feedList.myFavoritesList(nodes.favoritesList);
			$.custEvent.add(myFavoritesList, "request", function() {
				var args = arguments;
				var type;
				if (args.length < 3) {
					throw new Error("[comp.content.homeFeed]:bindCustEvt()-custom event 'success' should supply enough arguments.");
				} else {
					type = args[1];
				}
				var url = $.kit.extra.parseURL();
				var urlquery = $.core.json.queryToJson(url.query);
				var query = {};
				//php 处理比较麻烦，前端解码，如果测试出有特殊字符的bug，php处理。注释下这句就好。
				if (urlquery.key) {
					query.key = decodeURIComponent(urlquery.key);
				}
				if (args[2].page) {
					query.page = args[2].page;
				}
				if (type == "page") {
					$.common.trans.favorite.getTrans('getFav', {
						'onSuccess' : function(json) {
							nodes.favContent.innerHTML = json.data;
							destroy();
							init();
						},
						'onFail' : bindDOMFuns.backError,
						'onError' : bindDOMFuns.backError
					}).request(query);
				}
			});
			if (nodes.favoritesTags) {
				myFavoritesListNarrow = $.common.content.myFavoritesLeftNav(nodes.favoritesTags, {"narrow":true});
				$.custEvent.add(myFavoritesListNarrow, 'filter', bindCustEvtFuns.filterTag);
			}
			// 点击返回全部收藏后，初始化节点，将原来的类全部destroy掉，重新初始化。
			//原来采用bp刷页，这里模拟bp刷页。调用destroy方法，采用ajax这也太蛋疼了。功能比较单一，没新写一个类。
			dEvent = $.core.evt.delegatedEvent(node);
			dEvent.add("back", "click", bindDOMFuns.back);
		};
		//-------------------------------------------

		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function(){
		};
		//-------------------------------------------

		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function(){
		};
		//-------------------------------------------

		//---广播事件绑定方法定义区------------------------
		var bindListener = function(){
		};
		//-------------------------------------------

		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			$.custEvent.remove(search, 'success', bindCustEvtFuns.searchFav);
			search.destroy();
			myFavoritesList.destroy();
			nodes = search = myFavoritesList = null;
			if (myFavoritesListNarrow) {
				$.custEvent.remove(myFavoritesListNarrow, 'filter', bindCustEvtFuns.filterTag);
			    myFavoritesListNarrow.destroy();
			}
			myFavoritesListNarrow = null;
			dEvent.remove("back", "click");
			dEvent = null;

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