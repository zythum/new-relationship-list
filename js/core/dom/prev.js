/**
 * previous node
 * @id STK.core.dom.prev
 * @alias STK.core.dom.prev
 * @param {Element} node
 * @return {Element} node
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.prev($.E('test')) == Element;
 */
STK.register('core.dom.prev', function($){
	return function(node){
		var prev = node.previousSibling;
		if (!prev) 
			return null;
		else 
			if (prev.nodeType !== 1) {
				prev = arguments.callee(prev);
			}
		return prev;
	};
});
