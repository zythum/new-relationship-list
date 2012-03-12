/**
 * 我的标签
 * 
 * @id STK.comp.content.myTags
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('ui.confirm');
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('common.layer.addTags');
$Import('common.trans.feed');
$Import('common.dialog.validateCode');
$Import('common.layer.ioError');

STK.register("comp.content.myTags", function($) {
	
	
	var $T = $.templet;
	var $L = $.kit.extra.language;
	
	//---常量定义区---------------------------------- 
	var TAG_TEMP = '<span><a href="http://s.weibo.com/user/&tag=#{url}" weight="#{weight}" tagid="#{tag_id}" class="ft12 ft_b">#{tag}</a></span>';
	
	var RECOMMENDTAGS_BUTTON_TEMP = '<a class="right" href="settings/tags" onclick="return false;" action-type="recommendTag">'+$L("#L{标签推荐}")+'</a>'
	var RECOMMENDTAGS_TEMP = $L("#L{将自己的标签生成一条微博，告诉给大家？}");
	var TAG_PUBLISH_TEMP = $L("#L{我给自己贴了}") + " #{content} " + $L("#L{标签}") + "。";
	var RECOMMENDTAGS_SUCCESS_TEMP = $L("#L{推荐成功！}");
	var RECOMMENDTAGS_PROBLEM_TEMP = $L("#L{不能重复推荐相同的的标签！}");
	//-------------------------------------------
	
	return function(node, opts) {
		
		
		//---变量定义区----------------------------------
		var that = {};
		var nodes, tagsList, dEvt, addTagsLayer, messageBox, lsner, recommendTagsLock = true , validateTool;
		var options = {
			limit :  10
		}
		
		var warn = function(message, spec){
			clearTimeout(lsner);
			messageBox = $.ui.alert(message, $.parseParam({icon:"success"}, spec || {}));
			lsner = setTimeout(function(){
				messageBox.dia.hide();
			}, 500);
		};
		
		var isTagsFull = function(){
			if(options.limit <= tagsList.length && nodes.addTag){
				var addTag = $.sizzle("[node-type=addTag]", node)[0];
				$.core.dom.next(addTag).style.display = "none";
				addTag.style.display = "none";
				return true;
			}
			return false;
		}
		
		var isTagsEmpty = function(){
			if(tagsList.length == 0){
				return true;
			}
		}
		
		/**
		 * 获取所有标签
		 */
		var getTags = function(){
			var tagList = $.sizzle("[node-type=tags_list] a");
			
			var tagName = [];
			for(var i in tagList){
				if( $.core.dom.isNode(tagList[i]) ){
					tagName.push(tagList[i].innerHTML);
				}
			}
			return tagName;
		}
		
		/**
		 * tag拼接
		 */
		var formatTags = function(){
			return '[TAG]' + getTags().join('[TAG]、[TAG]') + '[TAG]';
		}
		
		var highLight = function(coincidents){
			var elements = $.sizzle("a", nodes.tags_list);
			
			for(var i in coincidents){
				var el = elements[$.core.arr.indexOf(coincidents[i], tagsList)];
				$.core.dom.setStyle(el, 'backgroundColor', '#FFFF66');
				$.core.dom.setStyle(el, 'fontSize', '20px');
				$.core.dom.setStyle(el, 'fontWeight', 'bold');
			}
			
			setTimeout(function(){
				for(var i in elements){
					$.core.dom.setStyle(elements[i], 'backgroundColor', '');
					$.core.dom.setStyle(elements[i], 'fontSize', '');
					$.core.dom.setStyle(elements[i], 'fontWeight', '');
				}
			}, 1000);
		}
		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			recommendTagsDialog : function(){
				$.ui.confirm( RECOMMENDTAGS_TEMP, {
					"OK" : bindDOMFuns.recommendTags,
					"cancel" : function(){
						recommendTagsLock = true;
					}
				});
			},
			recommendTags : function(){
				var getParams = function() {
					return {
						text: $T( TAG_PUBLISH_TEMP, {content:formatTags()})
					};
				};
				var t = $.common.trans.feed.getTrans("publish", {
					'onComplete' : function(req , params) {
						var bigObj = {
							'onSuccess'  : bindDOMFuns.recommendTagsSuccess,
							'onError'    : bindDOMFuns.recommendTagsError,
							'requestAjax' : t,
							'param' : getParams()
						};
						//加入验证码检查机制，参见$.common.dialog.validateCode
						validateTool.validateIntercept(req , params , bigObj);
					}
				});
				t.request(getParams());
			},
			recommendTagsSuccess : function() {
				//warn(RECOMMENDTAGS_SUCCESS_TEMP);
				$.ui.litePrompt(RECOMMENDTAGS_SUCCESS_TEMP,{'type':'succM','timeout':'500'});
				recommendTagsLock = true;
			},
			recommendTagsError : function(req,params) {
				if(req.code == '100001') {
					warn(RECOMMENDTAGS_PROBLEM_TEMP, {icon:"warn"});
				}else{
					$.common.layer.ioError(req.code,req);
				}
				recommendTagsLock = true;
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			addTag : function(type, ret){
				var sTag = ret.data;
				if( sTag.length > 0 && !isTagsFull()){
					if( isTagsEmpty() ){
						nodes.tags_list.innerHTML = '';
						var tmp = $.sizzle.find('.title', node).set[0];
						tmp.innerHTML = RECOMMENDTAGS_BUTTON_TEMP + tmp.innerHTML;
					}
					var isCoincident = true;
					var coincidents = [];
					var _tpNpde = $.sizzle("[node-type=tags_list]")[0];
					for(var i in sTag){
						if( !$.inArray(sTag[i].tag, tagsList) ){
							sTag[i].url = encodeURIComponent(sTag[i].tag);

							_tpNpde.innerHTML = $T(TAG_TEMP, sTag[i]) + _tpNpde.innerHTML;
							
							tagsList.unshift(sTag[i].tag);
							
							isCoincident &= false;
							
							$.sizzle("[node-type=tags_count]")[0].innerHTML = '(' + tagsList.length + ')';

							isTagsFull();
							
						} else {
							coincidents.push(sTag[i].tag);
						}

						if(!isCoincident){
							addTagsLayer.hide();
						}
					}
					if(coincidents.length > 0){
						highLight(coincidents);
					}
					if(!recommendTagsLock){
						bindDOMFuns.recommendTagsDialog();
					}
					_tpNpde = null;
				}
			},
			highLight : highLight
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
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			options = $.parseParam(options, opts);
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM( $.core.dom.builder(node).list );
			tagsList = getTags();
			if(tagsList.length <= 0)
				recommendTagsLock = false;
			validateTool = $.common.dialog.validateCode();
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			isTagsFull();
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add("addTag", "click", function(){
				if(!addTagsLayer){
					addTagsLayer = $.common.layer.addTags({parent:node});
				}
				
				if(addTagsLayer.isOpened){
					addTagsLayer.hide();
				} else {
					addTagsLayer.show();
				}
			});
			dEvt.add("recommendTag", "click", bindDOMFuns.recommendTagsDialog);
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {
			$.custEvent.define(node, 'addTag');
			$.custEvent.add(node, 'addTag', bindCustEvtFuns.addTag);
		};
		//-------------------------------------------
		
		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {
			
		};
		//-------------------------------------------
		
		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			validateTool && validateTool.destroy && validateTool.destroy();
			dEvt = null;that = null;nodes = null;tagsList = null;
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		//-------------------------------------------
		
		return that;
	};
});
