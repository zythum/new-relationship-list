/**
 * get element's position
 * @id STK.core.dom.position
 * @alias STK.core.dom.position
 * @param {Element} node
 * @return {Object} {l:number,t:number}
 * @author Robin Young | yonglin@staff.sina.com.cn
 *         FlashSoft | fangchao@staff.sina.com.cn
 * @modify
 * 使用getXY替代,原因是考虑safari跟opera的元素,以及对于inline的处理
 * @example
 * STK.core.dom.position($.E('test')) == {l:100,t:100};
 */
$Import('core.util.scrollPos');
$Import('core.util.browser');
$Import('core.obj.parseParam');
STK.register('core.dom.position', function($){
	
	var generalPosition = function(el){
		var box, scroll, body, docElem, clientTop, clientLeft;
		box = el.getBoundingClientRect();
		scroll = $.core.util.scrollPos();
		body = el.ownerDocument.body;
		docElem = el.ownerDocument.documentElement;
		clientTop = docElem.clientTop || body.clientTop || 0;
		clientLeft = docElem.clientLeft || body.clientLeft || 0;
		return {
			l: parseInt(box.left + scroll['left']- clientLeft, 10) || 0,
			t: parseInt(box.top + scroll['top'] - clientTop, 10) || 0
		};
	};
	
	var countPosition = function(el, shell){
		var pos;
		pos = [el.offsetLeft, el.offsetTop];
		parent = el.offsetParent;
		if (parent !== el && parent !== shell) {
			while (parent) {
				pos[0] += parent.offsetLeft;
				pos[1] += parent.offsetTop;
				parent = parent.offsetParent;
			}
		}
		
		//解决特殊浏览器的问题，今后可删除
		if ($.core.util.browser.OPERA != -1 || ($.core.util.browser.SAFARI != -1 && el.style.position == 'absolute')) {
			pos[0] -= document.body.offsetLeft;
			pos[1] -= document.body.offsetTop;
		}
		if (el.parentNode) {
			parent = el.parentNode;
		}
		else {
			parent = null;
		}
		while (parent && !/^body|html$/i.test(parent.tagName) && parent !== shell) { // account for any scrolled ancestors
			if (parent.style.display.search(/^inline|table-row.*$/i)) {
				pos[0] -= parent.scrollLeft;
				pos[1] -= parent.scrollTop;
			}
			parent = parent.parentNode;
		}
		return {
			l: parseInt(pos[0], 10),
			t: parseInt(pos[1], 10)
		};
	};
	return function(oElement,spec){
		if (oElement == document.body) {
			return false;
		}
		if (oElement.parentNode == null) {
			return false;
		}
		if (oElement.style.display == 'none') {
			return false;
		}
		
		var conf = $.core.obj.parseParam({
			'parent' : null
		},spec);
	
		if (oElement.getBoundingClientRect) {// IE6+  FF3+ chrome9+ safari5+ opera11+
			if(conf.parent){
				var o = generalPosition(oElement);
				var p = generalPosition(conf.parent);
				return {
					'l' : o.l - p.l,
					't' : o.t - p.t
				};
			}else{
				return generalPosition(oElement);
			}
		}else { //old browser
			return countPosition(oElement, conf.parent || document.body);
		}
	};
});
