/**
 * @fileoverview
 * 限制输入框的输入长度
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
STK.register("common.feed.groupAndSearch.include.inputLimit", function($){
	
	return function (node, nLength) {
		var nValue;
		var keyup = function(){
			nValue = node.value;
			var strLen = $.core.str.bLength(nValue);
			if (strLen > nLength) {
				node.value = $.core.str.leftB(nValue, nLength);
			}
		};
		$.core.evt.addEvent(node, "keyup", keyup);
		$.core.evt.addEvent(node, "blur", keyup);
		$.core.evt.addEvent(node, "input", keyup);
	};
});