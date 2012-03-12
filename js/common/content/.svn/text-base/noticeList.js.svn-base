/**
 *
 * @id $.common.content.noticeList 我的通知列表
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author guoqing5@staff.sina.com.cn
 * @example
 */

$Import('kit.dom.parentElementBy');
$Import('kit.extra.language');

STK.register('common.content.noticeList', function($) {

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	var inited = false;
	return function(node, opts) {
		opts = opts || {};
		var that = {};
		var $L = $.kit.extra.language,selectLi = null;

		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			fold:true,
			iconTitle:
			{
				expend:$L("#L{展开}"),
				fold:$L("#L{收起}")
			},
			//属性方法区
			DOM_eventFun: {
				expendAllNotice: function(el) {
					if (!_this.fold) return;
					_this.fold = false;
					if (_this.DOM.noticeLists) {
						var length = _this.DOM.noticeLists.length;
						for (var i = 0; i < length; i++) {
							_this.DOM_eventFun.expendOneNotice(_this.DOM.noticeLists[i]);
						}
					}
					_this.DOM_eventFun.expendClickFunc();
				},
				foldAllNotice : function(el) {
					if (_this.fold) return;
					_this.fold = true;
					if (_this.DOM.noticeLists) {
						var length = _this.DOM.noticeLists.length;
						for (var i = 0; i < length; i++) {
							_this.DOM_eventFun.foldOneNotice(_this.DOM.noticeLists[i]);
						}
					}
					_this.DOM_eventFun.expendClickFunc();
				},
				overNotice : function(e) {
					var event = $.fixEvent(e),
							ev = event.target;
					var target = $.kit.dom.parentElementBy(ev, node, function (o) {
						if (o.getAttribute('node-type') == 'notice') {
							return true;
						}
					});
					if (selectLi == target) return;
					selectLi && $.removeClassName(selectLi, "W_bgcolor");
					selectLi = null;
					if (target) {
						$.addClassName(target, "W_bgcolor");
						selectLi = target;
					}

				},
				clickNotice : function(el) {
					var target = $.kit.dom.parentElementBy(el.el, node, function (o) {
						if (o.getAttribute('node-type') == 'notice') {
							return true;
						}
					});
					_this.DOM_eventFun.changeNoticeFunc(target);
				},
				expendClickFunc :function() {
					var expendLength = _this.DOM.expend.length;
					if (expendLength) {
						for (var i = 0; i < expendLength; i++) {
							_this.fold ? $.core.dom.removeClassName(_this.DOM.expend[i], "W_textb") : $.core.dom.addClassName(_this.DOM.expend[i], "W_textb");
						}
					}

					var foldLength = _this.DOM.fold.length;
					if (foldLength) {
						for (var i = 0; i < foldLength; i++) {
							_this.fold ? $.core.dom.addClassName(_this.DOM.fold[i], "W_textb") : $.core.dom.removeClassName(_this.DOM.fold[i], "W_textb");
						}
					}
				},
				expendOneNotice : function(target) {
					var imgDOM = $.core.dom.sizzle("[node-type='noticestatic']", target)[0];
					var tbbody = $.core.dom.sizzle("[node-type=content]", target)[0];
					//$.core.dom.setStyle(tbbody,"display","");

					var actiondom = $.sizzle("[node-type='clickNotice']", target)[0];

					if (actiondom && actiondom.getAttribute("tsuda-data")) {
						var sudadata = actiondom.getAttribute("tsuda-data");
						sudadata && actiondom.setAttribute("suda-data", sudadata);
					}
					tbbody && $.core.dom.addClassName(tbbody, "expanded");
					if (imgDOM) {
						if (imgDOM && imgDOM.getAttribute("tsuda-data")) {
							var sudadata1 = imgDOM.getAttribute("tsuda-data");
							sudadata1 && imgDOM.setAttribute("suda-data", sudadata1);
						}
						$.core.dom.removeClassName(imgDOM, "W_moredown");
						imgDOM.innerHTML = _this.iconTitle.fold + '<span class="more"></span>';
						$.core.dom.addClassName(imgDOM, "W_moreup");
						imgDOM.setAttribute("title", $L(_this.iconTitle.fold));
					}

					if (target && $.core.dom.hasClassName(target, "unread")) {
						$.core.dom.removeClassName(target, "unread");
					}

				},
				foldOneNotice : function(target) {
					var imgDOM = $.core.dom.sizzle("[node-type='noticestatic']", target)[0];
					var tbbody = $.core.dom.sizzle("[node-type=content]", target)[0];
					//$.core.dom.setStyle(tbbody,"display","none");
					tbbody && $.core.dom.removeClassName(tbbody, "expanded");

					var actiondom = $.sizzle("[node-type='clickNotice']", target)[0];
					if (actiondom && actiondom.getAttribute("suda-data")) {

						var sudadata = actiondom.getAttribute("suda-data");
						actiondom.removeAttribute && actiondom.removeAttribute("suda-data");
						if (!actiondom.getAttribute("tsuda-data")) {
							actiondom.setAttribute("tsuda-data", sudadata);
						}
					}

					if (imgDOM) {
						if (imgDOM && imgDOM.getAttribute("suda-data")) {
							var sudadata1 = imgDOM.getAttribute("suda-data");
							imgDOM.removeAttribute && imgDOM.removeAttribute("suda-data");
							if (!imgDOM.getAttribute("tsuda-data"))imgDOM.setAttribute("tsuda-data", sudadata1);
						}

						$.core.dom.removeClassName(imgDOM, "W_moreup");
						$.core.dom.addClassName(imgDOM, "W_moredown");
						imgDOM.innerHTML = _this.iconTitle.expend + '<span class="more"></span>';
						imgDOM.setAttribute("title", $L(_this.iconTitle.expend));
					}


				},
				changeNoticeFunc: function(dom) {
					var target = dom;
					//var imgDOM = $.core.dom.sizzle("[node-type='noticestatic']", target)[0];
					var tbbody = $.core.dom.sizzle('[node-type=content]', target)[0];
					if (!$.core.dom.hasClassName(tbbody, "expanded")) {
						_this.DOM_eventFun.expendOneNotice(target);
					}
					else {

						_this.DOM_eventFun.foldOneNotice(target);
					}
				}
			}
		};
		//----------------------------------------------


		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function() {

			/* var a =$.sizzle("[node-type='noticestatic']",node);
			 var b =$.sizzle(".notice",node);
			 for(var i =0;i<a.length;i++)
			 {
			 a[i].setAttribute("action-type","clickNotice");
			 }
			 for(var j=0;j<b.length;j++)
			 {
			 b[j].setAttribute("action-type","clickNotice");
			 }*/
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------


		//+++ 参数的验证方法定义区 ++++++++++++++++++
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			if (!node) {
				throw 'common.content.noticeList node没有定义';
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			//内部dom节点
			if (!node) {
				throw 'common.content.noticeList node没有定义';
			}
			_this.DOM = $.builder(node).list;
			if (!_this.DOM["notice"]) {
				throw 'common.content.noticeList 没有列表';
			}
			_this.DOM.noticeLists = _this.DOM["notice"];
			/*if(!_this.DOM["expendAllNotice"])
			 {
			 throw 'common.content.noticeList 没有全部展开的node';
			 }
			 _this.DOM.expend = _this.DOM["expendAllNotice"];
			 if(!_this.DOM["foldAllNotice"])
			 {
			 throw 'common.content.noticeList 没有全部收起的node';
			 }
			 _this.DOM.fold = _this.DOM["foldAllNotice"];*/
			if (!1) {
				throw 'common.content.noticeList 必需的节点不完整';
			}


		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			_this.DEvent = $.core.evt.delegatedEvent(node);
			//加载sudo
			//!inited&&$.comp.content.suda();
		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {

			_this.DEvent.add("clickNotice", "click", _this.DOM_eventFun.clickNotice);
			var length = _this.DOM.noticeLists.length;
			for (var i = 0; i < length; i++) {
				$.addEvent(_this.DOM.noticeLists[i], 'mouseover', _this.DOM_eventFun.overNotice);
				//$.addEvent( _this.DOM.noticeLists[i], 'mouseout', _this.DOM_eventFun.outNotice);
			}

			_this.DEvent.add("clickNotice", "click", _this.DOM_eventFun.clickNotice);
			_this.DEvent.add("expendAllNotice", "click", _this.DOM_eventFun.expendAllNotice);
			_this.DEvent.add("foldAllNotice", "click", _this.DOM_eventFun.foldAllNotice);
		};
		//-------------------------------------------


		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {

		};
		//-------------------------------------------


		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		var bindListener = function() {

		};
		//-------------------------------------------


		//+++ 组件公开方法的定义区 ++++++++++++++++++
		/**
		 * 组件销毁方法
		 * @method destory
		 */
		var destroy = function() {
			_this.DEvent.remove("clickNotice", "click");
			_this.DEvent.remove("expendAllNotice", "click");
			_this.DEvent.remove("foldAllNotice", "click");
			var length = _this.DOM.noticeLists.length;
			for (var i = 0; i < length; i++) {
				$.removeEvent(_this.DOM.noticeLists[i], 'mouseover');
				//$.removeEvent( _this.DOM.noticeLists[i], 'mouseout');
			}
		};
		//-------------------------------------------


		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------
		inited = true;

		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		//-------------------------------------------


		return that;
	};

});
