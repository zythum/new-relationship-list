/**
 * 
 * @id $.common.content.inputTip
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
	this.objs.oInputTip = $.common.content.inputTip(searchInput, {
		text:searchInput.defaultValue || searchInput.value,
		className: 'on_tips'
	});
	this.objs.oInputTip.destroy();
 */
//$Import('');

STK.register('common.content.inputTip', function($){

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	
	return function(node, opts){
		var that = {};


		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			//属性方法区
			DOM_eventFun: {
				blurInput: function () {
					_this.checkValueForTips();
				},
				focusInput: function () {
					_this.checkValueForInput();
				}
			},
			checkValueForTips: function () {
				$.log('checkValueForTips:'+(node.value.replace(/\s/g, '') == ''));
				if(node.value.replace(/\s/g, '') == '' || node.value == opts.text) {
					$.addClassName(node, opts.className);
					node.value = opts.text;
				}else{
					$.removeClassName(node, opts.className);
				}
			},
			checkValueForInput: function () {
				$.log('checkValueForInput:'+(node.value == opts.text));
				$.removeClassName(node, opts.className);
				if(node.value == opts.text) {
					node.value = '';
				}
			}
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
			opts.text = opts.text || '请输入.....';
			if(!node) {
				throw new Error('common.content.inputTip node没有定义');
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			//_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if(!1) {
				throw new Error('common.content.inputTip 必需的节点不完整');
			}

			
		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){
			_this.checkValueForTips();
		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			$.addEvent(node, 'blur', _this.DOM_eventFun.blurInput);
			$.addEvent(node, 'focus', _this.DOM_eventFun.focusInput);
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
			$.removeEvent(node, _this.DOM_eventFun.blurInput, 'blur');
			$.removeEvent(node, _this.DOM_eventFun.blurInput, 'focus');
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
