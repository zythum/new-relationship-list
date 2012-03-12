/**
* 我的标签
* 
* @id pl.content.myTags
* @author Runshi Wang | runshi@staff.sina.com.cn
*/

$Import('comp.content.myTags');

STK.pageletM.register("pl.content.myTags", function($) {
	var node = $.E("pl_content_myTags");
	var that = $.comp.content.myTags(node, {limit: 10});
	return that;
});
