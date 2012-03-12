/**
* 粉丝页内容
* 
* @id pl.relation.fans
*/

$Import('comp.relation.fans');

STK.pageletM.register("pl.relation.fans", function($) {
	var node = $.E('pl_relation_fans');
	var that = $.comp.relation.fans(node);
	return that;
});
