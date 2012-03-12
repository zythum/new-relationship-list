/**
 * 收藏列表组件用于：收藏的全部，收藏的搜索
 * 
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * 
 */
$Import('common.favorite.search');
$Import('common.feed.feedList.myFavoritesList');
STK.register('comp.content.myFavoritesList',function($){
	//---常量定义区----------------------------------

	//-------------------------------------------
	return function(node, opts){
		var that = {};
		//---变量定义区----------------------------------
		var nodes, search, myFavoritesList;
		
		//----------------------------------------------

		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			
		};
		//-------------------------------------------

		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
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
			if(opts.html) {
				node.innerHTML = opts.html;
			}
			nodes = {
				//内部dom规则
				'favoritesSearch' : $.core.dom.sizzle('[node-type="favorites_search"]', node)[0],
				'favoritesList': $.core.dom.sizzle('[node-type="favorites_list"]', node)[0]
			};
			if (!nodes.favoritesSearch) {
				$.log('[comp.content.myFavoritesList]:parseDOM()- there is not favorites_search node in node.');
			}
			if (!nodes.favoritesList) {
				$.log('[comp.content.myFavoritesList]:parseDOM()- there is not favorites_list node in node.');
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
			myFavoritesList = $.common.feed.feedList.myFavoritesList(nodes.favoritesList);
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
		var destroy = function(){
			search.destroy();
			myFavoritesList.destroy();
			nodes = search = myFavoritesList = null;
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