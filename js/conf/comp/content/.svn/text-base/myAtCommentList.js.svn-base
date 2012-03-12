/**
 * 发出的评论
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('comp.content.tipsBar');
$Import('common.comment.delCommentDom');
$Import('common.comment.commentSearch');
$Import('common.comment.reply');
$Import('common.trans.comment');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.magic');
$Import('ui.confirm');
$Import('ui.alert');
$Import('kit.extra.parseURL');

STK.register('comp.content.myAtCommentList', function($){
	return function(node){
		var that	= {}, 
			nodes	= {},
			delCom	= $.common.comment.delCommentDom,
			$L		= $.kit.extra.language,
			ajax	= $.common.trans.comment,
			dEvent,
			msg 	= {
				'tips'		: $L('#L{确定要删除该回复吗？}')
				//'watermark'	: $L('#L{查找评论内容或评论人}')
			}, 
			getStyle= $.core.dom.getStyle,
			setStyle= $.core.dom.setStyle,
			searchPlugin, page, msgCount,
			tip;//诈骗广告tip黄条
		
		/**
		 * 检测当前页面是否是通过高级搜索打开的页面
		 */
		var checkSearch = function(){
			var parseURL;
			if($CONFIG['bigpipe'] === 'true' && $.historyM){
				parseURL = $.historyM.parseURL()
			} else{
				parseURL = window.location.href;
			}
			var cof = {'source': parseURL.url};
			var filter_by_author = $.core.str.queryString('filter_by_author', cof),
				filter_by_source = $.core.str.queryString('filter_by_source', cof);
			return (filter_by_author !== null || filter_by_source !== null);
		};
		
			
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
				parseURL = $.historyM.parseURL()
			} else{
				parseURL = window.location.href;
			}
			return $.core.str.queryString('page', {'source': parseURL.url}) || 1;
		};
 
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
		
		var ioFuns = {
			'currentEl': null,
			/**
			 * 删除评论
			 */
			'delComment': (function(){
				var onSuccess = function(rs){
					var cb = function(){
						commentNum(-1);
						msgCount -= 1;
						msgCount <= 0 && ioFuns.getComments({'page': getPage()});
					}
					delCom({
						'el'	: ioFuns.currentEl,
						'endCb'	: cb
					});
					
				};
				var delComAjax = ajax.getTrans('delete', {
					'onSuccess': onSuccess,
					'onFail': onSuccess
				});
				return function(spec){
					ioFuns.currentEl = getParent(spec.el, 'dl');
					delComAjax.request(spec.data);
				}
			})(),

			/**
			 * 获取评论
			 */
			'getComments': function(spec) {
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
					//$.historyM.setQuery(spec);
					ioFuns.searchComment(spec);
					return;
				}
				for (var key in spec) {
					if (spec[key] === null) {
						delete spec[key];
					}
				}
				var uri = '/at/comment',
						query = $.jsonToQuery(spec);
				query && (uri = '?' + query);
				window.location.href = uri;
			},
			'getCommentAll': function(spec) {

				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
					//$.historyM.setQuery(spec);
					ioFuns.searchCommentAll(spec);
					return;
				}
				for (var key in spec) {
					if (spec[key] === null) {
						delete spec[key];
					}
				}
				var uri = '/at/comment',
						query = $.jsonToQuery(spec);
				query && (uri = '?' + query);
				window.location.href = uri;
			},
			'searchComment' : function(spec) {
				ajax.getTrans('getComment', {
					'onComplete' : function(json) {
						$.historyM.setQuery(spec);
						nodes.comment_atmeSearch.innerHTML = json.data;
						destroy();
						init();
					}
				}).request(spec);
			},
			'searchCommentAll' : function(spec) {
				ajax.getTrans('getComment', {
					'onSuccess' : function(json) {
						var query = {};
						query.is_search = (typeof spec.is_search !="undefined" ? spec.is_search : null);
						query.key_word = (typeof spec.key_word !="undefined" ? spec.key_word : null);
						$.historyM.setQuery(query);
						nodes.comment_atmeSearch.innerHTML = json.data;
						nodes.searchkeyword.value = "";
						destroy();
						init();

					},
					'onFail' : function(json)
					{
						$.ui.alert(json.msg);
					},
					'onError' : function(json)
					{
						  $.ui.alert(json.msg);
					}
				}).request(spec);
			}
		};
 
		var bindDOMFuns = {
			'delComment': function(spec){
				var dia = $.ui.confirm(msg.tips, {
					'OK': function(){
						ioFuns.delComment(spec);
					}
				})
			},
			
			'filterClick': function(){
				$.preventDefault();
				var data = $.htmlToJson(nodes['searchBox']);
				ioFuns.getComments(data);
			},
			
			'playMagic': function(obj) {
				$.common.magic(obj.data.swf);
				return $.core.evt.preventDefault();
			},
			
			'showSearch': function(){
				$.preventDefault();
				nodes['searchBox'].style.display = '';
				nodes['tagBox'].style.display = 'none';
			},
			
			'hideSearch': function(){
				$.preventDefault();
				nodes['searchBox'].style.display = 'none';
				nodes['tagBox'].style.display = '';
				ioFuns.getComments({
					'filter_by_author': null,
					'filter_by_source': null,
					'page': null,
					'nofilter': 1
				});
			},
			
			'showReply': function(opts) {
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
			'all' : function(spec)
			{
				 bindDOMFuns.doFilter(spec);
				//nodes.all.className  ="current W_texta";
				//nodes.follow.className = "";
				$.preventDefault();
			},
			'follow' : function(spec)
			{
				bindDOMFuns.doFilter(spec);
				//nodes.all.className  ="";
				//nodes.follow.className = "current W_texta";
				$.preventDefault();
			},
			'doFilter' : function(spec)
			{

				if($CONFIG['bigpipe'] === 'true' && $.historyM){
				ajax.getTrans('getComment', {
					'onComplete' : function(json) {
						var query = {page:null};
						if(spec.data.filter_by_author)
						{
							query.filter_by_author = spec.data.filter_by_author;
						}
						else
						{
							 query.filter_by_author = null;;
						}
						$.historyM.setQuery(query);
						nodes.comment_atmeSearch.innerHTML = json.data;
						destroy();
						init();
					}
				}).request(spec.data);
				}else
				{
					window.location.href = spec.el.getAttribute("href");
				}
			},
			'back' : function(spec)
			{
				 $.preventDefault();
				ioFuns.searchCommentAll(spec.data);
			},
			'commentFilter' : function(spec)
			{

				if($CONFIG['bigpipe'] === 'true' && $.historyM){
					var url = $.kit.extra.parseURL();
				var query  = $.core.json.queryToJson(url.query);
					if(typeof query.key_word != "undefined")
					{
						spec.data.key_word = query.key_word;
					}
						if(typeof query.filter_by_author != "undefined")
					{
						spec.data.filter_by_author = query.filter_by_author;
					}
					if(typeof query.filter_by_source != "undefined")
					{
						spec.data.filter_by_source = query.filter_by_source;
					}
				ajax.getTrans('getComment', {
					'onComplete' : function(json) {
						$.historyM.setQuery(spec.data);
						nodes.comment_atmeSearch.innerHTML = json.data;
						destroy();
						init();
					}
				}).request(spec.data);
				}
				else
				{
					window.location.href = spec.el.getAttribute("href");
				}
				 $.preventDefault();
			}

		};
 
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
			msgCount = getCommentLength();
		};
 
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.myAtCommentList]: node is not a Node!";
			}
		};

		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};

		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function(){
			dEvent	= $.core.evt.delegatedEvent(node);
			var spec = {
				'input'		: nodes['searchkeyword'],
				'searchBtn'	: nodes['searchBtn'],
				//'msg'		: msg['watermark'],
				'searchCb'	: function(val){
					ioFuns.getCommentAll({
						'is_search': 1,
						'key_word': encodeURIComponent(val)
					});
				}
			};
			searchPlugin = $.common.comment.commentSearch(spec);
			if(nodes['tipsBar']) {
				//@我的页面关闭黄条使用的值为3，见common.trans.global的closetipsbar
				var CLOSE_TIP_TYPE = 3; 
				tip = $.comp.content.tipsBar(nodes['tipsBar'] , CLOSE_TIP_TYPE);				
			}
		};

		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function(){
			dEvent.add('delComment', 'click', bindDOMFuns.delComment);
			dEvent.add('filterComment', 'click', bindDOMFuns.filterClick);
			dEvent.add("feed_list_media_magic", "click", bindDOMFuns.playMagic);
			dEvent.add('showSearch', 'click', bindDOMFuns.showSearch);
			dEvent.add('hideSearch', 'click', bindDOMFuns.hideSearch);
			dEvent.add('replycomment', 'click', bindDOMFuns.showReply);
			dEvent.add('all', 'click', bindDOMFuns.all);
			dEvent.add('follow', 'click', bindDOMFuns.follow);
			dEvent.add("back",'click',bindDOMFuns.back);
			dEvent.add("feed_list_page_n",'click',bindDOMFuns.commentFilter);

		};

		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function(){
			searchPlugin && searchPlugin.destroy();
			dEvent.destroy();
			dEvent = null;
			nodes = null;
			tip && tip.destroy();
		};

		init();

		that.destroy = destroy;
	
		return that;
	};
});