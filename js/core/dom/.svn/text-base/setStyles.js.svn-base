/**
 * set Elements style
 * @id STK.core.dom.setStyles
 * @alias STK.core.dom.setStyles
 * @param {array} node
 * @param {String} property
 * @param {String} val
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * STK.core.dom.setStyles(nodesArray,'display','none');
 */
$Import('core.dom.setStyle');
$Import('core.arr.isArray');
STK.register('core.dom.setStyles', function($){
	return function(nodes, property, val){
		if(!$.core.arr.isArray(nodes))
			var nodes = [nodes];
		for(i=0,l=nodes.length;i<l;i++){
			$.core.dom.setStyle(nodes[i],property,val);
		}
		return nodes;
	};
});
