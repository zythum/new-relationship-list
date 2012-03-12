/**
 * set Elements style
 * @id STK.core.dom.setStyle
 * @alias STK.core.dom.setStyle
 * @param {Element} node
 * @param {String} property
 * @param {String} val
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.setStyle($.E('test'),'display','none');
 */
STK.register('core.dom.setStyle', function($){
	return function(node, property, val){
		if ($.IE) {
			switch (property) {
				case "opacity":
					node.style.filter = "alpha(opacity=" + (val * 100) + ")";
					if (!node.currentStyle || !node.currentStyle.hasLayout) {
						node.style.zoom = 1;
					}
					break;
				case "float":
					property = "styleFloat";
				default:
					node.style[property] = val;
			}
		}
		else {
			if (property == "float") {
				property = "cssFloat";
			}
			node.style[property] = val;
		}
	};
});
