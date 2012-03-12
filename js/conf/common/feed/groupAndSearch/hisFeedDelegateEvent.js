/**
 * @fileoverview
 * 事件代理
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
$Import("kit.extra.language");
$Import('common.feed.groupAndSearch.tagListener');

STK.register("common.feed.groupAndSearch.hisFeedDelegateEvent", function($) {

	var SEARCH = [$.kit.extra.language("#L{搜索他说的话}"), $.kit.extra.language("#L{搜索她说的话}")];

	return function(node, filterObject, opts) {
		var nodes = node;
		var actions = filterObject;
		opts = opts || {};
		var isBigPipe = opts.isBigPipe;

		var search = nodes.search;
		var keyword = nodes.keyword ;
		var placeHolderEnabled = !!("placeholder" in document.createElement("input"));

		function keywordHandle(keyword) {
			if(!keyword) return;
			if (placeHolderEnabled) {
				keyword.value = "";
			} else {
				// 搜索关键字---
				$.core.evt.addEvent(keyword, 'focus', function() {
					var find = $.hasby(SEARCH, function(v, i) {
						return (v === keyword.value);
					});
					if (find.length > 0) {
						keyword.value = "";
					} else {
						keyword.select();
					}
				});
				// 搜索关键字---
				$.core.evt.addEvent(keyword, 'blur', function() {
					if (keyword.value == "") {
						keyword.value = keyword.getAttribute("placeholder");
					}
				});
			}
		}

		function enterKeySubmit() {
			var evt = $.fixEvent();
			evt.target.form.onsubmit = function() {
				return false;
			};
			evt = $.getEvent();
			var key = evt.which || evt.keyCode;

			if (key == 13) {
				actions.searchKeyword.call(filterObject, isBigPipe);
			}
		}

		if ($.isArray(keyword)) {
			for (var i = 0, len = keyword.length; i < len; i ++) {
				keywordHandle(keyword[i]);
				if (i == 0) {
					$.core.evt.addEvent(keyword[i], 'keyup', enterKeySubmit);
				}
			}
		} else {
			//写保护，去除掉原来的[i]的方法，确认为误写。
			keyword && keywordHandle(keyword);
			keyword && $.core.evt.addEvent(keyword, 'keyup', enterKeySubmit);
		}
		// 如果支持 bigPipe
		if (isBigPipe) {
			$.core.evt.addEvent(nodes.cnt, "click", function(e) {
				var currentElement = $.core.evt.fixEvent(e);
				currentElement = currentElement.target.tagName;
				if (currentElement.toLowerCase() == "a") {
					$.core.evt.preventDefault();
				}
			});
		}
		// 事件代理
		var delegate = STK.core.evt.delegatedEvent(nodes.cnt);

		// -- 开始事件委托绑定 --

		// 搜索展开/隐藏
		delegate.add('search_folding', 'click', function(spec) {
			actions.searchToggle.call(filterObject);
		});

		// 搜索类型
		if (isBigPipe) {
			delegate.add('search_type', 'click', function(spec) {
				actions.searchFilterChange.call(filterObject, spec.data.type);
			});
		}
		// 搜索日期
		delegate.add('search_date', 'click', function(spec) {
			actions.showCalendar.call(filterObject, spec.el, spec.data.type);
		});

		// 搜索按钮
		delegate.add('search_button', 'click', function(spec) {
			actions.searchStart.call(filterObject, isBigPipe);
		});

		delegate.add('search_key', 'click', function(spec) {
			actions.searchKeyword.call(filterObject);
		});

		// 高级搜索开关
		delegate.add('search_adv', 'click', function(spec) {
			//actions.advSearchToggle.call(filterObject, search, spec.data.type);
			actions.advDisplayToggle.call(filterObject, search, spec.data.type);
		});
		//标签
		delegate.add('feed_tag_active', 'click', function(spec){
			actions.tagActive.call(filterObject, spec);
		});
		delegate.add('feed_tag_edit','click',function(spec){
			actions.tagEditForm.call(filterObject, spec);
		});
		delegate.add('feed_tag_del','click',function(spec){
			actions.tagDel.call(filterObject, spec);
		});
		delegate.add('more_tags_toggle', 'click', function(spec){
			actions.tagMoreToggle.call(filterObject, spec);
		});
		delegate.add('tag_edit_submit','click',function(spec){
			actions.tagEditSubmit.call(filterObject, spec);
		});
		delegate.add('tag_edit_cancel','click',function(spec){
			actions.tagEditFormCancel.call(filterObject, spec);
		});
		//心情微博列表模式
		delegate.add('mood_list', 'click', function(spec) {
			actions.moodList.call(filterObject, spec);
		});
		//心情微博的日期列表
		delegate.add('mood_calendar', 'click', function(spec) {
			actions.moodCalendar.call(filterObject, spec);
		});
		$.common.feed.groupAndSearch.tagListener(filterObject);
		// -- 结束事件委托绑定 --
	};
//	};
});