$Import('common.feed.feedList.feedTemps');
STK.register('common.profile.profilePageDelegate' , function($) {
	return function(evtObj , opts) {
		var failLink ;
		var tpls = $.common.feed.feedList.feedTemps;
		var feedNode = opts.contentNode;
		var callback = opts.callback;
		var scrollNode = opts.scrollNode;
		var onComplete = function(data) {
			var code = data.code;
			if(code == '100000') {
				feedNode.innerHTML = data.data.html;
				callback && callback(data.data);	
			} else {
				onFail();
			}
		};
		var onFail = function() {
			feedNode.innerHTML = tpls.loadErrorRetryHTML;
		};
		var pageNClick = function(data) {
			failLink = data.el;
			if($.core.dom.hasClassName(failLink , 'current')) {
				return;				
			}
			var href = failLink.href;
			(scrollNode || feedNode).scrollIntoView();
			feedNode.innerHTML = tpls.loadingIMG;
			$.core.io.ajax({
				url : href , 
				onComplete : onComplete,
				onFail : onFail,
				onTimeout : onFail
			});
			data.evt && $.preventDefault(data.evt);			
		};
		var pageRetry = function(data) {
			var data = {
				el : failLink
			};
			pageNClick(data);
			$.preventDefault(data.evt);
		};
		evtObj.add("feed_list_page_n", "click", pageNClick);
		evtObj.add("feed_list_page_first", "click", pageNClick);
		evtObj.add("feed_list_page_pre", "click", pageNClick);
		evtObj.add("feed_list_page_next", "click", pageNClick);
		evtObj.add("feed_list_retry" , "click" , pageRetry);	
	};
});