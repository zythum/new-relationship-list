/**
 * @fileoverview
 * Feed 顶部分组和搜索区域的事件代理
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */

$Import("common.feed.inter.feedInter");
$Import("common.trans.feed");
STK.register("common.feed.inter.atMeFeedInter", function($) {

	var inter = function (opts) {
		this.custKeySuccess = $.core.evt.custEvent.define(this, "success");
		this.custKeyFailure = $.core.evt.custEvent.define(this, "failure");
		this.init(opts.pageQuery);
		this.isBigPipe = (opts != null && opts.isBigPipe);
	};
	var feedInter = $.common.feed.inter.feedInter.prototype;
	for(var key in feedInter){
		inter.prototype[key] = feedInter[key];
	}
	inter.prototype.pageParam =  ['page', 'count', 'since_id', 'max_id', 'pre_page', 'end_id', 'nofilter', 'pagebar', 'is_adv','filter_by_author', 'filter_by_type']
	inter.prototype.trans = $.common.trans.feed;
	inter.prototype.transKey = "atMeSearch";
	/*
		 * 接收来自Feed列表的自定义事件：黄条、lazyload、翻页
		 * @param {String} type		请求类型 newFeed/page/lazyload/search
		 * @param {Object} data
		 */
		inter.prototype.evtRequest = function () {
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
			if(data.key_word)
			{
				   this.param["key_word"] = data.key_word;
			}
			else
			{
				delete this.param["key_word"];
			}
			// 追加参数 _k 来保证最后一次操作是有效的，不过 newFeed 和 lazyload 的情况可以超过一个key
			key = $.core.util.getUniqueKey();
			if(this.type == "newFeed" || this.type == "lazyload"){// || this.type =="more"){
				this.key.push(key);
			} else {
				this.key = [];
			}
			this.param._k = key;
			this.key.push(key);
			this.collectParameter(type);
		};
	return function(opts){
		return new inter(opts);
	};

});