/**
 * @author Runshi Wang|runshi@staff.sina.com.cn
 * 
 * 我的首页微号外
 */
$Import('comp.ad.jsonpAD');
//$Import('ui.alert');
//$Import('ui.confirm');

STK.pageletM.register('pl.ad.backFill', function($) {
		
	var rndToggle = function(){
		var ck = $.cookie.get("ads_ck");
		if (!ck || (ck == '0')) {
			$.cookie.set('ads_ck', '1', {'expire':24});
			ck = 0;
		} else {
			$.cookie.set('ads_ck', '0', {'expire':24});
		}
		return ck;
	}
	
	var ads = {
		"ads_35"       : {io:"weibo_AD_SS", psId: "PDPS000000028367"},
		"ads_36"       : {io:"weibo_AD_SS", psId: "PDPS000000028371"},
		"ads_37"       : {io:"weibo_AD_SS", psId: "PDPS000000028370"},
		"ads_47"       : {io:"weibo_AD_Activity", psId: "PDPS000000028369"},
		"ads_bottom_1" : {io:"weibo_AD_SS", psId: "PDPS000000028374"}
	}
	
	var wbVersion = !$CONFIG['isnarrow'] ? "v4w" : "v4";
	var rnd = rndToggle();
	
	for(var container in ads){
		
		var node = $.E(container);
		
		node && $.comp.ad.jsonpAD(node, {
			ioname : ads[container].io,
			extra  : {
				psId      : ads[container].psId,
				wbVersion : wbVersion,
				uid       : $CONFIG['uid'],
				rnd       : rnd,
				jsonp     : "JSONP_164GNI9952"
			},
			bind   : ["follow", "popup_win"]
		});
	}
});
