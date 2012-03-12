/**
 * @fileoverview
 *	Feed 分组页签的 HTML 模版
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
STK.register('common.feed.groupAndSearch.template.feedType', function (){
	
	var feedType = '' +
	'<#et userlist data>' +
	'<#list data.list as list>' +
		'<a action-type="search_type" action-data="type=${list.id}" href="${list.url}"${data.current==list.id?\' class="current W_texta"\':\'\'} suda-data="key=tblog_home_tab&value=${list.suda}">${list.name}</a> ' +
		'<#if (list.id<data.count)>' +
			'<em class="W_vline">|</em> ' +
		'</#if>' +
	'</#list>';
	
	return feedType;
	
});