$Import('common.relation.recommendFollow');
STK.register('comp.content.profilerecommend' , function($) {
	return function(node) {
		var that = {} , recommend;
		var init = function() {
			recommend = $.common.relation.recommendFollow(node , {
				nick : window.$CONFIG && window.$CONFIG.onick || ''
			});	
		};
		var destroy = function() {
			recommend && recommend.destroy();
		};
		init();
		that.destroy = destroy;
		return that;
	};
});
