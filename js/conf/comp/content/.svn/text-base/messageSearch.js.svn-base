/**
 * 
 * @id $.comp.content.messageSearch
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
 * demo待完善
 */
$Import('common.dialog.sendMessage');
$Import('common.channel.message');
$Import('common.content.messageSearchList');
$Import('common.trans.message');
$Import('comp.content.tipsBar');
$Import('common.content.inputTip');
$Import('comp.content.messageSearchForm');

STK.register('comp.content.messageSearch', function($){

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	
	return function(node){
		var that = {};

		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			//属性方法区
			channel: {
				message: $.common.channel.message
			},
			DOM_eventFun: {
				clickPostMsg: function (evt) {
					var e = $.fixEvent(evt);

					var oE = e.target;
					if(!oE.dialog) {
						oE.dialog = $.common.dialog.sendMessage();
					}
					oE.dialog.show();

					$.preventDefault();
				}
			}
		};
		//----------------------------------------------




		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if(!1) {
				throw new Error('必需的节点不完整');
			}

			
		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){
			_this.objs.messageDetailList = $.common.content.messageSearchList(node);
			//为发私信打个补丁。。 现在是整个node都传递过去，去掉这个方法。

			/*if($.sizzle('.search_choice').length != 0) {
                //console.log($.sizzle('.search_choice'));
				_this.objs.messageDetailList = $.common.content.messageSearchList($.sizzle('.search_choice')[0]);
			}*/

			_this.objs.messageSearchForm = $.comp.content.messageSearchForm(_this.DOM['messageSearchForm']);
			if(_this.DOM['tipsBar']) {
				//私信页面关闭黄条使用的值为2，见common.trans.global的closetipsbar
				var CLOSE_TIP_TYPE = 2; 
				_this.objs.tipsBar = $.comp.content.tipsBar(_this.DOM['tipsBar'] , CLOSE_TIP_TYPE);
			}

		};
		//-------------------------------------------

		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			$.addEvent(_this.DOM['postMsg'], 'click', _this.DOM_eventFun.clickPostMsg);
		};
		//-------------------------------------------


		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		var bindCustEvt = function(){
			
		};
		//-------------------------------------------


		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		var bindListener = function(){
			
		};
		//-------------------------------------------



		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
			  $.foreach(_this.objs, function(o) {
                if (o && o.destroy) {
                    o.destroy();
                }
            });
            _this = null;
		};
		//-------------------------------------------


		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
		    argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------
		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------


		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		//-------------------------------------------


		return that;
	};
	
});
