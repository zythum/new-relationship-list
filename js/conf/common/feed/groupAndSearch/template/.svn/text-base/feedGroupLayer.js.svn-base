/**
 * @fileoverview
 *	Feed 分组下拉菜单的 HTML 模版
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
STK.register('common.feed.groupAndSearch.template.feedGroupLayer', function (){
	var transPIC = $CONFIG.imgPath + '/style/images/common/transparent.gif';
	var feedGroupLayer = '' +
	'<#et userlist data>' +
	'<ul>' +
	'<#list data.list as list>' +
           '<#if (list.type==2)>'+
		'<li><a href="/${data.path}?gid=${list.gid}" action-type="group" action-data="id=${list.gid}" suda-data="key=tblog_home_tab&value=group:${list.gid}">${list.gname}</a></li>' +
	'</#list>' +
		'<#if (data.list.length>0)>' +
		'<li class="line"></li>' +
            '</#if>' +
		'</#if>' +
		'<#if (data.count<16)>' +
		'<li action-type="group_add" action-data="" class="opt" suda-data="key=tblog_home_tab&value=create_grp"><a href="#" onclick="return false;">' +
			'<img title="#L{创建分组}" class="iconadd" src="' + transPIC + '"' +
				' width="11" height="11" />' +
			'#L{创建分组}</a></li>' +
		'</#if>' +
		'<li action-type="group_sort" action-data="" class="opt" suda-data="key=tblog_home_tab&value=sort_grp"><a href="#" onclick="return false;">' +
			'<img title="#L{调整分组顺序}" class="iconord" src="' + transPIC + '"' +
				' width="11" height="11" />' +
			'#L{调整分组顺序}</a></li>' +
		'<li class="opt"><a href="/'+$CONFIG['oid']+'/follow" suda-data="key=tblog_home_tab&value=manage_grp">' +
			'<img title="#L{管理分组}" class="iconsetup" src="' + transPIC + '"' +
				' width="11" height="11" />' +
			'#L{管理分组}</a></li>' +
	'</ul>';
	return feedGroupLayer;
});