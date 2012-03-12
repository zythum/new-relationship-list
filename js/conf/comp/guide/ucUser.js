/**
 * UC用户个性域名模块
 * created by  lianyi@staff.sina.com.cn
 * 采用异步加载方式加载弹层js,避免每次用户访问首页加载无用代码
 * see MINIBLOGREQ-6193
 */
STK.register('comp.guide.ucUser', function($) {
	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	return function(node) {
		var that = {};
		var baseUrl = 'http://js.t.sinajs.cn/t4/home/js/';
		$.core.io.scriptLoader({
			url : baseUrl + '/guide/ucUser.js?version=' + new Date().getTime(),
			onComplete : function() {
				var obj = STK.comp.guide.ucUserImpl();
				that.destroy = obj.destroy;
			}
		});
		return that;
	};
});
