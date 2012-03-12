/**
 * @fileoverview
 * Feed 顶部分组和搜索区域的事件代理
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */

$Import("common.feed.inter.feedInter");
$Import("common.trans.feed");
STK.register("common.feed.inter.homeFeedInter", function($) {

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
	inter.prototype.trans = $.common.trans.feed;
	inter.prototype.transKey = "homeSearch";

	return function(opts){
		return new inter(opts);
	};

});