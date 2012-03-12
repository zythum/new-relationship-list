/**
 * @fileoverview
 * 事件代理
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 * L.Ming @2011.06.08 增加按兴趣、互相关注搜索的事件代理
 *
 * @modfiy xionggq|guoqing5@staff.sina.com.cn
 * 添加意见反馈的链接跳转。
 */
// 分组“更多”控制
$Import("common.feed.groupAndSearch.include.groupMoreControl");
$Import("kit.extra.language");
$Import("common.feed.groupAndSearch.groupListener");
STK.register("common.feed.groupAndSearch.homeFeedDelegateEvent", function($){
	var $L = $.kit.extra.language;
	var SEARCH = $L("#L{搜索关注人说的话}");
	var SIMPLE = $L("#L{查找作者、内容或标签}");
	return function(node, filterObject, opts){
		
		var nodes = node;
		var actions = filterObject;
		opts = opts || {};
		var isBigPipe = opts.isBigPipe;
		var isPlaceHolderEnabled = !!("placeholder" in document.createElement("input"));

		// 取得分组更多及下拉浮层节点
		var groupMoreBtn = nodes.groupMoreBtn;
		var feedGroupLayer = nodes.feedGroupLayer;
		var search = nodes.search;
		var keyword = nodes.keyword;
		var simpleSearch = nodes.simpleSearch;
		var singleForm = nodes.singleForm;
		
		// 禁止我的首页简单搜索框里的回车刷新页面
		$.addEvent(singleForm, 'submit', function(){
			$.core.evt.preventDefault();
			return false;
		});

		// “更多”按钮绑定鼠标滑过事件
		$.common.feed.groupAndSearch.groupMoreControl.on({
			groupMoreBtn: groupMoreBtn,
			feedGroupLayer: feedGroupLayer
		});
		
		// 两个搜索关键字输入框的 placeholder 处理
		if (isPlaceHolderEnabled) {
			keyword && keyword.setAttribute('value', "");
			simpleSearch && simpleSearch.setAttribute('value', "");
		} else {
			// 搜索关键字---
			$.addEvent(simpleSearch, 'focus', function(){
				if (simpleSearch.value == SIMPLE) {
					simpleSearch.setAttribute('value', "");
				} else {
					simpleSearch.select();
				}
			});
			// 搜索关键字---
			$.addEvent(simpleSearch, 'blur', function(){
				if (simpleSearch.value == "") {
					simpleSearch.setAttribute('value', SIMPLE);
				}
			});
			// 搜索关键字---
			$.addEvent(keyword, 'focus', function(){
				if (keyword.value == SEARCH) {
					keyword.setAttribute('value', "");
				} else {
					keyword.select();
				}
			});
			// 搜索关键字---
			$.addEvent(keyword, 'blur', function(){
				if (keyword.value == "") {
					keyword.setAttribute('value', SEARCH);
				}
			});
		}
		
		//支持回车提交搜索
		$.core.evt.hotKey.add(simpleSearch, ["enter"], function(e){
			var btn = $.sizzle('[action-type="simpleSearchBtn"]', singleForm)[0];
			$.fireEvent(btn, 'click');
		});
		
		// 如果支持 bigPipe，阻止链接的默认行为
		if (isBigPipe) {
			$.addEvent(nodes.cnt, "click", function(e){
				var currentElement = $.core.evt.fixEvent(e);
				currentElement = currentElement.target;
               //add by xionggq 添加意见反馈的链接。
				if (currentElement.tagName.toLowerCase() == "a" && currentElement.innerHTML.indexOf('管理') == -1 && currentElement.innerHTML.indexOf('反馈') == -1 && currentElement.innerHTML.indexOf($L('#L{微博}')) == -1 && currentElement.innerHTML.indexOf($L('#L{成员}')) == -1) {
					$.core.evt.preventDefault();
				}
			});
		}
		
		// 事件代理
		var delegate = $.core.evt.delegatedEvent(nodes.cnt);
		
		// -- 开始事件代理绑定 --
		// 分组页签切换
		if (isBigPipe) {
			delegate.add('group', 'click', function(spec){
				actions.groupChange.call(filterObject, spec);
			});
		}
		// 分组增加
		delegate.add('group_add', 'click', function(spec){
			actions.groupAdd.call(filterObject, spec.data.id);
		});
		
		// 分组排序
		delegate.add('group_sort', 'click', function(spec){
			actions.groupSort.call(filterObject);
		});
		
		// 分组管理 Change By WK 不用了
		delegate.add('group_admin', 'click', function(spec){
			actions.groupAdmin.call(filterObject, spec.el);
		});
		
		// 分组管理
		delegate.add('group_menu', 'click', function(spec){
			$.core.evt.preventDefault();
			actions.groupMenu.call(filterObject, spec.el);
		});
		
		// 搜索展开/隐藏
		delegate.add('search_folding', 'click', function(spec){
			// action-data 等于 1 表示展开，等于2表示隐藏
			var isShow = (spec.el.getAttribute('action-data') * 1 == 1);
			actions.searchToggle.call(filterObject, isShow);
		});
		
		// 搜索类型
		if (isBigPipe) {
			delegate.add('search_type', 'click', function(spec){
				actions.searchFilterChange.call(filterObject, spec.data.type);
			});
		}
		
		// 高级搜索日期选择器
		delegate.add('search_date', 'click', function(spec){
			actions.showCalendar.call(filterObject, spec.el, spec.data.type);
		});
		
		// 简单搜索按钮
		delegate.add('simpleSearchBtn', 'click', function(spec){
			actions.searchKeyword.call(filterObject, isBigPipe);
		});
		
		// 高级搜索按钮
		delegate.add('search_button', 'click', function(spec){
			actions.searchStart.call(filterObject, isBigPipe);
		});
		
		// 高级搜索开关
		delegate.add('search_adv', 'click', function(spec){
			//actions.advSearchToggle.call(filterObject, search, spec.data.type);
			actions.advDisplayToggle.call(filterObject, search, spec.data.type);
		});
		
		// 按互相关注搜索
		delegate.add('attention', 'click', function(spec){
			actions.orderByAttention.call(filterObject);
		});
		
		// 按悄悄关注搜索
		delegate.add('whisper', 'click', function(spec){
			actions.orderByWhisper.call(filterObject);
		});
		
		// 切换到按兴趣搜索
		delegate.add('order_by_hot', 'click', function(spec){
			actions.orderByHot.call(filterObject, spec.data);
		});
		
		// 按兴趣筛选
		delegate.add('hot_section', 'click', function(spec){
			actions.hotSection.call(filterObject, spec.data.section);
		});
		
		// 按兴趣搜索刷新
		delegate.add('hot_refresh', 'click', function(spec){
			actions.hotSection.call(filterObject, filterObject.config.section);
		});
		
		// 切换到按时间（分组、筛选）搜索
		delegate.add('order_by_time', 'click', function(spec){
			actions.orderByTime.call(filterObject, spec.data);
		});
		
		// 切换到微群页签
		delegate.add('order_by_weiqun', 'click', function(spec){
			actions.orderByWeiqun.call(filterObject, spec);
		});
		
		// 切换到精选页签
		delegate.add('order_by_collect', 'click', function(spec){
			actions.orderByCollect.call(filterObject, spec);
		});
		
		// -- 结束事件代理绑定 --
		
		//测试分组选择顺序方法。
		$.common.feed.groupAndSearch.groupListener.fireGroupRefresh();
	};
});
