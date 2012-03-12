/**
 * @fileoverview
 * 日期选择器HTML模版
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
STK.register("common.feed.groupAndSearch.template.calendar", function($){
	
	var html = '' +
	'<#et userlist data>' +
		'<div class="selector">' +
			'<select node-type="month" class="month htc_select">' +
			'<#if (data.hidePastMonth)>' +
				'<#if (!(data.start.year == data.showDate.year&& data.currDate.month>0))><option value="0" ${data.showDate.month==0?\'selected=""\':\'\'}>#L{一月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>1)||(data.end.year == data.showDate.year&& data.currDate.month<1)))><option value="1" ${data.showDate.month==1?\'selected=""\':\'\'}>#L{二月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>2)||(data.end.year == data.showDate.year&& data.currDate.month<2)))><option value="2" ${data.showDate.month==2?\'selected=""\':\'\'}>#L{三月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>3)||(data.end.year == data.showDate.year&& data.currDate.month<3)))><option value="3" ${data.showDate.month==3?\'selected=""\':\'\'}>#L{四月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>4)||(data.end.year == data.showDate.year&& data.currDate.month<4)))><option value="4" ${data.showDate.month==4?\'selected=""\':\'\'}>#L{五月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>5)||(data.end.year == data.showDate.year&& data.currDate.month<5)))><option value="5" ${data.showDate.month==5?\'selected=""\':\'\'}>#L{六月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>6)||(data.end.year == data.showDate.year&& data.currDate.month<6)))><option value="6" ${data.showDate.month==6?\'selected=""\':\'\'}>#L{七月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>7)||(data.end.year == data.showDate.year&& data.currDate.month<7)))><option value="7" ${data.showDate.month==7?\'selected=""\':\'\'}>#L{八月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>8)||(data.end.year == data.showDate.year&& data.currDate.month<8)))><option value="8" ${data.showDate.month==8?\'selected=""\':\'\'}>#L{九月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>9)||(data.end.year == data.showDate.year&& data.currDate.month<9)))><option value="9" ${data.showDate.month==9?\'selected=""\':\'\'}>#L{十月}</option></#if>' +
				'<#if (!((data.start.year == data.showDate.year&& data.currDate.month>10)||(data.end.year == data.showDate.year&& data.currDate.month<10)))><option value="10" ${data.showDate.month==10?\'selected=""\':\'\'}>#L{十一月}</option></#if>' +
				'<#if (!(data.end.year == data.showDate.year&& data.currDate.month<11))><option value="11" ${data.showDate.month==11?\'selected=""\':\'\'}>#L{十二月}</option></#if>' +
			'<#else>' +
				'<option value="0" ${data.showDate.month==0?\'selected=""\':\'\'}>#L{一月}</option>' +
				'<option value="1" ${data.showDate.month==1?\'selected=""\':\'\'}>#L{二月}</option>' +
				'<option value="2" ${data.showDate.month==2?\'selected=""\':\'\'}>#L{三月}</option>' +
				'<option value="3" ${data.showDate.month==3?\'selected=""\':\'\'}>#L{四月}</option>' +
				'<option value="4" ${data.showDate.month==4?\'selected=""\':\'\'}>#L{五月}</option>' +
				'<option value="5" ${data.showDate.month==5?\'selected=""\':\'\'}>#L{六月}</option>' +
				'<option value="6" ${data.showDate.month==6?\'selected=""\':\'\'}>#L{七月}</option>' +
				'<option value="7" ${data.showDate.month==7?\'selected=""\':\'\'}>#L{八月}</option>' +
				'<option value="8" ${data.showDate.month==8?\'selected=""\':\'\'}>#L{九月}</option>' +
				'<option value="9" ${data.showDate.month==9?\'selected=""\':\'\'}>#L{十月}</option>' +
				'<option value="10" ${data.showDate.month==10?\'selected=""\':\'\'}>#L{十一月}</option>' +
				'<option value="11" ${data.showDate.month==11?\'selected=""\':\'\'}>#L{十二月}</option>' +
			'</#if>' +
			'</select>' +
			'<select node-type="year" class="year htc_select">' +
				'<#list data.years as year>' +
					'<option value="${year}"${(data.showDate.year==year)?\' selected=""\':""}>${year}</option>' +
				'</#list>' +
			'</select>' +
		'</div>' +
		'<ul class="weeks">' +
			'<li>#L{日}</li><li>#L{一}</li><li>#L{二}</li><li>#L{三}</li><li>#L{四}</li><li>#L{五}</li><li>#L{六}</li>' +
		'</ul>' +
		'<ul class="days">' +
		'<#list data.dates as list>' +
			'<li>' +
			'<#if (list!="")>' +
				'<#if (' +
						'(data.start.year==data.showDate.year&&data.start.month==data.showDate.month&&(data.start.date<=list&&list<=data.start.max))' +
						'||(data.start.year==data.showDate.year&&data.start.month<data.showDate.month)' +
						'||(data.start.year<data.showDate.year&&data.showDate.year<data.end.year)' +
						'||(data.showDate.year==data.end.year&&data.showDate.month<data.end.month)' +
						'||(data.showDate.year==data.end.year&&data.showDate.month==data.end.month&&list<=data.end.date)' +
					')>' +
					'<a action-type="date" href="#date" onclick="return false;" ' +
						'title="${data.showDate.year}-${data.showDate.month+1}-${list}"' +
						'year="${data.showDate.year}" month="${data.showDate.month+1}" day="${list}"' +
						'${(data.today.year==data.showDate.year&&data.today.month==data.showDate.month&&list==data.showDate.date)?\' class="day"\':\'\'}><strong>${list}</strong></a>' +
				'<#else>' + 
					'${list}' +
				'</#if>' +
			'</#if>' + 
			'</li>' +
		'</#list>' +
		'</ul>';
	
	return html;
	
});