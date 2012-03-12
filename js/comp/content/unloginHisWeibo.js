$Import('ui.alert');
$Import('comp.content.scrollToTop');
$Import('common.dialog.loginLayer');
$Import('common.content.weiboDetail.utils');
$Import('common.feed.feedList.feedTemps');
$Import('module.rotateImage');
STK.register('comp.content.unloginHisWeibo' , function($) {
	return function() {
		//scrollToTop是回到顶部
		var that = {} , scrollToTop , delegate , showLoginLayer = $.common.dialog.loginLayer , langType = window.$CONFIG && window.$CONFIG['lang'] || 'zh-cn', changeLangDom , util = $.common.content.weiboDetail.utils();
		//var shorter = $.common.feed.feedList , unloginRotateImage;
		var initPlugin = function() {
			//加载回到顶部
			var scrollEl = $.E("base_scrollToTop");
			scrollToTop = $.comp.content.scrollToTop(scrollEl);
		};
		var bindDOMFuns = {
			login : function(opts) {
				showLoginLayer({
					lang: langType					
				});
				return $.preventDefault(opts.evt);
			},
			/**
			 * 旋转图片函数(向左)
			 * @param {Object} obj 事件对象
			 */
			rotateImageLeft : function(obj){
				util.rotateImg(obj, "left");
				return util.preventDefault(obj.evt);
			},
			/**
			 * 旋转图片函数(向右)
			 * @param {Object} obj 事件对象
			 */
			rotateImageRight : function(obj){
				util.rotateImg(obj, "right");
				return util.preventDefault(obj.evt);
			}
		};
		var bindDOM = function() {
			delegate = $.delegatedEvent(document.body);
			delegate.add('login' , 'click' , bindDOMFuns.login);
			
			changeLangDom = $.E("pl_content_changeLanguage");
			if(changeLangDom){
				$.addEvent(changeLangDom, "change", bindDOMFuns.login);
			}
			/*图片操作需要的js*/
			//旋转图片按钮事件(向左)
			delegate.add('feed_list_media_toLeft','click',bindDOMFuns.rotateImageLeft);
			//旋转图片按钮事件(向右)
			delegate.add('feed_list_media_toRight','click',bindDOMFuns.rotateImageRight);

		};
		var init = function() {
			initPlugin();
			bindDOM();			
		};
		init();
		var destroy = function() {
			//销毁回到顶部
			scrollToTop && scrollToTop.destroy && scrollToTop.destroy();
			delegate.remove('login' , 'click' , bindDOMFuns.login);
			$.removeEvent(changeLangDom, "change", bindDOMFuns.login);
			/*销毁图片操作*/
			/*图片操作需要的js*/
			//旋转图片按钮事件(向左)
			delegate.remove('feed_list_media_toLeft','click',bindDOMFuns.rotateImageLeft);
			//旋转图片按钮事件(向右)
			delegate.remove('feed_list_media_toRight','click',bindDOMFuns.rotateImageRight);
		};
		that.destroy = destroy;
		return that;				
	};
});
