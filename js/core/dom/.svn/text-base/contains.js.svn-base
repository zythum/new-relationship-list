/**
 * to decide whether Element A contains Element B;
 * @id STK.core.dom.contains
 * @alias STK.core.dom.contains
 * @param {Element} parent
 * @param {Element} node
 * @return {Boolean} true/false
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.contains($.E('parent'),$.E('child')) === true;
 */
STK.register('core.dom.contains', function($) {
    return function(parent, node) {

        if (parent === node) {
            return false;

        } else if (parent.compareDocumentPosition) {
			return ((parent.compareDocumentPosition(node) & 16) === 16);

        } else if (parent.contains && node.nodeType === 1) {
			return   parent.contains(node);

        }else {
			while (node = node.parentNode) {
				if (parent === node){
					return true;
				}
			}
		}
        return false;
    };
});
