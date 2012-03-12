/**
 * @author liusong@staff.sina.com.cn
 */
$Import('kit.extra.language');
$Import('common.favorite.favorite');
$Import('common.dialog.forward');
$Import('kit.dom.firstChild');
$Import('kit.extra.language');
$Import('ui.alert');
$Import('common.magic');
$Import('common.feed.feedList.utils');

STK.register('common.plaza.parseFeed', function($){
	var utils = $.common.feed.feedList.utils;
	
	var cache = {}, mid;
	
	var bindEvent = function(feedNode) {
		var  favoriteObj
			,favoriting = false
			,$L = $.kit.extra.language
			,dEvent = $.delegatedEvent(feedNode);
		//收藏---------------------------------------------------------------------
		dEvent.add("feed_list_favorite", "click", function(obj) {
			if(favoriting) return;
			favoriting = true;
			var el = obj.el,
				favoriteFlag = (el.getAttribute("favorite") != "1");
				
			favoriteObj && favoriteObj.destroy();
			favoriteObj = $.common.favorite.favorite({
				mid: mid,
				node: el
			});
			
			var elHtml = $L("#L{取消收藏}"), elClass = "W_textb", elParentClass = "hover";
			
			$.custEvent.add(favoriteObj, "success", function() {
				el.innerHTML = elHtml;
				el.className = elClass;
				el.parentNode.className = "";
				el.setAttribute("favorite", favoriteFlag?"1":"0");
				favoriting = false;
			});
			$.custEvent.add(favoriteObj, "fail", function() {
				favoriting = false;
			});
			$.custEvent.add(favoriteObj, "error", function() {
				favoriting = false;
			});
			$.custEvent.add(favoriteObj, "cancel", function() {
				favoriting = false;
			});
			
			if(favoriteFlag) {
				elParentClass = "";
				favoriteObj.add();
			} else {
				elClass = "";
				elHtml = $L("#L{收藏}");
				favoriteObj.del();
			}
			return utils.preventDefault(obj.evt);
		});
//转发-----------------------------------------------------------
		var $firstChild = $.kit.dom.firstChild;
		var FTEXT = $.kit.extra.language("#L{转发}"), forwardNode;
		var forwardDialog = $.common.dialog.forward({
				styleId: 1
		});
		$.custEvent.add(forwardDialog, "forward", function(evt, data) {
			if(!forwardNode || !data.isToMiniBlog) return;
			var count = forwardNode.innerHTML.match(/\(([\d]*)\)/);
			forwardNode.innerHTML = FTEXT + "("+ (count ? parseInt(count[1]) + 1 : 1) +")";
			forwardNode = undefined;
		});
		
		$.custEvent.add(forwardDialog, "hide", function() {
			forwardNode = undefined;
		});
		var showForward = function(el, data) {
			forwardNode = el;
			var errorMsg = el.getAttribute("error-msg");
			if(errorMsg) {
				$.ui.alert(errorMsg);
				return $.preventDefault();
			}
			if(data.allowForward == '0') {
				$.ui.alert($L('#L{抱歉，此微博已经被删除，无法进行转发哦，请试试其他内容吧。 }'));
				return $.preventDefault();
			}
			
			var forwardOpts = {};
			var contentNode = $.sizzle('p[node-type="feed_list_content"]', feedNode)[0];
			
			forwardOpts.url = (data || "") && data.url;
			if(!contentNode) {
				$.log("forward : there is not 'p[node-type=\"feed_list_content\"]' in the feed_item ");
				return $.preventDefault();
			}
			var reasonEm = $.sizzle(">em", contentNode)[0];
			if(!reasonEm) {
				forwardOpts.originNick = (typeof $CONFIG != "undefined" && $CONFIG['onick']) || "";
				forwardOpts.reason = contentNode.innerHTML;
			} else {
				forwardOpts.originNick = $firstChild(contentNode).getAttribute("nick-name");
				forwardOpts.reason = reasonEm.innerHTML;
			}
			var forwardContentNode = $.sizzle('dt[node-type="feed_list_forwardContent"]', feedNode)[0];
			if(forwardContentNode) {
				forwardOpts.forwardNick = forwardOpts.originNick;
				forwardOpts.originNick = $firstChild(forwardContentNode).getAttribute("nick-name");
				var _originEm = $.sizzle(">em", forwardContentNode)[0];
				if(!_originEm) {
					$.log("forward : there is not 'em' node in the feed_list_forwardContent node ");
					return $.preventDefault();
				}
				forwardOpts.origin = _originEm.innerHTML;
			} else {
				forwardOpts.origin = forwardOpts.reason;
				delete forwardOpts.reason;
			}
			for (var key in data) {
				forwardOpts[key] = data[key];
			}
	  		forwardDialog.show(mid, forwardOpts);
		};
		dEvent.add("feed_list_forward", "click", function(obj) {
			showForward(obj.el, obj.data);
			return utils.preventDefault(obj.evt);
		});
//评论---------------------------------------------------------------------
		var $comment = $.common.comment.comment;
		var $uniqueID = $.core.dom.uniqueID;
		var feedTemps = $.common.feed.feedList.feedTemps;
		var commentCache = {};
		var CTEXT = $.kit.extra.language("#L{评论}");
		var FTEXT = $.kit.extra.language("#L{转发}");
		dEvent.add("feed_list_comment", "click", function(obj) {
			var commentNode = obj.el,
				euid = $uniqueID(commentNode),
				cCache = commentCache[euid];
			
			var repeatNode = $.sizzle('div[node-type="feed_list_repeat"]', feedNode)[0];
			if(!repeatNode) {
				$.log("feedList.plugins.comment: 评论列表的展示区不存在！");
				return;
			}
			if(!cCache) {
				cCache = commentCache[euid] = $comment({focus:false,mid: mid, appkey:obj.data.appkey}, repeatNode);
				$.custEvent.add(cCache, "count", function(evt, ct) {
					if(parseInt(ct) < 1) return;
					commentNode.innerHTML = CTEXT + "("+ct+")";
				});
				
				$.custEvent.add(cCache, "feed", function() {
					var forwardNode = $.sizzle('a[action-type="feed_list_forward"]', commentNode.parentNode)[0];
					if(!forwardNode) {
						$.log("feedList.plugins.comment: 转发按钮节点不存在！");
						return;
					}
					var count = forwardNode.innerHTML.match(/\(([\d]*)\)/);
					forwardNode.innerHTML = FTEXT + "("+ (count ? parseInt(count[1]) + 1 : 1) +")";
				});
				
				repeatNode.innerHTML = feedTemps.loadingIMG;
				repeatNode.style.display = "";
			} else {
				$.custEvent.remove(cCache);
				cCache.destroy();
				delete commentCache[euid];
				repeatNode.on = 0;
				repeatNode.innerHTML = "";
				repeatNode.style.display = "none";
			}
			return utils.preventDefault(obj.evt);
		});
//魔表---------------------------------------------------------
		dEvent.add("feed_list_media_magic", "click", function(obj) {
			if(obj.data.swf) {
				$.common.magic(obj.data.swf);
			} else {
				$.log("魔法表情的地址不存在: node上的action-data swf不存在!");
			}
			return utils.preventDefault(obj.evt);
		});
	};
	
	return function(feedNode, outMid) {
		var feedUid = $.core.dom.uniqueID(feedNode);
		mid = outMid;
		if (cache[feedUid]) return;
		cache[feedUid] = true;
		bindEvent(feedNode);
	};
});
