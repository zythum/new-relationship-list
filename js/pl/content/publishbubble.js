/**
 * 首页引导发话题弹层(满足条件scriptLoader运行更多)
 * 
 * @id pl.content.publishbubble
 * @author Lian yi | lianyi@staff.sina.com.cn
 * 
 */
STK.pageletM.register('pl.content.publishbubble',function($){
	var that = {};
	var node = $.E("pl_content_publishbubble");
	var span = node && $.sizzle('[node-type="publish_bubble"]' , node);
	if(span && span.length && span[0].getAttribute("show") === '1') {
		var baseUrl = ($CONFIG['jsPath'] + '/home/js/') || 'http://js.t.sinajs.cn/t4/home/js/';
		var version = $CONFIG['version'];
		$.core.io.scriptLoader({
			url : baseUrl + '/guide/hotTopicGuide.js?version=' + version,
			onComplete : function() {
				var obj = $.guide.hotTopicGuide();
				that.destroy = obj && obj.destroy || function() {};
			}
		});		
	}
	return that;
});
