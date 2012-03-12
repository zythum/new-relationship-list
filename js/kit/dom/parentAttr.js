
/**
 * 得到本身直到目的父节点的某个属性 找到即返回 
 * @param {Object} node 当前节点  必
 * @param {Object} attr  属性名称 必
 * @param {Object} pNode 目的父节点 默认为body
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
STK.register('kit.dom.parentAttr',function($){
	return function(node, attr, pNode) {
		var x;
		if (node && attr) {
			pNode = pNode || document.body;
			while (node && (node != pNode) && !(x = node.getAttribute(attr))) {
				node = node.parentNode;
			}
		}
		return x;
	};
});