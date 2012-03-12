/**
 * @fileoverview
 * hisFeed 顶部搜索区域的事件代理
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */

$Import("kit.dom.parseDOM");

// 事件代理
$Import("common.feed.groupAndSearch.hisFeedDelegateEvent");

$Import("common.feed.groupAndSearch.filter.hisFeed");

STK.register("common.feed.groupAndSearch.hisFeed", function($) {
	
	return function(node, opts) {
		if(node == null){ return; }
		opts = opts || {};
		var isBigPipe = opts.isBigPipe;
		
		// 获得所需的节点，改用 builder 来生成，用户操作不会导致这些节点被移除
		var nodes = $.core.dom.builder(node);
		nodes.list = $.kit.dom.parseDOM(nodes.list);
		var domList = nodes.list;
		domList.cnt = nodes.box;

		// 实例化feed过滤对象
		var filter = new $.common.feed.groupAndSearch.filter.hisFeed(domList, opts);
		
		// 用户点击、交互的事件代理
		$.common.feed.groupAndSearch.hisFeedDelegateEvent(domList, filter, opts);

		return filter;
	};
});