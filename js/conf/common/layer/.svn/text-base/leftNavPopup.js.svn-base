/**
 * 左导浮层
 * @author Runshi Wang | runshi@staff.sina.com.cn
 */

STK.register('common.layer.leftNavPopup', function($) {
	//---常量定义区----------------------------------

	//-------------------------------------------

	return function(node, opts) {

		//---变量定义区----------------------------------
		var pos,
		size,
		that = {},
		options = {
			attachment : null,
			align  : 'tl',
			fixedX : 0,
			fixedY : 0
		},mouseoutTimer;

		var parseFixed = function() {

			if(!!pos)
				return;

			pos = $.core.dom.position(options.attachment);

			switch(options.align) {
				case 'tl':
					pos.l += options.fixedX;
					pos.t += options.fixedY;
					break;
				case 'tr':
					size = $.core.dom.getSize(node);
					pos.l += (0 - size.width) + options.fixedX;
					pos.t += options.fixedY;
					break;
				case 'br':
					size = $.core.dom.getSize(node);
					pos.l += (0 - size.width) + options.fixedX;
					pos.t += (0 - size.height) + options.fixedY;
					break;
				case 'bl':
					size = $.core.dom.getSize(node);
					pos.l += options.fixedX;
					pos.t += (0 - size.height) + options.fixedY;
					break;
			}
		}
		var setPos = function() {
			$.core.dom.setXY(node, pos);
			node.style.top = pos.t + 'px';
			node.style.left = pos.l + 'px';
		}
		var show = function() {
			node.style.display = "";
		}
		var hide = function() {
			node.style.display = 'none';
			$.removeEvent(node , 'mouseout' , mouseout);
			$.removeEvent(node , 'mouseover' , mouseover);
		}
		var mouseout = function(e) {
			clearTimeout(mouseoutTimer);
			e = window.event || e;
			var target = e.relatedTarget || e.toElement;
			mouseoutTimer = setTimeout(function() {
				if(target && !$.contains(node , target)) {
					hide();
				}	
			} , 300);
		};
		var mouseover = function() {
			clearTimeout(mouseoutTimer);
		};
		//----------------------------------------------

		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {

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
			options = $.parseParam(options, opts);
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
			$.addEvent(node , 'mouseout' , mouseout);
			$.addEvent(node , 'mouseover' , mouseover);
			show();
			parseFixed();
			setPos();
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
			pos = null, size = null, that = null, options = null;
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
