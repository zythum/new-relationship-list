/**
* 他人的微博页Feed组件
* 
* @id pl.content.hisFeed
* @author Finrila | wangzheng4@staff.sina.com.cn
* @return {Object} 实例 
* @example 
* 暂略
*/

$Import('comp.content.hisFeed');

STK.pageletM.register("pl.content.hisFeed", function($) {
	var opts = {};
	var node = $.E("pl_content_hisFeed");
	var that = $.comp.content.hisFeed(node, opts);
	return that;
});
