/**
 * is node
 * @id STK.core.dom.isNode
 * @alias STK.core.dom.isNode
 * @param {Element} node
 * @return {Boolean} true/false
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.isNode($.E('test')) == true;
 */
STK.register('core.dom.isNode', function($){
	return function(node){
		return (node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType);
	};
});
