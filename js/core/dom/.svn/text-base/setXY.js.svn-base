/**
 * set Element position
 * @id STK.core.dom.setXY
 * @alias STK.core.dom.setXY
 * @param {Element} node
 * @param {Object} pos
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.setXY($.E('test'),{'t':100,'l':100});
 */

$Import('core.dom.getStyle');
$Import('core.dom.setStyle');
$Import('core.dom.position');
STK.register('core.dom.setXY', function($){
	return function(node, pos){
		var pos_style = $.core.dom.getStyle(node, "position");
		if (pos_style == "static") {
			$.core.dom.setStyle(node, "position", "relative");
			pos_style = "relative";
		}
		var page_xy = $.core.dom.position(node);
		if (page_xy == false) {
			return;
		}
		var delta = {
			'l': parseInt($.core.dom.getStyle(node, "left"), 10),
			't': parseInt($.core.dom.getStyle(node, "top"), 10)
		};
		
		if (isNaN(delta['l'])) {
			delta['l'] = (pos_style == "relative") ? 0 : node.offsetLeft;
		}
		if (isNaN(delta['t'])) {
			delta['t'] = (pos_style == "relative") ? 0 : node.offsetTop;
		}
		
		if (pos['l'] != null) {
			node.style.left = pos['l'] - page_xy['l'] + delta['l'] + "px";
		}
		if (pos['t'] != null) {
			node.style.top = pos['t'] - page_xy['t'] + delta['t'] + "px";
		}
	};
});
