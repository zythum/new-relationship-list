/**
 * yuheng | yuheng@staff.sina.com.cn
 * top组件 独立部署版本
 * modified by lianyi@staff.sina.com.cn
 * 2011年7月8日 添加顶导未登录版本的登录弹出层 lianyi
   为WBtopPublic添加showLoginLayer方法，用来显示登录弹层
   1.WBtopPublic.showLoginLayer('zh-cn');   显示简体中文版本的登录弹层
   2.WBtopPublic.showLoginLayer('zh-tw');   显示繁体中文版本的登录弹层
   2011年7月13日 添加广场超链接，找人超链接
 */
var WBtopPublic = (function(){
	$Import('core.STK');
	$Import('core.evt.addEvent');
	$Import('core.evt.removeEvent');
	$Import('core.evt.fixEvent');
	$Import('core.evt.preventDefault');
	$Import('core.evt.delegatedEvent');
	$Import('core.evt.stopEvent');
	$Import('core.dom.sizzle');
	$Import('core.dom.addClassName');
	$Import('core.dom.removeClassName');
	$Import('core.dom.contains');
	$Import('core.dom.position');
	$Import('core.dom.isNode');
	$Import('core.dom.hasClassName');
	$Import('core.dom.builder');
	$Import('core.str.trim');
	$Import('core.str.leftB');
	$Import('core.arr.inArray');
	$Import('core.arr.indexOf');
	$Import('core.obj.parseParam');
	$Import('core.io.jsonp');
	
	$Import('core.util.listener');
	
	$Import('core.util.language');
	$Import('core.util.getUniqueKey');
	$Import('core.util.easyTemplate');
	$Import('core.util.browser');
	$Import('common.extra.toplang');
	$Import('core.dom.ready');
	$Import('core.dom.getSize');
	$Import('core.util.scrollPos');
	$Import('core.io.scriptLoader');
	$Import('comp.content.top');
	var $ = STK;
	var that = {};
	var opts = {
		'imgPath' : 'http://img.t.sinajs.cn/t4'
	};
	$.listener = $.core.util.listener;
	$.parseParam = $.core.obj.parseParam;
	$.jsonp = $.core.io.jsonp;
	$.bLength = $.core.str.bLength;
	$.leftB = $.core.str.leftB;
	
	that.init = function(spec){
		var node = $.E("weibo_top_public");
		var TPL = spec.islogin?LOGINTPL:NOLOGINTOL;

		opts.name = spec.name;
		opts.beautyname = $.bLength(opts.name)>12 ? $.leftB(opts.name , 12) + "..." : opts.name;
		opts.verify = (typeof spec.verify != 'undefined')?spec.verify:0;
		opts.uid = spec.uid;
		opts.icon = spec.icon;
		opts.search_switch = spec.search_switch;
		opts.inviteCode= spec.inviteCode|| (window.$CONFIG && window.$CONFIG.inviteCode) || '';
		opts.entry= spec.entry || (window.$CONFIG && window.$CONFIG.entry) || '';
		spec.lang = spec.lang || (window.$CONFIG && window.$CONFIG.lang) || (window.$CONFIG && window.$CONFIG.$lang);
		var tpl = $.core.util.easyTemplate(TPL, opts).toString();
		if(spec.lang == 'zh-tw') {
			spec.language = spec.language || $.common.extra.toplang;
		} else {
			spec.language = null;
		}
		node.innerHTML = $.core.util.language(tpl,spec.language);

		var topObj = $.comp.content.top(node,spec);
		that.showLoginLayer = topObj.showLoginLayer;
	};

	that.register = function(type,cb){
		$.common.channel.topTip.register(type,cb);
	};
	var analysis = (window.$CONFIG && window.$CONFIG.any) || '';
	var linkDomain = 'http://' + (document.domain == 'www.weibo.com' ? 'www.weibo.com' : 'weibo.com');
	var LOGINTPL = '<#et opts data>' +
	'<div class="global_header">' +
	'<div class="header clearfix">' +
		'<div class="logo"><a href="' + linkDomain + '?topnav=1' + analysis + '" title="#L{返回首页}" target="_top"></a></div>' +
		'<ul class="list">' +
			'<li><a href="' + linkDomain + '?topnav=1' + analysis + '" class="link" target="_top">#L{首页}</a></li>' +
			'<li node-type="plaza">' +
				'<a href="http://plaza.weibo.com?topnav=1' + analysis + '" class="link" target="_top">#L{广场}<span class="W_arr_d"><em class="b1"></em><em class="b2"></em><em class="b3"></em></span></a>' +
				'<div node-type="layerPlaza" style="width:135px;display:none;" class="layer_topmenu_list layer_topmenu_list_yy">' + 
					'<div class="func"><span><a class="more" href="' + linkDomain + '/jx/pic.php?topnav=1' + analysis + '" target="_top">#L{微博精选}</a></span>#L{广场}</div>' +
					'<div node-type="plazaContent"></div>' + 
					'<div class="func func_up"><span><a class="more" href="http://plaza.weibo.com?topnav=1' + analysis + '" target="_top">#L{查看更多有趣内容}</a></span></div>' +
				'</div>' +  
			'</li>' +
			'<li node-type="group">' +
				'<a href="http://q.weibo.com?topnav=1' + analysis + '" class="link" target="_top">#L{微群}<span class="W_arr_d"><em class="b1"></em><em class="b2"></em><em class="b3"></em></span></a>' +
				'<div node-type="layerGroup" style="width: 270px;display:none" class="layer_topmenu_list layer_topmenu_list_yy"><div class="func"><span><a class="more" href="http://q.weibo.com?topnav=1' + analysis + '" target="_top">#L{发现微群}</a></span>#L{我的微群}</div>'+
				'<div node-type="groupContent"></div>'+
				'<div class="func func_up"><span><a class="more" href="http://q.weibo.com/profile?topnav=1' + analysis + '" target="_top">#L{管理/查看更多微群}</a></span></div></div>' +
			'</li>' +
			'<li node-type="app">' +
				'<a href="' + linkDomain + '/app?topnav=1' + analysis + '" class="link" target="_top">#L{应用}<span class="W_arr_d"><em class="b1"></em><em class="b2"></em><em class="b3"></em></span></a>' +
				 '<div class="layer_topmenu_list layer_topmenu_list_app" node-type="layerApp" style="position:absolute; top:33px; left:-329px;display:none;">' +
                     '<div node-type="appContent" class="border clearfix">' +
                     '</div>'+
	             '</div>'+
			'</li>' +
			'<li node-type="game"><a href="http://game.weibo.com?origin=1021&topnav=1' + analysis + '" class="link" target="_top">#L{游戏}<span class="W_arr_d"><em class="b1"></em><em class="b2"></em><em class="b3"></em></span></a>' +
				'<div style="display:none;" class="layer_topmenu_list layer_topmenu_list_yy" node-type="layerGame">' +
					'<div class="func"><span><a class="more" href="http://game.weibo.com/home/recommend/game?origin=2304&topnav=1' + analysis + '" target="_top">#L{浏览热门游戏}</a></span>#L{常用游戏}</div>'+
					'<div node-type="gameContent"></div>' +
					'<div class="func func_up"><span><a class="more" href="http://game.weibo.com/home/game/my?origin=2002&topnav=1' + analysis + '" target="_top">#L{查看我的游戏}</a></span></div>' +
				'</div>' +
			'</li>' + 
		'</ul>' +
	'<div class="search" '+
	'<#if (data.search_switch)>' +
		'style="visibility:hidden;"'+
	'</#if>' +
	'>' +
			'<input node-type="searchInput" type="text" class="input W_no_outline" value="#L{搜索微博、找人}" maxlength="40" />'+
			'<a href="javascript:void(0)" onclick="return false" class="btn" node-type="searchSubmit" ></a>' +
			'<div class="W_layer_suggest" style="display: none;top: 27px; left: 0px;" node-type="searchSuggest">' +
					'<div node-type="basic"></div>' +
					'<div node-type="plus"></div>' +
			'</div>' +
		'</div>' +
		'<div class="right">' +
			'<ul class="person">' +
				'<li node-type="account">' +
					'<a href="javascript:void(0)" onclick="return false;" class="link  W_no_outline">#L{帐号}<span class="W_arr_d"><em class="b1"></em><em class="b2"></em><em class="b3"></em></span></a>'+
					'<div class="layer_topmenu_list" node-type="layerAccount" style="display:none">' +
						'<dl class="person_infos">' +
							'<dt><img height="30" width="30" alt="${data.name}" src="${data.icon}"></dt>' +
							'<dd><a href="' + linkDomain + '/${data.uid}/profile?topnav=1' + analysis + '" target="_top"><span>${data.name}' +
							'<#if (data.verify)>' +
							'<img src="${data.imgPath}/style/images/common/transparent.gif" alt="" class="approve<#if (data.verify == 2)> approve_co</#if>" width="11" height="10"/>' +
							'</#if>' +
							'</span></a></dd>' +
						'</dl>' +
						'<ul>' +
							'<li class="line"></li>' +
							'<li><a href="http://account.weibo.com/settings/index?topnav=1" target="_top"><img width="16" height="16" class="ico_account" alt="#L{帐号设置}" src="${data.imgPath}/style/images/common/transparent.gif" />#L{帐号设置}</a></li>' +
							'<li><a href="' + linkDomain + '/home?setskin&topnav=1' + analysis + '" target="_top"><img width="16" height="16" class="ico_template" alt="#L{模板设置}" src="${data.imgPath}/style/images/common/transparent.gif" />#L{模板设置}</a></li>' +
							'<li><a href="http://account.weibo.com/settings/version?topnav=1" target="_top"><img width="16" height="16" class="ico_versionchoice" alt="#L{版本选择}" src="${data.imgPath}/style/images/common/transparent.gif" />#L{版本选择}</a></li>' +
							'<li class="line"></li>' +
							'<li><a href="http://credits.weibo.com/?topnav=1' + analysis + '" target="_top"><img width="16" height="16" class="ico_credits" alt="#L{我的微币}" src="${data.imgPath}/style/images/common/transparent.gif" />#L{我的微币}</a></li>' +
							'<li><a href="http://hao.weibo.com/show?entry=account' + analysis + '" target="_top"><img width="16" height="16" class="ico_hao" alt="#L{我的微号}" src="${data.imgPath}/style/images/common/transparent.gif" />#L{我的微号}</a></li>' +
							'<li><a href="' + linkDomain + '/tool?topnav=1' + analysis + '" target="_top"><img width="16" height="16" class="ico_toolset" alt="#L{我的工具}" src="${data.imgPath}/style/images/common/transparent.gif" />#L{我的工具}</a></li>' +
							'<li class="line"></li>' +
							'<li><a href="' + linkDomain + '/logout.php?backurl=/&topnav=1' + analysis + '" node-type="exit" target="_top"><img width="16" height="16" class="ico_exit" alt="#L{退出}" src="${data.imgPath}/style/images/common/transparent.gif" />#L{退出}</a></li>' +
						'</ul>' +
					'</div>' +
				'</li>' +
				'<li node-type="notice" >' +
					'<a href="javascript:void(0)" onclick="return false;" class="link W_no_outline">#L{消息}<span class="W_arr_d"><em class="b1"></em><em class="b2"></em><em class="b3"></em></span></a>' +
					'<div class="layer_topmenu_list" node-type="layerNotice" style="display:none;width:190px">' +
						'<div node-type="noticeContent">' +
						'</div>' +
					'</div>' +
				'</li>' +
				'<li node-type="find"><a href="' + linkDomain + '/f/find?topnav=1' + analysis + '" class="link" target="_top">找人</a></li>' +
				'<li><a href="http://m.weibo.com/web/cellphone.php?topnav=1' + analysis + '" class="link" target="_top">#L{手机}</a></li>' + 
				'<li><a href="' + linkDomain + '/${data.uid}/profile?topnav=1' + analysis + '" class="link" target="_top">${data.beautyname}</a></li>' + 
			'</ul>' +
		'</div>' +
	'</div>' +
	'</div>' +
	'</#et>';
	
	var NOLOGINTOL = '<#et opts data>' +
	'<div class="global_header">' +
		'<div class="header">' +
			'<div class="logo"><a href="' + linkDomain + '?topnav=1' + analysis + '" target="_top"></a></div>' +
			'<ul class="list">' +
				'<li><a class="link" href="' + linkDomain + '?topnav=1' + analysis + '" target="_top">#L{首页}</a></li>' +
				'<li><a href="http://plaza.weibo.com?topnav=1' + analysis + '"  class="link" target="_top">#L{广场}</a></li>' +
				'<li class=""><a class="link" href="http://q.weibo.com?topnav=1' + analysis + '" target="_top">#L{微群}</a></li>' +
				'<li><a class="link" href="' + linkDomain + '/app?topnav=1' + analysis + '" target="_top">#L{应用}</a></li>' +
				'<li><a class="link" href="http://game.weibo.com?origin=1021&topnav=1' + analysis + '" target="_top">#L{游戏}</a></li>' +
			'</ul>' +
			'<div class="search" '+
			'<#if (data.search_switch)>' +
				'style="visibility:hidden;"'+
			'</#if>' +
			'>' +
				'<input node-type="searchInput" type="text" value="搜索微博、找人" class="input W_no_outline">' +
				'<a href="javascript:void(0)" onclick="return false" class="btn" node-type="searchSubmit" ></a>' +
					'<div class="W_layer_suggest" style="display: none;top: 27px; left: 0px; width: 217px;" node-type="searchSuggest">' +
							'<div node-type="basic"></div>' +
							'<div node-type="plus"></div>' +
					'</div>' +
			'</div>' +
			'<a href="' + linkDomain + '/f/find?topnav=1' + analysis + '" class="search_person" target="_top">找人</a>' + 
			'<div class="right">' +
				'<p class="no_login"><span>#L{还没有微博帐号？}</span><a href="' + linkDomain + '/signup/signup.php?topnav=1' + analysis + '&inviteCode=${data.inviteCode}&entry=${data.entry}" target="_top">#L{注册}</a><em>|</em><a node-type="loginBtn" href="javascript:void(0)">#L{登录}</a></p>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'</#et>';
	return that;
})();
