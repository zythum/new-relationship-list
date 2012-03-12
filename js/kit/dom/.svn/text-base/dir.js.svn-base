/**
 * sizzle查找某节点相关的节点
 * @param {Node} node 参考节点
 * @param {Object} opts
 * {
 *  dir //与参考节点关系 parentNode/nextSibling/previousSibling
 * 	expr //必选 父节点条件
 *  endpoint //终极节点 默认为document
 *  maxLength //最大匹配个数 默认为1 为0时表示能匹配到的所有
 * }
 * @return {Array} 节点列表
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */

STK.register('kit.dom.dir', function($) {
	
	return function(node, opts) {
		opts = $.parseParam({
			dir: "parentNode",//与参考节点关系
			expr: undefined,//条件
			endpoint: document,//终极节点
			maxLength: 1//最大匹配个数  
		}, opts);
		var dir = opts.dir,
			expr = opts.expr,
			endpoint = opts.endpoint,
			maxLength = opts.maxLength;
		if(!node || !expr) {
			$.log("kit dir: node or opts.expr is undefined.");
			return;
		}
		var matches = [],
			cur = node[dir];
		while ( cur ) {
			if(cur.nodeType == 1 && $.sizzle( expr, null, null, [cur] ).length > 0) {
				matches.push(cur);
				if(matches.length == maxLength) {
					break;
				}
			}
			if(cur == endpoint) {
				break;	
			}
			cur = cur[dir];
		}
		return matches;
	};

});