/**
 * Add a htmlstring in an Element
 * @id STK.core.dom.addHTML
 * @alias STK.core.dom.addHTML
 * @param {Element} node
 * @param {String} html
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.addHTML($.E('test'),'<span>new HTML<span>');
 */
STK.register('core.dom.addHTML', function($){
	return function(node, html){
		if ($.IE) {
			node.insertAdjacentHTML("BeforeEnd", html);
		}
		else {
			var oRange = node.ownerDocument.createRange();
			oRange.setStartBefore(node);
			var oFrag = oRange.createContextualFragment(html);
			node.appendChild(oFrag);
		}
	};
});
