/**
 * 文本投票的查看
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
 
STK.register("common.vote.textVoteView", function($) {

	return function(node,opts) {
		var that = {};
		
		if(!$.isNode(node)) {
			$.log("textVoteView : parameter node is not a document node!");
		};
		
		var nodeList = $.builder(node).list;
		var vote_smallInfo = nodeList["vote_smallInfo"][0];
		var vote_bigInfo = nodeList["vote_bigInfo"][0];
		var dEvent = $.delegatedEvent(node);
		dEvent.add("vote_toBigInfo", "click", function() {
			vote_smallInfo.style.display = "none";
			vote_bigInfo.style.display = "";
		});
		
		dEvent.add("vote_toSmallInfo", "click", function() {
			vote_bigInfo.style.display = "none";
			vote_smallInfo.style.display = "";
		});
		
		that.destroy = function() {
			dEvent.destroy();
			node = nodeList = vote_smallInfo = vote_bigInfo = dEvent = undefined;
		};
		
		return that;
	};
	
});
