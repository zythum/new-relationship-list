/**
 * 
 * @id $.comp.content.messageOtherSide
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
 * demo待完善
 */
//$Import('');

STK.register('comp.content.messageOtherSide', function($){

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	
	return function(node){
		var that = {};

		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{}//组件容器
			//属性方法区
		};
		//----------------------------------------------


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


		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('comp.content.messageOtherSide node没有定义');
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if(!1) {
				throw new Error('comp.content.messageOtherSide 必需的节点不完整');
			}

			
		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){
			
		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			
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
