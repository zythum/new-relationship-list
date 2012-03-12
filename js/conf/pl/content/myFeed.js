/**
* 我的微博页Feed组件
* 
* @id pl.content.myFeed
* @author L.Ming | liming1@staff.sina.com.cn
* @return {Object} 实例 
* @example 
* 暂略
*/

$Import('comp.content.myFeed');

STK.pageletM.register("pl.content.myFeed", function($) {
	var opts = {};
	var node = $.E("pl_content_myFeed");
	var that = $.comp.content.myFeed(node, opts);
	return that;
});
