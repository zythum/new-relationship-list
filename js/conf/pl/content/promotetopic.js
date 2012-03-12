/**
 * @author Runshi Wang|runshi@staff.sina.com.cn
 * 
 * 我的首页微号外
 */
$Import('comp.content.promotetopic');

STK.pageletM.register('pl.content.promotetopic', function($) {
	var that = $.comp.content.promotetopic($.E("pl_content_promotetopic"), {
		ad : {
			ioname : "weibo_AD_SS",
			extra  : {
				psId      : "PDPS000000028368",
				wbVersion : !$CONFIG['isnarrow'] ? "v4w" : "v4",
				rnd       : "0",
				jsonp     : "JSONP_164GNI9952"
			},
			bind   : ["follow", "popup_win"]
		}
	});
	return that;
});
