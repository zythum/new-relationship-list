/**
* 关注页内容
* 
* @id pl.relation.follow
*/

$Import('comp.relation.follow');

STK.pageletM.register("pl.relation.follow", function($) {
	var node = $.E('pl_relation_follow');
	var that = $.comp.relation.follow(node);
	return that;
});
