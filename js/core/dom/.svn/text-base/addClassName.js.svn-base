/**
 * Add a classname for an Element
 * @id STK.core.dom.addClassName
 * @alias STK.core.dom.addClassName
 * @param {Element} node
 * @param {String} className
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.addClassName($.E('test'),'classname1');
 */
$Import('core.dom.hasClassName');
STK.register('core.dom.addClassName', function($) {
	return function(node, className) {
		if(node.nodeType === 1){
			if (!$.core.dom.hasClassName(node,className)) {
				node.className += (' ' + className);
			}
		}
		
	};
});