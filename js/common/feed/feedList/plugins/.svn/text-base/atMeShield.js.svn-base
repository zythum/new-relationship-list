/**
 * @屏蔽
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.tipConfirm');
$Import('common.trans.feed');
$Import('common.feed.feedList.utils');
$Import('kit.extra.language');
$Import('common.dialog.shieldDialog');
$Import('common.comment.delCommentDom');
STK.register("common.feed.feedList.plugins.atMeShield", function($) {
	
	var utils = $.common.feed.feedList.utils;
	
	return function(base) {
		if (!base) {
			$.log("atMeShield : need object of the baseFeedList Class");
			return;
		}
		
		var that	= {},
			node	= base.getNode(),
			dEvent	= base.getDEvent();
		
		var deleteFeed = function(feedNode){
			$.common.comment.delCommentDom({
				'el': feedNode,
				'endCb': function(){
					feedNode = null;
					base.getFeedCount() || window.location.reload();
				}
			});
		};
		
		var getContent = function(node){
			var conEl	= $.sizzle('dt[node-type="feed_list_forwardContent"]', node)[0] ||
							$.sizzle('p[node-type="feed_list_content"]', node)[0];
				span	= $.sizzle('span.W_linkb', conEl)[0];
			span && $.core.dom.removeNode(span);
			return conEl.innerHTML;
		};
		
		var atMeShield = function(spec){
			var el		= spec.el,
				data	= spec.data,
				mid		= utils.getMid(el, node)
				fNode	= utils.getFeedNode(el, node);
			$.common.dialog.shieldDialog({
				'mid': mid,
				'content': getContent(fNode),
				'OK': function(){
					deleteFeed(fNode);
				}
			});
		};
		
		base.getDEvent().add("feed_list_atShield", "click", atMeShield);
		
		
		that.destroy = function() {
		};
		
		return that;
	};
});