/**
* @author Finrila | wangzheng4@staff.sina.com.cn
* @return {Object} 实例 
*/
$Import('comp.content.plazaChosen');
STK.pageletM.register("pl.content.plazaChosen", function($) {
	var opts = {};
	var node = $.E("pl_content_plazaChosen");
	var that = $.comp.content.plazaChosen(node, opts);
	return that;
});
