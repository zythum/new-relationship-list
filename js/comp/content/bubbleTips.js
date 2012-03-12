/**
 * 全局气泡提示
 * @author jiequn@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('ui.bubbleBox');
STK.register('comp.content.bubbleTips', function($) {
	var defUrl = '/';
	return function(node){
		
		var that	= {},
			bubBox	= $.ui.bubbleBox,
			nodes,bub;
			
		var bindBub = function(){
			var len = $.sizzle('div[node-type=bubTips]', node).length,
				item, data, dir, target, inner, content, url, offsetX, offsetY;
			for (var i = len; i--;) {
				item = nodes['bubTips'][i];
				data = $.htmlToJson($.sizzle('div[node-type=conf]', item)[0]);
				target = $.sizzle(data['node'])[0];
				if (!$.isNode(target)) {
					$.log('[STK.comp.content.bubbleTips]: ' + data['node'] + ' is error!');
					return;
				}
				inner = $.sizzle('div[node-type=inner]', item)[0];
				if (!$.isNode(inner)) {
					$.log('[STK.comp.content.bubbleTips]: ' + data['node'] + ' inner is not a Node!');
					return;
				}
				url = data['url'] || defUrl;
				dir = data['dir'] || 'bl';
				offsetX = parseInt(data['offset-x'], 10) || 0;
				offsetY = parseInt(data['offset-y'], 10) || 0;
				content = inner.innerHTML;
				bub = new bubBox({ 'url': url, 'dir': dir, 'node': target });
				bub.show({
					'content': content,
					'zIndex': data['zIndex'],
					'offsetX': offsetX,
					'offsetY': offsetY,
					'hasClose': data['hasClose'] === 'true'
				});	
			}
		};
		
		var init = function(){
			parseDOM();
			bindBub();
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = buildDom.list;
		};
		
		var destroy = function(){
			bub && bub.hide();
			nodes = null;
		};
		
		node && init();
		
		that.destroy = destroy;
		
		return that;
	};
});
