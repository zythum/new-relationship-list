/**
 * commentTopNav
 * 评论换一换
 * 
 * @id STK.comp.content.commentTopNav
 * @author qbaty.qi | yuheng@staff.sina.com.cn
 * 
 */
$Import('common.trans.comment');
$Import('kit.dom.parseDOM');

STK.register("comp.content.commentTopNav", function($) {
	
	//---常量定义区----------------------------------
	var LOADING = '<div class="W_loading"><span></span></div>';
	//-------------------------------------------
	
	return function(node, opts) {
		var nodes = {};
		var that = {};
		var trans = $.common.trans.comment.getTrans;
		
		//---变量定义区----------------------------------

		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			changeComment : function(data){
				$.core.dom.sizzle('[node-type=content]')[0].innerHTML = LOADING;
				trans('hotChange',{
					'onSuccess'  : bindDOMFuns.rendResult,
					'onComplete' : function(){}
				}).request(data.data);
			},
			rendResult : function(data){
				var result = data.data.html;
				if(result && result != ''){
					node.innerHTML = data.data.html;
				}
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
			if(!node){
				throw 'comp.content.commentTopNav need node as a param';
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
			var dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add('change','click',bindDOMFuns.changeComment);
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