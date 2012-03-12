/**
 * 业务层通用名片卡绑定方式——同步方式；使用方式同STK.comp.content.asynUserCard(异步方式)
 * 
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
 * ZhouJiequn @2011.10.08	修复用户昵称折行后名片卡展示异常
 * ZhouJiequn @2011.10.08	优化	：if(!rs || typeof rs != 'object' || typeof rs['msg'] != 'string' || rs['msg'] == '') {
 *							为	：if(!rs || !rs['msg'] || typeof rs['msg'] !== 'string') {
 * 
 * 目前将勋章卡片展示也加入了支持；后期勋章如果需求改变，以至于无法和名片卡通用
 * 此组件，则可以单独使用STK.ui.popCard来进行勋章卡片的开发；
 */
$Import('ui.alert');
$Import('ui.confirm');
$Import('ui.popCard');
$Import('kit.extra.merge');
$Import('kit.extra.language');
$Import('common.trans.relation');
$Import('common.dialog.setGroup');
$Import('common.dialog.setRemark');
$Import('common.channel.relation');
$Import('common.dialog.inviteFollow');
$Import('common.relation.baseFollow');
STK.register('comp.content.userCard', function($){
		/**
		 * 卡片缓存超时时间5分钟
		 */
	var CACHETIMEOUT= 300000,
		/**
		 * 卡片展示延迟时间
		 */
		SHOWDELAY	= 500;
		
	var userCard, showTimer, hideTimer, groupDialog;
	
	var TEMP_ERROR = '<div style="width:360px;padding-top:15px;padding-bottom:15px;text-align:center"><span>#{msg}</span></div>';
	
	return function(node, spec){
		
		var that	= {},
			$L		= $.kit.extra.language,
			fTrans	= $.common.channel.relation,
			$T      = $.templet;
		
		var	conf	= $.parseParam({
				'order': 't,b,l,r',
				'zIndex': 9999,
				'type': 0,
				'variety': 'userCard',
				'arrowPos': 'auto',
				'loadTemp': $L('<div class="W_loading" style="width:360px;padding-top:15px;padding-bottom:15px;text-align:center"><span>#L{正在加载，请稍候}...</span></div>')
			}, spec || {});

		/**
		 * 卡片Ajax函数定义
		 */
		var getCardTrans = $.common.trans.relation.getTrans(conf['variety'], {
			'onComplete' : function(rs, param) {
				if(rs['code'] == "100000"){
					var key = param["id"] || param["name"];
					cache.setCache(key, rs['data']);
					userCard.setContent(rs['data']);
				} else {
					if(!rs || !rs['msg'] || typeof rs['msg'] !== 'string') {
						rs = {
							msg : $L('#L{加载失败}')
						};						
					}
					userCard.setContent($T(TEMP_ERROR, rs));
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
				var event	= $.fixEvent(e),
					node	= event.target,
					ucData	= node.getAttribute('usercard');
				if(ucData){
					userCard.stopHide();
					userCard.showTimer = setTimeout(function(){
						var data = $.queryToJson(ucData);
						var key = data.id || data.name;
						var cHtml = cache.getCache(key);
						userCard.showCard({
							'content'	: cHtml || conf['loadTemp'],
							'node'		: node,
							'order'		: conf['order'],
							'arrowPos'	: conf['arrowPos'],
							'zIndex'	: conf['zIndex'],
							'event'		: e
						});
						cHtml || getCardTrans.request($.kit.extra.merge({
							'type': conf['type']
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
					name	= node.getAttribute('userCard');
				if (name) {
					userCard.stopShow();
					userCard.hideCard();
				}
			}
		};
		
		var bindListenerFuns = {
			'rmCache': function(spec){
				cache.rmCache( spec['uid'] );
				cache.rmCache( spec['fnick'] );
			}
		};
		
		/**
		 * 设置分组函数调用
		 * @param {Object} spec
		 */
		var setGroup = function(spec){
			groupDialog || (groupDialog = $.common.dialog.setGroup());
			groupDialog.show({
				'uid': spec.data.uid,
				'fnick': spec.data.fnick,
				'hasRemark': false
			});
		};
		
		/**
		 * 设置备注函数调用
		 * @param {Object} spec
		 */
		var setRemark = function(spec){
			var remark = $.core.str.decodeHTML(spec.el.innerHTML);
				(remark === $L('设置备注')) && (remark = '');
			$.common.dialog.setRemark({
				'uid'		: spec.data.uid,
				'remark'	: remark,
				'callback'	: function (data){
					spec.el.innerHTML = data;
				}
			});
		};
	
		/**
		 * 求关注
		 */
		var inviteFollow = function(spec){
			var data = spec.data;
			$.common.trans.relation.request('questions', {
				'onSuccess'	: function(rs, parm){
					$.common.dialog.inviteFollow({
						'name': data.fnick,
						'uid': data.uid,
						'questionList': rs.data
					});
				},
				'onError'	: function(rs, parm){
					if(rs && rs.code === "100060"){
	                    rs.msg &&
	                    $.ui.confirm(rs.msg, {
							icon:'warn',
	                        OKText: $L("#L{立刻绑定}"),
	                        OK: function(){
	                        	window.location.href = "http://account.weibo.com/settings/mobile";
								return $.preventDefault();
	                        }
	                    });
					}else{
						rs.msg && $.ui.alert(rs.msg);
					}
				}
			}, {uid: data.uid});
		};
		
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function(){
			if(!userCard){
				userCard = $.ui.popCard();
				$.common.relation.baseFollow(userCard.cardPanel);
				userCard.dEvent.add('setGroup', 'click', setGroup);
				userCard.dEvent.add('setRemark', 'click', setRemark);
				userCard.dEvent.add('inviteFollow', 'click', inviteFollow);
			}
			argsCheck();
			bindDOM();
			bindListener();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.userCard]: node is not a Node!";
			}
		};
		
		var bindDOM = function(){
			$.addEvent(node, 'mouseover', bindDOMFuns.showCardMouseover);
			$.addEvent(node, 'mouseout', bindDOMFuns.showCardMouseout);
		};
		
		var bindListener = function(){
			fTrans.register('follow', bindListenerFuns.rmCache);
			fTrans.register('unFollow', bindListenerFuns.rmCache);
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