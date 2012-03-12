/**
 * @fileoverview
 * 搜索和过滤基础类
 * @id common.feed.groupAndSearch.filter.filter
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
$Import("common.feed.groupAndSearch.include.calendar");
$Import('ui.confirm');
$Import("kit.extra.language");
$Import("kit.dom.parentElementBy");
$Import("kit.dom.firstChild");

STK.register("common.feed.groupAndSearch.filter.base", function($) {
	var lang = $.kit.extra.language;
	var DATE_ERROR = lang('<span class="icon_del"></span>#L{开始日期不能小于结束日期}');
	var TEMP = {
		TAG : {
			ITEM : '' +
				'<li tag_name="#{TAG_NAME}" node-type="feed_tag">' +
					'<a class="tag" onclick="return false;" href="javascript:void(0);">' +
					'<i url="?is_tag=1&tag_name=#{TAG_NAME}" action-data="tag_name=#{TAG_NAME}" action-type="feed_tag_active">#{TAG_NAME}</i>' +
						'<span class="W_texta">(<i node-type="count">#{COUNT}</i>)</span>' +
						'<em>' +
							'<span class="icon_edit_s" action-data="old_tag=#{TAG_NAME}" action-type="feed_tag_edit" title="#L{修改这个标签}"></span>' +
							'<span class="icon_del_s" action-data="del_tag=#{TAG_NAME}" action-type="feed_tag_del" title="#L{删除这个标签}"></span>' +
						'</em>' +
					'</a>' +
				'</li>'
			,EDIT : lang('' +
				'<span>' +
					'<input node-type="tag_edit_form" type="text" class="W_input" value="#{TAG_NAME}">' +
					'<a class="W_btn_b" action-type="tag_edit_submit" action-data="old_tag=#{TAG_NAME}" href="javascript:void(0);" onclick="return false"><span>#L{保存}</span></a>' +
					'<a class="W_btn_a" action-type="tag_edit_cancel" action-data="old_tag=#{TAG_NAME}" href="javascript:void(0);" onclick="return false"><span>#L{取消}</span></a>' +
				'</span>')
		}
	};
		

	function filter(node, opts){
		
		this.nodes = node;
		this.reset();
		
		// 定义自定义事件
		this.defineCustEvent && this.defineCustEvent();
		// 初始化 
		this.init && this.init(opts);
	}
	
	filter.prototype.TEMP = {
		ALL        : lang('#L{全部}'),
		ORIGINAL   : lang('#L{原创}'),
		PICTURE    : lang('#L{图片}'),
		VIDEO      : lang('#L{视频}'),
		MUSIC      : lang('#L{音乐}'),
		TAGS       : lang('#L{标签}')
	}
	
	// 搜索过滤参数默认值
	filter.prototype.defaultConfig = {
		'gid' :	0,				// 分组ID
		'isAllType' :	0,		// 全部分类
		'is_ori' :	0,			// 是原创
		'is_forward' :	0,		// 是转发
		'is_pic' :	0,			// 是图片
		'is_video' :	0,		// 是视频
		'is_music' :	0,		// 是音乐
		'is_tag'   :	0,		// 是Tag
		'is_text' :		0,		// 是纯文本
		'key_word' :	null,	// 关键字
		'start_time' :	null,	// 起始日期
		'end_time' :	null,	// 结束日期
		'rank'     :    null    // 定向过滤类型
	};
		
	filter.prototype.searchStart = function () {
		this.isAdvSearched = true;
		if(this.hasError != true){
			this.collectParameter(this.nodes.searchForm);
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
			'list' : [	{ 'id' : 0, 'name' : ALL,		'url' : "/" + url + gid },
						{ 'id' : 1, 'name' : ORIGINAL,	'url' : "/" + url  + gid + filter + "is_ori=1" },
						{ 'id' : 2, 'name' : PICTURE,	'url' : "/" + url  + gid + filter + "is_pic=1" },
						{ 'id' : 3, 'name' : VIDEO,		'url' : "/" + url  + gid + filter + "is_video=1" },
						{ 'id' : 4, 'name' : MUSIC,		'url' : "/" + url  + gid + filter + "is_music=1" }
			],
			'count' : 4,
			'current' : type * 1
		};
		var viewerHTML = template(data);
		this.nodes.feedType.innerHTML = viewerHTML;
	};
	
	// 如果点开高级搜索前，用户选择了一个筛选类型：原创、图片、视频、音乐，展开高级搜索时，只选中它和转发、纯文字
	filter.prototype.setAdvForm = function(type){
		var formItem = $.sizzle('input[type=checkbox]', this.nodes.searchForm);
		var is_ori = formItem[0], is_pic = formItem[3],
			is_video = formItem[4], is_music = formItem[5], is_forward = formItem[1], is_txt = formItem[2];
		switch(type * 1){
			case 1:
				is_forward.checked = false;
				break;
			case 2:
				is_txt.checked = false;
				is_video.checked = false;
				is_music.checked = false;
				break;
			case 3:
				is_txt.checked = false;
				is_pic.checked = false;
				is_music.checked = false;
				break;
			case 4:
				is_txt.checked = false;
				is_pic.checked = false;
				is_video.checked = false;
				break;
		}
	};
	
	//隐藏高级搜索框
	filter.prototype.hideAdvSearch = function(){
		var el = this.nodes.search;
		var children = el.children || el.childNodes;
		var simple = children[0];	// 简单过滤
		var advance = children[1];	// 高级过滤
		simple.style.display = "";
		advance.style.display = "none";
	};
	
	// 搜集需要转发给 Feed 列表的搜索参数
	filter.prototype.collectParameter = function (form) {
		var formValue;
		var postParam = {};
		var config = $.core.json.clone(this.config);
		delete config.currentType;
		delete config.isAllType;
		if(form != null){
			formValue = $.core.util.htmlToJson(form);
			for(var key in formValue){
				if(key != "key_word"){
					config[key] = formValue[key];
				} else {
					var find = $.hasby(this.defaultSearchTip, function(v,i){return (v === formValue[key]);});
					if(find.length == 0){
						config[key] = formValue[key];
					}
				} 
			}
			config.is_search = "1";
		}
		// 默认每次取 15 条，只有homeFeed才传
		if (this.defaultCount != null) {
			config.count = this.defaultCount;
		}
		for(key in config){
			var p = config[key];
			if(!(p == null || p * 1 === 0 ||  p === "")){
				postParam[key] = config[key]; 
			}
		}
		if(postParam['start_time'] == '选择日期') {
			delete postParam['start_time'];
		}
		if(postParam['end_time'] == '选择日期') {
			delete postParam['end_time'];
		}
		var isGroupAll = (this.isGroupAll != null) ? this.isGroupAll() : false;
		var isFilterAll = this.isFilterAll();
		$.core.evt.custEvent.fire(this.custKeySearch, "search", ["search", postParam, {
			'isGroupAll' : isGroupAll,
			'isFilterAll' : isFilterAll
		}]);
	};
	
	// 获取是否在全部过滤器下
	filter.prototype.isFilterAll = function () {
		var isAll = true;
		if(this.config != null && this.config.currentType != null){
			isAll = (this.config.currentType * 1 == 0) ? true : false;
		}
		return isAll;
	};
	// 筛选条件切换
	filter.prototype.searchFilterChange = function (el) {
		var gid = this.config.gid;
		var key_word = this.config.key_word;
		this.reset();
		this.config.gid = gid;
		this.config.key_word = key_word;
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
			case "5" :
				this.config.is_tag = 1;
				break;
		}
		this.config.currentType = el;
		this.setSearchTypeUI();
		this.collectParameter();
		
	};
	// 简单关键字搜索
	filter.prototype.searchKeyword = function () {
		// 如果我的首页搜索关键字为空，就不提交请求
		if(this.nodes.keyword[0] && $.trim(this.nodes.keyword[0].value) == ""){
			return;
		}
		if(this.hasError != true){
			this.isAdvSearched = true;
			this.collectParameter(this.nodes.singleForm);
		}
	};

	// 日期校验
	function validateDate (start, end) {
		if(start == null || end == null){ return true; }
		start = new Date(start.replace(/-/g, "/")).getTime();
		end = new Date(end.replace(/-/g, "/")).getTime();
		return start <= end;
	}

	// 显示日历
	filter.prototype.showCalendar = function (el, type) {
		var date = $.core.str.trim(el.value);
		var cal;
		var that = this;
		function set (date) {
			var isValidate;
			// ##### 校验日期的正确性
			if(type == "1"){
				isValidate = validateDate(date, that.config.end_time);
			} else {
				isValidate = validateDate(that.config.start_time, date); 
			}
			if(type == "1"){
				isValidate && (that.config.start_time = date);
			} else {
				isValidate && (that.config.end_time = date);
			}
			that.nodes.advSearchErr.innerHTML = (!isValidate) ? DATE_ERROR : "";
			that.hasError = !isValidate;
		}
		if(type == "1"){
			cal = new $.common.feed.groupAndSearch.include.calendar(0, {
				'source' : el,
				'callback' : set
			});
		} else {
			cal = new $.common.feed.groupAndSearch.include.calendar(date, {
				'source' : el,
				'callback' : set
			});
		}
	};
	
	/**
	 * ================================================================
	 * = Tag                                                          =
	 * ================================================================
	 */
	/**
	 * 对比多个数组的不同
	 */
	var array_diff = function(){
		var o = Array.prototype.slice.apply(arguments);
		if(!$.core.arr.isArray(o[0])){
			throw 'The diff function needs an array as first parameter';
		}
		var r = $.core.arr.unique(o.shift());
		if(r.length == 0){
			return [];
		}
		o = o.length == 1 ? o[0] : $.core.arr.unique(Array.prototype.concat.apply([], o));
		return $.core.arr.clear($.core.arr.foreach(r, function(a){
			return $.core.arr.inArray(a, o) ? null : a;
		}));
	}
	//按名称获取标签节点
	filter.prototype.tagGetUnit = function(name){
		var tagNode = $.sizzle('[tag_name="' + name + '"]', this.nodes.feed_tag_list);
		return tagNode && tagNode[0] ? tagNode[0] : null;
	};
	//获取第一个标签
	filter.prototype.tagGetFirst = function(){
		var target = $.sizzle('[node-type="feed_tag"]', this.nodes.feed_tag_list);
		return target && target[0] ? target[0] : null;
	};
	//点击一个标签
	filter.prototype.tagActive = function(ret){
		var tagName = ret.data['tag_name'];
		this.tagClearCurrent();
		this.reset();
		if(tagName){
			this.config.tag_name = tagName;
			$.addClassName(ret.el, 'W_texta');
		}
		this.config.is_tag = 1;
		this.collectParameter();
	};
	//标签清除焦点
	filter.prototype.tagClearCurrent = function(){
		var tags = $.sizzle('i.W_texta', this.nodes.feed_tag_list);
		if(tags.length > 0){
			$.core.arr.foreach(tags, function(o){
				$.removeClassName(o, 'W_texta');
			});
		}
	};
	//标签区域显示
	filter.prototype.tagAutoToggle = function(){
		if(this.config["is_tag"] == 1){
			this.tagShow();
		} else {
			this.tagHide();
		}
	};
	//新增标签
	filter.prototype.tagAppend = function(name){
		$.core.dom.insertHTML(
			$.sizzle('ul', this.nodes.feed_tag_list)[0],
			$.core.util.templet(TEMP.TAG.ITEM, {'TAG_NAME':name, 'COUNT':1})
		);
	}
	//标签计数增加
	filter.prototype.tagUpdateCount = function(name, value){
		if(!name) return false;
		
		var ntp = this.tagGetUnit(name);
		var numEl, count;
		if(ntp){
			numEl = $.builder(ntp).list.count[0];
			count = value + parseInt(numEl.innerHTML);
			count < 0 && (count = 0);
			numEl.innerHTML = '' + count;
		} else {
			this.tagAppend(name);
		}
	}
	//标签更新
	filter.prototype.tagUpdateChange = function(ret){
		var res = ret["res"] ? ret.res.split(' ') : [],
			now = ret["now"] ? ret.now.split(' ') : [];
		//diff
		var remove = array_diff(res, now);
		var add = array_diff(now, res);
		
		if(remove.length > 0){
			for(var i in remove){
				this.tagUpdateCount(remove[i], -1);
			}
		}
		if(add.length > 0){
			for(var i in add){
				this.tagUpdateCount(add[i], 1);
			}
		}
	};
	filter.prototype.tagMoreToggle = function(spec){
		var moreBtns = $.sizzle('[action-type="more_tags_toggle"]', this.nodes.feed_tag_list);
		var isShown = this.nodes.tag_show.getAttribute('show');
		
		if(isShown == "1"){ //显示状态
			$.setStyle(this.nodes.tag_show, 'height', '');
			this.nodes.tag_show.setAttribute('show', '0');
		} else { //隐藏状态
			$.setStyle(this.nodes.tag_show, 'height', 'auto');
			this.nodes.tag_show.setAttribute('show', '1');
		}
		
		$.core.arr.foreach(moreBtns, function(o){
			$.setStyle(o, 'display', (o === spec.el ? 'none' : ''));
		});
	};
	//标签区域隐藏
	filter.prototype.tagHide = function(){
		this.tagClearCurrent();
		$.setStyle(this.nodes.feed_tag_list, 'display', 'none');
	};
	//标签区域显示
	filter.prototype.tagShow = function(){
		var first = this.tagGetFirst();
		//操蛋的需求，临时取第一个标签。欧顶！
		if(first) {
			$.addClassName($.sizzle('[action-type="feed_tag_active"]', first)[0], 'W_texta');
			$.setStyle(this.nodes.feed_tag_list, 'display', '');
		} else {
			this.tagHide();
		}
	};
	var lastEditTag;
	filter.prototype.tagEditFormShow = function(name){
		this.tagEditFormHide(lastEditTag);
		var target = this.tagGetUnit(name);
		var a = $.kit.dom.firstChild(target);
		
		$.setStyle(a, 'display', 'none');
		var editForm = $.core.dom.next(a);
		if(!editForm){
			$.core.dom.insertHTML(target, $.core.util.templet(TEMP.TAG.EDIT, {'TAG_NAME':name}), 'beforeend');
		} else {
			$.sizzle('input[node-type="tag_edit_form"]', editForm)[0].value = name;
			$.setStyle(editForm, 'display', '');
		}
		//this.tagEditFormFocus();
		
		lastEditTag = name;
	};
	filter.prototype.tagEditFormHide = function(name){
		var target = this.tagGetUnit(name);
		if(target){
			var a = $.kit.dom.firstChild(target);
			$.setStyle(a, 'display', '');
			$.setStyle($.core.dom.next(a), 'display', 'none');
		}
	};
	//设置焦点，不能设置焦点！！！！！
	filter.prototype.tagEditFormFocus = function(){
		var form = $.sizzle('[node-type="tag_edit_form"]', this.nodes.tag_show)[0];
		form && $.core.dom.selectText(form, {'start':0, 'len':form.value.length});
	};
	//标签修改表单
	filter.prototype.tagEditForm = function(spec){
		this.tagEditFormShow(spec.data.old_tag);
	};
	//标签修改取消
	filter.prototype.tagEditFormCancel = function(spec){
		this.tagEditFormHide(spec.data.old_tag);
	};
	//编辑标签
	filter.prototype.tagEditSubmit = function(spec){
		var newVal = $.sizzle('input', spec.el.parentNode)[0].value;
		var oldVal = spec.data.old_tag;
		var oldUnit = this.tagGetUnit(oldVal);
		var count = $.sizzle('[node-type="count"]', oldUnit)[0].innerHTML;
		var isFocus = $.core.dom.hasClassName($.sizzle('[action-type="feed_tag_active"]', oldUnit)[0], 'W_texta');
		var _that = this;
		if(newVal == oldVal){
			this.tagEditFormCancel(spec);
			return;
		}
			
		var parm = {
			'old_tag' : oldVal,
			'new_tag' : newVal
		};
		$.common.trans.feed.getTrans("feedTagEdit", {
			onSuccess: function(ret) {
				//_that.tagEditFormHide(oldVal);
				var node = $.kit.dom.parseDOM($.builder($.core.util.templet(TEMP.TAG.ITEM, {'TAG_NAME':ret.data.tag, 'COUNT':count})).list);
				isFocus && $.core.dom.addClassName($.sizzle('[action-type="feed_tag_active"]', node.feed_tag)[0], 'W_texta');
				$.core.dom.replaceNode(node.feed_tag, oldUnit);
			},
			onFail: function(ret){
				$.ui.alert(ret.msg || lang('#L{更新失败}'));
			},
			onError: function(ret){
				$.ui.alert(ret.msg || lang('#L{更新失败}'));
			}
		}).request(parm);
	};
	//删除标签
	filter.prototype.tagDel = function(spec){
		var _that = this;
		var sendRequest = function() {
			var el = spec.el;
			var _this = _that;
			$.common.trans.feed.getTrans("feedTagDel", {
				onSuccess: function(data) {
					var target = $.kit.dom.parentElementBy(el, _this.nodes.feed_tag_list, function (o) {
						if (o.getAttribute('node-type') == 'feed_tag') {
							return true;
						}
					});
					target.parentNode.removeChild(target);
					!_this.tagGetFirst() && _this.tagHide();
				},
				onFail: function(ret , data){
					$.ui.alert(ret.msg || lang('#L{删除失败}'));
				},
				onError: function(ret , data){
					$.ui.alert(ret.msg || lang('#L{删除失败}'));
				}
			}).request($.module.getDiss(spec.data));			
		}
		$.ui.confirm(lang('#L{你确定要删除这个微博标签吗？}') , {
			textSmall : lang('#L{删除微博标签不会将对应的微博一起删除}'),
			OK : sendRequest
		});
	};
	
	// 数据状态重置
	filter.prototype.reset = function () {};
	// 销毁对象，解除事件绑定，变量置为null
	filter.prototype.destroy = function () {
	};
	
	// 不改变任何搜索条件，刷新顶部的分组和搜索区
	filter.prototype.refresh = function () {
	};
	return filter;

});
