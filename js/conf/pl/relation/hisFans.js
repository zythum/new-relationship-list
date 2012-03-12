/**
* 粉丝页内容
* 
* @id pl.relation.fans
*/

$Import('comp.relation.hisFans');

STK.pageletM.register("pl.relation.hisFans", function($) {
	var node = $.E('pl_relation_hisFans');
	var that = $.comp.relation.hisFans(node);
	return that;
});
