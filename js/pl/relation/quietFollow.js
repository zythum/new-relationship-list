/**
* 悄悄关注页
* 
* @id pl.relation.quietFollow
*/
$Import('comp.relation.quietFollow');
STK.pageletM.register("pl.relation.quietFollow", function($) {
	var node = $.E('pl_relation_quietFollow');
	var that = $.comp.relation.quietFollow(node);
	return that;
});