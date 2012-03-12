
/**
 * 取最后一个非文本子节点
 * @param {Object} node 
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
STK.register('kit.dom.lastChild',function($){
	var _prev = $.core.dom.prev;
	return function(node) {
		var _l = node.lastChild;
		if (_l && _l.nodeType != 1) {
			_l = _prev(_l);
		}
		return _l;
	};
});