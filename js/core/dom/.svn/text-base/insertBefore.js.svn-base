/**
 * insert before
 * @id STK.core.dom.insertBefore
 * @alias STK.core.dom.insertBefore
 * @param {Element} node
 * @param {Element} target
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.insertBefore($.E('test'),$.E('target'));
 */
STK.register('core.dom.insertBefore', function($){
	return function(node, target){
		var parent = target.parentNode;
		parent.insertBefore(node, target);
	};
});
