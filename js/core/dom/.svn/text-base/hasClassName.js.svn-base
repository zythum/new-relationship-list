/**
 * to decide whether Element A has an classname B
 * @id STK.core.dom.hasClassName
 * @alias STK.core.dom.hasClassName
 * @param {Element} node
 * @param {String} className
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.hasClassName($.E('test'),'classname1');
 */
STK.register('core.dom.hasClassName', function($){
	return function(node, className){
		return (new RegExp('\\b' + className + '\\b').test(node.className));
	};
});
