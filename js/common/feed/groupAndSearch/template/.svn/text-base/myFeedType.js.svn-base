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
		'<li action-type="search_type" action-data="type=${list.id}"${data.current==list.id?\' class="current"\':\'\'}>' +
			'<#if (data.current==list.id)>' +
				'<span>${list.name}</span>' +
			'<#else>' +
				'<a href="${list.url}">${list.name}</a>' +
			'</#if>' +
		'</li>' +
		'<#if (data.count!=list.id)>' +
			'<li class="W_vline">|</li>' +
		'</#if>' +
	'</#list>' +
	'<li class="W_vline">|</li>' +
	'<li action-type="search_ranks">' +
		'<a class="W_moredown" href="javascript:void(0)"><span class="txt">${data.rankDefault}</span><span class="more"></span></a>' +
	'</li>';
	
	return feedType;
	
});