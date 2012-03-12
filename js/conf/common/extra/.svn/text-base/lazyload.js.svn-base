/**
 * 懒加载管理器
 * 通过这个管理器来在屏幕滚动的时候,检查节点是否满足回调条件,来进行处理
 * 由于listener支持了异步通知模式,此处不进行异步处理
 * @param {Array} aNodes 需要被处理的节点数组
 * @param {Function} fCallBack 处理的回调函数
 * @param {Object} oOpts 检测模式的参数
 * {
 * 	// type 被管理者的名字
 *  // threshold 敏感度 默认600, 当前加载对象距离屏幕范围
 * 	// parent 是否是用父节点来做判断条件,true为使用,此处因为有部分节点是display none的,所以需要是用父节点来处理
 * 	// over 是否采用过载判断模式,默认为false, 如果为false,那么是判断当前屏幕范围的,如果为true,则计算从页面0位置计算到当前屏幕位置
 * }
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
// 加载广播白名单
$Import('common.channel.window');

STK.register('common.extra.lazyload', function($){
	// 监听器状态
	var listenStatus = false;
	// 监听器异步定时器
	var listenTimer;
	
	/**
	 * 运行任务
	 * @param {Object} aNodes
	 * @param {Object} oArea
	 * @param {Object} fCallBack
	 * @param {Object} oOpts
	 */
	function runTask(aNodes, fCallBack, oOpts, oArea){
		var item, itemTop, viewItem;
		var nodeCount = aNodes.length, d = new Date();
		
		if (aNodes.length > 0) {
			for (var i = aNodes.length - 1; i >= 0; i--) {
				item = aNodes[i];
				viewItem = oOpts['parent'] ? item.parentNode : item;
				itemTop = $.core.dom.position(viewItem)['t'];
				if (itemTop > oArea['top'] && itemTop < oArea['bottom']) {
					aNodes.splice(i, 1);
					fCallBack(item);
				}
			}
			//console.log(oOpts.type + ': [' + nodeCount + ', ' + aNodes.length + ']' + (new Date() - d) + '毫秒');
		}
	}
	
	/**
	 * 广播当前屏幕参数
	 */
	function fireAreaInfo(){
		var scrollPos = $.core.util.scrollPos();
		var pageSize = $.core.util.pageSize();
		
		var data = {
			'scrollLeft': scrollPos.left,
			'scrollTop': scrollPos.top,
			'winWidth': pageSize.win.width,
			'winHeight': pageSize.win.height,
			'pageWidth': pageSize.page.width,
			'pageHeight': pageSize.page.height
		};
		$.common.channel.window.fire('scroll', data);
	}
	
	/**
	 * 异步广播,避免广播重叠
	 */
	function scrollEvent(){
		clearTimeout(listenTimer);
		// 延迟调用广播动作
		listenTimer = setTimeout(fireAreaInfo, 300);
	}
	
	return function(aNodes, fCallBack, oOpts){
		// 针对lazyload,监听器只添加一次
		if (listenStatus == false) {
			listenStatus = true;
			
			$.addEvent(window, 'scroll', scrollEvent);
			$.addEvent(window, 'resize', scrollEvent);
			
			scrollEvent();
		}
		var scrollFn = function(oData){
			var cfg = {
				'type': '',
				'threshold': 600,
				'parent': false,
				'over': false
			};
			cfg = $.core.obj.parseParam(cfg, oOpts);
			runTask(aNodes, fCallBack, oOpts, {
				'top': cfg.over ? 0 : oData['scrollTop'],
				// 范围的底部, 最小600
				'bottom': parseInt(oData['scrollTop'] + oData['winHeight'] + cfg.threshold, 10)
			});
		};
		// 每次调用都订阅一次广播
		$.common.channel.window.register('scroll', scrollFn);
		var that = {
			destroy: function() {
				$.common.channel.window.remove('scroll', scrollFn);
			}
		};
		
		return that;
	};
});
