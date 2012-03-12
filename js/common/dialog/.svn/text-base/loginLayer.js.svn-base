/**
 * create by lianyi
 * lianyi@staff.sina.com.cn
 * 2011年7月8日 添加未登录登录弹出层 lianyi
 * 调用方法:
 * $.common.dialog.loginLayer('zh-cn');   显示简体中文版本的登录弹层
 * $.common.dialog.loginLayer('zh-tw');   显示繁体中文版本的登录弹层
 */
STK.register("common.dialog.loginLayer", function($){
	var JSHOST = 'http://tjs.sjs.sinajs.cn/t4/' , isLoading;
	var destJsUrl = JSHOST + 'home/js/public/topLogin.js';
	//---常量定义区----------------------------------
	return function(params){
		params = $.core.obj.parseParam({
			'lang' : 'zh-cn',
			'loginSuccessUrl' : window.location.href
		},params);
		params['loginSuccessUrl']="http://weibo.com/login.php?url="+params['loginSuccessUrl'];
		//如果加载过js 直接显示
		if(window.WBtopPublicLogin) {
			WBtopPublicLogin.showLoginLayer(params);
		} else {
			if(isLoading) {
				return;
			} else {
				isLoading = true;
				//如果没有加载过js 使用scriptLoader加载 完成后显示浮层
				$.core.io.scriptLoader({
					url : destJsUrl,
					onComplete : function() {
						isLoading = false;
						window.WBtopPublicLogin.showLoginLayer(params);
					},
					timeout : 10000,
					onTimeout : function() {
						isLoading = false;
					}
				});
			}
		}
	};
});
