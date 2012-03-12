/**
 * @fileoverview
 *	Feed 分组页签的 HTML 模版
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
STK.register('common.feed.groupAndSearch.template.feedGroup', function (){
	var transPIC = $CONFIG.imgPath + '/style/images/common/transparent.gif';
	var feedGroup = '' +
	'<#et userlist data>' +
	// 全部页签
	'<li action-type="group" action-data="id=0"' +
		'<#if (data.current==0 && data.attention!=1  && data.whisper!=1)>' +
			' class="current"><span>#L{全部}</span>' +
		'<#else>' +
			' suda-data="key=tblog_home_tab&value=all_tblog"><a href="/${data.path}" title="#L{全部}">#L{全部}</a>' +
		'</#if>' +
	'</li>' +
	'<li class="W_vline">|</li>' +
	'<li' +
	'<#if (data.attention==1)>' +
		' class="current"><span>#L{相互关注}</span>' +
		'<#else>' +
		' action-type="attention"><a href="/${data.path}?attention=1" title="#L{相互关注}">#L{相互关注}</a>' +
		'</#if>' +
	'</li>' +
	'<li' +
	'<#if (data.whisper==1)>' +
		' class="current"><span>#L{悄悄关注}<a action-type="group_admin" href="#"' +
				' onclick="return false;" class="arrow"><cite class="arr_m"></cite></a></span>' +
				'<div class="layer_menu_list" style="position:absolute; top:22px; right:-55px; z-index:99; display:none;">' +
				'<ul><li><a action-type="group_menu" href="/' + $CONFIG['oid'] + '/whisper" suda-data="key=tblog_home_tab&value=manage_whisper"><img title="#L{管理悄悄关注}" class="iconsetup" ' +
					'src="' + transPIC + '" width="11" height="11">#L{管理悄悄关注}</a></li>' +
				'</ul>' +
			'</div>' +
		'<#else>' +
		' action-type="whisper"><a href="/${data.path}?whisper=1" title="#L{悄悄关注}">#L{悄悄关注}</a>' +
		'</#if>' +
	'</li>' +
	'<li class="W_vline">|</li>' +
	'<#list data.list as list>' +
		'<#if (list.gid==data.current)>' +
			'<li action-type="group" action-data="id=${list.gid}" class="current" suda-data="key=tblog_home_tab&value=group:${list.gid}">' +
			'<span>${list.gname}<a action-type="group_admin" action-data="id=${list.gid}" href="#"' +
				' onclick="return false;" class="arrow"><cite class="arr_m"></cite></a></span>' +
			'<div class="layer_menu_list" style="position:absolute; top:22px; right:-55px; z-index:99; display:none;">' +
				'<ul><li><a action-type="group_menu" href="/' + $CONFIG['oid'] + '/follow?gid=${list.gid}" suda-data="key=tblog_home_tab&value=manage_grp"><img title="#L{管理该分组}" class="iconsetup" ' +
					'src="' + transPIC + '" width="11" height="11">#L{管理该分组}</a></li>' +
				'</ul>' +
			'</div>' +
			'</li>' +
		'<#else>' +
			'<li action-type="group" action-data="id=${list.gid}" suda-data="key=tblog_home_tab&value=group:${list.gid}"><a href="/${data.path}' + '?gid=${list.gid}" title="${list.gname}">' +
				'${list.short_name}' +
				'<#if (list.count>0)>' +
					'<span class="W_count"><span>${list.num}</span></span>' +
				'</#if>' +
			'</a></li>' +
		'</#if>' +
		'<li class="W_vline">|</li>' +
	'</#list>';
	return feedGroup;
});
