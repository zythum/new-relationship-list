/**
 * 卡片通用组件
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 
 * @param {Object} node 需要绑定卡片的区域
 * @param {Object} spec {
 * 	order		卡片出现优先顺序		l,t,r,b 左,上,右,下
 * 	type		卡片类型				默认为0
 *  variety		卡片种类				medal | businessCard
 *  arrowPos	箭头显示位置 		top | bottom | left | right | center
 *  zIndex		卡片zIndex
 * 	loadTemp	加载状态模板	
 * }
 * 
 * @history
 * ZhouJiequn @2011.05.06	删除ioFunc对象
 * ZhouJiequn @2011.05.09	增加对缓存卡片的删除函数rmCache,当名片状态改变时删除该卡片缓存
 * ZhouJiequn @2011.05.10	增加卡片对纵向与横向箭头位置设置支持
 * ZhouJiequn @2011.05.27	增加卡片在横向位置时对居中位置的支持
 * ZhouJiequn @2011.06.13	增加求关注与发私信功能
 * 
 * 目前将勋章卡片展示也加入了支持；后期勋章如果需求改变，以至于无法和名片卡通用
 * 此组件，则可以单独使用STK.ui.popCard来进行勋章卡片的开发；
 */
$Import('ui.alert');
$Import('kit.extra.merge');
$Import('ui.popCard');
$Import('common.trans.setting');
STK.register('comp.content.medalCard', function($){
		/**
		 * 卡片缓存超时时间5分钟
		 */
	var CACHETIMEOUT= 300000,
		/**
		 * 卡片展示延迟时间
		 */
		SHOWDELAY	= 500;
		
	var userCard, showTimer, hideTimer, groupDialog;
	
	var TEMP_ERROR = '<div style="width:310px;padding-top:15px;padding-bottom:15px;text-align:center"><span>#{MSG}</span></div>';
	
	return function(node, spec){
		var that	= {},
			$L		= $.kit.extra.language,
			$T      = $.templet;
		
		var	conf	= $.parseParam({
				'order': 't,b,l,r',
				'zIndex': 9999,
				'type': 0,
				'uid' : null,
				'arrowPos': 'auto',
				'loadTemp': $L('<div class="W_loading" style="width:310px;padding-top:15px;padding-bottom:15px;text-align:center"><span>#L{正在加载，请稍候}...</span></div>')
			}, spec || {});

		/**
		 * 卡片Ajax函数定义
		 */
		var getCardTrans = $.common.trans.setting.getTrans('medalCard', {
			'onComplete' : function(rs, param) {
				if(rs['code'] == '100000'){
					cache.setCache(param["id"], rs['data']);
					userCard.setContent(rs['data']);
				} else {
					userCard.setContent($T(TEMP_ERROR, {"MSG": rs['msg']}));
				}
			}
		});
		
		/**
		 * 卡片缓存
		 */
		var cache = {
			data: [],
			/**
			 * 从缓存内获取卡片
			 * @param {String} key 卡片唯一索引
			 */
			getCache: function(key){
				var rs		= this.data[key],
					html	= '';
				if (rs) {
					var nowDate = new Date();
					if (nowDate - rs.date < CACHETIMEOUT) {
						html = rs.html;
					} else {
						delete this.data[key];
					}
				}
				return html;
			},
			
			/**
			 * 设置卡片缓存
			 * @param {String} key
			 * @param {HTML} html
			 */
			setCache: function(key, html){
				this.data[key] = {
					'date': new Date(),
					'html': html
				};
			},
			
			/**
			 * 删除卡片缓存
			 * @param {String} key
			 * @param {HTML} html
			 */
			rmCache: function(key){
				delete this.data[key];
			}
		};
		
		var bindDOMFuns = {
			showCardMouseover: function(e){
				var event    = $.fixEvent(e),
					node     = event.target,
					ucData   = node.getAttribute('medalcard');
				if(ucData){
					userCard.stopHide();
					userCard.showTimer = setTimeout(function(){
						var data = {
							id: ucData
						};
						var cHtml = cache.getCache(ucData);
						userCard.showCard({
							'content'	: cHtml || conf['loadTemp'],
							'node'		: node,
							'order'		: conf['order'],
							'arrowPos'	: conf['arrowPos'],
							'zIndex'	: conf['zIndex'],
							'event'     : e
						});
						cHtml || getCardTrans.request($.kit.extra.merge({
							'type': conf['type'],
							'uid': conf['uid']
						}, data));
					}, SHOWDELAY);
				}
			},
			
			/**
			 * 当展示名片锚点移出后的操作
			 * @param {Event} e
			 */
			showCardMouseout: function(e){
				var event	= $.fixEvent(e),
					node	= event.target,
					name	= node.getAttribute('medalcard');
				if (name) {
					userCard.stopShow();
					userCard.hideCard();
				}
			}
		};
				
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function(){
			if(!userCard){
				userCard = $.ui.popCard();
			}
			argsCheck();
			bindDOM();
			bindListener();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.medalCard]: node is not a Node!";
			}
		};
		
		var bindDOM = function(){
			$.addEvent(node, 'mouseover', bindDOMFuns.showCardMouseover);
			$.addEvent(node, 'mouseout', bindDOMFuns.showCardMouseout);
		};
		
		var bindListener = function(){
			
		};
		
		var destroy = function(){
			$.removeEvent(node, 'mouseover', bindDOMFuns.showCardMouseover);
			$.removeEvent(node, 'mouseout', bindDOMFuns.showCardMouseout);
			cache.data.length = 0;
			bindDOMFuns = null;
			cache = null;
		};
		
		init();
		
		that.destroy = destroy;
		that.userCard = userCard;
		return that;
	};
});