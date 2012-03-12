/**
* 分组详情成员
* 
* @id pl.relation.publicGroupMember
*/

$Import('comp.relation.groupMember');

STK.pageletM.register("pl.relation.publicGroupMember", function($) {
	var node = $.E('pl_relation_publicGroupMember');
	var that = $.comp.relation.groupMember(node);
	return that;
});
