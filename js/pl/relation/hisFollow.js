/**
* 他人关注页内容
* 
* @id pl.relation.fans
*/

$Import('comp.relation.hisFollow');

STK.pageletM.register("pl.relation.hisFollow", function($) {
	var node = $.E('pl_relation_hisfollow');
	var that = $.comp.relation.hisFollow(node);
	return that;
});
