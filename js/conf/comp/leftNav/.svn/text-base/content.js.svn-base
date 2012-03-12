/**
 * leftNavContent
 * 收到的评论、发出的评论、at我的评论、at我的微博 左侧导航
 * 
 * @id STK.comp.leftNav.content
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */
$Import("common.channel.topTip");
STK.register("comp.leftNav.content", function($) {
	
	//---常量定义区----------------------------------
	var nodes = {}, dEvt;
	//-------------------------------------------
	
	return function(node, opts) {
		var that = {};
		
		//---变量定义区----------------------------------
		var channel = $.common.channel.topTip;
		
		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			cleanCurrent : function(){
				if(nodes.items.length > 0){
					for(var index in nodes.items){
						$.removeClassName( nodes.items[index].parentNode, "current" );
					}
				}
			},
			setCurrent : function(target){
				bindDOMFuns.cleanCurrent();
				
				var el = target.el.parentNode;
				
				if(el.nodeName.toLowerCase() == 'dd'){
					$.addClassName( $.sizzle("dt", el.parentNode)[0], "current" );
				} else {
					var nextEl = $.core.dom.next(el);
					if(nextEl)
						$.addClassName( $.core.dom.next(el), "current" );
				}
				
				$.addClassName( el, "current" );
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			
		};
		//----------------------------------------------
		
		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {
			updateNum : function(rt){
				if(nodes["atcmt"]) nodes["atcmt"].innerHTML = rt["atcmt"];
				if(nodes["atme"]) nodes["atme"].innerHTML = rt["atme"];
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
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			nodes.items = $.core.dom.sizzle('a[action-type=leftNavItem]');
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
			dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add("leftNavItem", "click", bindDOMFuns.setCurrent);
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
			channel.register('refresh', bindListenerFuns.updateNum);
			
			$.historyM.onpopstate(function(ret){
				var target = {el:$.sizzle("[href="+ret+"]", node)[0]};
				bindDOMFuns.setCurrent(target);
			});
		};
		//-------------------------------------------
		
		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			
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