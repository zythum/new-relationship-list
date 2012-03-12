/**
 * 名片卡异步方式绑定，名片卡的实际加载被延迟到了用户第一次触发时；
 * 
 * 由于名片卡内包含内容过多，所以重新创建了一个异步的名片卡绑定方式；
 * 传统的绑定方式依然由文件STK.comp.content.userCard完成；
 */
$Import('common.depand.asynUserCard');
STK.register('comp.content.asynUserCard', function($){
	return function(node, spec){
		var that	= {},
			require	= $.common.depand.asynUserCard, userCard;
		
		var depKey = 'asyn_userCard';
		
		var show = require.bind(depKey, function(node, ucData, event){
			userCard || (userCard = $.common.layer.userCard(node, spec));
			userCard.showCard(node, ucData, event);
		});
		
		var hide = require.bind(depKey, function(node, ucData, event){
			userCard || (userCard = $.common.layer.userCard(node, spec));
			userCard.hideCard(node, ucData, event);
		});
		
		var bindDOMFuns = {
			mouseover: function(evt){
				var event	= $.fixEvent(evt),
					node	= event.target,
					ucData	= node.getAttribute('usercard');
				if (!ucData) { return; }
				show(node, ucData, event);
			},
			
			/**
			 * 当展示名片锚点移出后的操作
			 * @param {Event} e
			 */
			mouseout: function(evt){
				var event	= $.fixEvent(evt),
					node	= event.target,
					ucData	= node.getAttribute('usercard');
				if (!ucData) { return; }
				hide(node, ucData, event);
			}
		};
		
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function(){
			argsCheck();
			bindDOM();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.seedUserCard]: node is not a Node!";
			}
		};
		
		var bindDOM = function(){
			$.addEvent(node, 'mouseover', bindDOMFuns.mouseover);
			$.addEvent(node, 'mouseout', bindDOMFuns.mouseout);
		};
		
		var destroy = function(){
			$.removeEvent(node, 'mouseover', bindDOMFuns.mouseover);
			$.removeEvent(node, 'mouseout', bindDOMFuns.mouseout);
		};
		
		init();
		
		that.destroy = destroy;
		that.userCard = userCard;
		return that;
	};
});