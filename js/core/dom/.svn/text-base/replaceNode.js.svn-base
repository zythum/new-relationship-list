/**
 * replace one Element as other
 * @id STK.core.dom.replaceNode
 * @alias STK.core.dom.replaceNode
 * @param {Element} node
 * @param {Element} original
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.replaceNode($.C('div'),$.E('test'));
 */
STK.register('core.dom.replaceNode', function($){
	return function(node, original){
		if (node == null || original == null) {
			throw 'replaceNode need node as paramster';
		}
		original.parentNode.replaceChild(node, original);
	};
});
