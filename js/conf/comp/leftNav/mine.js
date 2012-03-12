/**
 * leftNavMine 我的微博页左侧导航
 * 
 * @id STK.comp.leftNav.mine
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */
$Import('kit.dom.parseDOM');
STK.register("comp.leftNav.mine", function($) {
	//---常量定义区---------------------------------- 
	var nodes;
	//-------------------------------------------
	
	return function(node) {
		var that = {};
		
		//---变量定义区----------------------------------

		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			dilemmaJump : function(evt){
				$.core.evt.preventDefault(evt);
				var el = evt.target || evt.srcElement;
				var url = el.getAttribute('url');
				url && (window.location = url);
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			
		};
		//----------------------------------------------
		
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
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.leftNav]:node is not a Node!";
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
			var ls = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(ls.list);
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			if(nodes["dilemma"]){
				if(!$.isArray(nodes["dilemma"])){
					nodes["dilemma"] = [].concat([nodes["dilemma"]]);
				}
				if(nodes["dilemma"].length > 0){
					for(var i in nodes["dilemma"]){
						$.addEvent(nodes["dilemma"][i], 'click', bindDOMFuns.dilemmaJump);
					}
				}
			}
		};
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
			if(nodes["dilemma"] && nodes["dilemma"].length > 0){
				for(var i in nodes["dilemma"]){
					$.removeEvent(nodes["dilemma"][i], 'click', bindDOMFuns.dilemmaJump);
				}
			}
			bindDOMFuns = null;
			nodes = null;
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