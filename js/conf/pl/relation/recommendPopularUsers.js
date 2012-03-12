/**
* 人气用户推荐
* 
* @id pl.relation.recommendPopularUsers
*/

$Import('comp.relation.recommendPopularUsers');

STK.pageletM.register("pl.relation.recommendPopularUsers", function($) {
	var node = $.E('pl_relation_recommendPopularUsers');
	var that = $.comp.relation.recommendPopularUsers(node);
	return that;
});
