/**
 * feed用到的模版
 */

$Import('kit.extra.language');

STK.register("common.feed.feedList.feedTemps", function($) {
	var $L = $.kit.extra.language;
	var loadingPIC = $CONFIG['imgPath'] + '/style/images/common/loading.gif';
	
	return {
		loadingIMG: $L('<div class="W_loading"><span>#L{正在加载，请稍候}...</span></div>'),
		newFeedTipHTML: $L('<a action-type="feed_list_newBar" class="notes" href="">#L{有} [n] #L{条新微博}，#L{点击查看}</a>'),
		
		loadingHTML: $L('<div class="W_loading" requestType="[n]"><span>#L{正在加载，请稍候}...</span></div>'),
		loadErrorRetryHTML: $L('<div class="zero_tips W_textb"><span>#L{加载失败}，<a action-type="feed_list_retry" requestType="[n]" href="javascript:void(0)">#L{请重试}</a></span></div>'),
		loadErrorEndHTML: $L('<div class="zero_tips W_textb" requestType="[n]"><span>#L{加载失败}。</span></div>'),
		
		mediaIMGTEMP: $L('<#et temp data>'+
			//'<#if (data.notForward)><dl class="comment"></#if>'+
				'<#if (data.notForward)><dd class="expand"></#if>'+
					'<p class="W_no_border"><a action-type="feed_list_media_toSmall" href="javascript:void(0);" class="retract">#L{收起}</a><i class="W_vline">|</i><a href="${data.largeSrc}" target="_blank" class="show_big">#L{查看大图}</a><i class="W_vline">|</i><a action-type="feed_list_media_toLeft" href="javascript:void(0);" class="turn_left">#L{向左转}</a><i class="W_vline">|</i><a action-type="feed_list_media_toRight" href="javascript:void(0);" class="turn_right">#L{向右转}</a></p>'+
					'<div class="smallcursor" action-type="feed_list_media_bigimgDiv"><img dynamic-id="${data.uniqueId}" action-type="feed_list_media_bigimg" src="${data.bigSrc}" width="${data.bigWidth}"/></div>'+
				'<#if (data.notForward)></dd></#if>'+
			//'<#if (data.notForward)></dl></#if>'+
			'</#et>'),
			
		mediaVideoMusicTEMP: $L('<#et temp data>'+
			//'<#if (data.notForward)><dl class="comment"></#if>'+
				'<#if (data.notForward)><dd class="expand"></#if>'+
					'<p class="W_no_border"><a href="javascript:void(0);" action-type="feed_list_media_toSmall" class="retract">#L{收起}</a><i class="W_vline">|</i><a href="${data.short_url}" title="${data.short_url}" class="show_big" target="_blank">${data.title}</a><i class="W_vline">|</i><a action-type="feed_list_media_toFloat" action-data="title=${data.fTitle}" href="javascript:void(0);" class="turn_right">#L{弹出}</a></p>'+
					'<div node-type="feed_list_media_big${data.type}Div" style="text-align:center;min-height:18px;"><img class="loading_gif" src="' + loadingPIC + '"/></div>'+
				'<#if (data.notForward)></dd></#if>'+
			//'<#if (data.notForward)></dl></#if>'+
			'</#et>'),
//		mediaVoteTEMP: $L('<#et temp data>'+
//				'<#if (data.notForward)><dd class="expand"></#if>'+
//					'<p class="W_no_border"><a href="javascript:void(0);" action-type="feed_list_media_toSmall" class="retract">#L{收起}</a></p>'+
//					'<div node-type="feed_list_media_voteDiv" class="vote" style="text-align:center;"><img class="loading_gif" src="' + loadingPIC + '"/></div>'+
//				'<#if (data.notForward)></dd></#if>'+
//			'</#et>'),
			
		mediaVideoMusicFloatTEMP: $L('<#et temp data>'+
			'<div node-type="outer" class="W_layer" style="top:50px;left:50px;">'+
				'<div class="bg">'+
					'<table border="0" cellspacing="0" cellpadding="0">'+
							'<tr>'+
								'<td>'+
									'<div class="content">'+
										'<div class="title"><h3>${data.title}</h3></div>'+
										'<a href="####" onclick="return false;" node-type="close" class="W_close"></a>'+
										'<div node-type="mediaContent" style="text-align:center;width:440px;"><img style="margin:10px;" class="loading_gif" src="' + loadingPIC + '"/></div>'+
									'</div>'+
								'</td>'+
							'</tr>'+
					'</table>'+
				'</div>'+
			'</div>'+
			'</#et>'),
			
		widgetTEMP: $L('<#et temp data>'+
				'<#if (data.notForward)><dd class="expand"></#if>'+
					'<p class="W_no_border"><a href="javascript:void(0);" action-type="feed_list_media_toSmall" class="retract">#L{收起}</a><i class="W_vline">|</i><a <#if (data.suda)>suda-data="${data.suda}"</#if> href="${data.full_url}" title="${data.full_url}" class="show_big" target="_blank">${data.title}</a></p>'+
					'<div node-type="feed_list_media_widgetDiv"><img class="loading_gif" src="' + loadingPIC + '"/></div>'+
				'<#if (data.notForward)></dd></#if>'+
			'</#et>'),
		qingTEMP: $L('<#et temp data>'+
				'<#if (data.notForward)><dd class="expand"></#if>'+
					'<p class="W_no_border"><a href="javascript:void(0);" action-type="feed_list_media_toSmall" class="retract">#L{收起}</a><i class="W_vline">|</i><a <#if (data.suda)>suda-data="${data.suda}"</#if> href="${data.full_url}" title="${data.full_url}" class="show_big" target="_blank">${data.title}</a></p>'+
					'<div node-type="feed_list_media_qingDiv"><img class="loading_gif" src="' + loadingPIC + '"/></div>'+
				'<#if (data.notForward)></dd></#if>'+
			'</#et>')
	};
});
