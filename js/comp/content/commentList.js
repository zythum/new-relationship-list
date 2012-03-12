/**
 * 发出的评论
 * @author qiyuheng | yuheng@staff.sina.com.cn
 */
$Import('ui.confirm');
$Import("common.channel.topTip");
$Import('common.trans.comment');
$Import('common.comment.commentSearch');
$Import('common.comment.reply');
$Import('kit.extra.language');
$Import('common.comment.delCommentDom');
$Import('kit.dom.parseDOM');
$Import('common.trans.top');
$Import('comp.content.tipsBar');
$Import('common.comment.privateSetting');
$Import('common.channel.receiveComment');
$Import('ui.bubble');
$Import('ui.tipAlert');
$Import('ui.alert');
$Import('kit.extra.parseURL');
$Import('common.layer.ioError');


STK.register('comp.content.commentList', function($){
	return function(node){
		//对顶导的通知放到最前面，尽量减少延迟
		$.common.channel.topTip.fire('readed',{});
		var that	= {},
			bubble = null,timer = null,
			nodes	= {},
			delCom	= $.common.comment.delCommentDom,
			$L		 = $.kit.extra.language,
			ajax	 = $.common.trans.comment,
			setStyle = $.core.dom.setStyle,
			getStyle = $.core.dom.getStyle,
			prevent  = $.core.evt.preventDefault,
			dEvent	 = $.core.evt.delegatedEvent(node),
			privateSetting = $.common.comment.privateSetting,
			commentChannel = $.common.channel.receiveComment,
			msg 	 = {
				'tips'		: $L('#L{确定要删除该回复吗？}'),
				//'watermark'	: $L('#L{查找评论内容或评论人}'),
				'reply'     : $L('#L{回复}'),
				'alert'     : $L('#L{写点东西吧，评论内容不能为空哦。}'),
				'success'   : $L('#L{评论成功}'),
				'block'     : $L('#L{同时将此用户加入黑名单}'),
				'unReply' :$L('#L{由于用户设置，你无法回复评论。}<br><a href="http://account.weibo.com/settings/mobile" target="_blank">绑定手机</a>后可以更多地参与评论。'),
				'unPower' : $L('#L{由于用户设置，你无法回复评论。}')
			},
			checkReply = new RegExp(['^',msg['reply'],'@(.*):(.*)'].join('')),
			searchPlugin, page, msgCount, tip;
		/**
		 * 检测当前页剩余评论数
		 */
		var getCommentLength = function(){
			var list = $.core.dom.sizzle('dl', nodes['commentPanel']) || [];
			return list.length;
		};
		
		/**
		 * 修改剩余评论总数
		 * @param {Object} num
		 */
		var commentNum = function(num){
			if(!nodes['commentNum']){ return; }
			var cNum = nodes['commentNum'].innerHTML;
				cNum = parseInt(cNum, 10);
				cNum = isNaN(cNum) ? 0 : cNum + num;
			nodes['commentNum'].innerHTML = cNum < 0 ? 0 : cNum;
		};
		
		/**
		 * 获取当前页面的页数
		 */
		var getPage = function(){
			var parseURL;
			if($CONFIG['bigpipe'] === 'true' && $.historyM){
				parseURL = $.historyM.parseURL();
			} else{
				parseURL = window.location.href;
			}
			return $.core.str.queryString('page', {'source': parseURL.url}) || 1;
		};

//		var setHash = function(data){
//			if($CONFIG['bigpipe'] === 'true' && $.historyM){
//				$.historyM.setQuery(data);
//			}
//		};
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
			delComment: (function(){
				var onSuccess = function(rs){
					var cb = function(){
						commentNum(-1);
						msgCount -= 1;
						msgCount <= 0 && ioFuns.getComments({'page': getPage()});
						if(rs.data && rs.data.showPrivateSet) {
							privateSetting.show();
						}
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
			getComments: function(spec) {
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
					ioFuns.searchComment(spec);
					return;
				}
				var uri = '/comment/inbox?' + $.jsonToQuery(spec);
				window.location.href = uri;
			},
			'searchComment' : function(spec) {
				ajax.getTrans('getIn', {
					'onComplete' : function(json) {
						//url替换参数列表如果为空就去掉了，就为了蛋疼的局部刷新。
						var key = ['page','is_search','key_word','role'];
						var query = {};
						for (var i = 0; i < key.length; i++) {
							query[key[i]] = (typeof spec[key[i]] != "undefined" ? spec[key[i]] : null);
						}
						$.historyM.setQuery(query);
						nodes.myincomment.innerHTML = json.data;
						destroy();
						init();
					}
				}).request(spec);
			}
//			getComments: (function(){
//				var onSuccess = function(rs, spec){
//					document.body.scrollIntoView(true);
//					nodes['commentPanel'].innerHTML = rs.data;
//					msgCount = getCommentLength();
//				};
//				var getComAjax = ajax.getTrans('inBoxList', {
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
//					var uri = '/comment/inbox?'+$.jsonToQuery(spec);
//					window.location.href = uri;
//				}
//			})()
		};

		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区------------------
		var bindDOMFuns = {
			delComment	: function(spec){
				var block = spec.data['block']? ['<label for="block_user"><input node-type="block_user" id="block_user" name="block_user" value="1" type="checkbox"/>',msg['block'],'</label>'].join(''):'';
				var dia = $.ui.confirm(msg.tips, {
					'textComplex' : block,
					'OK': function(obj){
						var isBlock = obj['block_user']?1:0;
						ioFuns.delComment({
							'el' : spec.el,
							'data' : {
								'is_block' : isBlock,
								'cid' : spec.data.cid
							}
						});
					}
				})
			},
			commentFilter: function(spec){
				//var el		= $.fixEvent(spec.evt).target,
					//tagName	= el.tagName.toLowerCase(),
				//var data =spec.el.getAttribute('action-data');
				//if (data) {
				//data = $.core.json.queryToJson(data);
				//if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				var url = $.kit.extra.parseURL();
				var query  = $.core.json.queryToJson(url.query);
				if(typeof query.key_word != "undefined")
				{
					spec.data.key_word = query.key_word;
				}
					ioFuns.getComments(spec.data);
				//}
				//else {
					//window.location.href = spec.el.getAttribute("href");
				//}
				$.core.evt.preventDefault();
			},
			 //返回全部，设置url好蛋疼，终于知道为什么当时是刷新页面。
			back : function(spec)
			{
				$.preventDefault();
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				ajax.getTrans('getIn',{
					'onSuccess' : function(json)
					{
						$.historyM.setQuery({role:null,page:null,key_word:null,is_search:null});
						nodes.myincomment.innerHTML = json.data;
						nodes.searchkeyword.value = "";
						destroy();
						init();
					},
					'onError' : bindDOMFuns.backError
				}).request(spec.data);
				}else
				{
					window.location.href = spec.el.getAttribute("href");
				}
			},
			backError : function(json)
			{
			  $.ui.alert(json.msg);
			},
			'all' : function(spec)
			{
				$.core.evt.preventDefault();
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
					ajax.getTrans('getIn', {
						'onComplete' : function(json) {
							$.historyM.setQuery({role:null,page:null});
							nodes.myincomment.innerHTML = json.data;
							// nodes.commentNum.inerHTML = json.data.num;
							//nodes.all && $.addClassName(nodes.all,"current");
							//nodes.follow && $.removeClassName(nodes.follow,"current");
							destroy();
							init();
						}
					}).request(spec.data);
				} else {
					window.location.href = spec.el.getAttribute("href");
				}
			},
			'follow' : function(spec)
			{

				$.core.evt.preventDefault();
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
				ajax.getTrans('getIn', {
					'onComplete' : function(json) {
						$.historyM.setQuery({role:spec.data.role,page:null});
						//nodes.all && $.removeClassName(nodes.all,"current");
						//nodes.follow && $.addClassName(nodes.follow,"current");
						nodes.myincomment.innerHTML = json.data;
						//nodes.commentNum.inerHTML = json.data.num;
						destroy();
						init();
					}
				}).request(spec.data);
				}else
				{
					window.location.href = spec.el.getAttribute("href");
				}
			},
			showReply : function(opts) {
				/*var el = opts.el;
				if ($.core.dom.hasClassName(el, "unclick_rep")) {
					return;
				}
				ajax.getTrans('isComment', {
				'onComplete': function(json) {
					if (json.code == '100000') {*/
						 bindDOMFuns.showReplyFunc(opts);
					/*}
					else {
						if (bubble) {
							bubble.anihide && bubble.anihide();
							bubble.destroy && bubble.destroy();
							bubble = null;
						}
						if (json.code == "100022") {
							bubble = $.ui.tipAlert({'msg':msg.unPower,'type': 'warn'});
						}
						else if (json.code == "100001") {
							bubble = $.ui.tipAlert({'msg':msg.unReply,'type': 'warn'});
						}
						bubble.setLayerXY(el);
						bubble.aniShow();
						$.addClassName(el, "unclick_rep");
						timer && window.clearTimeout(timer);
						timer = window.setTimeout(function() {
							bubble.anihide && bubble.anihide();
							bubble.destroy && bubble.destroy();
							bubble = null;
						}, 3000);
						$.addClassName(el, "unclick_rep")
					}
				}
			}).request(opts.data);*/

			},
			 showReplyFunc : function(opts)
			 {
				 var reply		= opts.el,
					commentEL	= getParent(reply, 'dl'),
					node		= $.core.dom.sizzle('[node-type="commentwrap"]', commentEL)[0],
					status		= reply.getAttribute('status');
				if(status !== 'show'){
					reply.setAttribute('status','show');
					setStyle(node,'display','');
					node.reply || (node.reply = $.common.comment.reply(node, opts.data));
				}else{
					reply.setAttribute('status','hide');
					setStyle(node,'display','none');
				}
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
			bindListener();
			msgCount = getCommentLength();
			//tip黄条防诈骗
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
			dEvent.add('feed_list_page_n', 'click', bindDOMFuns.commentFilter);
			dEvent.add("feed_list_media_magic", "click", bindDOMFuns.playMagic);
			dEvent.add('delComment', 'click', bindDOMFuns.delComment);
			dEvent.add('replycomment','click',bindDOMFuns.showReply);
			dEvent.add('all','click',bindDOMFuns.all);
			dEvent.add('follow','click',bindDOMFuns.follow);
			//private settings
			dEvent.add('private_setting','click',privateSetting.show);
			dEvent.add('all','click',bindDOMFuns.all);
			dEvent.add('follow','click',bindDOMFuns.follow);
			// 返回全部
			dEvent.add('back','click',bindDOMFuns.back);
		};
		//----绑定channel用来使当前的窗口显示私信隐私设置弹层--------
		var bindListenerFuns = {
			showPrivateSet : function() {
				privateSetting.show();					
			}			
		};
		var bindListener = function() {
			//隐私设置弹层
			commentChannel.register('showPrivateSet' , bindListenerFuns.showPrivateSet);			
		};
		
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
			commentChannel.remove("showPrivateSet",bindListenerFuns.showPrivateSet);
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
