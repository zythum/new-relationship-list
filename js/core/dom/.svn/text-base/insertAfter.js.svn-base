/**
 * insert after
 * @id STK.core.dom.insertAfter
 * @alias STK.core.dom.insertAfter
 * @param {Element} node
 * @param {Element} target
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.insertAfter($.E('test'),$.E('target'));
 */
STK.register('core.dom.insertAfter', function($){
	return function(node, target){
		var parent = target.parentNode;
		if (parent.lastChild == target) {
			parent.appendChild(node);
		}
		else {
			parent.insertBefore(node, target.nextSibling);
		}
	};
});
