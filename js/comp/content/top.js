/**
 * yuheng | yuheng@staff.sina.com.cn
 * top组件
 * 
 * 被 conf/public/top.js  conf/public/yunying_top.js 两个js引用（顶导外框）important
 * 
 * 这里列出了一个demo comp 需要实现的方法
 * @id comp.content.top
 * @param {Object} node 组件最外节点
 * 	需确保node节点包含属性node-type="guangchang" node-type="app" node-type="search_input" node-type="setting"的节点
 * @return {Object} 实例
 * @example
 * {
				'uid'            : '',
				'onick'        : '',
				'islogin'     : '',
				'language' : {},
				'bigpipe'    : '',
				'imgPath'  : DEFAULTIMGPATH,
				'page'        : '',
				'setCover'  : ''
}
 * @modified by lianyi,yuheng jump to other company
 * lianyi@staff.sina.com.cn
 * 2011年7月8日 添加顶导未登录版本登录弹出层 lianyi
 * 公开showLoginLayer方法至外部，用来显示统一登录弹层
 * 调用方法:
 * showLoginLayer('zh-cn');   显示简体中文版本的登录弹层
   showLoginLayer('zh-tw');   显示繁体中文版本的登录弹层
   修改搜索框下拉层
 */
$Import('common.channel.topTip');
$Import('common.trans.top');
$Import('kit.dom.parseDOM');
$Import('kit.dom.hover');
$Import('common.extra.toplang');
$Import('common.dialog.loginLayer');

