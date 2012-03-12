/**
* 顶部发布器组件
* 实现顶部发布器的功能
* @id pl.content.publisherTop
* @return {Object} 实例 
* @example 
* 暂略
*/

$Import('comp.content.publisherTop');

STK.pageletM.register("pl.content.publisherTop", function($) {
	var opts={	
		pid : 'pl_content_publisherTop'
	};

	var node = $.E(opts.pid);
	var publisherTop = $.comp.content.publisherTop(node,opts);
	return publisherTop;
});

