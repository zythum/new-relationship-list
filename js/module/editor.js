/**
* Editor组件
* 这里列出了一个module editor 需要实现的方法
* @id STK.module.editor
* @author WK | wukan@staff.sian.com.cn
* @param {html/node} node 组件最外节点
* @param {Object} options 配置 
* @return {Object} 实例 
* @example 
* 暂略
*/
//$Import('module.editorPlugin.plugin');
$Import('kit.dom.parseDOM');
$Import('kit.extra.textareaUtils');
$Import('kit.extra.count');

STK.register("module.editor", function($) {

	//---常量定义区---------------------------------- 
	//todo 定义事件名称

	var addEvent = $.core.evt.addEvent;
	var custEvent = $.core.evt.custEvent;
	var getStyle = $.core.dom.getStyle;
	var setStyle = $.core.dom.setStyle;
	//-------------------------------------------

	return function(node,options) {
		var that = {};
		var options = options;

		//---变量定义区----------------------------------
		//----------------------------------------------
		var nodes={};
		//var plugins;
		var custFuncs = {
			//重置发布器为初始状态
			reset:function(){
				//$.core.dom.selector(viewObj.poster_msg).hidd();
				nodes.textEl.value='';
				//nodes.textEl.focus();
				$.core.evt.custEvent.fire(that,'changed');
				nodes.textEl.removeAttribute('extra');
			},
			delWords : function(value){
				var old = custFuncs.getWords();
				if(old.indexOf(value)>-1){
					nodes.textEl.value='';
					bindCustEvtFuns.textInput(old.replace(value,''));
				}else{return false;}
			},
			getWords : function(){
				return $.core.str.trim(nodes.textEl.value);
			},
			getExtra : function(){
				var submitStr;
				var pid = nodes.textEl.getAttribute('extra') || '';
				if(pid != null){
					submitStr = $.core.str.trim(pid);
				}
				return submitStr;
			},
			focus : function(start,len){
				if(typeof start != 'undefined'){
					$.kit.extra.textareaUtils.setCursor(nodes.textEl,start,len);
				}else{
					var end = nodes.textEl.value.length;
					$.kit.extra.textareaUtils.setCursor(nodes.textEl,end);
				}
				bindDOMFuns.cacheCurPos();
			},
			blur : function(){
				nodes.textEl.blur();
			},
			addExtraInfo : function(data){
				if(typeof data == 'string'){
					nodes.textEl.setAttribute('extra',data);
				}
			},
			disableEditor : function(t){
				$.core.evt.removeEvent(nodes.textEl,'mouseup',bindDOMFuns.cacheCurPos);
				if(t===true){
					nodes.textEl.setAttribute('disabled','disabled');
				}else{
					$.core.evt.addEvent(nodes.textEl,'mouseup',bindDOMFuns.cacheCurPos);
					nodes.textEl.removeAttribute('disabled');
				}
			},
			getCurPos : function(){
				var range = nodes.textEl.getAttribute('range')||'0&0';
				return range.split('&');
			},
			count : function(){
				var str = ($.core.str.trim(nodes.textEl.value).length == 0)?$.core.str.trim(nodes.textEl.value):nodes.textEl.value;
				return $.kit.extra.count(str);
			}

		};

		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {		
			textElFocus : function(){
				//隐藏大家来造句
				if(nodes.recommendTopic){
					$.core.dom.setStyle(nodes.recommendTopic,'display','none');
				}
				$.custEvent.fire(that,'focus');

				if(nodes.num){
					$.core.dom.setStyle(nodes.num,'display','block');
				}
				if(custFuncs.getWords() == options.tipText){
					custFuncs.delWords(options.tipText);
				}
			},
			textElBlur : function(){//todo 伸缩应该放在comp层做
				//var ev = STK.core.evt.getEvent();
				//$.log(STK.core.evt.getEvent());
				//$.log(STK.core.evt.hitTest($.sizzle('[node-type="widget"]')[0],ev));
				setTimeout(function(){ //blur事件发生时可能需要插入发布器文字，如果马上检测字数，就不正确

					if(nodes.textEl.value.length === 0){
						if(nodes.recommendTopic)
							$.core.dom.setStyle(nodes.recommendTopic,'display','block');
						if(nodes.num && nodes.recommendTopic)
							$.core.dom.setStyle(nodes.num,'display','none');
						$.custEvent.fire(that,'blur');
						
						if(typeof options.tipText != 'undefined'){
							//bindCustEvtFuns.textInput(options.tipText);//不能使用textInput，因为ie下会触发focus
							nodes.textEl.value = options.tipText;
						}

					}
				},50);

			},
			cacheCurPos : function(){
				//$.log($.getEvent());
				var selValue = $.kit.extra.textareaUtils.getSelectedText(nodes.textEl);
				var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
				var start = $.kit.extra.textareaUtils.getCursorPos(nodes.textEl);
				
				var curStr = start + '&' + slen;
				nodes.textEl.setAttribute('range',curStr);
			}
		};

		//-------------------------------------------

		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			//changed事件
			textChanged : function(){
				//点亮或grey out发布按钮
				//STK.core.evt.fireEvent(nodes.textEl,'keyup');
				$.custEvent.fire(that,'keyUpCount');
			},

			//input事件
			textInput : function(_words,pos){
				var cur = custFuncs.getCurPos();
				var pos = cur[0];
				var len = cur[1];
				//$.log('del default',custFuncs.getWords(),options.tipText,_words);
				//$.log('sssssssssssss = '+pos);
				if(custFuncs.getWords() == options.tipText && _words != options.tipText){
					//$.log('del default');
					custFuncs.delWords(options.tipText);
				}
				
				
				//if(typeof pos == 'undefined')
				//	pos = $.kit.extra.textareaUtils.getCursorPos(nodes.textEl) || 0;
				//$.log('pos ',pos,len);
				//$.log(nodes.textEl.getAttribute('range'));
				$.kit.extra.textareaUtils.unCoverInsertText(nodes.textEl,_words,{'rcs':cur[0],'rccl':cur[1]});
				//$.log(nodes.textEl.getAttribute('range'));
				bindDOMFuns.cacheCurPos();
				//$.log(nodes.textEl.getAttribute('range'));
				//$.kit.extra.textareaUtils.insertText(nodes.textEl,_words,pos,len);
				
				$.core.evt.custEvent.fire(that, 'changed');
				//$.log('2',custFuncs.getWords());
			}
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
		var checker = function(){
			argsCheck();
			parseDOM();
		};
		var init = function() {
			bindDOM();
			bindCustEvt();
			bindListener();
			initialize();
			//initPlugins();
			//return nodes;
		};
		var initialize= function(){
			//初始化tip文字或者本地存储文字
			//$.log(options.storeWords,options.tipText);
			if(options.storeWords){
				if(nodes.textEl.value.length == 0){//php填文本框的时候会自动带着上次的文本
					bindCustEvtFuns.textInput(options.storeWords);
				}
				return;
			}
			if(options.tipText){
				nodes.textEl.value = options.tipText;
			}
			//bindDOMFuns.cacheCurPos();
		};
		//-------------------------------------------

		//---参数的验证方法定义区---------------------------
		/**
		* 参数的验证方法
		* @method init
		* @private
		*/
		var argsCheck = function() {
			if(!node) throw "node is not defined in module editor";
		};

		//-------------------------------------------

		//---Dom的获取方法定义区---------------------------
		/**
		* Dom的获取方法
		* @method parseDOM
		* @private
		*/
		var parseDOM = function() {
			//内部dom规则

			var _nodelist = $.core.dom.builder(node).list;
			/*for(var a in _nodelist){//todo if[a][0]就取[0]
				nodes[a] = _nodelist[a][0];
				}*/
				nodes = $.kit.dom.parseDOM(_nodelist);
				if(!nodes.widget) throw "can not find nodes.widget in module editor";
		};
		//-------------------------------------------



		//---模块的初始化方法定义区-------------------------

		//-------------------------------------------

		//---DOM事件绑定方法定义区-------------------------
		/**
		* DOM事件绑定方法
		* @method bindDOM
		* @private
		*/
		var bindDOM = function() {
			$.core.evt.addEvent(nodes.textEl,'focus',bindDOMFuns.textElFocus);
			$.core.evt.addEvent(nodes.textEl,'blur',bindDOMFuns.textElBlur);
			$.core.evt.addEvent(nodes.textEl,'mouseup',bindDOMFuns.cacheCurPos);
			$.core.evt.addEvent(nodes.textEl, 'keyup',bindDOMFuns.cacheCurPos);
			
		};
		//-------------------------------------------

		//---自定义事件绑定方法定义区------------------------
		/**
		* 自定义事件绑定方法
		* @method bindCustEvt
		* @private
		*/
		var defineEvt = function(){
			//$.core.evt.custEvent.define(that, "input");
			$.core.evt.custEvent.define(that, "changed");
		};
		var bindCustEvt = function() {
			defineEvt();
			$.core.evt.custEvent.add(that, "changed", bindCustEvtFuns.textChanged);
			//$.core.evt.custEvent.add(that, "input",bindCustEvtFuns.textInput);	
		};

		//-------------------------------------------

		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {

		};
		//-------------------------------------------
		//init();

		//---组件公开方法的定义区---------------------------
		/**
		* 组件销毁方法
		* @method destroy
		*/
		var destroy = function() {

		};
		//init();
		checker();
		var API = {
			reset:custFuncs.reset,
			getWords : custFuncs.getWords,
			getExtra : custFuncs.getExtra,
			delWords : custFuncs.delWords,
			//closeWidget : plugins.close,
			focus : custFuncs.focus,
			blur : custFuncs.blur,
			insertText : bindCustEvtFuns.textInput,
			check : bindCustEvtFuns.textChanged,
			addExtraInfo : custFuncs.addExtraInfo,
			disableEditor : custFuncs.disableEditor,
			getCurPos : custFuncs.getCurPos,
			count : custFuncs.count,
			textElFocus : bindDOMFuns.textElFocus,
			cacheCurPos : bindDOMFuns.cacheCurPos
		};
		//-------------------------------------------

		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		that.API = API;
		that.nodeList = nodes;
		that.init = init;
		that.opts = options;
		//-------------------------------------------

		return that;
	};

});
