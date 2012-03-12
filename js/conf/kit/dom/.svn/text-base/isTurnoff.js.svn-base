/**
 * @author wangliang3
 * 判断节点是否被GC、隐藏、disable
 */
STK.register("kit.dom.isTurnoff", function($) {
	return function(el){
		return !(el.parentNode && el.parentNode.nodeType != 11&&!el.disabled);
	}
});