/**
 * get Elements style
 * @id STK.core.dom.getStyle
 * @alias STK.core.dom.getStyle
 * @param {Element} node
 * @param {String} property
 * @return {String} value
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.getStyle($.E('test'),'display') === 'none';
 */
STK.register('core.dom.getStyle', function($){
	return function(node, property){
		if ($.IE) {
			switch (property) {
				// 透明度
				case "opacity":
					var val = 100;
					try {
						val = node.filters['DXImageTransform.Microsoft.Alpha'].opacity;
					} 
					catch (e) {
						try {
							val = node.filters('alpha').opacity;
						} 
						catch (e) {
						}
					}
					return val / 100;
				// 浮动
				case "float":
					property = "styleFloat";
				default:
					var value = node.currentStyle ? node.currentStyle[property] : null;
					return (node.style[property] || value);
			}
		}
		else {
			// 浮动
			if (property == "float") {
				property = "cssFloat";
			}
			// 获取集合
			try {
				var computed = document.defaultView.getComputedStyle(node, "");
			} 
			catch (e) {}
			return node.style[property] || computed ? computed[property] : null;
		}
	};
});
