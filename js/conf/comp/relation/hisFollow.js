/**
 * 他人关注页主逻辑
 * ChenJian | chenjian2@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('common.relation.userList');
STK.register('comp.relation.hisFollow', function($){
	return function(node){
		var that	= {},
			nodes, userList;
		
		var initPlugins = function(){
			userList = $.common.relation.userList(nodes);
		};
		
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.relation.hisFollow]:node is not a Node!";
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		
		var destroy = function(){
			userList.destroy();
			nodes = null;
		};
		
		init();
		
		that.destroy = destroy;
		
		return that;
		
	};
});
