/**
 * 取第一个非文本子节点
 * @param {Object} node 
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
STK.register('kit.dom.firstChild',function($){
	var _next = $.core.dom.next;
	return function(node) {
		var _f = node.firstChild;
		if (_f && _f.nodeType != 1) {
			_f = _next(_f);
		}
		return _f;
	};
});