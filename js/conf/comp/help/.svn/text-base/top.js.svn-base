$Import('kit.dom.parseDOM');
$Import('kit.dom.hover');
STK.register('comp.help.top' , function($) {
	return function(node) {
		var that = {} , nodes;
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.builder(node).list);
		};
		var bindDOM = function() {
			$.kit.dom.hover({
					act : nodes.account,
					delay : 300,
					extra : nodes.layerAccount,
					onmouseover : function(){
						$.addClassName(nodes.account , "current");
						nodes.layerAccount.style.display = '';
					},
					onmouseout : function(){
						$.removeClassName(nodes.account , "current");
						nodes.layerAccount.style.display = 'none';
					}
				});
		};
		var init = function() {
			if(!$.isNode(node)) {
				return that;
			}
			parseDOM();
			bindDOM();
		};
		init();
		return that;
	}
});
