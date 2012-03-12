/**
 * 返回指定ID或者DOM的节点句柄
 * @param {String | Element} node 节点ID或者节点的DOM
 * @example
 * var node = STK.E('input');
 * STK.core.dom.removeNode(node);
 */
STK.register('core.dom.removeNode', function($){
	return function(node){
		node = $.E(node) || node;
		try {
			node.parentNode.removeChild(node);
		} 
		catch (e) {
		}
	};
});
