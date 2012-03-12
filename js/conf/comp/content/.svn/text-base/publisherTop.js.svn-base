/**
* pulbisherTop组件
* 这里列出了一个publisherTop comp层 需要实现的方法
* @id STK.comp.content.publisherTop
* @author WK | wukan@staff.sian.com.cn
* @param {Object} node 组件最外节点
* @param {Object} options 配置 
* @return {Object} 实例 
* @example 
* 暂略
*/
$Import('module.getDiss');
$Import('ui.alert');
$Import('module.layer');
$Import('common.trans.editor');
$Import('common.trans.feed');
$Import('common.trans.forward');
$Import('common.channel.feed');
$Import('common.channel.insertTopic');
$Import('kit.dom.parseDOM');
$Import('kit.dom.layoutPos');
$Import('kit.extra.language');
$Import('common.dialog.publish');
$Import('common.guide.util.tipLayer');
$Import('common.editor.service.base');
$Import('common.extra.shine');
$Import('common.dialog.validateCode');
$Import('common.editor.plugin.publishTo');
$Import('common.layer.ioError');

STK.register("comp.content.publisherTop", function($) {
	//---常量定义区---------------------------------- 
	var addEvent = $.core.evt.addEvent;
	var custEvent = $.core.evt.custEvent;
	var getStyle = $.core.dom.getStyle;
	var setStyle = $.core.dom.setStyle;
	var ajax = $.core.io.ajax;
	var $L = $.kit.extra.language;
	var $T = $.core.util.templet;
	var $ET = $.core.util.easyTemplate;
	var FORBIDDENWORDS = ['#在这里输入你想要说的话题#'];
	//-------------------------------------------

	return function(node,opts) {
		var that = {};

		//---变量定义区----------------------------------
		//----------------------------------------------
		/**
		 * publishTo是发布定向控件 
		 */
		var baseEditor,nodes,isPublishAvailable,editor,validateTool,clock,publishTo;

		var custFuncs = {
			restore : function(){
				var word = STK.core.util.storage.get('publisherTop_word'+$CONFIG.uid);
				if(word != 'null' && word != null && word.length!=0){
					return word;
				}else{
					return false;
				}
			},
			store : function(){
				var words = editor.API.getWords();
				if(typeof option.tipText != 'undefined' && words == option.tipText)return;
				STK.core.util.storage.set('publisherTop_word'+$CONFIG.uid,words);
			},
			delWord : function(){
				STK.core.util.storage.del('publisherTop_word'+$CONFIG.uid);
			},
			
			filterWords : function(){
				var _s = editor.API.getWords();
				for(var i=0,l=FORBIDDENWORDS.length;i<l;i++){
					var _b =_s.replace(new RegExp(FORBIDDENWORDS[i],"g"),'');
				}
				return _b;
			},
			enableEditor : function(editorNode) {
				editorNode.isSending = false;
				$.core.dom.removeClassName(nodes.publishBtn , "disable");
			},
			disableEditor : function(editorNode) {
				editorNode.isSending = true;
				$.core.dom.addClassName(nodes.publishBtn , "disable");
			}
		};
		
		/**
		 * recTopic
		 */
		var recTopic = {
			cache        : null,
			timeout      : 30,
			displayTime  : 1500,
			loading      : false,
			last         : '',
			lsn          : null,
			TEMP         : $L('<a href="#{URL}" target="_blank" class="normal" suda-data="key=issu_guide&value=open">#{CONTENT}</a> <a href="#{URL}" class="W_linka" target="_blank" suda-data="key=issu_guide&value=to_see">#L{去看看}&raquo;</a>'),
			layer        : $.module.layer('<div class="layer_tips" style="display:none" node-type="outer"><div node-type="inner"></div><a node-type="close" class="W_close_color" href="#" onclick="return false;" suda-data="key=issu_guide&value=close"></a><span node-type="arrow"></span></div>'),
			closeBtn     : null,
			//--- method ----------------------------------
			init : function(){
				nodes.wrap.appendChild(recTopic.layer.getOuter());
				recTopic.closeBtn = recTopic.layer.getDom('close');
				
				var tipLayer = $.common.guide.util.tipLayer();
				var opt = {
					target : nodes.textEl,
					layer  : recTopic.layer.getOuter(),
					pos    : "top",
					arrow  : recTopic.layer.getDom("arrow")
				};
				var pos = tipLayer.getLayerPosition(opt.target, opt.layer, opt.pos, opt.arrow);
				pos.arrow.left = '30px';
				pos.left = 0;
				pos.top = -5;
				tipLayer.setPosition(opt, pos);
				recTopic.layer.hide();
				$.setStyle(opt.layer, 'position', 'absolute');
				$.setStyle(opt.layer, 'width', 'auto');
				$.setStyle(opt.layer, 'paddingRight', '20px');
				
				addEvent(recTopic.closeBtn, 'click', recTopic.close);
				
				tipLayer = null;
			},
			getTs : function(){
				return Date.parse(new Date()) / 1000;
			},
			show : function(conf){
				recTopic.layer.html($T(recTopic.TEMP, {
					URL     : conf.url,
					CONTENT : conf.text
				}));
				
				var outer = recTopic.layer.getOuter();
				if(outer.style.display == '') return;
				recTopic.layer.show();
				$.setStyle(outer, 'opacity', 0);
				$.setStyle(outer, 'top', 0);
				$.core.ani.tween(outer, {
					'duration' : 500,
					'end' : function(){
						$.setStyle(outer, 'filter', '');
					}
				}).play({'opacity':1, 'top':-10}).destroy();
			},
			match : function(){
				var data = recTopic.getData();
				if(data && data["data"]){
					data = data["data"];
					for(var key in data){
						if( recTopic.last.indexOf(data[key].key) > -1 ){	
							recTopic.show(data[key]);
							break;
						}
					}
				}
			},
			getData : function(){
				if(!recTopic.cache){
					//console.log("缓存空");
					recTopic.cache = $.storage.get('suggest-topic-data');
					if(!recTopic.cache || recTopic.cache === 'null'){
						recTopic.cache = null;
						//console.log("local空");
					} else {
						recTopic.cache = $.core.json.strToJson(recTopic.cache);
						//console.log("local有值");
					}
				}
				//console.log(recTopic.cache.data[0].key);
				var ts = recTopic.getTs();
				if( !recTopic.cache || !recTopic.cache["timeout"] || (recTopic.cache && recTopic.cache["timeout"] < ts) ){
					//console.log("local、缓存过期");
					if(recTopic.loading) return;
					recTopic.loading = true;
					$.common.trans.editor.getTrans('rectopic', {
						onComplete : function(ret, data) {
							if(ret && ret["code"] == "100000"){
								var st = {
									timeout : ts + recTopic.timeout,
									data    : ret.data
								};
								$.storage.set('suggest-topic-data', $.core.json.jsonToStr(st));
								recTopic.cache = st;
							}
							recTopic.loading = false;
						}
					}).request();
				}
				return recTopic.cache;
			},
			autoDisplay : function(currentWords){
				if(recTopic.last !== currentWords){
					recTopic.lsn && clearTimeout(recTopic.lsn);
					recTopic.lsn = setTimeout(recTopic.match, recTopic.displayTime);
					recTopic.last = currentWords;
				}
			},
			close : function(){
				recTopic.layer.hide();
				editor.API.focus(); //焦点返回
				$.core.evt.preventDefault();
			},
			destory : function(){
				$.removeEvent(recTopic.closeBtn, 'click', recTopic.close);
				recTopic = null;
			}
		};
				
		var bindHotKey = function(){
			$.common.extra.shine(editor.nodeList.textEl);
			editor.API.focus();
		};
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {		
			publishBtn : function(){
				var editorNode = editor.nodeList.textEl;
				$.preventDefault();
				if(editorNode.isSending) {
					return false;					
				}
				if(!isPublishAvailable){
					$.common.extra.shine(editorNode);
					return;
				}
				editor.API.disableEditor(true);
				custFuncs.disableEditor(editorNode);
				var text = editor.API.getWords();
				//var extra = editor.API.getExtra();
				var pid = editor.API.getExtra();
				var rank = publishTo.rank(); //发布导向
				var trans = $.common.trans.feed;
				var onSuccess = function(ret, params){
					//alert(ret.data.html);
					//$.common.listener.fire('common.channel.feed','publish',ret.data.html);
					$.common.channel.feed.fire('publish', ret.data.html);
					$.custEvent.fire(window.$CONFIG || {} , "publish" , {'params' : params , 'ret' : ret});
					editor.nodeList.successTip.style.display = '';
					setTimeout(function(){
						editor.nodeList.successTip.style.display = 'none';
						editor.API.disableEditor(false);
						editorNode.isSending = false;
						bindCustEvtFuns.checkText();
					},2*1000);
					editor.API.reset();
					//editor.API.closeWidget();
					custFuncs.delWord();
					baseEditor.closeWidget();
					//alert('发布信道:common.channel.feed : publish');
					isPublishAvailable = false;
					$.core.dom.addClassName(nodes.publishBtn , "disable");
					publishTo.reset();
				}
				var onError = function(ret, params){
					ret.msg = ret.msg||$L("操作失败");
					$.common.layer.ioError(ret.code,ret);
//					$.ui.alert(ret && ret.msg || $L("操作失败"));
					editor.API.disableEditor(false);
					custFuncs.enableEditor(editorNode);
				};
				var getParams = function() {
					return {
						text   : text,
						pic_id : pid,
						rank   : rank
					};
				};
				var t = trans.getTrans('publish',{
					onComplete : function(ret , data) {
						var bigObj =  {
							onSuccess : onSuccess,
							onError : onError,
							requestAjax : t,
							param : getParams(),
							onRelease : function() {
								editor.API.disableEditor(false);
								custFuncs.enableEditor(editorNode);			
							}
						};
						//加入验证码检查机制，参见$.common.dialog.validateCode
						validateTool.validateIntercept(ret , data ,bigObj);
					},
					onFail : onError,
					onTimeout : onError
				});
				t.request($.module.getDiss(getParams(), nodes.publishBtn));
				
				//提交后行为
				//STLastWords = text;
				//custFuncs.matchSuggest();
			},
			hotKey : function(e){
				var ev = $.core.evt.fixEvent(e);
				if(ev.ctrlKey && ev.keyCode == 13 || ev.ctrlKey && ev.keyCode == 10){
					bindDOMFuns.publishBtn();
				}
			}
		};
		//-------------------------------------------
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			checkText : function(isDomLoadCall){
				if(!editor)return;
				custFuncs.store();
				var words = custFuncs.filterWords();
				//var words = editor.API.getWords();
				var count = editor.API.count();
				//console.log(1);
				var diff = option.limitNum - count;
				var key = diff>=0?true:false;
				//console.log('count',count,key,words.length);

				var normalTxt = $L('#L{请文明发言，还可以输入}<span>' + (diff) + '</span>#L{字}');
				var overTxt = $L('#L{请文明发言，已经超过}<span class="W_error">' + Math.abs(diff) + '</span>#L{字}');

				if(count > 0 && words != 0){//如果有值输入并且有效
					if(key){//都正常
						$.core.dom.removeClassName(nodes.publishBtn,'disable');
						isPublishAvailable = true;
						if(isDomLoadCall) {
							editor.API.textElFocus();
						}
						nodes.num.innerHTML = normalTxt;
					}else{//超过
						$.core.dom.addClassName(nodes.publishBtn,'disable');
						isPublishAvailable = false;
						if(isDomLoadCall) {
							editor.API.textElFocus();
						}
						nodes.num.innerHTML =  overTxt;
					}
					/**
					 * 发布引导，进行有效性输入检验，符合条件才发起事件。
					 */
					recTopic.autoDisplay(words);
				}else{//没有字符或者只有空话题
					$.core.dom.addClassName(nodes.publishBtn,'disable');
					isPublishAvailable = false;
					nodes.num.innerHTML = normalTxt;
				}
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
		var init = function() {
			argsCheck();
			parseDOM();
			bindDOM();
			initPlugins();
			bindCustEvt();
			bindListener();
			$.Ready(function() {
				bindCustEvtFuns.checkText(true);
			});
			//$.log('finish');
			//custFuncs.restore();
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		* 参数的验证方法
		* @method init
		* @private
		*/
		var argsCheck = function() {
			if(!node) throw "node is not defined";
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
			nodes = $.kit.dom.parseDOM($.core.dom.builder(node).list);
			/*nodes = {
				publishBtn : $.core.dom.sizzle('[node-type="publishBtn"]',node)[0],
				wrap : $.core.dom.sizzle('[node-type="wrap"]',node)[0],
				textEl : $.core.dom.sizzle('[node-type="textEl"]',node)[0],

				}*/
				if(!nodes.publishBtn) throw "can not find nodes in comp.content.publisherTop";
		};
		//-------------------------------------------
		
		
		
		//---模块的初始化方法定义区-------------------------
		/**
		* 模块的初始化方法
		* @method initPlugins
		* @private
		*/
		var initPlugins = function() {
			//初始化发布器及发布器组件
			baseEditor = $.common.editor.service.base(node,option);
			editor = baseEditor.editor;
			//热键
			$.hotKey.add(document.documentElement , ['f'] , bindHotKey , {type : 'keyup' , 'disableInInput' : true});
			$.hotKey.add(document.documentElement , ['p'] , bindHotKey , {type : 'keyup' , 'disableInInput' : true});
			//add by zhaobo 201109071748 fix begin req-8677
			if($CONFIG['afterupgrade'] == "true") {
				//var pid = "6b888227jw1dky3tgv7zgj";
				var pid = "6b888227jw1dm6730omlvj";
				var publish = $.common.dialog.publish({
					'styleId':'1',
					'picBtn' : false
				});
				publish.show({
					'title':$L('#L{快把升级新版的好消息分享给大家吧}'),
					'content':$L('#L{[话筒]#新版微博#开放升级啦。我已经抢“鲜”体验，新版很给力、功能很强大，新鲜应用、热门游戏应有尽有，两栏、三栏版本自由切换。hold不住了吧？你也来升级吧，不用邀请码哦。}http://weibo.com/new')
				});
				publish.addExtraInfo("pic_id=" + pid);
			}
			//add by zhaobo 201109071748 fix end
			
			/**
			 * 引导层
			 */
			recTopic.init();
			/**
			 * 定向发布
			 */
			publishTo = $.common.editor.plugin.publishTo({
				editorWrapEl : node,
				textEl : nodes.textEl
			});
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		* DOM事件绑定方法
		* @method bindDOM
		* @private
		*/
		var bindDOM = function() {
			addEvent(nodes.publishBtn,'click',bindDOMFuns.publishBtn);
			addEvent(nodes.textEl,'keypress',bindDOMFuns.hotKey);
			addEvent(nodes.textEl,'focus',function(){
				clock = setInterval(function(){
					bindCustEvtFuns.checkText();
				},200);
				
				recTopic.getData();
				
				//如果无值，清除弹出框
				if( 0 == custFuncs.filterWords() ){
					recTopic.close();
				}
			});
			addEvent(nodes.textEl,'blur',function(){
				clearInterval(clock);
			});
			
			//addEvent(nodes.textEl,'keydown', STLayer.hide);
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		* 自定义事件绑定方法
		* @method bindCustEvt
		* @private
		*/
		/*var defineEvt = function(){
			//custEvent.define(editor,'textNum');
			//custEvent.define(editor,'blur');
			//custEvent.define(editor,'focus');
		};*/
		var bindCustEvt = function() {
			//defineEvt();
			//custEvent.add(editor,'textNum',bindCustEvtFuns.publishBtn);
			//custEvent.add(editor,'blur',bindCustEvtFuns.editorBlur);
			//custEvent.add(editor,'focus',bindCustEvtFuns.editorFocus);
		};
		
		//-------------------------------------------
		//任务系统 相应功能
		var scrollToTop=function(){
			document.body.scrollIntoView();
			return false;
		};
		var insertTopic = function(text){
			var textEl = editor.nodeList.textEl;
			var textVal = textEl.value;
			var textLen = text.length-2;
			scrollToTop();
			if(textVal.indexOf(text) != -1){
				var index = textVal.indexOf(text);
				$.kit.extra.textareaUtils.setCursor(textEl,index+1,textLen);
			}else{
				editor.API.insertText(text);
				var end = $.kit.extra.textareaUtils.getCursorPos(textEl);
				$.kit.extra.textareaUtils.setCursor(textEl,end-(textLen+1),textLen);
			}
		};	
		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {
			$.common.channel.insertTopic.register('insert',insertTopic);
		};
		//-------------------------------------------

		//---组件公开方法的定义区---------------------------
		/**
		* 组件销毁方法
		* @method destroy
		*/
		var destroy = function() {
			validateTool && validateTool.destroy && validateTool.destroy();
			recTopic.destory();
			baseEditor.destory();
			publishTo && publishTo.destroy && publishTo.destroy();
		};
		var API = {
		};
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		
		//-------------------------------------------
		var option = {
			//plugin:['smiley','','count'],
			limitNum:140,
			flex:true,
			count:'disable',
			//tipText:'rrrrrrrrrrrrr',
			storeWords : custFuncs.restore()
		};
		opts.trans = $.common.trans.feed;
		validateTool = $.common.dialog.validateCode();

		init();


	return that;
	};
	
});
