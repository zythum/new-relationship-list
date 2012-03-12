/**
 * common.editor.plugin.publishTo
 * @id STK.common.editor.plugin.publishTo
 * @author Lianyi | lianyi@staff.sina.com.cn
 * @example
 * 
*/
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');

STK.register('common.editor.plugin.publishTo', function($){
	/**
	 * 一开始加载的时候添加到document.body的下拉模板 
	 */
	var LISTTPL = '<div style="position: absolute;display:none;z-index:99;" node-type="publishTo" class="layer_menu_list">' + 
						'<ul>' + 
							'<li node-type="hotKeyItem"><a title="#L{公开-你发表的微博可以被大家公开查看哦}" suda-data="key=tblog_edit_exposure&value=edit_public" href="javascript:void(0)" action-data="rank=all" action-type="publishTo"><img class="i_conn_public" alt="#L{公开}" src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif"> #L{公开}</a></li>' +
							'<li node-type="hotKeyItem"><a title="#L{私密-发表的微博只有自己才能看到}" suda-data="key=tblog_edit_exposure&value=edit_private" href="javascript:void(0)" action-data="rank=self" action-type="publishTo"><img class="i_conn_private" alt="#L{私密}" src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif"> #L{私密}</a></li>' + 
							'<!--<li><a action-type="publishTo" action-data="rank=mefollow" href="javascript:void(0)" onclick="return false" >#L{我关注的人}</a></li>' + 
							'<li><a action-type="publishTo" action-data="rank=evenfollow" href="javascript:void(0)" onclick="return false" >#L{双向关注}</a></li>' + 
							'<li class="line"></li>' + 
							'<li><a action-type="publishTo" action-data="rank=weiqun" href="javascript:void(0)" onclick="return false" >#L{发到微群}</a></li>-->' + 
						'</ul>' + 
					'</div>';
	var $L = $.kit.extra.language;
	/**
	 * editorWrapEl 是发布器框架的node节点，需要进行builder操作，保存nodes节点
	 */
	return function(spec) {
		/**
		 * bindBody用来绑定body的click时候定向发布隐藏
		 */
		var publishTo , nodes , publishToUtil , editorWrapEl = spec && spec.editorWrapEl, textEl = spec && spec.textEl , that = {} , hotKeyArray = [] , bindBody;
		
		var argsCheck = function() {
			if(!$.isNode(editorWrapEl)) {
				throw 'publishTo need a wrapper node to parseDOM';				
			}
		};
		
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.builder(editorWrapEl).list);
		};
				
		var initPlugin = function() {
			
			publishTo = (function(){
			
				var dEvt = {},
					currentRank,
					currentWeiqun,
					publishToBtnCon,
					publishToBtnDef;
					
					dEvt.node = $.core.evt.delegatedEvent(editorWrapEl);
				
				var TEMP = {
					WEIQUN : '<#et tname data>' + 
						'<ul>' +
							'<li><a href="javascript:void(0)" onclick="return false;" action-type="back">返回</a></li>' +
							'<li class="line"></li>' +
						'</ul>' +
						'<ul#{SCROLLBAR}>' +
							'<#list data as list>'+
							'<li>' +
								'<a action-type="toWeiqun" action-data="gid=${list.gid}" href="javascript:void(0);" onclick="return false;">${list.g_name}</a>' +
							'</li>' +
							'</#list>'+
						'</ul>' +
					'</#et>'
				};
				/**
				 * 事件绑定函数
				 * @param {Object} evt 事件对象
				 * @param {Object} keyParam 用户按下的键值
				 */
				var bindDOMFuns = {
					hotKeyChangeRank : function(evt , keyParam) {
						var arr = keyParam.match(/\d+/);
						if(arr && arr[0]) {
							that.changeRank(parseInt(arr[0] , 10));
						}
					}				
				};
				
				var bind = function(){
					dEvt.node.add("showPublishTo", "click", that.show);
					menu.normal.bind();
					menu.weiqun.bind();
					/**
					 * 绑定按下alt键的时候进行定向发布的下拉层中每一项的绑定，
					 * 按下alt + 1相当于点击第一项
					 * 按下alt + 2相当于点击第二项
					 * 按下alt + 3相当于点击第三项
					 */
					if($.isNode(textEl)) {
						/**
						 * 获取一共有几个下拉项
						 */
						var arr = $.builder(nodes.publishTo).list;
						if(arr.hotKeyItem && $.isArray(arr.hotKeyItem)) {
							var len = arr.hotKeyItem.length ;
							for(var i = 1 ; i <= len ; i++) {
								hotKeyArray.push('alt+' + i);								
							}
							$.hotKey.add(textEl , hotKeyArray , bindDOMFuns.hotKeyChangeRank);
						}
					}
				};
				
				var layer = {
					/**
					 * 设置发布定向下拉层的位置
					 */
					setPos : function() {
						$.kit.dom.layoutPos(nodes.publishTo, nodes.showPublishTo, {
							'offsetX' : -11,
							'offsetY' : 2
						});
					},
					init : function(){
						dEvt.layer = $.core.evt.delegatedEvent(nodes.publishTo);
					},
					show : function(){
						layer.setPos();
						$.setStyle(nodes.publishTo, 'display', '');
						if(!bindBody) {
							bindBody = 1;
							layer.bindBodyEvt();						
						}
					},
					hide : function(){
						$.setStyle(nodes.publishTo, 'display', 'none');
						if(bindBody) {
							bindBody = 0;
							layer.removeBodyEvt();		
						}
					},
					autoHide : function(evt){
						evt = $.core.evt.fixEvent(evt);
						if(nodes.showPublishTo === evt.target || $.core.dom.contains(nodes.showPublishTo, evt.target) || $.core.dom.contains(nodes.publishTo, evt.target)){
							return;
						}
						that.hide();
					},
					content : function(content){
						if(typeof content == "undefined"){
							return nodes.publishTo.innerHTML;
						} else {
							nodes.publishTo.innerHTML = content;
						}
					},
					bindBodyEvt : function() {
						$.addEvent(document.body, "click", layer.autoHide);						
					},
					removeBodyEvt : function() {
						$.removeEvent(document.body, "click", layer.autoHide);						
					}
				}
				
				var that = {
					show : function(){
						if(currentRank == 'weiqun'){
							menu.weiqun.show();
						} else {
							menu.normal.show();
						}
					},
					btnContent : function(conrtent){
						conrtent && (publishToBtnCon.innerHTML = conrtent);
					},
					btnTitle : function(title){
						title && (nodes.showPublishTo.setAttribute('title', title));
					},
					hide : function(){
						layer.hide();
					},
					toggle : function(){
						if(currentRank != "weiqun"){
							if(nodes.publishTo.style.display == 'none'){
								that.show();
							} else {
								that.hide();
							}
						}
					},
					rank : function(){
						return currentRank;
					},
					weiqun : function(){
						return currentWeiqun;
					},
					reset : function(){
						that.btnContent(publishToBtnDef.content);
						that.btnTitle(publishToBtnDef.title);
						currentRank = null;
						currentWeiqun = null;
					},
					destroy : function(){
						for(var i in dEvt){
							dEvt[i].destroy();
						}
						/**
						 * 删除绑定的按键
						 * 按下alt + 1相当于点击第一项
					 	 * 按下alt + 2相当于点击第二项
					 	 * 按下alt + 3相当于点击第三项
						 */
						hotKeyArray.length && $.hotKey.remove(textEl , hotKeyArray , bindDOMFuns.hotKeyChangeRank);
						$.removeNode(nodes.publishTo);
					},
					changeRank : function(index){
						index = index > 0 ? index - 1 : 0;
						var tg = $.sizzle('a[action-type="publishTo"]', nodes.publishTo)[index];
						if(tg){
							menu.normal.changeRank({
								'el' : tg,
								'data' : $.core.json.queryToJson(tg.getAttribute('action-data') || '')
							});
							/**
							 * 通过键盘按键进行操作 
							 */
							var sudaData = tg.getAttribute("suda-data");
							if(sudaData) {
								var arr = sudaData.match(/key=(.+?)&value=(.+)/);
								if(arr && arr.length === 3 && window.SUDA && window.SUDA.uaTrack) {
									window.SUDA.uaTrack(arr[1] , arr[2]);
								}						
							}
						}
					}
				}
				
				var menu = {
					normal : {
						bind : function(){
							dEvt.layer.add("publishTo", "click", menu.normal.changeRank);
						},
						getList : function(){
							if(!menu.normal["cache"]){
								menu.normal.cache = layer.content();
							} else {
								layer.content(menu.normal.cache);
							}
						},
						show : function(){
							menu.normal.getList();
							layer.show();
						},
						changeRank : function(ret){
							$.preventDefault(ret.evt);
							currentRank = ret.data.rank;
							that.btnContent(ret.el.innerHTML);
							that.btnTitle(ret.el.getAttribute('title'));
							if(currentRank == "weiqun"){
								menu.weiqun.show();
							} else {
								that.hide();
							}
						}
					},
					weiqun : {
						bind : function(){
							dEvt.layer.add("back", "click", menu.weiqun.back);
						},
						getList : function(){
							if(!menu.weiqun["cache"]){
								var onError = function(){
									//layer.content("载入失败，刷新");
								};
								$.common.trans.forward.getTrans("microgroupList", {
									onComplete : function(ret, data){
										var content = '';
										if(ret && ret["code"] == '100000'){
											content = $T(TEMP.WEIQUN, {SCROLLBAR : ret.data.length < 10 ? '' : 'scroll_bar'});
											content = $ET(content, ret.data);
											menu.weiqun.cache = content;
											layer.content(menu.weiqun.cache);
										}
									},
									onFail : onError,
									onTimeout : onError
								}).request();
							} else {
								layer.content(menu.weiqun.cache);
							}						
						},
						show : function(){
							layer.content("<div>载入中...</div>");
							layer.show();
							menu.weiqun.getList();
						},
						back : function(){
							currentWeiqun = null;
							currentRank = null;
							that.btnContent(publishToBtnDef.content);
							that.btnTitle(publishToBtnDef.title);
							that.show();
						}
					}
				};
				/**
				 * 向body插入点击模板 
				 */
				var insertDropList = function() {
					nodes.publishTo = $.insertHTML(document.body , $L(LISTTPL));					
				};
				/**
				 * 执行初始化方法，会判断是否真的需要定向发布功能，因为common.dialog.publish可以支持传入template模板，
				 * 但是传入的模板如果没有定向发布，就会悲剧，所以加了个检测，返回1表示有定向发布，返回0表示没有定向发布
				 * 
				 * 判断条件是 外层节点中含有nodes.showPublishTo这个节点
				 * 		如果有，则有定向发布
				 * 		如果没有，则没有定向发布
				 */
				var initEntrance = function() {
					
					if(!$.isNode(nodes.showPublishTo)) {
						return 0;
					} else {
						insertDropList();
						publishToBtnCon = $.core.dom.sizzle('em', nodes.showPublishTo)[0];
						publishToBtnDef = {
							'content' : publishToBtnCon.innerHTML,
							'title'   : nodes.showPublishTo.getAttribute('title')
						};
						layer.init();
						bind();
						menu.normal.getList();
						return 1;	
					}
				};
				
				var hasPublishTo = initEntrance();
				
				if(hasPublishTo) {
					return that;	
				} else {
					return null;
				}
				
			})();						
		};
		
		var init = function() {
			argsCheck();
			parseDOM();
			initPlugin();			
		};
		
		init();
		
		return publishTo;
	};
});


