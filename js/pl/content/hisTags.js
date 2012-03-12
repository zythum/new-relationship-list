/**
* 他的标签
* 
* @id pl.content.hisTags
* @author Runshi Wang | runshi@staff.sina.com.cn
*/

$Import('comp.content.hisTags');

STK.pageletM.register("pl.content.hisTags", function($) {
	var node = $.E("pl_content_hisTags");
	var that = $.comp.content.hisTags(node, {limit: 10});
	return that;
});
