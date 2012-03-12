/**
 * 收藏左侧导航
 * * @id $.common.content.myFavoritesLeftNav
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author guoqing5@staff.sina.com.cn
 * @example
 *
 */
$Import('kit.dom.parseDOM');
$Import('common.content.myFavoritesLeftNav');
STK.register('comp.content.myFavoritesLeftNav',function($){
	//---常量定义区----------------------------------

	//-------------------------------------------
	return function(node, opts){
		var that = {};
		//---变量定义区----------------------------------
		//----------------------------------------------
		var _this = {
			DOM:{},//节点容器
			objs:{}//组件容器
		};
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
			eventInit();
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
		};
		//-------------------------------------------

		//---Dom的获取方法定义区---------------------------
		/**
		 * @method eventInit
		 * @private
		 */
		var eventInit  = function()
		{

		};
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function(){
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			_this.objs.myFavoritesLeftNav = $.common.content.myFavoritesLeftNav(_this.DOM["myFavoritesLeftNav"]);
		};
		//-------------------------------------------

		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function(){
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
            _this.objs.myFavoritesLeftNav = null;
		};
		//-------------------------------------------

		//---执行初始化---------------------------------
		init();
		//-------------------------------------------

		//---组件公开属性或方法的赋值区----------------------
		that.destroy = function(){

		};
		//-------------------------------------------

		return that;
	};
});