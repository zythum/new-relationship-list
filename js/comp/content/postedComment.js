/**
 * 发出的评论
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.confirm');
$Import('common.trans.comment');
$Import('common.comment.delCommentDom');
$Import('common.comment.commentSearch');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.magic');
$Import('comp.content.tipsBar');
$Import('kit.extra.parseURL');
$Import('common.layer.ioError');

STK.register('comp.content.postedComment', function($){
	return function(node){
		var that	= {}, 
			nodes	= {},
			delCom	= $.common.comment.delCommentDom,
			$L		= $.kit.extra.language,
			ajax	= $.common.trans.comment,
			dEvent	= $.core.evt.delegatedEvent(node),
			msg 	= {
				'tips'		: $L('#L{确定要删除该回复吗？}')
				//'watermark'	: $L('#L{查找评论内容或评论人}')
			}, searchPlugin, page, msgCount, tip;
		//---变量定义区----------------------------------
		var privaceFuns = {
			/**
			 * 检测当前页剩余评论数
			 */
			getCommentLength: function(){
				var list = $.core.dom.sizzle('dl.list', nodes['commentPanel']) || [];
				return list.length;
			},
			
			/**
			 * 修改剩余评论总数
			 * @param {Object} num
			 */
			commentNum: function(num){
				if(!nodes['commentNum']){ return; }
				var cNum = nodes['commentNum'].innerHTML;
					cNum = parseInt(cNum, 10);
					cNum = isNaN(cNum) ? 0 : cNum + num;
				nodes['commentNum'].innerHTML = cNum < 0 ? 0 : cNum;
			}
		};
		
		//----------------------------------------------
		/**
		 * 获取当前页面的页数
		 */
		var getPage = function(){
			var parseURL;
			if($CONFIG['bigpipe'] === 'true' && $.historyM){
				parseURL = $.historyM.parseURL()
			} else{
				parseURL = window.location.href;
			}
			return $.core.str.queryString('page', {'source': parseURL.url}) || 1;
		};
		
