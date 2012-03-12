/**
* 公开分组
* 
* @id pl.relation.groupList
*/

$Import('comp.relation.publicGroupList');

STK.pageletM.register("pl.relation.publicGroupList", function($) {
	var node = $.E('pl_relation_publicGroupList');
	var that = $.comp.relation.publicGroupList(node);
	return that;
});
