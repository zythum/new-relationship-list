/*
 * 
 * @id $.comp.content.messageSearchForm
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
 * $.comp.content.messageSearchForm(_this.DOM['messageSearchForm']);
 */
$Import('kit.dom.parseDOM');
$Import('common.content.inputTip');
$Import('ui.tipAlert');

STK.register('comp.content.messageSearchForm', function($){

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	
	return function(node){
		var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {};

		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			DOM_eventFun: {//DOM事件行为容器
				clickSearchMessage: function (evt) {
					var e = $.fixEvent(evt);
					_this.searchMessage(_this.DOM['messageSearchInput'].value, e.target);

					$.preventDefault();
				}
			},
			//属性方法区
			searchMessage: function (sValueSearch, el) {
				$.log('发出搜索: '+sValueSearch);
				if(sValueSearch && sValueSearch !== _this.DOM['messageSearchInput'].defaultValue) {
					_this.DOM['messageSearchInput'].form.submit();
				}else{
					//var oDialog = $.ui.alert($L('#L{请输入要搜索的词。}'));
					
					if(!_this.tipSearchValue) {
						_this.tipSearchValue = $.ui.tipAlert({
							direct: 'down',
							type: 'warn',
							msg: $L('#L{请输入要搜索的词。}')
						});
					}
					_this.tipSearchValue.setLayerXY(el);
					_this.tipSearchValue.aniShow();

					setTimeout(function() {
						_this.tipSearchValue.anihide();
					},4000);
				}
				//$.common.trans.message.getTrans('search',{
					//'onSuccess': function (o) {
						//$.log('search onSuccess');
						////var_dump(o);
						//_this.objs.messageDetailList.refreshListWithHTML(o.html);
						//$.scrollTo(_this.DOM['messageList'], {top: 30});
					//},
					//'onError': function (o) {
						//$.log('search onError');
					//},
					//'onFail': function () {
						//$.log('search onFail');
					//}
				//}).request({value: sSearch});
			}
			
		};
		//----------------------------------------------




		//+++ 参数的验证方法定义区 ++++++++++++++++++
		argsCheck = function(){
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		parseDOM = function(){
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if(!1) {
				throw new Error('必需的节点 不存在');
			}

			
		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		initPlugins = function(){
			_this.objs.oInputTip = $.common.content.inputTip(_this.DOM['messageSearchInput'], {
				text: _this.DOM['messageSearchInput'].defaultValue || _this.DOM['messageSearchInput'].value,
				className: 'input_default'
			});
		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		bindDOM = function(){
			$.addEvent(_this.DOM['searchMessage'], 'click', _this.DOM_eventFun.clickSearchMessage);
			
		};
		//-------------------------------------------


		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		bindCustEvt = function(){
			
		};
		//-------------------------------------------


		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		bindListener = function(){
			
		};
		//-------------------------------------------



		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		destroy = function(){
			
		};
		//-------------------------------------------


		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		init = function(){
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
