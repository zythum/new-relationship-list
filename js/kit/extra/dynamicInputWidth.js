$Import('kit.dom.parseDOM');
$Import('kit.dom.cssText');
STK.register('kit.extra.dynamicInputWidth',function($){
	return function(inputNode) {
		var custObj = {};
		var inited , nodes , box , getSize = $.core.dom.getSize , setStyle = $.core.dom.setStyle;
		var cacheValue , keyupTimer;
		$.custEvent.define(custObj, "textChange");
		var initPlugin = function() {
			if(inited) {
				return;
			}
			inited = 1;
			var cssText = $.kit.dom.cssText("");
			cssText.push('width' , '1000px');
			cssText.push('height' , '55px');
			cssText.push('position' , 'absolute');
			cssText.push('left' , '-10000px');
			cssText.push('top' , '-10000px');
			cssText.push('visibility' , 'hidden');
			var _cssText = cssText.getCss();
			inited = 1;
			var html = '<div node-type="wrap" style="' + _cssText + '">' + 
				'<span node-type="before"></span>' + 
			'</div>';
			var builder = $.core.dom.builder(html);
			box = builder.box;
			nodes = $.kit.dom.parseDOM(builder.list);
			document.body.appendChild(box);
		};
		var bindDOMFuns = {
			focus : function() {
				clearTimeout(keyupTimer);
				keyupTimer = setTimeout(bindDOMFuns.focusFun , 200);
			},
			focusFun : function() {
				var value = inputNode.value;
				if(value == cacheValue) {
					bindDOMFuns.focus();
					return;
				}
				cacheValue = value;
				initPlugin();
				nodes.before.innerHTML = value;
				var size = getSize(nodes.before);
				setStyle(inputNode , 'width' , (size.width + 20) + 'px');
				bindDOMFuns.focus();
				$.custEvent.fire(custObj , "textChange" , value);
			},
			blur : function() {
				clearTimeout(keyupTimer);				
			}
		};
		var bindDOM = function() {
			$.addEvent(inputNode , 'focus' , bindDOMFuns.focus);
			$.addEvent(inputNode , 'blur' , bindDOMFuns.blur);
		};
		var destroy = function() {
			$.removeEvent(inputNode, 'focus' , bindDOMFuns.focus);
			$.removeEvent(inputNode, 'blur' , bindDOMFuns.blur);
			custObj = null;
		};
		var that = {
			custObj : custObj,
			destroy : destroy
		};
		bindDOM();
		return that;
	}
});