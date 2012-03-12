/**
 * 返回node的唯一编号 
 * @id STK.core.dom.uniqueID
 * @param {Element} node
 * @return {String} uniqueString
 * @author Finrila | wangzheng4@staff.sina.com.cn
 * @example
 * STK.core.dom.uniqueID($.E('test'));
 * 
 * @import STK.core.util.getUniqueKey
 */
$Import('core.util.getUniqueKey');

STK.register('core.dom.uniqueID', function($){
	return function(node) {
		return node && (node.uniqueID || (node.uniqueID = $.core.util.getUniqueKey()));
	};
});