STK.register("comp.content.top", function($){
	var analysis = (window.$CONFIG && window.$CONFIG.any) || '';
	var searcharg= analysis ? '?&topnav=1&topsug=1':'?&topsug=1';
	//---常量定义区----------------------------------
	var WEIQUNDOMAIN = 'http://q.weibo.com',
		SEARCHDOMAIN = 'http://s.weibo.com',
		DOMAIN = 'http://' + (document.domain == 'www.weibo.com' ? 'www.weibo.com' : 'weibo.com'),
		DEFAULTIMGPATH = 'http://img.t.sinajs.cn/t4/',
		//发现微群首页
		WEIQUNEXPLORE = 'http://q.weibo.com',
		//未读数接口
		UNREADAPI = "http://rm.api.weibo.com/remind/unread_count.json?source=3818214747&target=api",
		
		//搜索url
		SEARCHWEIBOURL = SEARCHDOMAIN + '/weibo/',
		SEARCHUSERURL = SEARCHDOMAIN + '/user/',
		SEARCHWEIQUNURL = SEARCHDOMAIN + '/q/',
		SEARCHAPPURL = SEARCHDOMAIN + '/apps/',
		
		USERSTATIC = '<#et suggest data>' +
		'<div class="selectbox"><p action-type="select" isStatic="1" durl="'+ SEARCHWEIBOURL +'${data.keywordlong}' + searcharg + '" class="title current">搜 “<span class="c_red">${data.keyword}</span>” #L{相关微博}»</p></div>' +
		'<div class="selectbox">' +
			'<p action-type="select" class="title" isStatic="1" durl="'+SEARCHUSERURL+'${data.keywordlong}' + searcharg + '">搜 “<span class="c_red">${data.keyword}</span>” #L{相关用户}»</p>' +
		'</div>' +
		'</#et>',
		
		//用户单条模版
		USERLIST = '<#et suggest data>' +
		'<div class="selectbox"><p action-type="select" isStatic="1" durl="'+ SEARCHWEIBOURL +'${data.keywordlong}' + searcharg + '" class="title current">搜 “<span class="c_red">${data.keyword}</span>” #L{相关微博}»</p>' +
		'<#list data.querys as list>'+
		'<p class="keyword" action-type="select" suda-data="key=${list.sudaKey}&value=${list.sudaValue}" durl="'+ SEARCHWEIBOURL +'${list.ekey}' + searcharg + '">${list.key}</p>'+
		'</#list>'+
		'</div>'+
		'<div class="selectbox">' +
			'<p action-type="select" class="title" isStatic="1" durl="'+SEARCHUSERURL+'${data.keywordlong}' + searcharg + '">搜 “<span class="c_red">${data.keyword}</span>” #L{相关用户}»</p>' +
			'<#if (data.userlist.length)>' +
			'<div node-type="userResult">' +
			'<#list data.userlist as list>'+
			'<dl class="clearfix" action-type="select" suda-data="key=${list.sudaKey}&value=${list.sudaValue}" durl="'+ DOMAIN + '/u/${list.u_id}' + searcharg + '">'+
				'<dt><img height="30" width="30" src="${list.u_pic}"></dt>'+
				'<dd>'+
					'<span><!--start-->${list.u_name}<!--end--><#if (list.is_v)><img class="<#if (list.verified_type)> approve_co<#else> approve</#if>" alt="" src="${data.imgPath}style/images/common/transparent.gif"></#if><#if (list.verified_type == 220)><img class="ico_club" alt="#L{微博达人}" title="#L{微博达人}" src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif"></#if></span>'+
					'<p class="area txtb">'+
					'<span class="${list.sex=="m"?"male":"female"}"></span> '+
					'<!--start-->#L{粉丝}:${list.fans_n} <#if (list.prov)>${list.prov}</#if><!--end-->'+
					'</p>'+
				'</dd>'+
			'</dl>'+
			'</#list>'+
			'</div>' +
			'</#if>'+
		'</div>' +
		'</#et>',
		
		//微群单条模版
		PLUSTPL = '<#et suggest data>' +
		'<#if (data.weiqun)>' +
		'<div class="selectbox">' +
			'<p action-type="select" class="title" isStatic="1" durl="'+ SEARCHWEIQUNURL +'${data.keywordlong}' + searcharg + '">搜 “<span class="c_red">${data.keyword}</span>” #L{相关微群}»</p>' +
			'<div node-type="weiqunResult">' +
				'<dl class="clearfix" action-type="select" suda-data="key=tblog_top_search_v4&value=weiqunc" durl="' + WEIQUNDOMAIN + '/${data.weiqun.id}' + searcharg + '">'+
					'<dt><span><img height="30" width="30" src="${data.weiqun.pic}"></span></dt>'+
					'<dd>'+
						'<span><!--start-->${data.weiqun.name}<!--end--><span class="${data.weiqun.grade}"></span></span>'+
						'<p class="txtb member">#L{成员}:${data.weiqun.members}</p>'+
					'</dd>'+
				'</dl>'+
			'</div>' +
		'</div>' +
		'</#if>'+
		'<#if (data.app)>' +
		'<div class="selectbox">' +
			'<p action-type="select" class="title" isStatic="1" durl="'+ SEARCHAPPURL +'${data.keywordlong}' + searcharg + '">搜 “<span class="c_red">${data.keyword}</span>” #L{相关应用}»</p>' +
			'<div node-type="appResult">' +
				'<dl class="clearfix" action-type="select" suda-data="key=tblog_top_search_v4&value=appc" durl="${data.app.link}' + searcharg + '">'+
					'<dt><span><img height="30" width="30" src="${data.app.pic}"></span></dt>'+
					'<dd>'+
						'<span><!--start-->${data.app.name}<!--end--></span>'+
						'<p class="txtb">#L{用户}:${data.app.owner_n}</p>'+
					'</dd>'+
				'</dl>'+
			'</div>'+
		'</div>' +
		'</#if>'+
		'</#et>',

		APPTPL ="<#et app data>"+ 
			'<#if (data.offical_app)>' +
			'<ul class="app_list">'+
			'<#list data.offical_app as list>' +
				'<li><a href="${list.link}" title="${list.name}" target="_top"><img height="16" width="16" alt="${list.name}" src="${list.icon}">${list.sname}</a></li>'+
			'</#list>' +
			'</ul>'+
			'</#if>' +
			'<#if (data.my_app)>' +
			'<div class="recent_app_list">'+
				'<div class="app_title clearfix"><p><a target="_top" title="#L{管理应用}" href="http://account.weibo.com/settings/connections">#L{管理应用}</a><em class="W_vline">|</em><a target="_top" title="#L{浏览更多}" href="'+DOMAIN+'/app?topnav=1">#L{浏览更多}</a></p><h3>#L{${(data.my_app[0].category_id=="3")? "最近使用":"推荐应用"}}</h3></div>'+
				'<ul>'+
				'<#list data.my_app as list>' +
					'<li><div><a target="_top" href="${list.link}" title="${list.name}" class="app_pic_bg"></a><img style="width: 50px; height: 50px;" alt="${list.name}" src="${list.icon}" class="app_img"></div><a target="_top" class="app_name" href="${list.link}">${list.sname}</a><p>${(list.category_id=="4")?"<em></em>":list.time}</p></li>'+
				'</#list>' +
				'</ul>'+
			'</div>'+
			'</#if>' +
		"</#et>",
		
		GAMETPL = '<#et game data>' +
					'<div class="border clearfix">' +
						'<ul class="game_recommend clearfix">' +
							'<#list data.suggest as list>' +
							'<li><a target="_top" href="${list.game_url}" title="${list.description}"><img width="100" height="50" src="${list.thumbnail}" />${list.name}</a></li>' +
							'</#list>' +
						'</ul>' +
					'</div>'+
					'<div class="border clearfix">' +
						'<#if (data.my.length)>' +
							'<ul class="yy_list">' +
								'<#list data.my as list>' +
								'<li><a target="_top" href="${list.game_url}"><img width="16" height="16" src="${list.icon}" />${list.name}</a></li>' +
								'</#list>' +
							'</ul>' +
							'<#if (data.myB)>' +
							'<ul class="yy_list">' +
								'<#list data.myB as list>' +
								'<li><a target="_top" href="${list.game_url}"><img width="16" height="16" src="${list.icon}" />${list.name}</a></li>' +
								'</#list>' +
							'</ul>' +
							'</#if>' +	
						'<#else>' +
							  '<div class="zero">#L{你还没有玩过任何游戏，现在就去}<a target="_top" href="http://game.weibo.com?origin=1021&topnav=1' + analysis + '">#L{体验一下}</a>#L{吧}!</div>' + 
						'</#if>' + 
					'</div>'+
				'</#et>',
		PLAZATPL = '<#et plaza data>' +
						'<div class="border clearfix">' +
							'<ul class="yy_list group_list">' +
								'<li><a target="_top" href="http://verified.weibo.com?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{名人堂}" src="${data.imgPath}style/images/common/ico_fame.gif">#L{名人堂}</a></li>' +
								'<li><a target="_top" href="http://club.weibo.com?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{微博达人}" src="${data.imgPath}style/images/common/ico_talstat.png">#L{微博达人}</a></li>' +
								'<li><a target="_top" href="http://data.weibo.com/top?topnav=1"><img width="16" height="16" alt="#L{风云榜}" src="${data.imgPath}style/images/common/ico_toplistof.gif">#L{风云榜}</a></li>' +
								'<li><a target="_top" href="' + DOMAIN + '/pub/topic?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{微话题}" src="${data.imgPath}style/images/common/ico_topic.gif">#L{微话题}</a></li>' +
								'<li><a target="_top" href="' + DOMAIN + '/jx/pic.php?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{微博精选}" src="${data.imgPath}style/images/common/ico_handpick.png">#L{微博精选}</a></li>' +
								'<li><a target="_top" href="' + DOMAIN + '/pub/news?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{随便看看}" src="${data.imgPath}style/images/common/ico_browsing.png">#L{随便看看}</a></li>' +
								'<li><a target="_top" href="' + DOMAIN + '/pub/city?source=toptray' + analysis + '"><img width="16" height="16" alt="#L{同城微博}" src="${data.imgPath}style/images/common/ico_city.png">#L{同城微博}</a></li>' +
								'<li><a target="_top" href="http://talk.weibo.com/?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{微访谈}" src="${data.imgPath}style/images/common/ico_interview.gif">#L{微访谈}</a></li>' +
								'<li><a target="_top" href="http://live.weibo.com/?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{微直播}" src="${data.imgPath}style/images/common/ico_microlive.gif">#L{微直播}</a></li>' +
								'<li><a target="_top" href="http://screen.weibo.com/?topnav=1' + analysis + '"><img width="16" height="16" alt="#L{大屏幕}" src="${data.imgPath}style/images/common/ico_screen.png">#L{大屏幕}</a></li>' + 
								'<li><a target="_top" href="' + DOMAIN + '/pub/topmblog?type=re&act=day&topnav=1&wvr=4' + analysis + '"><img width="16" height="16" alt="#L{热门微博}" src="${data.imgPath}style/images/common/ico_hot_fw.gif" >#L{热门微博}</a></li>' +
							'</ul>' +
						'</div>' + 
				   '</#et>',
		GROUPTPL = '<#et group data>' +
		'<#if (data.my)>' +
				'<div class="border clearfix">' +
					'<ul class="yy_list group_list">' +
					'<#list data.my as list>' +
						'<li><#if (list.g_new!="0")><span class="W_count"><span>${list.g_new}</span></span></#if><a target="_top" href="'+WEIQUNDOMAIN+'/${list.gid}?topnav=1"><img width="16" height="16" alt="${list.g_name}" src="${list.g_logo}">${list.g_name}</a></li>' +
					'</#list>' +
					'</ul>' +
					'<#if (data.myB)>' +
					'<ul class="yy_list group_list">' +
					'<#list data.myB as list>' +
						'<li><#if (list.g_new!="0")><span class="W_count"><span>${list.g_new}</span></span></#if><a target="_top" href="'+WEIQUNDOMAIN+'/${list.gid}?topnav=1"><img width="16" height="16" alt="${list.g_name}" src="${list.g_logo}">${list.g_name}</a></li>' +
					'</#list>' +
					'</ul>' +
					'</#if>'+
				'</div>' +
		'<#else>' +
			'<div class="border">' +
				'<div class="zero">#L{你还没有加入任何微群，现在就去}<a target="_top" href="' + WEIQUNEXPLORE + '?topnav=1' + analysis + '">#L{发现微群}</a>#L{吧}!</div>' +
			'</div>' +
			'<#if (data.suggest&&data.suggest.length)>' +
				'<table cellspacing="0" cellpadding="0" border="0" class="layer_title">' +
					'<thead>' +
						'<tr>' +
							'<td class="line">&nbsp;</td>' +
							'<td nowrap="">&nbsp;#L{热门微群推荐}&nbsp;</td>' +
							'<td class="line">&nbsp;</td>' +
						'</tr>' +
					'</thead>' +
				'</table>' +
				'<div class="border clearfix">' +
					'<ul class="yy_list group_list">' +
					'<#list data.suggest as list>' +
						'<li><a target="_top" href="'+WEIQUNDOMAIN+'/${list.gid}"><img width="16" height="16" alt="${list.g_name}" src="${list.g_logo}">${list.g_name}</a></li>' +
					'</#list>' +
					'</ul>' +
					'<#if (data.suggestB)>' +
						'<ul class="yy_list group_list">' +
						'<#list data.suggestB as list>' +
							'<li><a target="_top" href="'+WEIQUNDOMAIN+'/${list.gid}"><img width="16" height="16" alt="${list.g_name}" src="${list.g_logo}">${list.g_name}</a></li>' +
						'</#list>' +
						'</ul>' +
					'</#if>' +
				'</div>'+
			'</#if>'+
		'</#if>'+
		'</#et>',
		
		TIPTYPETPL = '<#et tip data>' + 
		'<#if (data.comment)>' +
		'<li${data.isNotice}>${data.comment}#L{条新评论}， <a target="_top" action-type="bp-link" bpfilter="main" href="' + DOMAIN + '/comment/inbox?f=1&topnav=1' + analysis + '">#L{查看评论}</a></li>' +
		'</#if>' +
		'<#if (data.attention)>' +
		'<li${data.isNotice}>${data.attention}#L{位新粉丝}， <a target="_top" href="' + DOMAIN + '/${data.userId}/fans?topnav=1' + analysis + '">#L{查看粉丝}</a></li>' +
		'</#if>' +
		'<#if (data.msg)>' +
		'<li${data.isNotice}>${data.msg}#L{条新私信}， <a target="_top" action-type="bp-link" action-data="goMsg=stop" bpfilter="main" href="' + DOMAIN + '/messages?topnav=1' + analysis + '">#L{查看私信}</a></li>' +
		'</#if>' +
		'<#if (data.atme)>' +
		'<li${data.isNotice}>${data.atme}#L{条新@提到我}， <a target="_top" action-type="bp-link" bpfilter="main" href="${data.atlink}?topnav=1' + analysis + '">#L{查看@我}</a></li>' +
		'</#if>' +
		'<#if (data.group)>' +
		'<li${data.isNotice}>${data.group}#L{条群内新消息}， <a target="_top" href="' + WEIQUNDOMAIN + '/message/proxJump.php?topnav=1' + analysis + '">#L{查看消息}</a></li>' +
		'</#if>' +
		'<#if (data.photo)>' +
		'<li${data.isNotice}>${data.photo}#L{条相册新消息}， <a target="_top" href="http://photo.weibo.com/messages/index?topnav=1' + analysis + '">#L{查看消息}</a></li>' +
		'</#if>' +
		'<#if (data.notice)>' +
		'<li${data.isNotice}>${data.notice}#L{条新通知}， <a target="_top" href="' + DOMAIN + '/systemnotice?topnav=1' + analysis + '">#L{查看通知}</a></li>' +
		'</#if>' +
		'<#if (data.invite)>' +
		'<li${data.isNotice}>${data.invite}#L{条新邀请}， <a target="_top" href="' + DOMAIN + '/invite/recv.php?topnav=1' + analysis + '">#L{查看邀请}</a></li>' +
		'</#if>' +
		'</#et>',
		
		NOTICELINKTPL = '<#et tip data>' + 
		'<#if (data.showTip)><li class="line"></li></#if>' + 
		'<#if (data.comment)>' +
		'<li><a target="_top" action-type="bp-link" action-data="hide=true" bpfilter="main" href="' + DOMAIN + '/comment/inbox?f=1&topnav=1' + analysis + '">#L{查看评论}</a></li>' +
		'</#if>' +
		'<#if (data.attention)>' +
		'<li><a target="_top" href="' + DOMAIN + '/${data.userId}/fans?topnav=1' + analysis + '">#L{查看粉丝}</a></li>' +
		'</#if>' +
		'<#if (data.msg)>' +
		'<li><a target="_top" action-type="bp-link" action-data="hide=true" bpfilter="main" href="' + DOMAIN + '/messages?topnav=1' + analysis + '">#L{查看私信}</a></li>' +
		'</#if>' +
		'<#if (data.atme)>' +
		'<li><a target="_top" action-type="bp-link" action-data="hide=true" bpfilter="main" href="' + DOMAIN + '/at/weibo?topnav=1' + analysis + '">#L{查看@我}</a></li>' +
		'</#if>' +
		'<#if (data.group)>' +
		'<li><a target="_top" href="' + WEIQUNDOMAIN + '/message/proxJump.php?topnav=1' + analysis + '">#L{查看群内消息}</a></li>' +
		'</#if>' +
		'<#if (data.photo)>' +
		'<li><a target="_top" href="http://photo.weibo.com/messages/index?topnav=1' + analysis + '">#L{查看相册消息}</a></li>' +
		'</#if>' +
		'<#if (data.notice)>' +
		'<li><a target="_top" href="' + DOMAIN + '/systemnotice?topnav=1' + analysis + '">#L{查看通知}</a></li>' +
		'</#if>' +
		'<#if (data.invite)>' +
		'<li><a target="_top" href="' + DOMAIN + '/invite/recv.php?topnav=1' + analysis + '">#L{查看邀请}</a></li>' +
		'</#if>' +
		'</#et>',
		
		NOTICETPL = '<#et notice data><ul>' + 
		'${data.newMsg}${data.linkMsg}' + 
		'</ul>' + 
		'</#et>';

		var LOADING = '<div class="W_loading"><span>#L{正在加载,请稍候...}</span></div>',
		
		//LOADINGS = '<div class="selectbox" style="text-align:center;"><div class="W_loading"><span></span></div></div>',

		//Search默认文案
		SEARCHDEFAULT = '#L{搜索微博、找人}',
		
		ASKTIME = 30 * 1000,

		DATATIME = 10 * 1000,

		DELAYTIME = 0.3 * 1000;

	//-------------------------------------------
	var addEvent = $.core.evt.addEvent,
		rmEvent  = $.core.evt.removeEvent,
		stopEvent = $.core.evt.stopEvent,
		preventDefault = $.core.evt.preventDefault,
		fixEvent = $.core.evt.fixEvent,
		delegatedEvent = $.core.evt.delegatedEvent,
		trim = $.core.str.trim,
		encodeHTML = function(str) {
			var tNode = document.createTextNode(str);
			var div = $.C('div');
			div.appendChild(tNode);
			var result = div.innerHTML;
			div = tNode = null;
			return result;
		},
		leftB = $.core.str.leftB,
		isArray = $.core.arr.isArray,
		arrIndexOf = $.core.arr.indexOf,
		lang = $.core.util.language,
		browser = $.core.util.browser,
		template = $.core.util.easyTemplate,
		getUniqueKey = $.core.util.getUniqueKey,
		sizzle = $.core.dom.sizzle,
		builder = $.core.dom.builder,
		isNode = $.core.dom.isNode,
		contains = $.core.dom.contains,
		position = $.core.dom.position,
		hasClass = $.core.dom.hasClassName,
		addClass = $.core.dom.addClassName,
		removeClass = $.core.dom.removeClassName,
		parseParam = $.core.obj.parseParam,
		jsonp = $.core.io.jsonp,

		trans    = $.common.trans.top.getTrans,
		//topTip事件通道
		channel  = $.common.channel.topTip,
		hover    = $.kit.dom.hover;
	
	//var uid, onick, islogin, bigpipe, imgPath, language ,needCover,coverId;
	var uid, onick, islogin, bigpipe, imgPath, language;
	var initPubSub = function(){
	    function PubSub() {
	        this.subscribers = {};
	    }
	    PubSub.prototype = {
	        publish : function(topic,message) {
				this.subscribers[topic] = this.subscribers[topic] ||[];
	            for (var i=0; i < this.subscribers[topic].length; i++) {
	                var observer = this.subscribers[topic][i];
					if(typeof observer === 'function'){
						var params = [];
		                for(var j=1,len=arguments.length; j < len; j++){
		                    params.push(arguments[j]);
		                }
		                observer.apply(this, params);
					}
	            }
	        },
	        subscribe : function(topic, listener,context){
	            this.subscribers[topic] = this.subscribers[topic]||[];
	            this.subscribers[topic].push(function(){
	                listener.apply(context,arguments);
	            });
	        }
	    };
	    window.__PubSub__ = window.__PubSub__ || new PubSub(); //用于全局通信
	}
	return function(node, opts){
		//---变量定义区----------------------------------
		//var	searchTimer, _nodes, inputCache, lastKey, lastKey, page, thisConfig, hoverList,coverIframe,scrollIe6,suggestSelect,
		var	searchTimer, _nodes, inputCache, lastKey, lastKey, page, thisConfig, hoverList,scrollIe6,
		that = {},
		loopNumber = 0,
		suggestIndex = 0,
		tipCache = {},
		searchCache = {},

		updateList = {},tipsParams = {},tipsLastResult , dEvent , noMessage = window.$CONFIG && window.$CONFIG.$webim == 1 , webImStarted , webImTimer , readyIm30 = 1,  webImCount = 0 , searchIsShow , keyOff;

		
		var inter = {
			'suggestUserFun' : function(data , params) {
				var keyword = params.key;
				if(data.key == lastKey){
					if( typeof searchCache[keyword] === "undefined"){
						searchCache[keyword] = {};
					}
					searchCache[keyword]['userlist'] = data.data.user;
					var temp;
					!data.data.querys && (data.data.querys=[]);
					if(data.data.querys){
						var f= '<span class="c_red">',l='</span>';
						for(var i=0;i<data.data.querys.length;i++){
							temp=data.data.querys[i].key;
							data.data.querys[i]['ekey']=encodeURIComponent(temp);
							data.data.querys[i]['key']=temp.replace(new RegExp(keyword,'g'),f+keyword+l);
						};
					}

					temp=i=null;
					searchCache[keyword]['querys'] = data.data.querys; //构造数据
					bindDOMFuns.rendBasic(searchCache[keyword] , keyword);
				}
			},
			'suggestPlusFun' : function(data , params) {
				var keyword = params.key;
				if(data.key == lastKey){
					if( typeof searchCache[keyword] === "undefined"){
						searchCache[keyword] = {};
					}
					var hasSearchResult = false , tmp;
					for(var k in data['data']){
						tmp = data['data'][k];
						searchCache[keyword][k] = tmp;
						if(tmp !== null) {
							hasSearchResult = true; 									
						}
					}
					if(!hasSearchResult) {
						searchCache[keyword]['noPlusResult'] = true;					
					}
					bindDOMFuns.rendPlus(searchCache[keyword] , keyword);
				}				
			}, 
			'suggestUser' : trans('suggest',{
				'onComplete' : function(data , params){
					inter.suggestUserFun(data , params);
					inter.suggestPlusFun(data , params);
				},
				'onSuccess' : function(){},
				'onError' : function(){}
			}),
//			'suggestPlus' : trans('suggest_ext',{
//				'onComplete' : function(data , params){
//					inter.suggestPlusFun(data , params);
//				},
//				'onSuccess' : function(){},
//				'onError' : function(){}
//			}),
			'cleanTipsNumber' : trans('setRead',{
				'onComplete' : function(){},
				'onSuccess' : function(){},
				'onError' : function(){}
			}),
			getTrans : function(type){
				return trans(type,
				{
					'onComplete' : function(){},
					'onSuccess'  : function(spec){
						updateList[type] = false;
						hoverList[type]['cb'](spec.data);
					},
					'onError' : function(){
						updateList[type] = false;
					}
				});
			}
		};
		//----------------------------------------------

		var custFuncs = {
			wordFilter : function(word) {
				return encodeURIComponent(encodeURIComponent(word));				
			} ,
			setBasicSudaData : function(key,arr) {
				if(arr && isArray(arr)) {
					var sudaKey = 'tblog_top_search_v4';
					for(var i = 0 , len = arr.length ; i < len ; i++) {
						arr[i].sudaKey = sudaKey;
						arr[i].sudaValue = key + (i + 1) + 'c'; 							
					}
				}				
			},
			//webim好了
			webimStarted : function() {
				//webIm好了我要知道，从这个时候开始，一直显示私信，30秒以后，如果还没好，也一直显示私信
				webImStarted = 1;
				readyIm30 = 1;
				clearTimeout(webImTimer);
			},
			//webim 通知进行私信小黄签显示
			webimShowMsg : function(num) {
				webImCount = parseInt(num , 10);
				//显示私信
				tipCache.msg = webImCount;
				custFuncs.rendTips(tipCache , true);
			},
			//method for login layer
			showLoginLayer : function(params) {
				$.common.dialog.loginLayer(params);
			},
			//method for ie6 set top pos
			adjustTopPos : function() {
				clearTimeout(scrollIe6);
				scrollIe6 = setTimeout(custFuncs.adjustTopPosImpl , 100);
			},
			adjustTopPosImpl : function() {
				var docTop = $.core.util.scrollPos().top , top;
				if(docTop > (tipsParams.topHeight - 2)) {
					top = docTop;
				} else {
					top = tipsParams.topHeight - 2;
				}
				_nodes.tipsLayer.style.top = top + 'px';
			},
			isVisible : function(node) {
				return node && node.offsetWidth && node.offsetHeight;
			},
            //蛋疼的接口改变json属性，修改源头，将新的属性的值赋值给旧的值，为了兼容原来的代码
            getNewJson : function(json){
                var newJson = {};
                var arrMap = [
                         ["feed","status"],
                         ["attention","follower"],
                         ["comment","cmt"],
                         ["msg","dm"],
                         ["atme","mention_status"],
                         ["atcmt","mention_cmt"],
                    	 ["group","group"],
                         ["notice","notice"],
                         ["invite","invite"],
                         ["badge","badge"],
                         ["photo","photo"]
                 ];
                var len = arrMap.length , keys;
                for(var i = 0 ; i < len ; i++) {
                	keys = arrMap[i];
                	newJson[keys[0]] = json[keys[1]];
                }
                return newJson;
            },
			sendRequest : function(){
				jsonp({
					'url' : UNREADAPI + "&user_id=" + uid + "&_pid=" + thisConfig['pid'] + "&count=" + loopNumber,
					'onComplete' : function(data){
						loopNumber++;
						if(data.code == 'A00006'){
							data.data = custFuncs.getNewJson(data.data);
							custFuncs.rendTips(data.data);
                            tipCache = data.data;
							channel.fire('refresh',tipCache);
						}
					},
					'onFail' : function() {},
					'onTimeout' : function() {}
				});
			},
			getLayerData : function(type){
				if(type != 'plaza') {
					var delayUpdate = [ 'game', 'group','application'];
					inter.getTrans(type).request();
					if(arrIndexOf(type,delayUpdate) >= 0){
						setTimeout(function(){
							updateList[type] = true;
						},DATATIME);
					}						
				} else {
					//insert plaza content
					_nodes.plazaContent.innerHTML = template(lang(PLAZATPL,language) , {imgPath : imgPath});
				}
			},
			getSearchSuggest : function(keyword){
				//显示静态的内容
				bindDOMFuns.rendStatic(keyword);
				//无论如何都会显示
				bindDOMFuns.suggestShow();
				if(typeof searchCache[keyword] !== 'undefined'){
					//searchShowLoad = 0;
					bindDOMFuns.rendBasic(searchCache[keyword] , keyword);
					if(!searchCache[keyword]['noPlusResult'] && !(searchCache[keyword]['app'] || searchCache[keyword]['weiqun'])){
						//inter.suggestPlus.request({key:keyword,_k:lastKey,uid:uid});
					} else {
						bindDOMFuns.rendPlus(searchCache[keyword] , keyword);						
					}
				}else{
					lastKey = getUniqueKey();
					/*
					if(searchShowLoad) {
						_nodes.basic.innerHTML = LOADINGS;						
					}
					*/
					//searchShowLoad = 0;
					inter.suggestUser.request({key:keyword,_k:lastKey,uid:uid});
					//inter.suggestPlus.request({key:keyword,_k:lastKey,uid:uid});
				}
				/*
				这些成为了历史，现在要求两个请求同时发出，显示的时候是先显示用户，再显示应用
				if(typeof searchCache[keyword] !== 'undefined'){
					bindDOMFuns.rendSuggest(searchCache[keyword] , keyword);
					if(!searchCache[keyword]['noPlusResult'] && !(searchCache[keyword]['app'] || searchCache[keyword]['weiqun'])){
						_nodes.plus.innerHTML = LOADINGS;
						lastKey = getUniqueKey();
						inter.suggestPlus.request({key:keyword,_k:lastKey,uid:uid});
					}
				}else{
					lastKey = getUniqueKey();
					inter.suggestUser.request({key:keyword,_k:lastKey,uid:uid});
				}
				*/
				//custFuncs.setCover(_nodes.searchSuggest);
			},
			
			replaceWeiqunClass : function(data){
				if(!data) return;
				if(typeof data.grade !== 'undefined'){
					data.grade = 'mg_rankicon' + (parseInt(data.grade) < 10 ? ('0' + data.grade) : data.grade);
				}
				return data;
			},
			getTipsResult : function(data , cache , atmenum , atcmtnum) {
				var result = {};
				var numArray = ["comment" , "attention" , "msg" , "atme" , "group" , "notice" , "invite" , "photo"],showTip;
				for(var i = 0 ; i < numArray.length ; i++) {
					if(showTip = showTip || data[numArray[i]]) {
						break;
					}
				}
				//是否显示小黄签
				result.showTip = showTip;
				if(showTip) {
					var newMsg = [];
					var linkMsg = [];
					//消息有新有旧
					for(var i = 0 ; i < numArray.length ; i++) {
						var tipType = numArray[i];
						if(data[tipType]) {
							newMsg.push(tipType);
						} else {
							//这种是链接
							linkMsg.push(tipType);
						}
					}
					result.newMsg = newMsg;
					result.linkMsg = linkMsg;
					try {
					    window.external.msSiteModeSetIconOverlay("http://img.t.sinajs.cn/t4/style/images/common/favicon/newMsg.ico", "新消息");
					} catch (e) {
					}
				} else {
					//应该全是旧消息
					result.newMsg = [];
					result.linkMsg = numArray;
					
					try {
					    window.external.msSiteModeClearIconOverlay();
					} catch (e) {
					}
					
				}
				result.newMsg = custFuncs.arrToObj(result.newMsg , data);
				result.linkMsg = custFuncs.arrToObj(result.linkMsg , data , true);
				result.linkMsg.userId = uid;
				result.linkMsg.atlink = ((atmenum == 0 && atcmtnum != 0)? (DOMAIN + '/at/comment'):(DOMAIN + '/at/weibo'));
				return result;
			},
			arrToObj : function(array , data , type) {
				var obj = {};
				for(var i = 0 ; i < array.length ; i++) {
					var key = array[i];
					if(type) {
						obj[key] = 1;
					} else {
						obj[key] = data[key];
					}
				}
				return obj;
			},
			tipsCompareIsNew : function(obj1 , obj2) {
				return custFuncs.compareObjEquals(obj1,obj2);
			},
			compareObjEquals : function(obj1 , obj2) {
				obj1 = obj1 || {};
				obj2 = obj2 || {};
				var count1 = 0,count2 = 0;
				for(var key in obj1) {
					count1 ++;
				}
				for(var key in obj2) {
					count2 ++;
				}
				if(count1 != count2) {
					return true;
				}
				var isNew = false;
				for(var key in obj1) {
					if(obj1[key] != obj2[key]) {
						isNew = true;
						break;
					}
				}
				return isNew;
			},
			rendLayerTips : function(result) {
				var isNew = custFuncs.tipsCompareIsNew(result.newMsg , tipsLastResult);
				if(isNew) {
						if(result.showTip) {
							result.newMsg.atlink = result.linkMsg.atlink;
							result.newMsg.userId = result.linkMsg.userId;
							//用于小黄签
							result.newMsg.isNotice = '';
							//新消息html
							var newHtml = template(lang(TIPTYPETPL,language) , result.newMsg);
							_nodes['tipsContent'].innerHTML = newHtml;
							if(browser.IE6) {
								custFuncs.adjustTopPos();
							}
							/*
							if(needCover) {
								custFuncs.addTipsIframe();
							}
							*/
							if(_nodes.layerNotice.style.display == 'none') {
								//显示小黄签
								_nodes['tipsLayer'].style.display = '';
							}
						} else {
							//隐藏小黄签
							_nodes['tipsLayer'].style.display = 'none';
							_nodes['tipsContent'].innerHTML = '';
						}	
				}
				return isNew;
			},
			/*
			addTipsIframe : function() {
				var layer = _nodes.tipsLayer;
				var ret = sizzle('iframe' , layer) , cover;
				if(ret.length) {
					cover = ret[0];
				} else {
					cover = custFuncs.createIframe('weibo_tips_cover' + getUniqueKey());
					cover.style.left = '-1px';
					cover.style.top = '-1px';
					cover.style.zIndex = -1;
					layer.appendChild(cover);
				}
				var size = $.core.dom.getSize(layer);
				cover.style.width = size.width + 'px';
				cover.style.height = size.height + 'px';
			},
			*/
			rendNoticeTips : function(result , isNew) {
				if(isNew) {
						//用于小黄签
						result.newMsg.isNotice = ' class="message"';
						result.linkMsg.showTip = result.showTip;
						//新消息html
						var newHtml = template(lang(TIPTYPETPL,language) , result.newMsg);
						//link的html
						var linkHtml = template(lang(NOTICELINKTPL,language) , result.linkMsg);
						var resultHtml = template(lang(NOTICETPL , language) , {
							newMsg:newHtml,
							linkMsg:linkHtml
						});
						_nodes.noticeContent.innerHTML = resultHtml;
				}
				delete result.newMsg.isNotice;
				delete result.newMsg.atlink;
				delete result.newMsg.userId;
				tipsLastResult = result.newMsg;
			},
			rendTips : function(datas , callFromWebIm){
				var data = parseParam(datas , {});
				var cache = parseParam(tipCache , {});
				var atmenum = data.atme;
				var atcmtnum = data.atcmt;

				//Changed by WK  暂时不需要atcmt
				data.atme += data.atcmt;
				cache.atme += cache.atcmt;
				if(noMessage) {
					if(!callFromWebIm) {
						//不从webim调用
						if(readyIm30 || webImStarted) {
							data.msg = webImCount;
						}
					} 
				}
				var result = custFuncs.getTipsResult(data , cache , atmenum , atcmtnum);
				//渲染小黄签
				var isNew = custFuncs.rendLayerTips(result);
				//渲染消息中心
				custFuncs.rendNoticeTips(result , isNew);
			},
			rendApp : function(data){
				var my_app = data.my_app;
				var offical_app = data.offical_app;

				for(var i = 0; i<offical_app.length; i++){
					offical_app[i].sname = leftB(offical_app[i].name,8);
				}

				for(var i = 0; i<my_app.length; i++){
					my_app[i].sname = leftB(my_app[i].name,10);
				}
				
				_nodes.appContent.innerHTML = template(lang(APPTPL,language),data);
				//custFuncs.setCover(hoverList.application.layer);
			},
			rendGame : function(data){
				for(var i in data){
					if(isArray(data[i])){
						for(var j =0; j <data[i].length; j++){
							data[i][j].name = leftB(data[i][j].name,12);
						}
						if(data[i].length > 6){
							data[i+'B'] = data[i].splice(6,6);
						}
						if(data[i].length > 6) {
							data[i] = data[i].splice(0 , 6);
						}
					}
				}
				_nodes.gameContent.innerHTML = template(lang(GAMETPL,language),data);
			},
			rendGroup : function(data){
				var tmp;
				for(var i in data){
					if(isArray(data[i])){
						for(var j =0; j <data[i].length; j++){
							data[i][j].g_name = leftB(data[i][j].g_name,12);
							tmp = parseInt(data[i][j].g_new) || 0;
							tmp > 99 ? (tmp = '99+') : (tmp = tmp.toString());
							data[i][j].g_new = tmp;
						}
						if(data[i].length > 10){
							data[i+'B'] = data[i].splice(10,10);
						}
						if(data[i].length > 10) {
							data[i] = data[i].splice(0 , 10);
						}
					}
				}
				_nodes.groupContent.innerHTML = template(lang(GROUPTPL,language),data);
				var itemsLength = sizzle('ul.group_list li' , _nodes.groupContent).length;
				if(itemsLength > 10) {
					_nodes.layerGroup.style.width = '270px';
				} else {
					_nodes.layerGroup.style.width = '135px';
				}
				//custFuncs.setCover(hoverList.group.layer);
			},
			'bindHover' : function(type){
				hover({
					act : hoverList[type].act,
					delay : DELAYTIME,
					extra : [hoverList[type].layer],
					onmouseover : function(){
						bindDOMFuns.showHover(type);
					},
					onmouseout : function(){
						bindDOMFuns.hideHover(type);
					}
				});
			},
			/*
			'setCover' : function(node){
				//如果不要iframe遮盖和不是IE6的话，直接返回
				
				if(!needCover) 	return;
				var cover = custFuncs.getCover();
				if(!$.E(coverId)) {
					document.body.appendChild(cover);
				}
				var pos = position(node);
				cover.style.width = node.offsetWidth + 'px';
				cover.style.height = node.offsetHeight + 'px';
				cover.style.left = pos.l + 'px';
				cover.style.top = pos.t + 'px';
				cover.style.display = '';
				node.cover = cover;
			},
			'createIframe' : function(id) {
					var cover = $.C('iframe');
					cover.frameBorder = 0;
					cover.tabIndex = -1;
					cover.src = 'about:blank';
					cover.name = id;
					cover.id = id;
					cover.style.border = 'none';
					cover.style.position = 'absolute';
					cover.style.filter = 'alpha(opacity=0)';
					return cover;
			},
			'getCover' : function() {
				if(!coverIframe) {
					var cover = custFuncs.createIframe(coverId);
					cover.style.display = 'none';
					coverIframe = cover;
				}
				return coverIframe;
			},
			
			'removeCover' : function(node){
				//needCover && node && node.cover && node.cover.parentNode && node.cover.parentNode.removeChild(node.cover);
			},
			*/
			surprise : function(type){
				var value = custFuncs.strFilter(_nodes.searchInput.value);
				if(type == "@"){
					_nodes.searchInput.value = '';
					window.top.location.href = DOMAIN + "/n/" + value;
					return true;
				}else if(type == "#"){
					_nodes.searchInput.value = '';
					window.top.location.href = "http://s.weibo.com/weibo/" + value;
					return true;
				}
				return false;
			},

			strFilter : function(str){
				return trim(str).replace(/[\\\$\^\*\.\[\]\(\)\{\}\?]/g,'');
			}
		};
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			emptySearchSubmit : function(e) {
				e = fixEvent(e);
				if(e.keyCode == 13) {
						var value = trim(_nodes.searchInput.value);
						if(value == '' && !keyOff) {
							window.top.location.href = SEARCHDOMAIN;
							return ;
						}
				}
			},
			loginBtn : function() {
				custFuncs.showLoginLayer(thisConfig);
				preventDefault();
			},
			closeTip : function() {
				_nodes.tipsLayer.style.display = 'none';
				_nodes.tipsContent.innerHTML = '';
				//请求接口清0
				inter.cleanTipsNumber.request();
				//noticeContent更新
				var tmp = {"comment" : 1 , "attention" : 1 , "msg" : 1 , "atme" : 1 , "group" : 1 , "notice" : 1, "invite" : 1, "atcmt" : 1 , "photo" : 1};
				//清理tipCache里面的数据
				for(var key in tmp) {
					if(typeof tipCache[key] != "undefined") {
						tipCache[key] = 0;
					}
				}
				custFuncs.rendTips(tipCache);
				//通知别人做事
				channel.fire('refresh',tipCache);
				//ie6 for javascript:void(0)
				preventDefault();
			},
			menuChoose : function(){
				var hash = arguments[0];
				var hashList = {};
				var _reg = /^[\\|\/](.+)/;
				hashList[onick] = _nodes.home;
				hashList[uid] = _nodes.home;
				hashList['home'] = _nodes.home;

				hash = hash.replace(_reg,'$1').replace(/[\\|\/]/ig,'|');
				for(var k in hashList){
					hashList[k] && removeClass(hashList[k],'current');
				}
				$.addClassName(hashList[hash],'current');
			},
			searchInputCheck : function(value){
				if(value === '' || value === lang(SEARCHDEFAULT,language)){
					return false;
				}else{
					return true;
				}
			},
			searchFocus : function(){
				var searchInput = _nodes.searchInput , value = custFuncs.strFilter(searchInput.value),
					hasContent = bindDOMFuns.searchInputCheck(value);

				if(value === lang(SEARCHDEFAULT,language)){
					searchInput.value = '';
				}
				if(hasContent) {
					//显示静态的内容
					bindDOMFuns.rendStatic(value);
					bindDOMFuns.suggestShow();
					if(searchCache[value]){
						bindDOMFuns.rendSuggest(searchCache[value] , value);
					}					
				}
				if(searchInput && searchInput.parentNode) {
					addClass(searchInput.parentNode,'search_current');
				}
				searchTimer = setInterval(bindDOMFuns.searchDetect , 200);
			},
			searchBlur : function(){
				var searchInput = _nodes.searchInput ,  value = custFuncs.strFilter(searchInput.value);
				_nodes.searchInput.value = ((value === '')?lang(SEARCHDEFAULT,language):searchInput.value);
				if(searchInput && searchInput.parentNode) {
					removeClass(searchInput.parentNode,'search_current');
				}
				bindDOMFuns.suggestBlur();
				clearInterval(searchTimer);
			},
			suggestShow : function(){
				if (searchIsShow) {
					return;
				}
				_nodes.searchSuggest.style.display = '';
				addEvent(document, 'click', bindDOMFuns.suggestBlur);
				addEvent(_nodes.searchInput,'keydown',bindDOMFuns.suggestKeySelect);
				searchIsShow = 1;
			},
			suggestHide : function(){
				if(!searchIsShow) {
					return;					
				}
				_nodes.searchSuggest.style.display = "none";
				rmEvent(document,'click',bindDOMFuns.suggestBlur);
				rmEvent(_nodes.searchInput,'keydown',bindDOMFuns.suggestKeySelect);
				searchIsShow = 0;
				bindDOMFuns.suggestClear();
				//custFuncs.removeCover(_nodes.searchSuggest);
			},
			suggestBlur : function(){
				//searchShowLoad = 1;
				var node = _nodes.searchSuggest,
					pnode = node.parentNode,
					target = fixEvent().target;
				
				if(isNode(target) && contains(pnode ,target)){
					return false;
				}else{
					bindDOMFuns.suggestHide();
				}
			},
			searchDetect : function(e){
				var node = _nodes.searchInput,
					value = custFuncs.strFilter(node.value),
					hasContent = bindDOMFuns.searchInputCheck(value);
				if(inputCache == value){
					return false;
				}
				//bindDOMFuns.suggestClear();
				inputCache = value;
				
				if(!hasContent){
					bindDOMFuns.suggestHide();
					return false;
				}else{
					custFuncs.getSearchSuggest(value);							
				}
			},
			rendStatic : function(word) {
				var data = {
					keyword : encodeHTML(word.length>12?(leftB(word,12)+'...'):word),
					keywordlong : custFuncs.wordFilter(word)					
				};
				var tempstr = template(lang(USERSTATIC),data).toString();
				_nodes.basic.innerHTML = bindDOMFuns.suggestHighLight(word,tempstr); 			
			},
			rendBasic : function(data , word){
				data['imgPath'] = imgPath;
				data['keywordlong'] = custFuncs.wordFilter(word);
				data['keyword'] = encodeHTML(word.length>12?(leftB(word,12)+'...'):word);
				custFuncs.setBasicSudaData('user_0',data.userlist);
				custFuncs.setBasicSudaData('key_0',data.querys);
				if(data.userlist || data.querys){
					var tempstr = template(lang(USERLIST),data).toString();
					_nodes.basic.innerHTML = bindDOMFuns.suggestHighLight(word,tempstr);
				}
			},
			rendPlus : function(data , word){
				data['imgPath'] = imgPath;
				data['keywordlong'] = custFuncs.wordFilter(word);
				data['keyword'] = encodeHTML(word.length>12?(leftB(word,12)+'...'):word);
				
				custFuncs.replaceWeiqunClass(data['weiqun']);
				data['app'] && (data['app']['rank'] = data['app']['rank']*20);
				var tempstr = template(lang(PLUSTPL),data).toString();
				_nodes.plus.innerHTML = bindDOMFuns.suggestHighLight(word,tempstr);
			},
			rendSuggest : function(data , keyword){
				bindDOMFuns.rendBasic(data , keyword);
				bindDOMFuns.rendPlus(data , keyword);
			},
			suggestClear : function(){
				var nodeArr = [_nodes.basic,_nodes.plus]

				for(var i=0; i<nodeArr.length; i++){
					nodeArr[i].innerHTML = '';
				}

				suggestIndex = 0;
			},
			suggestHighLight : function(word,str){
				var _regexp = new RegExp("<\\!\\-\\-start\\-\\->(.*?)<\\!\\-\\-end\\-\\->", "ig");
				var readyStr = str.replace(_regexp, function(){
					return arguments[1].replace(new RegExp(word,"g"),'<span node-type="input" class="c_red">'+ word + '</span>');
				});
				return readyStr;
			},
			suggestSelectInit : function(){
				var parentNode = _nodes.searchSuggest,
					suggestSelect = delegatedEvent(parentNode);
				suggestSelect.add('select','mouseover',bindDOMFuns.suggestSelect);
				suggestSelect.add('select','click',bindDOMFuns.goSuggest);
			},
			suggestSelect : function(opts){
				var nodelist = sizzle('[action-type="select"]',_nodes.searchSuggest),
					actionIndex = arrIndexOf(opts.el,nodelist),
					originNode = sizzle('.current',_nodes.searchSuggest)[0];

					if(suggestIndex == actionIndex || actionIndex < 0){
						return false;
					}
					originNode && removeClass(originNode,'current');
					nodelist[actionIndex] && addClass(nodelist[actionIndex],'current');
					suggestIndex = actionIndex;
			},
			suggestKeySelect : function(){
				var e = fixEvent(),
					nodelist = sizzle('[action-type="select"]',_nodes.searchSuggest),
					length = nodelist.length;
				
				if (length) {
					for (var i = 0; i < length; ++i) {
						if (hasClass(nodelist[i],'current')) {
							suggestIndex = i;
						}
						removeClass(nodelist[i],'current');
					}
				}

				if (e.keyCode == "9" || e.keyCode == "27"){
					bindDOMFuns.suggestHide();
					_nodes.searchInput.blur();
				}else if (e.keyCode == "38") {
					suggestIndex--;
				}else if (e.keyCode == "40") {
					suggestIndex++;
				}else if(e.keyCode == "13") {
					preventDefault();
					if(e.ctrlKey == true){
						if(custFuncs.surprise("@")){
							return false;
						};
					}
					if(e.shiftKey == true){
						if(custFuncs.surprise("#")){
                                                        return false;
                                                };
					}
					bindDOMFuns.goSuggest({el:nodelist[suggestIndex]});
				}
				
				if (suggestIndex < 0) {
					suggestIndex = length - 1;
				}else if (suggestIndex > (length - 1)) {
					suggestIndex = 0;
				}

				nodelist[suggestIndex] && addClass(nodelist[suggestIndex],'current');
			},
			goSuggest : function(opts){
				keyOff = 1;
				setTimeout(function() {
					keyOff = 0;
				} , 50);
				var value = trim(_nodes.searchInput.value);
				if(value == '') {
					window.top.location.href = SEARCHDOMAIN;
					return;
				}
				_nodes.searchInput.value = '';
				try {
					_nodes.searchInput.blur();
				} catch(e) {}
				if(opts.el){
					var isClick = opts.evt && opts.evt.type == 'click';
					//回车跳转的时候下suda.track发送suda代码
					if(isClick) {
						stopEvent(opts.evt);
					}
					var sudaValue = opts.el.getAttribute('suda-data');
					if(sudaValue) {
							sudaValue = sudaValue.match(/key=.+?&value=(.+)$/)[1];
							if(!isClick) {
								sudaValue = sudaValue.replace(/c$/ , 'k');
							}
							if(window.SUDA) {
								window.SUDA.uaTrack && window.SUDA.uaTrack('tblog_top_search_v4' , sudaValue);	
							} else {
								window.GB_SUDA && window.GB_SUDA._S_uaTrack && window.GB_SUDA._S_uaTrack('tblog_top_search_v4' , sudaValue);
							}
							
					}
					var isStatic = opts.el.getAttribute("isStatic") === "1";
					var url = opts.el.getAttribute('durl');
					if(isStatic) {
						url = url.replace(/\/[^\/]+?(?=\?topnav=1)/ , "/" + custFuncs.wordFilter(value));						
					}
					setTimeout(function() {
						window.top.location.href = url;
					} , 100);
				}
				bindDOMFuns.suggestHide();
			},
			goSearch : function(){
				var value = trim(_nodes.searchInput.value);
				stopEvent();
				if(value === '' || value === lang(SEARCHDEFAULT,language)){
					window.top.location.href = SEARCHDOMAIN;
				}else{
					_nodes.searchInput.value = '';
					window.top.location.href = SEARCHWEIBOURL + custFuncs.wordFilter(value) + "?topnav=1";
				}
			},
			showHover : function(type){
				/*
				if(needCover && _nodes.searchSuggest.style.display != 'none') {
					try {
						_nodes.searchInput.blur();
					} catch(e) {}
					bindDOMFuns.suggestHide();
				}
				*/
				var content = hoverList[type]['content'];
				if(custFuncs.isVisible(content)) {
					return;
				}
				if('notice|account'.indexOf(type) != -1) {
					_nodes.tipsLayer.style.display = 'none';	
				}
				var node = hoverList[type]['act'];
				var layer = hoverList[type]['layer'];
				
				var update = updateList[type];

				if(type != 'notice' && content && (typeof update == "undefined" || update)){
					if(type != 'plaza') {
						content.innerHTML = lang(LOADING);
					}
					custFuncs.getLayerData(type);
				}
				if(node == _nodes[page]){
					removeClass(node, "current_page");
				}
				layer.style.display = '';
				addClass(node, "current");
				
				//custFuncs.setCover(layer);
			},
			hideHover : function(type){
				if('notice|account'.indexOf(type) != -1) {
					_nodes.tipsLayer.style.display = sizzle('li' , _nodes.tipsLayer).length ? '' : 'none';
				}
				var node = hoverList[type]['act'];
				var layer = hoverList[type]['layer'];

				layer.style.display = 'none';
				removeClass(node, "current");
				if(node == _nodes[page]){
					addClass(node, "current_page");
				}
				//custFuncs.removeCover(layer);
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {};
		//----------------------------------------------
		
		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {};
		//-------------------------------------------

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
			initPubSub();//外部顶导与WEBIM通信的解决方案
			eventInit();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		
		var argsCheck = function(){
			var config = opts || window.$CONFIG || {};
			thisConfig =  parseParam({
				'uid'            : '',
				'onick'        : '',
				'islogin'     : '',
				'language' : null,
				'lang' : "zh-cn",
				'bigpipe'    : false,
				'imgPath'  : DEFAULTIMGPATH,
				'page'        : null,
				'setCover'  : false,
				'backurl' : '/',
				'loginSuccessUrl' : window.location.href,
				'pid' : 0
			},config);
			if(thisConfig.lang == 'zh-tw') {
				thisConfig.language = thisConfig.language || $.common.extra.toplang;
			}
			opts = opts || {};
			thisConfig = parseParam(thisConfig,opts);
			uid     = thisConfig['uid'];
			onick = thisConfig['onick'];
			islogin = parseInt(thisConfig['islogin']) || 0;
			language = thisConfig['language'];
			bigpipe = thisConfig['bigpipe'];
			page = thisConfig['page'];
			imgPath = thisConfig['imgPath'];
			/*
			needCover = browser.IE6;
			if(needCover) {
				coverId = 'weibo_top_cover' + getUniqueKey();
				$.core.dom.ready(function() {
					custFuncs.getCover();
				});
			}
			*/
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function(){
			if (opts && opts.html) {
				node.innerHTML = opts.html;
			}
			_nodes = $.kit.dom.parseDOM(builder(node).list);
			_nodes[page] && addClass(_nodes[page],'current_page');
			_nodes['searchInput'].value = lang(SEARCHDEFAULT,language);
			_nodes['searchInput'].setAttribute('name',getUniqueKey());
			if(islogin) {
				var div = $.C('div');
				div.innerHTML = '<div class="layer_message_box" style="display:none;"><ul></ul><a class="W_close_color" href="javascript:void(0);"  action-type="closeTip"></a></div>';
				div = div.firstChild;
				sizzle('div.header' , node)[0].appendChild(div);
				_nodes['tipsLayer'] = div;
				_nodes['tipsContent'] = sizzle('ul' , div)[0];
				_nodes['closeTip'] = sizzle('a[action-type="closeTip"]' , div)[0];
				tipsParams.topHeight = sizzle('div.global_header' , node)[0].offsetHeight;
				//先把html塞到noticeContent里面，避免unread超时出bug
				var tipData = {"photo":1,"comment":1,"attention":1,"msg":1,"atme":1,"group":1,"notice":1,"invite":1,"userId":uid};
				var linkHtml = '<ul>' + template(lang(NOTICELINKTPL,language),tipData) + '</ul>';
				_nodes.noticeContent.innerHTML = linkHtml;
				//修改退出链接
				_nodes.exit.href = _nodes.exit.href.replace("backurl=/" , "backurl=" + thisConfig.backurl);
			}
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function(){
			hoverList = {
				'application' : {
					'act' : _nodes.app,
					'layer' : _nodes.layerApp,
					'content' : _nodes.appContent,
					'cb' : custFuncs.rendApp
				},
				'group' : {
					'act' : _nodes.group,
					'layer' : _nodes.layerGroup,
					'content' : _nodes.groupContent,
					'cb' : custFuncs.rendGroup
				},
				'account' : {
					'act' : _nodes.account,
					'layer' : _nodes.layerAccount
				},
				'notice' : {
					'act' : _nodes.notice,
					'layer' : _nodes.layerNotice,
					'content' : _nodes.noticeContent
				},
				'game' : {
					'act' : _nodes.game,
					'layer' : _nodes.layerGame,
					'content' : _nodes.gameContent,
					'cb' : custFuncs.rendGame
				},
				'plaza' : {
					'act' : _nodes.plaza,
					'layer' : _nodes.layerPlaza,
					'content' : _nodes.plazaContent
				}
			};
		};
		//-------------------------------------------
		
		var eventInit = function(){
			if(!islogin){
				return;
			}
			setTimeout(function() {
				custFuncs.sendRequest();
				setInterval(custFuncs.sendRequest , ASKTIME);
			},3000);
			if(noMessage) {
				webImTimer = setTimeout(function() {
					if(webImStarted) {
						readyIm30 = 1;
					} else {
						readyIm30 = 0;
					}
				} , 30000);								
			}
		};
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function(){
			addEvent(_nodes.searchInput,'focus',bindDOMFuns.searchFocus);
			addEvent(_nodes.searchInput,'blur',bindDOMFuns.searchBlur);
			addEvent(_nodes.searchInput,'keydown',bindDOMFuns.emptySearchSubmit);
			addEvent(_nodes.searchSubmit,'click',bindDOMFuns.goSearch);
			//绑定搜索
			bindDOMFuns.suggestSelectInit();
			//未登录登录层开始
			if(!islogin) {
				addEvent(_nodes.loginBtn , 'click' , bindDOMFuns.loginBtn);
				return;
			}
			//未登录登录层结束
			//ie6 小黄签跟随移动开始
			if(browser.IE6) {
				addEvent(window , 'scroll' , custFuncs.adjustTopPos);
				addEvent(window , 'resize' , custFuncs.adjustTopPos);
			}
			//ie6 小黄签跟随移动结束
			
			
			//搜索框开始
			
			/*
			addEvent(_nodes.searchInput,'keyup',bindDOMFuns.searchKeyUp);
			if(browser.OPERA) {
				addEvent(_nodes.searchInput,'input',bindDOMFuns.searchKeyUp);					
			} else {
				addEvent(_nodes.searchInput,'paste',function() {
					setTimeout(function() {
						bindDOMFuns.searchKeyUp();					
					} , 0);
				});								
			}
			*/
			//搜索框结束
			
			
			
			//代理连接开始
			dEvent = delegatedEvent(node);
			dEvent.add('dyn-click', 'click', function(opts){
				_nodes.searchInput.value = '';
				window.top.location.href = opts.el.getAttribute('durl');
			});
			dEvent.add("bp-link" , "click" , function(opts) {
				if(window.$CONFIG && window.$CONFIG['bpType'] === 'main') {
					if(opts.data.hide === 'true') {
						try {
							opts.el.blur();
						} catch(e) {}
						_nodes.layerNotice.style.display = 'none';
						removeClass(_nodes.notice, "current");			
					}						
				}
				if(webImStarted) {
					if(opts.data.goMsg === 'stop') {
//						$.core.util.listener.fire('common.channel.webim' , 'messageTipClicked' , [true]);
						window.__PubSub__.publish('webim.messageTipClicked',true);
						stopEvent(opts.evt);
					}
				}
			});
			//代理连接结束
			//绑定下拉开始
			//notice是消息中心
			var bindList = ['application', 'group','account','notice','game','plaza'];
			for(var i = 0; i < bindList.length; i++){
				custFuncs.bindHover(bindList[i]);
			}
			//绑定下拉结束
			if(bigpipe == 'true'){
				$.historyM && $.historyM.onpopstate && $.historyM.onpopstate(bindDOMFuns.menuChoose);
			}
			//小黄签的关闭
			addEvent(_nodes.closeTip , 'click' , bindDOMFuns.closeTip);
			
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function(){};
		//-------------------------------------------
		
		//---广播事件绑定方法定义区------------------------
		var bindListener = function(){
			channel.register('readed',custFuncs.sendRequest);
			if(noMessage) {
//				$.core.util.listener.register('common.channel.webim' , 'connected' , custFuncs.webimStarted);
//				$.core.util.listener.register('common.channel.webim' , 'showMessage' , custFuncs.webimShowMsg);
				window.__PubSub__.subscribe('webim.connected',custFuncs.webimStarted);
				window.__PubSub__.subscribe('webim.showMessage',custFuncs.webimShowMsg);
			}
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = function(){};
		//-------------------------------------------
		that.showLoginLayer = custFuncs.showLoginLayer;
		return that;
	};
});
