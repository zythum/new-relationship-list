/**
 * 进行物体碰撞检测，支持跟鼠标和对象做碰撞检测
 * @id STK.core.evt.hitTest
 * @alias STK.core.evt.hitTest
 * @param {Element} oNode 需要碰撞检测的节点
 * @param {Null | Event | Element} oEvent 需要跟上个节点做碰撞检测的event对象或者节点，非比选参数，默认为event对象
 * @return {Boolean} 是否碰撞
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * 
 * 	STK.core.evt.addEvent(document.body, 'click', function() {
 * 		var ipt1 = STK.E('input1');
 * 		var ipt2 = STK.E('input2');
 * 		var ev = STK.core.evt.getEvent();
 * 		
 * 		console.log(STK.core.evt.hitTest(ipt1));// true or false
 * 		console.log(STK.core.evt.hitTest(ipt1, ev));// true or false
 * 			
 * 		console.log(STK.core.evt.hitTest(ipt1, ipt2));// true or false
 * 			
 * 		console.log(STK.core.evt.hitTest(ipt1, 1));//error
 * 	});
 */
$Import('core.evt.getEvent');
$Import('core.dom.position');
$Import('core.util.scrollPos');
STK.register('core.evt.hitTest', function($){
	
	function getNodeInfo(oNode) {
		var node = STK.E(oNode);
		var pos = $.core.dom.position(node);
		var area = {
			left: pos.l,
			top: pos.t,
			right: pos.l + node.offsetWidth,
			bottom: pos.t + node.offsetHeight
		};
		return area;
	}
	return function(oNode, oEvent){
	
		var node1Area = getNodeInfo(oNode);
		
		if (oEvent == null) {
			oEvent = $.core.evt.getEvent();
		}
		else if (oEvent.nodeType == 1) {
			var node2Area = getNodeInfo(oEvent);
			
			if (node1Area.right > node2Area.left && node1Area.left < node2Area.right &&
				node1Area.bottom > node2Area.top && node1Area.top < node2Area.bottom) {
				return true;
			}
			return false;
		}
		else if (oEvent.clientX == null) {
			throw 'core.evt.hitTest: [' + oEvent + ':oEvent] is not a valid value';
		}
		
		var scrollPos = $.core.util.scrollPos();
		
		var evtX = oEvent.clientX + scrollPos.left;
		var evtY = oEvent.clientY + scrollPos.top;
		
		
		return (evtX >= node1Area.left && evtX <= node1Area.right) &&
		(evtY >= node1Area.top && evtY <= node1Area.bottom) ? true : false;
		
		
		
	};
});
