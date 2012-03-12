/**
 * @fileoverview
 * homeFeed 顶部分组和搜索区域类配置
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
  * L.Ming @2011.06.08 增加按兴趣、互相关注搜索的事件处理
 * @history
  * guoqing5 @2011.07.14 增加清除“时间”点后面数字的UI方法resetTimeUI。
 */
// 过滤器基础类
$Import("common.feed.groupAndSearch.filter.base");

$Import("common.feed.groupAndSearch.template.homeFeedType");
$Import("common.feed.groupAndSearch.template.feedGroup");
$Import("common.feed.groupAndSearch.template.feedGroupLayer");
// 添加分组
$Import("common.dialog.addGroup");
$Import("common.dialog.publish");
//$Import("common.dialog.relationGroupAdd");
// 分组排序
$Import("common.dialog.groupOrder");
$Import("common.feed.groupAndSearch.template.homeFeedType");
$Import("kit.extra.language");
$Import("kit.extra.parseURL");
$Import("kit.dom.firstChild");

STK.register("common.feed.groupAndSearch.filter.homeFeed", function($) {
	
	var url = $.kit.extra.parseURL();
	var lang = $.kit.extra.language;
	
	var SEARCH = lang("#L{搜索关注人说的话}");
	var FOLD = lang("#L{收起}");
	var EXPAND = lang("#L{展开}");
	var SIMPLE = lang('#L{查找作者、内容或标签}');
	var ALL = lang('#L{全部}');
	var ORIGINAL = lang('#L{原创}');
	var PICTURE = lang('#L{图片}');
	var VIDEO = lang('#L{视频}');
	var MUSIC = lang('#L{音乐}');

	var transPIC = $CONFIG.imgPath + '/style/images/common/transparent.gif';
	// 创建分组按钮 HTML
	var GROUP_ADD = lang('<li class="addNew" suda-data="key=tblog_home_tab&value=create_grp" action-type="group_add" action-data="" >'+
					'<a href="#" onclick="return false;" title="#L{创建分组}"><em>+</em><cite>#L{创建新分组}</cite></a></li>');
	// 更多分组按钮 HTML
	var GROUP_MORE = lang('<li node-type="groupMoreBtn"><a onclick="return false;"' +
					' href="#" class="W_moredown"><span class="txt">#L{更多}</span>' +
						'<span class="more"></span></a></li>');
	// 按兴趣搜索的时间段 HTML 模板
	var HOT_SECTION = lang('<#et userlist data>'
		+ '#L{选择时间段：} '
		+ '<#list data.list as list>'
			+ '<a action-type="hot_section" '
				+ '<#if (list.id != 0)>'
				+ 'action-data="section=${list.id}"'
				+ '</#if>'
				+ ' href="${data.path}?hotmblog=1'
				+ '<#if (list.id != 0)>'
				+ '&section=${list.id}'
				+ '</#if>'
				+ '" '
				+ '<#if (list.id == data.current)>'
					+ 'class="current W_texta"'
				+ '</#if>'
				+ ' suda-data="key=tblog_home_tab&value=${list.suda}">${list.name}</a>'
				+ '<#if (list.id < 24)>'
					+ '<em class="W_vline">|</em>'
				+ '</#if>'
		+ '</#list>');

	var filter = $.common.feed.groupAndSearch.filter.base;
	
	var currentShownToggle;
	
	// 定义自定义事件
	filter.prototype.defineCustEvent = function () {
		// search 事件，执行分组切换、类型切换、高级搜索等时候触发给 Inter
		this.custKeySearch = $.core.evt.custEvent.define(this, "search");
		// newFeed 事件，当监听到顶部托盘有广播的时候，通知 Feed 区域显示小黄条
		this.custKeyNewFeed = $.core.evt.custEvent.define(this, "newFeed");
	};

	filter.prototype.hostDomain = url.path;
	filter.prototype.defaultCount = 15;
	filter.prototype.defaultSearchTip = [SEARCH, SIMPLE];
	filter.prototype.feedType = $.common.feed.groupAndSearch.template.feedType;
	
	// 初始化
	filter.prototype.init = function (opts) {
		var query = opts.pageQuery;
		this.getGroupInfoAdd();
		this.config = query;
		this.newFeedControl = opts.newFeedControl;
		//当在猜你喜欢的时候，提示为全部微博上放一个叫做“新”的“小坨坨”，当点会全部微博的时候，应该把小坨坨干掉！
		this.hideTipWhenInterest = opts.hideTipWhenInterest;
		if(query != null && query.is_search == "1"){
			this.isAdvSearched = true;
		} else if(query != null){
			this.config.currentType = 0;
			query.is_ori && query.is_ori == "1" && (this.config.currentType = 1);
			query.is_pic && query.is_pic == "1" && (this.config.currentType = 2);
			query.is_video && query.is_video == "1" && (this.config.currentType = 3);
			query.is_music && query.is_music == "1" && (this.config.currentType = 4);
		}
	};
	
	// 接收新Feed通知功能
	filter.prototype.newFeedNotify = function (data) {
		data = data || {};
		var num = data.feed;
		var isAll = true;	// 判断当前分组下是否有搜索条件（即是否是全部类型）
		if(this.config != null && this.config.currentType != null){
			isAll = (this.config.currentType * 1 == 0);
		}
		var isGroupAll = true; // 判断是否是全部分组下
		if(this.config != null && this.config.gid != null){
			isGroupAll = (this.config.gid * 1 == 0) ? true : false;
		}
		/* 只有同时满足如下条件，才跑出新 Feed 自定义事件：
		 * Feed数大于0、不是在高级搜索的时候、不是在按兴趣搜索里
		 */
		if(num > 0 && this.isAdvSearched != true && this.config.hotmblog == null){
			// 查询分组结果，如果当前分组有新Feed，就发出自定义事件通知 Feed
			$.core.evt.custEvent.fire(this.custKeyNewFeed, "newFeed", [{
				'count' : num,
				'isAll' : isAll
			}]);
//			this.isNewFeed = true;
		}
		// 如果在按兴趣搜索，且收到了新Feed通知，就写入
		if(num > 0 && this.config.hotmblog != null){
			this.nodes.time_count && (this.nodes.time_count.innerHTML = lang('#L{时间}<span class="W_count"><span>'+num+'</span></span>'));
		}
	};
	// ----- 事件代理关键函数开始 -----
	// 添加分组功能
	filter.prototype.groupAdd = function () {
		var that = this;
		$.common.dialog.addGroup().show({OK:function(data){
			if(data.gid) {
				window.location.href = "/" + $CONFIG['uid'] + "/follow?gid=" + data.gid;
			} else {
				that.groups = data;
			
				// 对分组数据进行拆分
				that.groupSplit();
		
				// 重置分组UI
				that.setGroupUI();
		
				if(that.groups.length > 4){
					that.setGroupLayerUI();
				}
			}
		},publish:true});
		this.hideGroupMoreLayer();
	};

	// 分组排序功能
	filter.prototype.groupSort = function () {
		this.hideGroupMoreLayer();
		$.common.dialog.groupOrder.show();
	};

	// 单个分组的下拉管理功能，点击一次展开，再次点击收起，重复此过程
	filter.prototype.groupAdmin = function (el) {
		var core = $.core;
		var parent = el.parentNode;
		var next = core.dom.next(parent);
		var pos = {
			t : parent.clientHeight,
			l : parent.clientWidth - 25 // 相对于 当前标签右侧-25px位置定位
		};
		var that = this;
		// 隐藏菜单
		function listen(){
			that.singleAdminMenu.style.display = "none";
			core.evt.removeEvent(document.body, "click", listen);
		}
		if (next != null) {
			if($.getStyle(next, "display") == "none"){
				next.style.cssText = 'position: absolute; display:block;left:' + pos.l + 'px;top:' + pos.t + 'px;';
				// 临时监听页面的点击事件，如果有点击，就隐藏管理菜单
				core.evt.addEvent(document.body, "click", listen);
			} else {
				listen();
			}
			core.evt.stopEvent();
			this.singleAdminMenu = next;// 记录最后展开的分组管理菜单
			this.isSigleAdmin = true;
		}
	};
	
	// 单个分组的下拉管理功能
	filter.prototype.groupMenu = function (el) {
		this.isSigleAdmin = true;	// 记录当前点击的是不是分组的管理下拉菜单
		window.location.href = el.getAttribute("href");
	};

	//todo 李明，这里还需要加上$config里德 uid的来分开不同的用户
	/*
	 * 获得本地存储的搜索开关状态
	 */
	function searchStatusGet () {
		return $.core.util.storage.get("homeFeedSearchToggle");
	}
	/*
	 * 设置本地存储的搜索开关状态
	 * @param {Boolean} status 必选参数，true表示搜索区开，false表示搜索区关
	 */
	function searchStatusSet (status){
		$.log('set search Status storage', status);
		$.core.util.storage.set("homeFeedSearchToggle", status);
	}

	// 展开收起筛选条件
	filter.prototype.searchToggle = function (status) {
		var node = this.nodes;
		var el = node.search;
		var groupList = node.groupList;
		var folding = node.searchFolding;
		if(folding == null){
			folding = $.core.dom.sizzle('[action-type="search_folding"]', groupList)[0];
			node.searchFolding = folding;
		}
		var toBeShow = status; // 取得是否应该显示 
		//toBeShow = (toBeShow == true || el.style.display == "none");//李明，我已经让php把打出的html直接先写display:none了
		el.style.display = toBeShow ? "" : "none";
		folding.className = "W_Titarr_" + (toBeShow ? "on" : "off");
		folding.title = (toBeShow ? FOLD : EXPAND);
		folding.setAttribute('action-data', toBeShow ? '2' : '1');
		var searchStatus = toBeShow;
		searchStatusSet(searchStatus);
	};
	
	// 自动展开/收起搜索条，根据本地永久缓存决定
	filter.prototype.autoSearchToggle = function () {
		// 取得 localStorage 中的高级搜索状态
		var status = searchStatusGet();
		$.log('search status get =',status);
		// 如果不是强制指定为 false，都给显示出来
		status = (status != "true" ? false : true);
		if(status == true){
			this.searchToggle.call(this, true);
		}else{
			this.searchToggle.call(this, false);
		}
	};
	//高级搜索仅展开，合起功能
	filter.prototype.advDisplayToggle = function(el , button) {
		el = el || this.nodes.search;
		button = button * 1;
		var children = el.children || el.childNodes;
		var simple = children[0];	// 简单过滤
		var advance = children[1];	// 高级过滤
		if(button == 0) {
			simple.style.display = "none";
			advance.style.display = "";						
		} else {
			simple.style.display = "";
			advance.style.display = "none";						
		}
	};

	// 高级搜索展开/关闭功能
	filter.prototype.advSearchToggle = function (el, button) {
		el = el || this.nodes.search;
		button = button * 1;
		var children = el.children || el.childNodes;
		var simple = children[0];	// 简单过滤
		var advance = children[1];	// 高级过滤
		var gid, currentType, attention;
		if(button == null){
			button = (this.isAdvSearched != null && this.isAdvSearched == true) ? 0 : 1;
		}

		// 清除所有筛选条件参数，仅保留 gid 和上次筛选的 action-data 值
		gid = this.config.gid;
		attention = this.config.attention;
		currentType = this.config.currentType;
		this.reset();
		this.config.gid = gid;
		this.config.attention = attention;
		this.config.currentType = currentType;
		this.nodes.searchForm.reset();
		
		// button == 0 展开高级搜索，button == 1 关闭高级搜索
		if(button == 0){
			simple.style.display = "none";
			advance.style.display = "";
			if(this.config.currentType > 0 && this.config.currentType < 5){
				this.setAdvForm(this.config.currentType);
			}
			return;
		}
		if(button == 1){
			// this.isAdvSearched 表示执行过了高级搜索
			if((this.isAdvSearched != null && this.isAdvSearched == true) || this.config.currentType == null){
				this.searchFilterChange(0);
			}
			advance.style.display = "none";
			simple.style.display = "";
			return;
		}
		this.isAdvSearched = null;
	};
	// 切换分组功能
	filter.prototype.groupChange = function (el) {
		if(this.isSigleAdmin == true){
			this.isSigleAdmin = null;
			return;
		}
		this.isAdvSearched = false;
		this.reset();
		this.config.gid = el.data.id;
		this.config.isAllType = 1;
		this.config.currentType = 0;

		this.hideGroupMoreLayer();
		// 隐藏高级搜索表单
		this.advSearchToggle(null, 1);
		this.groupSplitAdd(el);
		this.setGroupUI();
		this.setGroupLayerUI();
		this.setSearchTypeUI(0);
		this.nodes.singleForm.reset();
		this.collectParameter();
	};

	// 简单关键字搜索
	filter.prototype.searchKeyword = function () {
		// 如果我的首页搜索关键字为空，就不提交请求
		if(this.nodes.simpleSearch && 
			($.trim(this.nodes.simpleSearch.value) == "" || $.trim(this.nodes.simpleSearch.value) == SIMPLE)){
			return;
		}
		if(this.hasError != true){
			this.isAdvSearched = true;
			this.collectParameter(this.nodes.singleForm);
		}
		this.config.key_word = $.trim(this.nodes.simpleSearch.value);
		this.setSearchTypeUI();
	};
	// showCalendar、searchStart 在 filter.base 中定义
	
	// 按互相关注搜索
	filter.prototype.orderByAttention = function () {
		// 清掉按时间（分组、筛选）搜索的所有数据
		this.reset();
		this.nodes.singleForm.reset();
		this.config.attention = 1;
		this.config.currentType = 0;
		this.groupSplitAdd();
		this.setGroupUI();
		this.setSearchTypeUI(0);
		
		var postParam = {
			'attention' : this.config.attention,
			'count' : 15
		};
		$.core.evt.custEvent.fire(this.custKeySearch, "search", ["search", postParam, {
			'isGroupAll' : false,
			'isFilterAll' : true
		}]);
	};
	// 按悄悄关注搜索
	filter.prototype.orderByWhisper = function () {
		// 清掉按时间（分组、筛选）搜索的所有数据
		this.reset();
		this.nodes.singleForm.reset();
		this.config.whisper = 1;
		this.config.currentType = 0;
		this.groupSplitAdd();
		this.setGroupUI();
		this.setSearchTypeUI(0);
		
		var postParam = {
			'whisper' : this.config.whisper,
			'count' : 15
		};
		$.core.evt.custEvent.fire(this.custKeySearch, "search", ["search", postParam, {
			'isGroupAll' : false,
			'isFilterAll' : true
		}]);
	};
	// 切换到按兴趣搜索面板
	filter.prototype.orderByHot = function () {
		//将是否显示新feed改为false,因为提示的新feed不是猜你喜欢的，而是所有的
		this.newFeedControl.display = false;
		//清掉小黄签的提醒
		
		// 清掉按时间（分组、筛选）搜索的所有数据
		this.reset();
        this.resetTimeUI();
		this.config.hotmblog = 1;
		this.nodes.feed_hot.style.display = '';
		this.nodes.feed_group.style.display = 'none';
		// 收集参数
		var postParam = {
			'hotmblog' : this.config.hotmblog,
			'count' : 15
		};
		$.core.evt.custEvent.fire(this.custKeySearch, "search", ["search", postParam, {
			'isGroupAll' : false,
			'isFilterAll' : false
		}]);
		
		this.switchTabs("feed_hot");
	};
	
	filter.prototype.switchTabs = function(name){
		name += '_tab';
		if(!this.nodes[name]) return;
		var currentNodes = $.sizzle(".current", this.nodes[name].parentNode);
		var a;
		for(var i in currentNodes){
			$.removeClassName(currentNodes[i], "current");
			a = $.sizzle("a", currentNodes[i]);
			if(a && a[0]){
				a[0].className = '';
			}
		}
		$.addClassName(this.nodes[name], "current");
		$.sizzle("a", this.nodes[name])[0].className = 'W_texta';
	}
	
    // add by xionggq
    //重置时间点的UI，清除“时间”后面接着的数字。
    filter.prototype.resetTimeUI = function()
    {
        if(this.nodes.time_count && this.config.hotmblog != null)
        {
            this.nodes.time_count.innerHTML = lang('#L{时间}<span class="W_count" style="display:none;"><span></span></span>');
        }
    };
	// 按兴趣搜索筛选
	filter.prototype.hotSection = function (section) {
		if(section == null){
			section = 0;
		} else {
			section = section || this.config.section;
		}
		// 如果时间段变了就重绘 UI
		if(section != this.config.section){
			this.setSectionUI(section);
		}
		// 收集参数
		var postParam = {
			'hotmblog' : this.config.hotmblog,
			'count' : 15
		};
		if(section * 1 != 0){
			postParam.section = section;
		}
		this.config.section = section;
		
		$.core.evt.custEvent.fire(this.custKeySearch, "search", ["search", postParam, {
			'isGroupAll' : false,
			'isFilterAll' : false
		}]);
	};
	// 切换到按时间（分组、筛选）搜索
	filter.prototype.orderByTime = function () {
		// 清掉按兴趣搜索的所有数据
		this.reset();
		this.newFeedControl.display = true;
		//干掉全部微博上面的叫做“新”的“小坨坨”
		this.hideTipWhenInterest();
		// 返回全部分组的全部类型
		this.setGroupUI();
		this.setGroupLayerUI();
		this.setSearchTypeUI(0);
		
		var postParam = {
			'count' : 15
		};
		$.core.evt.custEvent.fire(this.custKeySearch, "search", ["search", postParam, {
			'isGroupAll' : true,
			'isFilterAll' : true
		}]);
		this.nodes.feed_hot.style.display = 'none';
		this.nodes.feed_group.style.display = '';

		this.setSectionUI(0);
		
		this.switchTabs('feed_group');

	};
	// ----- 事件代理关键函数结束 -----
	
	// 重绘兴趣时间段的UI
	filter.prototype.setSectionUI = function(section){
		if(section == null){
			section = this.config.section;
		}
		var template = $.core.util.easyTemplate(HOT_SECTION);
		var viewerHTML = template({
			'list' : [
				{ 'id' : 0, 'name' : lang('#L{全部}') ,'suda' : 'like_all'},
				{ 'id' : 1, 'name' : lang('1#L{小时}'),'suda' : 'like01' },
				{ 'id' : 2, 'name' : lang('2#L{小时}'),'suda' : 'like02' },
				{ 'id' : 4, 'name' : lang('4#L{小时}'),'suda' : 'like04' },
				{ 'id' : 8, 'name' : lang('8#L{小时}'),'suda' : 'like08' },
				{ 'id' : 24, 'name' : lang('24#L{小时}'),'suda' : 'like24' }
				],
			'current' : section || 0,
			'path' : this.hostDomain
		});
		this.nodes.hot_section.innerHTML = viewerHTML;
	};

	// 重新渲染分组UI
	filter.prototype.setGroupUI = function () {
		var html = lang($.common.feed.groupAndSearch.template.feedGroup);
		var template = $.core.util.easyTemplate(html);
		var viewerHTML = template({
			'list' : this.groupInTab,
			'current' : this.config.gid || "0",
			'attention' : this.config.attention || "0",
			'whisper' : this.config.whisper || "0",
			'path' : this.hostDomain
		});
		var groupMoreBtn = this.nodes.groupMoreBtn;
		var feedGroupLayer;
		var feedGroup = this.nodes.feedGroup;
		var more;
		// 如果存在分组按钮
		if(groupMoreBtn != null && !$.core.arr.isArray(groupMoreBtn)){
			groupMoreBtn = groupMoreBtn.parentNode.removeChild(groupMoreBtn);
			feedGroup.innerHTML = viewerHTML;
			feedGroup.appendChild(groupMoreBtn);
		}
		// 如果分组数小于2，只出现添加按钮
		else if(this.groupInTab.length < 3){
			more = GROUP_ADD;
			more = $.core.dom.builder(more);
			feedGroup.innerHTML = viewerHTML;
			feedGroup.appendChild(more.box);
		}
		// 如果分组数从创建成功后增加到大于 1
		else {
			more = GROUP_MORE;
			more = $.core.dom.builder(more);
			feedGroup.innerHTML = viewerHTML;
			feedGroup.appendChild(more.box);
			groupMoreBtn = feedGroup.lastChild;
			feedGroupLayer = this.nodes.feedGroupLayer;
			$.common.feed.groupAndSearch.groupMoreControl.on({
				'groupMoreBtn' : groupMoreBtn,
				'feedGroupLayer' : feedGroupLayer
			});
		}
	};

	// 重新渲染分组下拉浮层UI
	filter.prototype.setGroupLayerUI = function () {
		var html = lang($.common.feed.groupAndSearch.template.feedGroupLayer);
		var template = $.core.util.easyTemplate(html);
		var list = this.groupInLayer;
		var viewerHTML = template({
			'list' : list,
			'count' : list.length,
			'path' : this.hostDomain
		});
		this.nodes.feedGroupLayer.innerHTML = viewerHTML;
	};

	// 设置简单过滤器的 UI，homeFeed 与  myFeed、hisFeed 不同，所以覆盖了基础的定义
	filter.prototype.setSearchTypeUI = function (type) {
		type = (type != null) ? type : this.config.currentType;
		
		var html = $.kit.extra.language(this.feedType);
		var template = $.core.util.easyTemplate(html);
		var url = $.kit.extra.parseURL();
		url = "/" + url.path;
		var gid, filter;
		if(this.config.attention == 1){
			url += "?attention=1";
			if(this.config.key_word != null){
				url += "&key_word=" + encodeURIComponent(this.config.key_word) + "&is_search=1";
			}
			filter = "&";
		} else if(this.config.whisper == 1){
			url += "?whisper=1";
			if(this.config.key_word != null){
				url += "&key_word=" + this.config.key_word + "&is_search=1";
			}
			filter = "&";
		} else {
			gid = this.config.gid;
			gid = (gid == null || gid * 1 == 0) ? "" : "?gid=" + gid;
			filter = (gid == "") ? "?" : "&";
			url += gid;
			if(this.config.key_word != null){
				url += filter + "key_word=" + encodeURIComponent(this.config.key_word) + "&is_search=1";
				filter = "&";
			}
		}

		var data = {
			'list' : [	{ 'id' : 0, 'name' : ALL,		'url' : url , 'suda' : 'all'},
						{ 'id' : 1, 'name' : ORIGINAL,	'url' : url + filter + "is_ori=1" ,'suda' : 'org'},
						{ 'id' : 2, 'name' : PICTURE,	'url' : url + filter + "is_pic=1" , 'suda' : 'pic'},
						{ 'id' : 3, 'name' : VIDEO,		'url' : url + filter + "is_video=1" , 'suda' : 'video'},
						{ 'id' : 4, 'name' : MUSIC,		'url' : url + filter + "is_music=1" , 'suda' : 'music'}
			],
			'count' : 4,
			'current' : type * 1
		};
		var viewerHTML = template(data);
		this.nodes.feedType.innerHTML = viewerHTML;
	};
	
		// 筛选条件切换
	filter.prototype.searchFilterChange = function (el) {
		var gid = this.config.gid;
		var key_word = this.config.key_word;
		var attention = this.config.attention;
		var whisper = this.config.whisper;
		this.reset();
		this.config.gid = gid;
		if(key_word != null){
			this.config.is_search = 1;
		}
		this.config.key_word = key_word;
		
		this.config.attention = attention;
		this.config.whisper = whisper;
		switch(el){
			case "0" : 
				this.config.isAllType = 1;
				break;
			case "1" : 
				this.config.is_ori = 1;
				break;
			case "2" : 
				this.config.is_pic = 1;
				break;
			case "3" : 
				this.config.is_video = 1;
				break;
			case "4" : 
				this.config.is_music = 1;
				break;
		}
		this.config.currentType = el;
		this.setSearchTypeUI();
		this.collectParameter();
	};

	// 隐藏分组下拉浮层UI
	filter.prototype.hideGroupMoreLayer = function () {
		var layer = this.nodes.feedGroupLayer;
		if(layer != null && $.getStyle(layer, "display") != "none"){
			$.setStyle(layer, "display", "none");
		}
	};

	// 将分组信息分割成两部分，一部分是分页页签要展示的，一部分是下来菜单要展示的
	filter.prototype.groupSplit = function () {
		var groups = this.groups;
		var groupInTab = [];
		var groupInLayer = [];
		var len = groups.length;
		var item;
		for(var i = 0; i < len; i ++){
			item = groups[i];
			// 如果是前4条，或者该分组是用户当前展示的分组
			if(i < 4 || (this.config.gid != null && item.id == this.config.gid)){
				item.short_name = ($.core.str.bLength(item.gname) > 8)
									? $.core.str.leftB(item.gname, 6) + "…" : item.gname;
				item.count = (item.count == null) ? 0 : item.count;
				item.num = (item.count > 99) ? "99+" : item.count;
				item.type = 0;
				groupInTab.push(item);
			} else {
				item.short_name = item.gname;
				item.count = (item.count == null) ? 0 : item.count;
				item.num = item.count;
				item.type =2;
				groupInLayer.push(item);
			}
		}
		this.groupInTab = groupInTab;
		this.groupInLayer = groupInLayer;
	};
	// 从页面 DOM 获得当前的分组信息
	filter.prototype.getGroupInfo = function () {
		var that = this;
		var node = this.nodes;
		var feedGroup = node.feedGroup;		
		var feedLayer = node.feedGroupLayer;
		
		var groupInfo = [];
		var core = $.core;
		var dom = core.dom;
		var arr = core.arr;
		var tabItem = dom.sizzle('[action-type="group"]', feedGroup);
		var menuItem = dom.sizzle('[action-type="group"]', feedLayer);
		
		arr.foreach(tabItem, function(e){
			var id = e.getAttribute("action-data").replace(/\D/g, "");
			if(id != 0){
				if(e.className == "current"){
					that.config.gid = id;
				}
				var item = $.kit.dom.firstChild(e);
				groupInfo.push({
					'gid' : id,
					'gname' : item.title || item.innerHTML.replace(/<[^>]*>/gi, ""),
					'num' : 0,
					 'type' : 0
				});
			}
		});
		arr.foreach(menuItem, function(e){
			var id = e.getAttribute("action-data").replace(/\D/g, "");
			groupInfo.push({
				'gid' : id,
				'gname' : e.title || e.innerHTML.replace(/<[^>]*>/gi, ""),
				'num' : 0 ,
				 'type' : 2
			});
		});
		this.groups = groupInfo;
	};
	
	// 获取是否在全部分组下
	filter.prototype.isGroupAll = function () {
		var isAll = true;
		if(this.config != null && this.config.gid != null){
			isAll = (this.config.gid * 1 == 0) ? true : false;
		}
		return isAll;
	};

	// 将分组信息分割成两部分，一部分是分页页签要展示的，一部分是下来菜单要展示的 (新增的)
	filter.prototype.groupSplitAdd = function (el) {
		var groups = this.groups;
		var groupInTab = [];
		var groupInLayer = [];
		var len = groups.length;
		var item;
		
		if(el && el.el && !$.core.dom.contains(this.nodes.feedGroup, el.el) ){
			for(var i = 0; i < len; i ++){		
				if(el.data["id"] === groups[i]["gid"]){
					groups[i]["type"] = 0;
					currentShownToggle["type"] = 2;
					currentShownToggle = groups[i];
					break;
				}
			}
		}
		
		for(var i = 0; i < len; i ++){
			item = groups[i];
			// 如果是前4条，或者该分组是用户当前展示的分组
			if(item.type == 0 || (this.config.gid != null && item.gid == this.config.gid)){
				item.short_name = ($.core.str.bLength(item.gname) > 8)
									? $.core.str.leftB(item.gname, 6) + "…" : item.gname;
				item.count = (item.count == null) ? 0 : item.count;
				item.num = (item.count > 99) ? "99+" : item.count;
				groupInTab.push(item);
			} else {
				item.short_name = item.gname;
				item.count = (item.count == null) ? 0 : item.count;
				item.num = item.count;
				groupInLayer.push(item);
			}
		}
		this.groupInTab = groupInTab;
		this.groupInLayer = groupInLayer;
	};
	// 从页面 DOM 获得当前的分组信息
	filter.prototype.getGroupInfoAdd = function () {
		var that = this;
		var node = this.nodes;
		var feedGroup = node.feedGroup;
		var feedLayer = node.feedGroupLayer;

		var groupInfo = [];
		var core = $.core;
		var dom = core.dom;
		var arr = core.arr;
		var tabItem = dom.sizzle('[action-type="group"]', feedGroup);
		var menuItem = dom.sizzle('[action-type="group"]', feedLayer);
		arr.foreach(tabItem, function(e){
			var id = e.getAttribute("action-data").replace(/\D/g, "");
			if(id != 0){
				if(e.className == "current"){
					that.config.gid = id;
				}
				var item = $.kit.dom.firstChild(e);
				groupInfo.push({
					'gid' : id,
					'gname' : $.trim(item.title || item.innerHTML.replace(/<[^>]*>/gi, "")),
					'num' : 0,
					'type' : 0
				});
			}
		});
		arr.foreach(menuItem, function(e){
			var id = e.getAttribute("action-data").replace(/\D/g, "");
			groupInfo.push({
				'gid' : id,
				'gname' : e.title || e.innerHTML.replace(/<[^>]*>/gi, ""),
				'num' : 0 ,
				'type' : 2
			});
		});
		
		this.groups = groupInfo;
		currentShownToggle = this.groups[2];
		this.groupSplitAdd();
	};
	
	//微群页签
	filter.prototype.orderByWeiqun = function (spec) {
		var el = $.sizzle('a', spec.el);
		if(el && el[0]){
			window.location.href = el[0].getAttribute('href');
		}		
	};
	
	//精选页签
	filter.prototype.orderByCollect = function(spec) {
		var el = $.sizzle('a', spec.el);
		if(el && el[0]){
			window.location.href = el[0].getAttribute('href');
		}		
	};
	
	filter.prototype.reset = function () {
		this.config = {};
	};
	return filter;
});
