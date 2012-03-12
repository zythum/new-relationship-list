/**
* 顶部发布器组件
* 实现顶部发布器的功能
* @id pl.content.publisherTop
* @return {Object} 实例 
* @example 
* 暂略
*/

$Import('common.dialog.publish');

STK.pageletM.register("pl.content.publisherLayer", function($) {
	var opts={	
		pid : 'pl_content_publisherLayer'
	};

	var node = $.E(opts.pid);
	var btn = $.core.dom.sizzle('[node-type="layerBtn"]',node)[0];
	
	$.core.evt.addEvent(btn,'click',function(){
		var publisher = $.common.dialog.publish();
		publisher.show();
	});
	return publisher;
});


