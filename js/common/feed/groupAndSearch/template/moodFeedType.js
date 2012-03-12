/**
 * 心情feed使用的模板，心情列表模式和心情日历模式切换的时候调用
 * @author Guoqing5 | guoqing5@staff.sina.com.cn
 *
 */
STK.register('common.feed.groupAndSearch.template.moodFeedType', function (){

	var moodFeedType ='<#et userlist data><span  class="cale">#L{查看方式：}' +
	'<#list data.list as list>' +
		'<a href="javascript:void(0)" action-type="${list.actiontype}" <#if (list.suda)>suda-data="${list.suda}"</#if> title="${list.title}" ' +
			'<#if (data.current==list.id)>' +
				'class ="${list.className} <#if (data.current==1)>icaleD_curr<#else>icaleF_curr</#if>"' +
			'<#else>' +
			'class ="${list.className}"' +
			'</#if>' +

		'></a>' +
		'<#if (data.count!=list.id)>' +
			'<em class="W_vline">/</em>' +
		'</#if>' +
	'</#list></span></#et>';

	return moodFeedType;

});
