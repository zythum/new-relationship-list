/**
 * 防抓站
 */
STK.register('comp.guide.accessdeny', function($) {
	return function(node){
		var that = {},
			lang = window.$CONFIG && window.$CONFIG.lang || 'zh-cn',
			picBase = '/aj/pincode/pin?type=rule&lang=' + lang + '&ts=',
			img = $.E('img_secode'),
			chgBtn = $.E('yzm_change');
		
		$.addEvent(chgBtn, 'click', function(e){
			img.src = picBase + $.getUniqueKey();
			return $.preventDefault();
		});
		
		return that;
	};
});