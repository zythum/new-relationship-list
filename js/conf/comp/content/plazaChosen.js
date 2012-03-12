/**
 * 广场精选
 * @param {Object} node
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
$Import('common.plaza.plazaChosenList');
$Import('common.plaza.plazaChosenImage');

STK.register("comp.content.plazaChosen", function($) {
	
	return function(node, opts) {
		var that = {};
		
		//根据不同模式初始化不同组件 
		//列表模式:使用plazaChosenFeedList 并为其加载更多按钮的数据
		//图模式:使用
		
		//---变量定义区----------------------------------
		var nodes,
			plazaChosenList,
			plazaChosenImage;
		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			feedListRequest: function() {
				
			}
		};
		//----------------------------------------------
		
		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {};
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
				throw "[comp.centent.plazaChosen]:argsCheck()-The param node is not a DOM node.";
			}
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
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			if($CONFIG['type'] == 'image') {
				plazaChosenImage = $.common.plaza.plazaChosenImage(node);
			} else {
				plazaChosenList = $.common.plaza.plazaChosenList(node);
			}
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {
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
			if(plazaChosenList) {
				plazaChosenList.destroy();
			}
			if(plazaChosenImage) {
				plazaChosenImage.destroy();
			}
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		
		return that;
	};
	
});
