/**
 * @fileoverview
 * Feed 顶部搜索的接口请求代理基础类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 * L.Ming @2011.06.08 增加attention、hotmblog、section几个参数
 */
$Import('kit.extra.merge');
STK.register("common.feed.inter.feedInter", function($) {

	function inter (opts) {
		this.custKeySuccess = $.core.evt.custEvent.define(this, "success");
		this.custKeyFailure = $.core.evt.custEvent.define(this, "failure");
		this.init(opts.pageQuery);
	}
	inter.prototype = {
		// 当前状态
		'param' : null,
		// 搜索过滤参数默认值
		'defaultConfig' : {
			'gid' :			0,		// 分组ID
			'is_ori' :		0,		// 是原创
			'is_forward' :	0,		// 是转发
			'is_pic' :		0,		// 是图片
			'is_video' :	0,		// 是视频
			'is_music' :	0,		// 是音乐
			'is_tag'   :	0,		// 是Tag
			'is_text' :		0,		// 是纯文本
			'key_word' :	null,	// 关键字
			'start_time' :	null,	// 起始日期
			'end_time' :	null,	// 结束日期
			'page' :		0,		// 要跳转的页码
			'count' :		0,		// 每次取多少条
			'since_id' :	0,		// 取某条 Feed ID 之后发表的（时间晚于FeedID）
			'max_id' :		0,		// 取 Feed 截止到某 ID 发表的那一刻结束(时间早于FeedID)
			'pre_page' :	0,		// 上一页页码
			'end_id' :		0,		// 第一页第一条ID
			'is_search':	0,
			'attention':	0,
			'whisper':		0,
			'hotmblog':		0,
			'section':		0,
			'tag_name' :    null,
			'rank'   :      0,
			//是心情
			'ismood' : 0
		},
		'pageParam' : [
			'page',
			'count',
			'since_id',
			'max_id',
			'pre_page',
			'end_id',
			'pagebar',
			'uid'
		],
		'key' : [],
		// 初始化
		'init' : function(query){
			query = $.core.json.clone(query);
			// 遍历参数，去掉无用信息
			for(var key in query){
				if(!(key in this.defaultConfig)){
					delete query[key];
				}
			}
			this.initQuery = query;
		},
		// 自定义事件监听
		/*
		 * 接收来自分组和搜索的自定义事件：切换分组、条件、搜索等
		 * @param {String} type		请求类型 search
		 * @param {Object} param
		 */
		'evtSearch' : function () {
			var args = arguments;
			var type = args[1];
			var data = args[2];
//			this.initQuery = null;
			this.type = type;
			this.param = {};
			for(var k in data){
				this.param[k] = data[k];
			}
			// 追加参数 _k 来保证最后一次操作是有效的
			this.key = [];
			var key = $.core.util.getUniqueKey();
			this.param._k = key;
			this.key.push(key);
			this.collectParameter(type);
		},
		/*
		 * 接收来自Feed列表的自定义事件：黄条、lazyload、翻页
		 * @param {String} type		请求类型 newFeed/page/lazyload/search
		 * @param {Object} data
		 */
		'evtRequest' : function () {
			var args = arguments;
			var type = args[1];
			var data = args[2] || {};
			this.type = type;
			if(this.param == null){
				this.param = (this.initQuery != null) ? $.core.json.clone(this.initQuery) : {};
			}
			// 遍历分页处所来的 7 个参数（见this.pageParam）：如果这次传递了，就保留；否则就清除掉上次遗留的
			var pageParam = this.pageParam;
			for(var i = 0, len = pageParam.length; i < len; i ++){
				var key = pageParam[i];
				if(data[key] != null){
					this.param[key] = data[key];
				} else {
					delete this.param[key];
				}
			}
			// 追加参数 _k 来保证最后一次操作是有效的，不过 newFeed 和 lazyload 的情况可以超过一个key
			key = $.core.util.getUniqueKey();
			if(this.type == "newFeed" || this.type == "lazyload"){
				this.key.push(key);
			} else {
				this.key = [];
			}
			this.param._k = key;
			this.key.push(key);
			this.collectParameter(type);
		},
		// 获取搜索接口的 trans 对象
		'getTrans' : function(){
			if(this.inter == null){
				var trans = this.trans;
				var that = this;
				trans = trans.getTrans(this.transKey, {
					'onSuccess' : function(ret, params){
						if(that.key.join(",").indexOf(ret.key) != -1){ // 如果key存在才响应成功，否则就抛弃
							$.core.evt.custEvent.fire(that.custKeySuccess, "success", [ret.data, that.type]);
						}
					},
					'onError' : function(ret, params){
						$.core.evt.custEvent.fire(that.custKeyFailure, "failure", [ret.data, that.type]);
					},
					'onFail' : function(ret, params){
						$.core.evt.custEvent.fire(that.custKeyFailure, "failure", ["", that.type]);
					},
					'noQueue' : true
				});
				this.inter = trans;
			}
			return this.inter;
		},
		// 搜集需要提供给搜索接口的参数
		'collectParameter' : function (type) {
			if(this.type != "lazyload" && this.type != "newFeed" && this.isBigPipe){
				this.setHash(this.param);
			}
			var trans = this.getTrans();
			var keyWord = encodeURIComponent(this.param.key_word);
			var params = $.kit.extra.merge(this.param , {
				key_word : keyWord				
			});
			trans.request(params);
		},
		// 设置 hash
		'setHash' : function (data){
			data = $.core.json.clone(data);
			var ext = ["count", "pagebar"];
			for(var i = 0, len = ext.length; i < len; i ++){
				if(ext[i] in data){
					delete data[ext[i]];
				}
			}
			var query = $.core.json.clone(this.defaultConfig);
			for(var key in query){
				if(data[key] != null){
					query[key] = data[key];
				} else {
					query[key] = null;
				}
			}
			STK.historyM.setQuery(query);
		}
	};
	return inter;
});
