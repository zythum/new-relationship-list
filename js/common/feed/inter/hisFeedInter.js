/**
 * @fileoverview
 * Feed 顶部搜索区域的事件代理
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */

$Import("common.feed.inter.feedInter");
$Import("common.trans.feed");

STK.register("common.feed.inter.hisFeedInter", function($) {

	var inter = function (opts) {
		this.custKeySuccess = $.core.evt.custEvent.define(this, "success");
		this.custKeyFailure = $.core.evt.custEvent.define(this, "failure");
		this.init(opts.pageQuery);

		if($CONFIG.uid != null){
			this.uid = $CONFIG.oid || "";
		} else {
			throw new Error("[common.feed.inter.hisFeedInter]: $CONFIG.uid is undefined.");
		}
//		if($CONFIG.ismood != null)
//		{
//			this.ismood = $CONFIG.ismood || 1;
//		}
		this.isBigPipe = (opts != null && opts.isBigPipe);
	};
	var feedInter = $.common.feed.inter.feedInter.prototype;
	for(var key in feedInter){
		inter.prototype[key] = feedInter[key];
	}
	inter.prototype.trans = $.common.trans.feed;
	inter.prototype.transKey = "profileSearch";
	inter.prototype.collectParameter = function (type) {
		if(this.type != "lazyload" && this.type != "newFeed" && this.isBigPipe){
			this.setHash(this.param);
		}
		if(this.uid !== ""){
			this.param.uid = this.uid;
		} else {
			$.log("[common.feed.inter.hisFeedInter]: $CONFIG.uid is undefined.");
		}
		if(this.mood && this.mood !== "")
		{
			this.param.mood = this.mood;
		}
		var trans = this.getTrans();
		trans.request(this.param);
	};


	return function(opts){
		return new inter(opts);
	};

});