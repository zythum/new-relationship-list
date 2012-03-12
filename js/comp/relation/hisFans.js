/**
 * 粉丝页主逻辑
 * ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('common.relation.userList');
STK.register('comp.relation.hisFans', function($){
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
				throw "[STK.comp.relation.hisFans]:node is not a Node!";
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
