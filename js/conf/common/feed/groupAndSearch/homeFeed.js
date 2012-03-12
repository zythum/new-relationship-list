/**
 * @fileoverview
 * Feed 顶部分组和搜索区域的事件代理
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
$Import("kit.dom.parseDOM");

// 事件代理
$Import("common.feed.groupAndSearch.homeFeedDelegateEvent");

$Import("common.feed.groupAndSearch.filter.homeFeed");



STK.register("common.feed.groupAndSearch.homeFeed", function($) {
	
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
		var filter = new $.common.feed.groupAndSearch.filter.homeFeed(domList, opts);
		
		// 根据本地缓存的搜索开关状态，重置搜索区域
		filter.autoSearchToggle.call(filter);

		// 用户点击、交互的事件代理
		$.common.feed.groupAndSearch.homeFeedDelegateEvent(domList, filter, opts);
		return filter;
	};
});