//		/**
//		 * 设置页面URL地址
//		 * @param {Object} data
//		 */
//		var setHash = function(data){
//			if($CONFIG['bigpipe'] === 'true'){
//				$.historyM.setQuery(data);
//			}
//		}

		/**
		 * 获取特定父节点
		 * @param {Object} el
		 * @param {Object} tagName
		 */
		var getParent = function(el, tagName){
			var currEl = el, rsEl; 
			while(currEl && currEl.tagName.toLowerCase() !== 'body'){
				if(currEl.tagName.toLowerCase() === tagName){
					rsEl = currEl;
					break;
				}
				currEl = currEl.parentNode;
			}
			return rsEl;
		};
		//--------------AJAX函数定义区-------------------
		var ioFuns = {
			currentEl: null,
			/**
			 * 删除评论
			 */
			delComment: (function(){
				var onSuccess = function(rs){
					var cb = function(){
						privaceFuns.commentNum(-1);
						msgCount -= 1;
						msgCount <= 0 && ioFuns.getComments({'page': getPage()});
					}
					delCom({
						'el'	: ioFuns.currentEl,
						'endCb'	: cb
					});
					
				};
				var onError = function(data){
					$.common.layer.ioError(data.code, data);
				};
				
				var delComAjax = ajax.getTrans('delete', {
					'onSuccess': onSuccess,
					'onError': onError,
					'onFail': onError
				});
				return function(spec){
					ioFuns.currentEl = getParent(spec.el, 'dl');
					delComAjax.request(spec.data);
				}
			})(),
			
			/**
			 * 获取评论
			 */
			getComments: function(spec){
				if($CONFIG['bigpipe'] === 'true' && $.historyM){
					//$.historyM.setQuery(spec, true);
					ioFuns.searchComment(spec);
					return;
				}
				var uri = '/comment/outbox?'+$.jsonToQuery(spec);
				window.location.href = uri;
			},
			'searchComment' : function(spec) {
				$.common.trans.comment.getTrans('getOut', {
					'onSuccess' : function(json) {
						var key = ['page','is_search','key_word'];
						var query = {};
						for (var i = 0; i < key.length; i++) {
							query[key[i]] = (typeof spec[key[i]] != "undefined" ? spec[key[i]] : null);
						}
						$.historyM.setQuery(query);
						nodes.commentPanel.innerHTML = json.data;
						destroy();
						init();
					}
				}).request(spec);
			}
//			/**
//			 * 获取评论数
//			 */
//			getComments: (function(){
//				var onSuccess = function(rs, spec){
//					document.body.scrollIntoView(true);
//					nodes['commentPanel'].innerHTML = rs.data;
//					msgCount = privaceFuns.getCommentLength();
//				};
//				var getComAjax = ajax.getTrans('outBoxList', {
//					'onSuccess': onSuccess
//				});
//				return function(spec){
//					if($CONFIG['bigpipe'] === 'true'){
//						setHash({
//							'page'		: spec.page || null,
//							'is_search'	: spec.is_search || null,
//							'key_word'	: spec.key_word || null
//						});
//						getComAjax.request(spec);
//						return;
//					}
//					var uri = '/comment/outbox?'+$.jsonToQuery(spec);
//					window.location.href = uri;
//				}
//			})()
		};
		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区------------------
		var bindDOMFuns = {
			delComment	: function(spec){
				var dia = $.ui.confirm(msg.tips, {
					'OK': function(){
						ioFuns.delComment(spec);
					}
				})
			},
			 back : function(spec)
			{
				 $.preventDefault();
				ajax.getTrans('getOut',{
					'onSuccess' : function(json)
					{
						  nodes['commentPanel'].innerHTML = json.data;
							$.historyM.setQuery({key_word:null,page:null,is_search:null});
							destroy();
							init();
					},
					'onError' : bindDOMFuns.backError
				}).request(spec.data);
			},
			backError : function(json)
			{
				 $.ui.alert(json.msg);
			},
			commentFilter: function(spec){
//				var el		= $.fixEvent(spec.evt).target,
//					tagName	= el.tagName.toLowerCase(),
//					data = el.getAttribute('action-data');
//				if (data) {
//					data = $.core.json.queryToJson(data);
				$.core.evt.preventDefault();
				var url = $.kit.extra.parseURL();
				var query  = $.core.json.queryToJson(url.query);
				if(typeof query.key_word != "undefined")
				{
					spec.data.key_word = query.key_word;
				}
					ioFuns.getComments(spec.data);

//				}
//				$.core.evt.preventDefault();
			},
			
			searchClick	: function(val){
				ioFuns.getComments({
					'is_search': 1,
					'key_word': encodeURIComponent(val)
				});
			},
			
			playMagic: function(obj) {
				$.common.magic(obj.data.swf);
				return $.core.evt.preventDefault();
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {};
		//----------------------------------------------
		
		//---组件的初始化方法定义区-------------------------
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			msgCount = privaceFuns.getCommentLength();
			//tip黄条
			var items = $.sizzle('[node-type=tipsBar]',node);
			if(items.length) {
				//评论页面关闭黄条使用的值为4，见common.trans.global的closetipsbar
				var CLOSE_TIP_TYPE = 4;
				tip = $.comp.content.tipsBar(items[0] , CLOSE_TIP_TYPE);
			}
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.postedComment]: node is not a Node!";
			}
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function(){
			var spec = {
				'input'		: nodes['searchkeyword'],
				'searchBtn'	: nodes['searchBtn'],
				//'msg'		: msg['watermark'],
				'searchCb'	: bindDOMFuns.searchClick
			};
			searchPlugin = $.common.comment.commentSearch(spec);
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function(){
			dEvent.add('delComment', 'click', bindDOMFuns.delComment);
			dEvent.add('feed_list_page_n', 'click', bindDOMFuns.commentFilter);
			dEvent.add("feed_list_media_magic", "click", bindDOMFuns.playMagic);
			dEvent.add('back','click',bindDOMFuns.back);

		};
		//-------------------------------------------
		
		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function(){
			searchPlugin && searchPlugin.destroy();
			dEvent.destroy();
			//tip黄条
			tip && tip.destroy();
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