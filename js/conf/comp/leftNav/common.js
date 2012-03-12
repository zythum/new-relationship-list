/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 当初的分离是正确的，如今的合并...也是正确的，俗话说分久必合喝酒必汾~ 干杯！
 */
$Import('kit.extra.language');
$Import('kit.dom.firstChild');
$Import('kit.dom.parseDOM');
$Import('common.listener');
$Import('common.channel.feed');
$Import('common.channel.relation');
$Import("common.channel.topTip");
$Import("comp.leftNav.appMore");
$Import('comp.content.medal');
$Import('comp.content.darenCard');
//$Import('common.dialog.darenPublish');
//$Import('comp.content.creditCard');
$Import('module.imgDynamicDownload');
STK.register('comp.leftNav.common', function($){
	var MINLISTNUM = 5,
		nodeCache,
		nodes,
		dEvt;
	
	return function(node){
		var that		= {},
			$L			= $.kit.extra.language,
			channels    = {
				feedChannel     : $.common.channel.feed,
				relationChannel : $.common.channel.relation,
				topTip          : $.common.channel.topTip
			},
			medal,unreadTimer,credit,daren;
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "大左导需要传入外层节点对象";
			}
		};
		/**
		 * 获取当前数值
		 */
		var getNum = function(type){
			return parseInt(nodes[type].innerHTML, 10) || 0;
		}
		
		var parseDOM = function() {
			var ls = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(ls.list);
			nodes['items'] = $.core.dom.sizzle('a[action-type=leftNavItem]', node);
		};
		
		var bindDOMFuns = {
			/**
			 * 清除所有焦点
			 */
			cleanCurrent : function(){
				if(nodes.items.length > 0){
					var parent;
					for(var index in nodes.items){
						parent = nodes.items[index].parentNode;
						$.removeClassName( parent, "current" );
						if(parent.nodeName.toLowerCase() == 'dd'){
							$.setStyle(parent, 'display', 'none');
						}
					}
					parent = null;
				}
			},
			/**
			 * 设置焦点
			 */
			setCurrent : function(target){
				bindDOMFuns.cleanCurrent();
				var el = target.el.parentNode;
				if(el.nodeName.toLowerCase() == 'dd'){
					$.addClassName( $.sizzle("dt", el.parentNode)[0], "current" );
				} else {
					var nextEl = $.core.dom.next(el);
					if(nextEl && nextEl.nodeName.toLowerCase() == 'dd')
						$.addClassName( $.core.dom.next(el), "current" );
				}
				$.foreach($.sizzle("dd", el.parentNode), function(e){
					$.setStyle(e, 'display', '');
				});
				
				$.addClassName( el, "current" );
			},
			dilemmaJump : function(evt){
				$.core.evt.preventDefault(evt);
				var el = evt.target || evt.srcElement;
				var url = el.getAttribute('url');
				var target = el.getAttribute('target') || '_self'; //默认弹出
				url && window.open(url, target);
				
			},
			mouseoverNode : function (evt) {
				$.module.imgDynamicDownload(node);
				$.removeEvent(node, 'mouseover', bindDOMFuns.mouseoverNode);
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
			},
			updateAtNum : function(rt){
				
				var types = ["atcmt", "atme"],
					num = 0,
					nodeName,
					i;
				
				for(i in types){
					nodeName = types[i];
					if(nodes[nodeName]){
						num = parseInt(rt[nodeName]);
						
						if(num >= 100){
							num = '99+';
						} else if(num <= 0){
							num = false;
						} else {
							num += '';
						}
						
						if(num){
							$.core.dom.setStyle(nodes[nodeName].parentNode, 'display', '');
							nodes[nodeName].innerHTML = num;
						} else {
							$.core.dom.setStyle(nodes[nodeName].parentNode, 'display', 'none');
							nodes[nodeName].innerHTML = 0;
						}
					}
				}
				
				num = null,
				nodeName = null,
				i = null,
				types = null;
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
			channels["topTip"].register('refresh', bindListenerFuns.updateAtNum);
			
			
			if($CONFIG['bigpipe'] === 'true'){
				$.historyM.onpopstate(function(ret){
					//修复IE6,7,8 CSS数量超过31bug的问题
					// if($.IE && document.styleSheets.length >= 18) {
						// window.location = ret;
						// return;
					// }
					ret = ret.replace(/\?.*/ , '');
					var target = {el:$.sizzle("a[href*="+ret+"]", nodes['nav'] || node)[0]};
					bindDOMFuns.setCurrent(target);
					unreadTimer = setTimeout(function() {
						channels["topTip"].fire("readed", {});
					} , 3000);
				});
			}
		};
		
		var bindDOM = function() {
			
			if(nodes["dilemma"] && nodes["dilemma"].length > 0){
				for(var i in nodes["dilemma"]){
					$.addEvent(nodes["dilemma"][i], 'click', bindDOMFuns.dilemmaJump);
				}
			}
			
			dEvt = $.core.evt.delegatedEvent(node);
			
			$.comp.leftNav.appMore(node , dEvt);
			
			dEvt.add("leftNavItem", "click", bindDOMFuns.setCurrent);
			$.addEvent(node, 'mouseover', bindDOMFuns.mouseoverNode);
			nodes["medal"] && (medal = $.comp.content.medal(nodes["medal"], {column:4, autohidden:1}));

             daren = nodes["daren"] && $.comp.content.darenCard(nodes["daren"],{'uid':$CONFIG['uid']});

            //$CONFIG['daren'] && $.common.dialog.darenPublish();
            //nodes["medal"] && (credit = $.comp.content.creditCard(nodes["medal"]));

		};
		
		var destroy = function() {
			clearTimeout(unreadTimer);
            !$CONFIG['bigpipe'] && daren && daren.destroy &&daren.destroy();
             !$CONFIG['bigpipe'] && medal && medal.destroy &&medal.destroy();
			// channels["feedChannel"].remove('forward', bindListenerFuns.updateNum);
			// channels["feedChannel"].remove('publish', bindListenerFuns.updateNum);
			// channels["feedChannel"].remove('delete', bindListenerFuns.updateNum);
			// channels["relationChannel"].remove('follow', bindListenerFuns.updateNum);
			// channels["relationChannel"].remove('unfollow', bindListenerFuns.updateNum);
			// channels["relationChannel"].remove('removeFans', bindListenerFuns.updateNum);
			// channels["topTip"].remove('refresh', bindListenerFuns.updateAtNum);
			// medal.destroy();
			// medal = null, channels = null;
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