/**
* 
* @id $.pl.content.messageOtherSide
* @param {Object} node 组件最外节点
* @return {Object} 实例 
* @example 
* demo待完善
*/

$Import('comp.content.messageOtherSide');


STK.pageletM.register('pl.content.messageOtherSide',function($){
	var node = $.E('pl_content_messageOtherSide');
	var that = $.comp.content.messageOtherSide(node);
	return that;
});
