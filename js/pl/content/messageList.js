/**
* 
* @id $.pl.content.messageList
* @param {Object} node 组件最外节点
* @return {Object} 实例 
* @example 
* demo待完善
*/

$Import('comp.content.messageList');

STK.pageletM.register('pl.content.messageList',function($){
	var node = $.E('pl_content_messageList');
	var that = $.comp.content.messageList(node);
	return that;
});
