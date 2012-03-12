/**
* 分组详情
* 
* @id pl.relation.groupList
*/

$Import('comp.relation.groupInfo');

STK.pageletM.register("pl.relation.publicGroupInfo", function($) {
	var node = $.E('pl_relation_publicGroupInfo');
	var that = $.comp.relation.groupInfo(node);
	return that;
});
