/**
 * remove a classname for an Element
 * @id STK.core.dom.removeClassName
 * @alias STK.core.dom.removeClassName
 * @param {Element} node
 * @param {String} className
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.removeClassName($.E('test'),'classname1');
 */
$Import('core.dom.hasClassName');
STK.register('core.dom.removeClassName',function($){
	return function(node,className){
		if(node.nodeType === 1){
			if($.core.dom.hasClassName(node,className)){
				node.className = node.className.replace(new RegExp('\\b' + className + '\\b'),' ');
			}
		}
	};
});