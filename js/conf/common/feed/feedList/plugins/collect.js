/**
 * 采集插件
 * @author Runshi Wang|runshi@staff.sina.com.cn
 * @param {Object} base baseFeedList实例
 */
$Import('kit.dom.parentAttr');
$Import('common.feed.feedList.utils');
$Import('kit.extra.language');
$Import('common.dialog.collect');
STK.register("common.feed.feedList.plugins.collect", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var $L = $.kit.extra.language;
	var $T = $.core.util.templet;
	var $ET = $.core.util.easyTemplate;
	
	return function(base, opts) {
		
		if (!base) {
			$.log("favorite : need object of the baseFeedList Class");
			return;
		}
		
		var node = base.getNode();
		var that = {};
		
		base.getDEvent().add("feed_list_collect", "click", function(spec) {
			$.common.dialog.collect({
				mid:spec.data.mid,
				collected: spec.el.getAttribute('collected') == '1',
				showRecord: true,
				success: function(data) {
					spec.el.setAttribute('collected', '1');
					spec.el.setAttribute('title', data.msg);
				}
			});
			return utils.preventDefault(spec.evt);
		});
		
		that.destroy = function() {

		};
		
		return that;
	};
});