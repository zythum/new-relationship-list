/**
 * 删除feed的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('ui.tipConfirm');
$Import('ui.tipAlert');
$Import('common.trans.feed');
$Import('kit.dom.parentAttr');
$Import('common.feed.feedList.utils');
$Import('kit.extra.language');
$Import('common.layer.ioError');

STK.register("common.feed.feedList.plugins.deleteFeed", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var tipOnMid, confirmTip, msgTip, okCallback;
	var $cFeed = $.common.channel.feed;
	
	var DERRORTEXT = $.kit.extra.language("#L{删除失败}!");
	
	var getConfirmTip = function(type) {
		return $.ui.tipConfirm({
			okCallback: function() {
				okCallback();
			},
			hideCallback: function() {
				tipOnMid = undefined;
			}
		});
	};
	
	var deleteMsg = function(msg, el) {
		msgTip = $.ui.tipAlert({
			showCallback: function() {
				setTimeout(function() {
					msgTip.anihide();
				}, 600);
			},
			hideCallback: function() {
				tipOnMid = undefined;
				msgTip.destroy();
				msgTip = null;
			},
			msg: msg,
			type: "error"
		});
		msgTip.setLayerXY(el);
		msgTip.aniShow();
	};
	
	var deleteFeed = function(base, mid, el, node) {
		var feedNode = utils.getFeedNode(el, node);
		feedNode.style.height = feedNode.offsetHeight + "px";
		feedNode.style.overflow = "hidden";
		//动画
		var feedNodeT = $.tween(feedNode, {'end' : function(){
			feedNode.innerHTML = '';
			$.removeNode(feedNode);
			node = el = feedNode = null;
			feedNodeT.destroy();
			if(base.getFeedCount() < 1) window.location.reload();
		}}).play({'height':0});
		
		$cFeed.fire("delete");
	};
	
	var deleteClickFun = function(base, obj, node) {
		var _el = obj.el;
		var _mid = utils.getMid(_el, node);;
		if(tipOnMid == _mid) {
			return;
		}
		tipOnMid = _mid;
		okCallback = function() {
			utils.getFeedTrans("delete", {
				onSuccess: function() {
					deleteFeed(base, _mid, _el, node);
				},
				onFail: function() {
					deleteMsg(DERRORTEXT, _el);
				},
				onError: function(data) {
					if (data.code == '100003') {
						$.common.layer.ioError(data.code, data);
					}
					else {
						deleteMsg(data.msg, _el);
					}
				}
			}).request({
					mid: _mid
			});
		};
		confirmTip = confirmTip || getConfirmTip();
		confirmTip.setLayerXY(_el);
		confirmTip.aniShow();
		return utils.preventDefault(obj.evt);
	};
	
	return function(base) {
		if (!base) {
			$.log("deleteFeed : need object of the baseFeedList Class");
			return;
		}
		
		var node = base.getNode();
		var dEvent = base.getDEvent();
		var that = {};

		base.getDEvent().add("feed_list_delete", "click", function(obj) {
			$.custEvent.fire(base, "clearTips", "deleteFeed");
			return deleteClickFun(base, obj, node);
		});
		
		that.hideTip = function(flag) {
			if (confirmTip) {
				flag ? confirmTip.hide() : confirmTip.anihide();
			}
		};
		
		that.destroy = function() {
			msgTip && msgTip.destroy();
			confirmTip && confirmTip.destroy();
			confirmTip = msgTip = okCallback = null;
		};
		
		return that;
	};
});
