/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 
 * 我的首页: 左侧导航
 * “更多”按钮功能实现，导航菜单功能实现
 * @id STK.comp.content.leftNav
 * @param {Node} node 组件最外节点
 * 
 * @modify 
 * 		2011-4-22 Runshi Wang | runshi@staff.sina.com.cn
 *  	* 加入左导顶部数据更新事件
 */
$Import('common.listener');
$Import('kit.extra.language');
$Import('common.channel.feed');
$Import('common.channel.relation');
$Import('kit.dom.firstChild');
$Import('kit.dom.parseDOM');
$Import('common.layer.leftNavPopup');
$Import('comp.content.medal');

STK.register('comp.content.leftNav', function($){
	var MINLISTNUM	= 5, nodeCache;
	
	return function(node){
		var dEvt,
			that		= {},
			$L			= $.kit.extra.language,
			channels    = {
				feedChannel     : $.common.channel.feed,
				relationChannel : $.common.channel.relation
			},
			templ		= {
				more	: $L('#L{更多}<span class="W_arrow">&raquo;</span>'),
				close	: $L('#L{收起}<span class="W_arrow">&laquo;</span>')
			},
			mouseOverTimer,
			medal;
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.leftNav]:node is not a Node!";
			}
		};
		/**
		 * 获取当前数值
		 */
		var getNum = function(type){
			return parseInt(nodes[type].innerHTML, 10) || 0;
		}
		
		var leftNavFuns = {
			clearItemSelected: function(aItem){
				for (var i = 0, len = nodes['leftItems'].length; i < len; i++) {
					var _item = nodes['leftItems'][i];
					if(_item !== aItem){
						_item.className = '';
						var next	= $.core.dom.next(_item);
							nType	= next ? next.getAttribute('node-type') : '';
						if( nType === 'leftSubMenu' ){
							next.style.display = 'none';
						}
					}
				}
				for (var i = 0, len = nodes['subItems'].length; i < len; i++) {
					nodes['subItems'][i].className = '';
				}
			},
			
			selectedEl: function(curEl){
				var menu = leftNavFuns.isMenuItem(curEl);
				var item = menu ? $.core.dom.prev(menu) : curEl.parentNode;
				leftNavFuns.clearItemSelected(item);
				if(menu){
					menu.style.display = '';
					curEl.className = 'current';
				}else{
					var next	= $.core.dom.next(item);
						nType	= next ? next.getAttribute('node-type') : '';
					if( nType === 'leftSubMenu' ){
						var subItem = $.kit.dom.firstChild(next);
						subItem.className = 'current';
						next.style.display = '';
					}
				}
				item.className = 'current';
			},
			
			isMenuItem: function(curEl){
				var pNode	= curEl.parentNode,
					pType	= pNode.getAttribute('node-type'),
					menu	= null;
				if(pType === 'leftSubMenu'){
					menu	= pNode;
				}
				return menu;
			},
			showPopup : function(rec) {
				if(rec.data.name){
					var el = $.E("leftNav_moreBtn_" + rec.data.name);
					if(el.style.display != 'none') {
						return;
					}
					var param = {
						attachment : rec.el
					};
					switch(rec.data.name){
						case 'assigned':
							param.align = 'bl';
							param.fixedX = 37;
							param.fixedY = 27;
							break;
						case 'myapps':
							param.align = 'bl';
							param.fixedX = 37;
							param.fixedY = 26;
							break;
					}
					$.common.layer.leftNavPopup(el, param);
				}
			}
		};
		
		var parseDOM = function() {
			var ls = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(ls.list);
			nodes['links'] = $.core.dom.sizzle('a', node);
			nodes['subItems'] = $.core.dom.sizzle('dd[node-type=leftSubMenu] a', node);
		};
		
		var bindDOMFuns = {
			leftNavClick: function(e){
				var evt	= $.fixEvent(e),
					item= evt.target || {},
					act	= item.getAttribute('act');
				act && bindDOMFuns.moreBtnClick(item, act, evt);
			},
			moreBtnClick: function(btn, action, evt){
				var listBox	= $.E('left_nav_' + action);
				if (!listBox) { return; }
				var items	= $.core.dom.sizzle('DT', listBox),
					state	= listBox.getAttribute('state'),
					temp	= (!state || state === 'close') ? '' : 'none';
				for (var i = MINLISTNUM, len = items.length; i < len; i++) {
					items[i].style.display = temp;
				}
				//更改按钮样式
				btn.innerHTML = temp ? templ.more : templ.close;
				//更改状态标示
				listBox.setAttribute('state', temp ? 'close' : 'open');
				$.stopEvent(evt);
			},
			morePopup : function(rec){
				clearTimeout(mouseOverTimer);
				mouseOverTimer = setTimeout(function() {
					leftNavFuns.showPopup(rec);
				} , 300);
			},
			cancelMorePopup : function() {
				clearTimeout(mouseOverTimer);
			}
		};
		
		var bindListenerFuns = {
			/**
			 * 更新显示数
			 */
			updateNum: function(type, aNum){
				return function(){
					nodes[type].innerHTML = getNum(type) + aNum;
				};
			}
		};
		
		var bindListener = function(){
			channels["feedChannel"].register('forward', function(args) {
				args.isToMiniBlog && bindListenerFuns.updateNum('weibo', 1)();
			});
			channels["feedChannel"].register('publish', bindListenerFuns.updateNum('weibo', 1));
			channels["feedChannel"].register('delete', bindListenerFuns.updateNum('weibo', -1));
			channels["relationChannel"].register('follow', bindListenerFuns.updateNum('follow', 1));
			channels["relationChannel"].register('unfollow', bindListenerFuns.updateNum('follow', -1));
			channels["relationChannel"].register('removeFans', bindListenerFuns.updateNum('fans', -1));
		};
		
		var bindDOM = function() {
			dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add("more", "mouseover", bindDOMFuns.morePopup);
			dEvt.add("more", "mouseout", bindDOMFuns.cancelMorePopup);
			//$.addEvent(node, 'click', bindDOMFuns.leftNavClick);
			nodes["medal"] && (medal = $.comp.content.medal(nodes["medal"], {column:4, autohidden:1}));
		};
		
		var destroy = function() {
			channels["feedChannel"].remove('forward', bindListenerFuns.updateNum);
			channels["feedChannel"].remove('publish', bindListenerFuns.updateNum);
			channels["feedChannel"].remove('delete', bindListenerFuns.updateNum);
			channels["relationChannel"].remove('follow', bindListenerFuns.updateNum);
			channels["relationChannel"].remove('unfollow', bindListenerFuns.updateNum);
			channels["relationChannel"].remove('removeFans', bindListenerFuns.updateNum);
			medal.destroy();
			medal = null, channels = null, nodes = null;
		};
		
		var init = function() {
			if(nodeCache){ return; }
			nodeCache = node;
			argsCheck();
			parseDOM();
			bindListener();
			bindDOM();
		};
		
		init();
		
		that.destroy = destroy;
		
		return that;
	}
});
