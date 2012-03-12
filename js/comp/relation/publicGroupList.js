/**
 * 公开分组
 * ChenJian | chenjian2@staff.sina.com.cn
 */
$Import('common.relation.groupList');
STK.register('comp.relation.publicGroupList', function($){
	return function(node){
		var that	= {},
			nodes, groupList;
		
		var initPlugins = function(){
			if (nodes['groupListBox']) {
				groupList = $.common.relation.groupList(nodes['groupListBox']);
			}
		};
		
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.relation.publicGroupList]:node is not a Node!";
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		
		var destroy = function(){
			groupList && groupList.destroy();
			nodes = null;
		};
		
		init();
		
		that.destroy = destroy;
		
		return that;
		
	};
});
