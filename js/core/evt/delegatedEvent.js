/**
 * 通过冒泡的方式做的事件代理对象
 * 
 * @id STK.core.evt.delegatedEvent
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @version 1.0
 * @import STK.core.dom.isNode
 * @import STK.core.dom.contains
 * @import STK.evt.addEvent
 * @import STK.evt.fixEvent
 * @param {Element} actEl
 * @param {Array} expEls
 * @return {delegatedEvent Object}
 * 	{
 * 		add : function,
 * 		remove : function
 * 		pushExcept : function
 * 		destroy : function
 * 	}
 */
$Import("core.json.queryToJson");
$Import('core.dom.isNode');
$Import('core.dom.sizzle');
$Import('core.dom.contains');
$Import('core.evt.addEvent');
$Import('core.evt.removeEvent');
$Import('core.evt.fixEvent');
$Import('core.arr.isArray');
$Import('core.obj.isEmpty');
$Import('core.func.empty');
STK.register('core.evt.delegatedEvent',function($){
	
	var checkContains = function(list,el){
		for(var i = 0, len = list.length; i < len; i += 1){
			if($.core.dom.contains(list[i],el)){
				return true;
			}
		}
		return false;
	};
	
	return function(actEl,expEls){
		if(!$.core.dom.isNode(actEl)){
			throw 'core.evt.delegatedEvent need an Element as first Parameter';
		}
		if(!expEls){
			expEls = [];
		}
		if($.core.arr.isArray(expEls)){
			expEls = [expEls];
		}
		var evtList = {};
		var bindEvent = function(e){
			var evt = $.core.evt.fixEvent(e);
			var el = evt.target;
			var type = e.type;
			var changeTarget = function(){
				var path, lis, tg;
				path = el.getAttribute('action-target');
				if(path){
					lis = $.core.dom.sizzle(path, actEl);
					if(lis.length){
						tg = evt.target = lis[0];
					}
				};
				changeTarget = $.core.func.empty;
				return tg;
			};
			var checkBuble = function(){
				var tg = changeTarget() || el;
				if(evtList[type] && evtList[type][actionType]){
					return evtList[type][actionType]({
						'evt' : evt,
						'el' : tg,
						'box' : actEl,
						'data' : $.core.json.queryToJson(tg.getAttribute('action-data') || '')
					});
				}else{
					return true;
				}
			};
			if(checkContains(expEls,el)){
				return false;
			}else if(!$.core.dom.contains(actEl, el)){
				return false;
			}else{
				var actionType = null;
				while(el && el !== actEl){
					actionType = el.getAttribute('action-type');
					if(actionType && checkBuble() === false){
						break;
					}
					el = el.parentNode;
				}
				
			}
		};
		var that = {};
		/**
		 * 添加代理事件
		 * @method add
		 * @param {String} funcName
		 * @param {String} evtType
		 * @param {Function} process
		 * @return {void}
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'),$.E('inner'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 *
		 */
		that.add = function(funcName, evtType, process){
			if(!evtList[evtType]){
				evtList[evtType] = {};
				$.core.evt.addEvent(actEl, evtType, bindEvent);
			}
			var ns = evtList[evtType];
			ns[funcName] = process;
		};
		/**
		 * 移出代理事件
		 * @method remove
		 * @param {String} funcName
		 * @param {String} evtType
		 * @return {void}
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'),$.E('inner'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.remove('alert','click');
		 */
		that.remove = function(funcName, evtType){
			if(evtList[evtType]){
				delete evtList[evtType][funcName];
				if($.core.obj.isEmpty(evtList[evtType])){
					delete evtList[evtType];
					$.core.evt.removeEvent(actEl, evtType, bindEvent);
				}
			}
		};
		
		/**
		 * 添加略过节点
		 * @method pushExcept
		 * @param {Node} el
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.pushExcept($.E('inner'));
		 */
		that.pushExcept = function(el){
			expEls.push(el);
		};
		
		/**
		 * 移出略过节点
		 * @method removeExcept
		 * @param {Node} el
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.pushExcept($.E('inner'));
		 * 		a.removeExcept($.E('inner'));
		 */
		that.removeExcept = function(el){
			if(!el){
				expEls = [];
			}else{
				for(var i = 0, len = expEls.length; i < len; i += 1){
					if(expEls[i] === el){
						expEls.splice(i,1);
					}
				}
			}
			
		};
		/**
		 * 晴空略过节点
		 * @method clearExcept
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.pushExcept($.E('inner'));
		 * 		a.clearExcept();
		 */
		that.clearExcept = function(el){
			expEls = [];
		};
		
		that.destroy = function(){
			for(k in evtList){
				for(l in evtList[k]){
					delete evtList[k][l];
				}
				delete evtList[k];
				$.core.evt.removeEvent(actEl, k, bindEvent);
			}
		};
		return that;
	};
});