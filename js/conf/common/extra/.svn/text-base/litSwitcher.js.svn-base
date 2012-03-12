/**
 * @author bigbone|guoqing5@staff.sina.com.cn
 * @example
 */
$Import('kit.dom.parseDOM');
$Import('ui.alert');

STK.register("common.extra.litSwitcher", function($) {
	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	return function(node, opts){
		var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {};
		var arrPageDom = [], arrDevent;
		var currentPage = 0;
		
		opts = $.parseParam({
			'changeUrl' : null,
			'pageUrl'   : null,
			'method'	: 'post',
			'maxPage'   : 'auto',
			'cycle'     : false
		}, opts);

		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			
			DOM:{},//节点容器
			
			objs:{},//组件容器
			
			DOM_eventFun: {//DOM事件行为容器
				
				flushStatus : function(){
					if(opts.cycle) return;
					if(_this.DOM.pagePrev)
						if(currentPage == 0)
							$.setStyle(_this.DOM.pagePrev, "display", "none");
						else
							$.setStyle(_this.DOM.pagePrev, "display", "");
					if(_this.DOM.pageNext)
						if(opts.maxPage && currentPage >= opts.maxPage - 1)
							$.setStyle(_this.DOM.pageNext, "display", "none");
						else
							$.setStyle(_this.DOM.pageNext, "display", "");
				},
				
				pagePrevFunc : function(ol) {
					var prevPage = currentPage - 1;
					if(prevPage <= 0){
				  		if(opts.cycle && opts.maxPage){
							prevPage = opts.maxPage - 1;
						} else {
							return;
						}
					}
					
					if(arrPageDom[prevPage]){
						currentPage = prevPage;
						_this.DOM.content.innerHTML = arrPageDom[prevPage];
						_this.DOM_eventFun.flushStatus();
					}
					return $.preventDefault(ol.evt);
				},
				pageNextFunc : function(ol) {
					
					var nextPage = currentPage + 1;

				  	if(opts.maxPage && nextPage >= opts.maxPage){
				  		if(opts.cycle){
							nextPage = 0;
						} else {
							return;
						}
				  	}
				  	
				  	if(arrPageDom[nextPage]){
				  		currentPage = nextPage;
						_this.DOM.content.innerHTML = arrPageDom[currentPage];
						_this.DOM_eventFun.flushStatus();
					} else {
						if(opts.pageUrl){
							$.ajax({
								"url"        : opts.pageUrl,
								"onComplete" : _this.DOM_eventFun._nextPageSucFunc,
								args         : {
									page: nextPage
								},
								method:'post'
							});
						} else {
							$.ui.alert("没有请求的地址！");
						}
					}
					return $.preventDefault(ol.evt);
				},
				_nextPageSucFunc : function(json) {
					if(json && json.code == "100000") {
						currentPage = currentPage + 1
						arrPageDom[currentPage] = json.data.html;
						_this.DOM.content.innerHTML = json.data.html;
						_this.DOM_eventFun.flushStatus();
					} else {
						$.ui.alert(json.msg);
					}
				},
				changeFunc : function(ol) {
					if(opts.changeUrl){
						if(opts.changeUrl == "next"){
							_this.DOM_eventFun.pageNextFunc(ol);
						} else {
							$.ajax({
								"url"        : opts.changeUrl,
								"onComplete" : _this.DOM_eventFun._changeSucFunc,
								method       : 'post'
							});
						}
					} else {
						throw new Error("没有请求的地址！");
						//$.ui.alert("没有请求的地址！");
					}
					return $.preventDefault(ol.evt);
				},
				_changeSucFunc : function(json) {
					if(json && json.code == "100000") {
						currentPage = currentPage + 1
						arrPageDom[currentPage] = json.data.html;
						_this.DOM.content.innerHTML = json.data.html;
						_this.DOM_eventFun.flushStatus();
					} else {
						$.ui.alert(json.msg);
					}
				}
			}
			//属性方法区
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
			if(_this.DOM.item){
				if(_this.DOM.item.length > 0){
					for(var i in _this.DOM.item){
						arrPageDom.push(_this.DOM.item[i].innerHTML);
					}
				} else {
					arrPageDom.push(_this.DOM.item.innerHTML);
				}
			}
			
			if(opts.maxPage == 'auto'){
				opts.maxPage = arrPageDom.length;
			}
			
			_this.DOM.content.innerHTML = arrPageDom[0];
			_this.DOM_eventFun.flushStatus();
		};
		//-------------------------------------------
		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		initPlugins = function(){
			_this.DEvent = $.delegatedEvent(node);
		};
		//-------------------------------------------
		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		bindDOM = function(){
			_this.DEvent.add("page_prev", "click", _this.DOM_eventFun.pagePrevFunc);
			_this.DEvent.add("page_next", "click", _this.DOM_eventFun.pageNextFunc);
			_this.DEvent.add("change", "click", _this.DOM_eventFun.changeFunc);
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
			_this.DEvent.destroy();
			arrDevent = null;
		};
		var AddDelegatedEvent  = function(actiontype, type, func) {
			arrDevent.push({
				'actiontype' : actiontype,
				'type'       : type
			});
			_this.DEvent.add(actiontype, type, _this.DOM_eventFun.pagePrevFunc);
		};
		var addExtraItems = function(html , type) {
			var div = $.C('div');
			div.innerHTML = html;
			var build = $.kit.dom.parseDOM($.builder(div).list);
			if(type == 'allInOne' && arrPageDom.length >= 2) {
				build.item && arrPageDom.splice(1 , arrPageDom.length - 1);
			}
			build.item && $.foreach(build.item , function(item) {
				arrPageDom.push(item.innerHTML);
			});
			opts.maxPage = arrPageDom.length;
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
		that.addDEvent = AddDelegatedEvent;
		that.getInner = function(){
			return _this.DOM.content;
		};
		that.getOuter = function()
		{
			return _this.DOM;
		};
		that.addExtraItems = addExtraItems;
		//-------------------------------------------
		return that;

	};
});
