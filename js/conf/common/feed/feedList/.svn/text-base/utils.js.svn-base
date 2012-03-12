/**
 * 工具包
 */
$Import('kit.dom.parentAttr');
$Import('common.trans.feed');
$Import('common.trans.favorite');

STK.register("common.feed.feedList.utils", function($) {
	var _parentAttr = $.kit.dom.parentAttr;
	var $preventDefault = $.core.evt.preventDefault;
	var that = {
		getMid: function(el, node) {
			return el.mid || (el.mid = _parentAttr(el, "mid", node));
		},
		getFeedNode: function(el, node) {
			var _mid = that.getMid(el, node);
			var feeds = that.getFeeds(node, 'mid="'+_mid+'"');
			for(var i = 1; i < feeds.length; i++) {
				if($.contains(feeds[i], el)) {
					return feeds[i];
				}
			}
			return feeds[0];
		},
		getFeeds: function(node, key) {
			return $.sizzle('>dl['+key+']', node);
//			var feeds = $.sizzle('>dl['+key+']', node);
//			return (feeds.length > 0) ? feeds : $.sizzle('>div['+key+']', node);
		},
		preventDefault: function(e) {
			$preventDefault(e);
			return false;
		},
		getFeedTrans: $.common.trans.feed.getTrans,
		getFavoriteTrans: $.common.trans.favorite.getTrans
	};
	return that;
});