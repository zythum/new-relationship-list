/**
 * 转发的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('common.depand.feed');
$Import('common.feed.feedList.utils');
$Import('common.feed.feedList.feedTemps');
$Import('kit.dom.firstChild');
$Import('kit.extra.language');
$Import('kit.extra.toFeedText');
$Import('ui.alert');

STK.register("common.feed.feedList.plugins.forward", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var $firstChild = $.kit.dom.firstChild;
	var FTEXT = $.kit.extra.language("#L{转发}");
	var $L = $.kit.extra.language;
	var require = $.common.depand.feed;
	
	return function(base, opts) {
		
		if (!base) {
			$.log("forward : need object of the baseFeedList Class");
			return;
		}
		opts = $.parseParam({
			forwardStyleId: "1"
		}, opts);
		
		var node = base.getNode();
		var that = {};
		var forwardNode, forwardDialog;
		var locked = false;
		
		/**
		 * 延迟载入
		 */
		var asynShowForward = require.bind('asyn_forward', function(mid, opts){
			locked = false;
			if (!forwardDialog) {
				forwardDialog = $.common.dialog.forward({
					styleId: opts.forwardStyleId
				});
				
				$.custEvent.add(forwardDialog, "forward", function(evt, data) {
					if(!forwardNode || !data.isToMiniBlog) return;
					var count = forwardNode.innerHTML.match(/\(([\d]*)\)/);
					forwardNode.innerHTML = FTEXT + "("+ (count ? parseInt(count[1]) + 1 : 1) +")";
					//这行代码需要注释掉，否则后面的hide事件函数的延迟处理无法继续。
//					forwardNode = undefined;
				});
				
				$.custEvent.add(forwardDialog, "show", function(evt, spec){
					if(spec && spec['box']){
						var outer = spec.box.getOuter();
						var dissPass = $.module.getDiss({
							'module' : 'tranlayout'
						}, utils.getFeedNode(forwardNode, node));
						delete dissPass['location'];
						/**
						 * Diss
						 */
						outer.setAttribute('diss-data', $.core.json.jsonToQuery(dissPass));
					}
				});
				
				$.custEvent.add(forwardDialog, "hide", function() {
					if ($.core.util.browser.IE6) { document.body.focus(); }
					(function(fwNode){
						setTimeout(function(){try{fwNode && fwNode.focus();}catch(e){}}, 200);
					})(forwardNode);
					forwardNode = undefined;
				});
			}
	  		forwardDialog.show(mid, opts);
		}, {'onTimeout': function(){locked = false;}});
		
		var showForward = function(el, data) {
			forwardNode = el;

			//modify by zhaobo 201105121321
			var _errorMsg = el.getAttribute("error-msg");
			if(_errorMsg) {
				$.ui.alert(_errorMsg);
				return utils.preventDefault();
			}
			if(data.allowForward == '0') {
				$.ui.alert($L('#L{抱歉，此微博已经被删除，无法进行转发哦，请试试其他内容吧。 }'));
				return utils.preventDefault();
			}
			
			var mid = utils.getMid(el, node);
			var feedNode = utils.getFeedNode(el, node);
			
			var forwardOpts = {};
			var contentNode = $.sizzle('p[node-type="feed_list_content"]', feedNode)[0];
			
			forwardOpts.url = (data || "") && data.url;
			if(!contentNode) {
				$.log("forward : there is not 'p[node-type=\"feed_list_content\"]' in the feed_item ");
				return utils.preventDefault();
			}
			var reasonEm = $.sizzle(">em", contentNode)[0];
			if(!reasonEm) {
				// 为什么取 $CONFIG.onick？
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
					return utils.preventDefault();
				}
				forwardOpts.origin = _originEm.innerHTML;
			} else {
				forwardOpts.origin = forwardOpts.reason;
				delete forwardOpts.reason;
			}
			for (var key in data) {
				forwardOpts[key] = data[key];
			}
			if(locked){ return; }
			locked = true;
			asynShowForward(mid, forwardOpts);
		};
		
		base.getDEvent().add("feed_list_forward", "click", function(obj) {
			showForward(obj.el, obj.data);
			return utils.preventDefault();
		});
		
		that.showForward = showForward;
		
		that.destroy = function() {
			if(forwardDialog){
				$.custEvent.remove(forwardDialog);
				forwardDialog.destroy();
				forwardDialog = null;
			}
			forwardNode = base = node = null;
		};
		
		return that;
	};
});
