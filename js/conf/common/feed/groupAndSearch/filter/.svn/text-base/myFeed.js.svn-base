/**
 * @fileoverview
 * myFeed 顶部搜索区域类配置
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
// 过滤器基础类
$Import("common.feed.groupAndSearch.filter.base");

$Import("common.feed.groupAndSearch.template.myFeedType");
$Import("common.feed.groupAndSearch.template.moodFeedType");
$Import("kit.extra.language");

STK.register("common.feed.groupAndSearch.filter.myFeed", function($) {
	var RANK = $.kit.extra.language("#L{查看权限}");
	var SEARCH = $.kit.extra.language("#L{搜索我说的话}");
	
	var filter = $.common.feed.groupAndSearch.filter.base;
	
	filter.prototype.defineCustEvent = function () {
		// search 事件，执行分组切换、类型切换、高级搜索等时候触发给 Inter
		this.custKeySearch = $.core.evt.custEvent.define(this, "search");
		// newFeed 事件，当监听到顶部托盘有广播的时候，通知 Feed 区域显示小黄条
		this.custKeyNewFeed = $.core.evt.custEvent.define(this, "newFeed");
		//定义心情微博的切换到时间模式下
		this.custKeyMoodCalendar = $.core.evt.custEvent.define(this,"mood")

	};
	
	filter.prototype.defaultCount = 50;
	filter.prototype.defaultSearchTip = [SEARCH];
	filter.prototype.feedType = $.common.feed.groupAndSearch.template.feedType;
	
	filter.prototype.init = function (opts) {
		var isAdvSearch;
		var query = opts.pageQuery;
		if(query != null && query.is_search == "1"){
			this.isAdvSearched = true;
		}
		this.config = query;
	};
	//只是展开和合起高级搜索(我的微博页面)
	filter.prototype.advDisplayToggle = function(el, button){
		el = el || this.nodes.search;
		button = button * 1;
		var simple = $.domPrev(el);
		if(button == 0) {
			// 简单过滤
			$.setStyle(simple, "display", "none");
			// 高级搜索
			$.setStyle(el, "display", "");
			
			this.tagHide();
		} else {
			// 简单过滤
			$.setStyle(simple, "display", "");
			// 高级搜索
			$.setStyle(el, "display", "none");
			
			this.tagAutoToggle();
		}
	}
	filter.prototype.advSearchToggle = function (el, button) {
		el = el || this.nodes.search;
		button = button * 1;
		var simple = $.domPrev(el);
		var isHide = ($.getStyle(el, "display") == "none");
		if(button == null){
			button = (this.isAdvSearched != null && this.isAdvSearched == true) ? 0 : 1;
		}

		// button == 0 展开高级搜索，button == 1 关闭高级搜索
		if(button == 0){
			var currentType = this.config.currentType;
			this.reset();
			this.config.currentType = currentType;
			this.nodes.searchForm.reset();
			this.nodes.keyword[0].value = "";
			// 简单过滤
			$.setStyle(simple, "display", "none");
			// 高级搜索
			$.setStyle(el, "display", "");
			if(this.config.currentType > 0 && this.config.currentType < 5){
				this.setAdvForm(this.config.currentType);
			}
			return;
		}
		if(button == 1){
			if(this.isAdvSearched != null && this.isAdvSearched == true){
				this.searchFilterChange(0);
				this.isAdvSearched = null;
			}
			// 简单过滤
			$.setStyle(simple, "display", "");
			// 高级搜索
			$.setStyle(el, "display", "none");
			return;
		}
	};
	
	// 设置简单过滤器的 UI
	filter.prototype.setSearchTypeUI = function (type) {
		type = (type != null) ? type : this.config.currentType;
		var html = $.kit.extra.language(this.feedType);
		var template = $.core.util.easyTemplate(html);
		var gid = this.config.gid;
		gid = (gid == null || gid * 1 == 0) ? "" : "?gid=" + gid;
		var url = $.kit.extra.parseURL();
		url = url.path;
		var filter = (gid == "") ? "?" : "&";
		var data = {
			'list' : [	{ 'id' : 0, 'name' : this.TEMP.ALL,		'url' : "/" + url + gid },
						{ 'id' : 1, 'name' : this.TEMP.ORIGINAL,	'url' : "/" + url  + gid + filter + "is_ori=1" },
						{ 'id' : 2, 'name' : this.TEMP.PICTURE,	'url' : "/" + url  + gid + filter + "is_pic=1" },
						{ 'id' : 3, 'name' : this.TEMP.VIDEO,		'url' : "/" + url  + gid + filter + "is_video=1" },
						{ 'id' : 4, 'name' : this.TEMP.MUSIC,		'url' : "/" + url  + gid + filter + "is_music=1" },
						{ 'id' : 5, 'name' : this.TEMP.TAGS,		'url' : "/" + url  + gid + filter + "is_tag=1" }
			],
			'rankDefault' : RANK,
			'count'       : 5,
			'current'     : type * 1
		};
		var viewerHTML = template(data);
		this.nodes.feedType.innerHTML = viewerHTML;
		this.ranksDisplayHide();
		this.tagAutoToggle();
	};
	
	/**
	 * 定向过滤 Start ------------------------------
	 */
	/**
	 * 更改rank
	 */
	filter.prototype.searchRankChange = function(spec){
		var key_word = this.config.key_word;
		this.reset();
		this.config.key_word = key_word;
		this.config.currentType = 0;
		this.setSearchTypeUI(-1);
		if(spec.data["rank"] && spec.data.rank != ''){
			this.config.rank = spec.data.rank;
			$.sizzle('li[action-type="search_ranks"] span.txt', this.nodes.feedType)[0].innerHTML = spec.el.firstChild.innerHTML;
			$.addClassName($.sizzle('li[action-type="search_ranks"] a')[0], 'W_texta');
		}
		this.collectParameter();
	};
	filter.prototype.ranksDisplayShow = function(spec){
		if(!this.nodes["search_ranks"]) return;
		var pos = $.position(spec.el);
		var size = $.core.dom.getSize(spec.el);
		$.setStyle(this.nodes.search_ranks, 'zIndex', 99);
		$.setStyle(this.nodes.search_ranks, 'left', pos.l - 3 + 'px');
		$.setStyle(this.nodes.search_ranks, 'top', pos.t + size.height + 3 + 'px');
		$.setStyle(this.nodes.search_ranks, 'display', '');
	};
	filter.prototype.ranksDisplayHide = function(spec){
		if(!this.nodes["search_ranks"]) return;
		$.setStyle(this.nodes.search_ranks, 'display', 'none');
	};
	filter.prototype.ranksDisplayToggle = function(spec){
		if($.getStyle(this.nodes.search_ranks, 'display') == 'none'){
			this.ranksDisplayShow(spec);
		} else {
			this.ranksDisplayHide(spec);
		}
	};
	filter.prototype.ranksDisplayAutoHide = function(evt){
		if(!this.nodes["search_ranks"]) return;
		var search_ranks_btn = $.sizzle('[action-type="search_ranks"]', this.nodes.feedType)[0];
		if( $.core.dom.contains(search_ranks_btn, evt.target) || $.core.dom.contains(this.nodes.search_ranks_btn, evt.target) ){
			return;
		}
		this.ranksDisplayHide();
	}
	/**
	 * 定向过滤 End ------------------------------
	 */


	filter.prototype.reset = function () {
		this.config = {};
	};
	//心情列表
	filter.prototype.moodList = function(spec)
	{
		$.core.evt.custEvent.fire(this.custKeyMoodCalendar, "mood", ["listMood"]);
		var lang = $.kit.extra.language;
		var html = $.common.feed.groupAndSearch.template.moodFeedType;
		var data = {
			'list' : [
				{ 'id' : 0, 'title':'#L{按列表查看}','actiontype':'mood_list','className':'icon_calef'},
				{ 'id' : 1, 'title' : '#L{按日期查看}','actiontype':'mood_calendar','className':'icon_caled' , suda : 'key=tblog_mood&value=cutover_calendar'}
			],
			'current' : 0,
			'count': 1
		};
		
		this.nodes.mood_filter.innerHTML = lang($.core.util.easyTemplate(html , data).toString());
		this.reset();
		//php要求在这个页面添加ismood=1来确定调用心情模板
		this.config.ismood = 1;
		this.collectParameter();
	};
	//心情日期
	filter.prototype.moodCalendar = function(spec) {
		$.core.evt.custEvent.fire(this.custKeyMoodCalendar, "mood", ["calendarMood" , spec]);
		var lang = $.kit.extra.language;
		var html = $.common.feed.groupAndSearch.template.moodFeedType;
		var data = {
			'list' : [
				{ 'id' : 0, 'title':'#L{按列表查看}','actiontype':'mood_list','className':'icon_calef'},
				{ 'id' : 1, 'title' : '#L{按日期查看}','actiontype':'mood_calendar','className':'icon_caled' , suda : 'key=tblog_mood&value=cutover_calendar' }
			],
			'current' : 1,
			'count': 1
		};
		this.nodes.mood_filter.innerHTML = lang($.core.util.easyTemplate(html , data).toString());
	};
	return filter;
});
