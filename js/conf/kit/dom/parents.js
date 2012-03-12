/**
 * sizzle查找父级节点
 * @param {Node} node 参考节点
 * @param {Object} opts
 * {
 * 	expr //必选 父节点条件
 *  endpoint //终极节点 默认为document
 *  maxLength //最大匹配个数 默认为1 为0时表示能匹配到的所有
 * }
 * @return {Array} 节点列表
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
$Import("kit.dom.dir");

STK.register('kit.dom.parents', function($) {
	
	return function(node, opts) {
		opts = $.parseParam({
			expr: undefined,//条件
			endpoint: document,//终极节点
			maxLength: 1//最大匹配个数  
		}, opts);
		var expr = opts.expr;
		if(!node || !expr) {
			$.log("kit parents: node or opts.expr is undefined.");
			return;
		}
		return $.kit.dom.dir(node, opts);
	};

});