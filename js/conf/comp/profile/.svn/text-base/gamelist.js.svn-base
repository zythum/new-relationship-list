$Import('common.trans.profile');
$Import('kit.dom.parseDOM');
$Import('common.profile.profilePageDelegate');
STK.register('comp.profile.gamelist' , function($) {
	return function(node) {
		var that = {} , delegateObj , nodes;
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.builder(node).list);
		};
		/*		
		var ioFuns = {
			balanceSuccess : function(data) {
				block = 0;
				var money = data.data;
				nodes.viewVB.style.display = 'none';
				nodes.leftVBNum.innerHTML = money;
				nodes.leftVBNum.style.display = '';
			},
			balanceError : function() {
				block = 0;				
			}		
		};
		
		var bindTrans = function() {
			trans = $.common.trans.profile.getTrans('getBalance' , {
				onSuccess : ioFuns.balanceSuccess,
				onError : ioFuns.balanceError,
				onFail : ioFuns.balanceError,
				onTimeout : ioFuns.balanceError
			});
		};
		var custFuncs = {
			//更新玩过的游戏,获得 的成就,游戏好友的个数 
			updateBasic  : function(data) {
				for(var key in data) {
					if(key != 'html') {
						nodes[key].innerHTML = data[key];
					}					
				}	
			}
		};
		*/
		/*
		var bindDOMFuns = {
			flushVB : function(e) {
				if(block) {
					return;					
				}
				block = 1;
				nodes.leftVBNum.style.display = 'none';
				nodes.viewVB.innerHTML = '稍等...';
				nodes.viewVB.style.display = '';
				trans.request();			
			}
		};
		*/
		var bindDOM = function() {
			delegateObj = $.delegatedEvent(node);
			//callback : custFuncs.updateBasic
			var opts = {
				contentNode : nodes.feedContent,
				scrollNode : document.body
			};
			$.common.profile.profilePageDelegate(delegateObj , opts);
			//$.addEvent(nodes.viewVB , 'click' , bindDOMFuns.flushVB);
			//$.addEvent(nodes.leftVBNum , 'click' , bindDOMFuns.flushVB);
		};
		var init = function() {
			parseDOM();
			//bindTrans();
			bindDOM();
		};
		var destroy = function() {
			delegateObj && delegateObj.destroy && delegateObj.destroy();
			/*
			$.removeEvent(nodes.viewVB , 'click' , bindDOMFuns.flushVB);
			$.removeEvent(nodes.leftVBNum , 'click' , bindDOMFuns.flushVB);
			*/
			that = delegateObj = nodes = undefined;
		};
		that.destroy = destroy;
		init(); 
		return that;
	};
});