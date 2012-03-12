/**
 * @author liusong@staff.sina.com.cn
 */
$Import('kit.extra.language');
$Import('common.dialog.publish');
STK.register('common.plaza.contribute', function($){
		var TEMP = '' +
			'<#et temp data>'+
			'<div class="detail" node-type="outer">'+
				'<div class="send_weibo_boutique" node-type="wrap">' +
					'<div class="title no_title" node-type="info"></div>' +
					'<div class="num" node-type="num"></div>' +
					'<div class="input">' +
						'<div class="top_border">' +
							'<div class="bottom_border">'+
								'<textarea name="" class="W_no_outline" node-type="textEl"></textarea>' +
								'<div class="send_succpic" style="display:none" node-type="successTip"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="btn"><a href="javascript:void(0);" node-type="submit"></a></div>' +
					'<div class="kind" node-type="widget">' +
						'<#if (data.smileyBtn)><a href="javascript:void(0);" class="face" node-type="smileyBtn">#L{表情}</a></#if>' +
						'<#if (data.picBtn)><a href="javascript:void(0);" class="img"  node-type="picBtn" >#L{图片}</a></#if>' +
					'</div>' +
					'<div class="bottom"><p>微博精选欢迎各类原创投稿，投稿请注意：</p><p>1、发微博时，直接@微博精选，即可完成投稿；</p><p>2、加上#美女#、#美食#等话题，投稿更容易被采用。</p></div>' +
				'</div>'+
			'</div>';
		var publish = $.common.dialog.publish({'templete':TEMP});
		return function(oNode, oData){		
			var appkey = ''
				topic = '';
			if(oData){
				oData.appkey && (appkey = oData.appkey);
				oData.topic && (topic = ['#', oData.topic, '# '].join(''))
			}
			publish.show({
				 'content' : '@微博精选  ' + topic
				,'title' : $.kit.extra.language('#L{投稿}')
				,'appkey' : appkey
			})
		}
});
