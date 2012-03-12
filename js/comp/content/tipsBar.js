/**
 * 
 * @id $.comp.content.tipsBar
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
		if(_this.DOM['tipsBar']) {
			$.comp.content.tipsBar(_this.DOM['tipsBar']);
		}
 */
$Import('kit.dom.parseDOM');
$Import('common.trans.global');

STK.register('comp.content.tipsBar', function($){

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	
	return function(node , type){
		var that = {};

		//+++ 变量定义区 ++++++++++++++++++
		/**
		 *
		 * closeTipType用来指定关闭黄条所对应的页面，各页面的值如下，调用方法的时候传入
		 * 私信页面:2,
		 * @我的页面:3,
		 * 评论页面:4
		 * 
		 */
		var closeTipType = type;
		var emptyFun = $.core.func.empty();
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			trans : null,//发起关闭黄条的请求
			DOM_eventFun: {//DOM事件行为容器
				
			}
			//属性方法区
			
		};
		//----------------------------------------------


		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindTrans();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------


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
			if(!_this.DOM['closeTipsBar']) {
				throw new Error('必需的节点 closeTipsBar 不存在');
			}
			if(!node) {
				throw new Error('必需的节点 tipsBar 不存在');
			}

		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){
			
		};
		//-------------------------------------------
		
		//绑定trans，用来发起请求
		var bindTrans = function() {
			trans = $.common.trans.global.getTrans('closetipsbar' , {
				onSuccess : emptyFun,
				onError : emptyFun,
				onFail : emptyFun					
			});
		};
		
		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			$.addEvent(_this.DOM['closeTipsBar'], 'click', function(e) {
				trans.request({
					type : closeTipType				
				});
				$.removeNode(node);
				$.preventDefault(e);
			});
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
