/**
 * next node
 * @id STK.core.dom.next
 * @alias STK.core.dom.next
 * @param {Element} node
 * @return {Element} node
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.next($.E('test')) == Element;
 */
STK.register('core.dom.next', function($){
	return function(node){
		var next = node.nextSibling;
		if (!next) {
			return null;
		}
		else 
			if (next.nodeType !== 1) {
				next = arguments.callee(next);
			}
		return next;
	};
});
