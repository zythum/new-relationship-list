/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 用于全局的返回顶部与名片卡绑定
 */
$Import("comp.content.scrollToTop");
$Import('comp.content.asynUserCard');
$Import('comp.content.suda');
$Import('comp.content.webim');
$Import('module.getDiss');
$Import('kit.extra.require');
$Import('comp.content.wbad');
STK.register('comp.content.base', function($){
	var inited = false;
	
	return function(){
		var that = {};
		
		var scrollEl	= $.E("base_scrollToTop"),
			cardPanels	= $.sizzle('div[ucardconf]'),
			userCards	= [],
			require = $.kit.extra.require,
			scrollToTop, cardData, cardPanel, userCard, activeLoad;
		//页面空闲后预加载调用
		if($.pageletView && $.pageletView.onload){
			$.pageletView.onload(function(){
				require.activeLoad();
			}); 
		} else {
			activeLoad = function(){
				require.activeLoad();
			};
			$.addEvent(window, 'load', activeLoad);
		}
		
		var initPluging = function(){
			//返回顶部
			scrollToTop = $.comp.content.scrollToTop(scrollEl);
			//批量绑定名片卡
			for (var i = cardPanels.length; i--;) {
				cardPanel	= cardPanels[i];
				cardData	= cardPanel.getAttribute('ucardconf');
				cardData	= $.queryToJson(cardData);
				userCards.push($.comp.content.asynUserCard(cardPanel, {
					'order': cardData.order,
					'type': cardData.type,
					'arrowPos': cardData.arrowPos
				}));
			}
			//加载sudo
			!inited&&$.comp.content.suda();
			//启动webim
			!inited&&$.comp.content.webim();
			//广告
			!inited&&$.comp.content.wbad();
		};
		
		var destroy = function(){
			for (var i = userCards.length; i--;) {
				userCard = userCards[i];
				typeof userCard.destroy === 'function' && userCard.destroy();
			}
			activeLoad && $.removeEvent(window, 'load', activeLoad);
			scrollToTop.destroy();
		};
		
		initPluging();
		
		that.destroy = destroy;
		inited = true;
		return that;
	};
});
