/**
 * User: guoqing5@staff.sina.com.cn
 * Date: 11-9-28
 * Time: 下午4:30
 *  达人信息提示卡。
 */
$Import('kit.extra.language');
$Import('common.trans.setting');
$Import('ui.popCard');

STK.register('comp.content.darenCard', function($){
		/**
		 * 卡片缓存超时时间5分钟
		 */
	var CACHETIMEOUT= 300000,
		/**
		 * 卡片展示延迟时间
		 */
		SHOWDELAY	= 500;

	var userCard;


	var TEMP_ERROR = '<div style="width:205px;padding-top:15px;padding-bottom:15px;height:20px;text-align:center"><span>#{MSG}</span></div>';

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
				'loadTemp': $L('<div class="W_loading" style="width:205px;height:20px;text-align:center"><span>#L{正在加载，请稍候}...</span></div>')
			}, spec || {});

		/**
		 * 卡片Ajax函数定义
		 */
		var getCardTrans = $.common.trans.setting.getTrans('darenCard', {
			'onComplete' : function(rs, param) {
				if(rs['code'] == '100000'){
				    cache.setCache("daren"+$CONFIG['uid'], rs['data']);
                    userCard.setContent( rs['data']);
				} else {
					userCard.setContent($T(TEMP_ERROR, {"MSG": (rs['msg'] || $L('#L{接口错误！}'))}));
                    //cache.setCache("daren",templeteLayer);
                    //userCard.setContent(templeteLayer);
				}
			}
		});
		/*
		 * 卡片缓存
          */
		var cache = {
			data: [],
			/**
			 * 从缓存内获取卡片
			 * @param {String} key 卡片唯一索引  */

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

			/*
			 * 设置卡片缓存
			 * @param {String} key
			 * @param {HTML} html
			 * */

			setCache: function(key, html){
				this.data[key] = {
					'date': new Date(),
					'html': html
				};
			},

			/*
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
					data   =$.core.json.queryToJson (node.getAttribute('action-data') || "");
                    ucData  ="daren"+$CONFIG['uid'];
				if(ucData){
					//userCard.stopHide();
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
                            'event' : event
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
					node	= event.target;
				if (userCard) {
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
                    //userCard.dEvent.add('', 'click');
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
			//cache = null;
		};

		init();

		that.destroy = destroy;
		that.darenCard = userCard;
		return that;
	};
});
