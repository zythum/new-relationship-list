/**
 * Created by .
 * User: bigbone || guoqing5@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('common.dialog.sendMessage');
STK.register('comp.content.customService',function($){
	//---常量定义区----------------------------------

	//-------------------------------------------
	return function(node, opts){
		var that = {};
		//---变量定义区----------------------------------
		//----------------------------------------------
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
            DOM_eventFun :{
            messageFunc :function(obj)
            {
                var data = obj.data;
                 var sm = $.common.dialog.sendMessage({
						uid: $CONFIG['uid'],
						userName: data.userName,
						args:{}
					});
					sm.show();
            }
           }
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
				throw 'node 没有定义';
			}
		};
		//-------------------------------------------

		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function(){
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
		};
		//-------------------------------------------

		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function(){
            	_this.DEvent = $.core.evt.delegatedEvent(node);
		};
		//-------------------------------------------

		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function(){
            _this.DEvent.add("messageBtn","click",_this.DOM_eventFun.messageFunc);
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
              _this.DEvent.remove("messageBtn","click");
		};
		//-------------------------------------------

		//---执行初始化---------------------------------
		init();
		//-------------------------------------------

		//---组件公开属性或方法的赋值区----------------------
		that.destroy =destroy;
		//-------------------------------------------

		return that;
	};
});