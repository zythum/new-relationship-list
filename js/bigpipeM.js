/**
 * Bigpipe页面管理器
 * 实现对页面链接的过滤(可对链接的嵌套类型进行配置)、对BigPipe页面的隐藏加载；
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
$Import("historyM");

STK.register("bigpipeM", function($) {
	
	if(typeof $CONFIG == "undefined" || $CONFIG["bigpipe"] != "true") {
		return;
	}
	var mac = $.core.util.browser.OS == 'macintosh',
		LINKFILTERTAGREG = /img|span/,
		nowFilterTarget,
		//加载时使用的框架
		pipeiframe,
		bpType;
	
	if (typeof $CONFIG != "undefined") {
        bpType = $CONFIG.bpType;
    }
		
	//加载完成时的回调方法
	var ajaxpipeLoaded = function() {
		ajaxpipeLoaded.timer = setTimeout(function() {
			$.core.util.hideContainer.removeChild(pipeiframe);
			document.body.style.cursor = "";
			if(nowFilterTarget) nowFilterTarget.style.cursor = "";
			ajaxpipeLoaded.timer = pipeiframe = null;
		});
	};
	
	/**
	 * ajaxpipe加载 
	 */
	var ajaxpipeLoader = function(url) {
		url = url.replace(/#.*$/, "");
		if(url.indexOf("?") != -1) {
			url = url + "&ajaxpagelet=1";
		} else {
			url = url + "?ajaxpagelet=1";
		}
		url += "&_t=" + new Date().getTime();
		if (pipeiframe) {
			ajaxpipeLoaded.timer && clearTimeout(ajaxpipeLoaded.timer);
			$.removeEvent(pipeiframe, "load", ajaxpipeLoaded);
			$.core.util.hideContainer.removeChild(pipeiframe);
		}
		pipeiframe = $.C("iframe");
		pipeiframe.src = url;
		pipeiframe.style.display = "none";
		$.core.util.hideContainer.appendChild(pipeiframe);
		document.body.style.cursor = "progress";
		nowFilterTarget && (nowFilterTarget.style.cursor = "progress");
		$.addEvent(pipeiframe, "load", ajaxpipeLoaded);
	};
	
	/**
	 * link filter
	 */
	var linkFilter = function() {
		$.core.evt.addEvent(document, "click", function(event) {
			event = $.fixEvent(event);
			//只对有filter + click鼠标左键/按回车 +　并且没有按ctrl的情况　进行无刷新
			var target = event.target,
				targetTagName = target.tagName.toLowerCase(),
				flag = (targetTagName == "a");
			if(!flag && LINKFILTERTAGREG.test(targetTagName)) {
				for(var i = 0; i < 2; i++) {
					if(!(target = target.parentNode)) {
						return;
					}
					if((targetTagName = target.tagName.toLowerCase()) == "a") {
						flag = true;
						break;
					}
				}
			}
			if(flag) {
				if(target.getAttribute("bpfilter") && target.getAttribute("bpfilter") == bpType && !event.ctrlKey && !event.shiftKey && event.button == 0 && !(mac && event.metaKey)) {
					$.log('bigpipeM: 点击行为拦截成功，使用Bigpipe模式加载');
					var href = target.href;
					var windowURL = $.historyM.getURL();
					//href = /^http:\/\//.test(href) ? href : "http://" + windowURL.host + href;
					var hrefURL = $.historyM.getURL(href);
					//alert(href + ";"+hrefURL.host + ";" + windowURL.host)
					if(hrefURL.host != windowURL.host) {
						return;
					}
					nowFilterTarget && (nowFilterTarget.style.cursor = "");
					nowFilterTarget = target;
					//没有考虑锚点的情况
					$.historyM.pushState(hrefURL.path + hrefURL.query + hrefURL.hash);
				} else if(!/^#/.test(target.href)) {
					return;
				}
				$.preventDefault(event);
			}
		});
	};

	$.historyM.onpopstate(function(URL) {
		$.pageletM.clear();
		$.scrollTo(document.body, {step:10});
		ajaxpipeLoader(URL);
	});
	
	linkFilter();//启动 link filter
	
	return {
		ajaxpipeLoader: ajaxpipeLoader
	};
	
});
