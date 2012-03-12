/**
 * 收藏的公共实现
 * @id STK.common.favorite.favorite
 * @param {Object} opts
 * {
 *    mid: 收藏的feed 编号
 *    node: 收藏提示信息时依附的节点
 * }
 * @author Finrila | wangzheng4@staff.sina.com.cn
 * @example 
 * STK.common.favorite.favorite({
 * 	mid: "123456789",
 *  node: STK.E("test")
 * }).add();
 */

$Import('ui.tipAlert');
$Import('ui.alert');
$Import('ui.tipConfirm');
$Import('common.trans.favorite');
$Import('common.favorite.tagSave');
$Import('kit.extra.language');

STK.register("common.favorite.favorite", function($) {
	var $L = $.kit.extra.language;
	var SUCCTEXT = $L("#L{成功}!"),
		FAILTEXT = $L("#L{失败}!"),
		UNFAVTEXT = $L("#L{取消收藏}"),
		FAVTEXT = $L("#L{收藏}"),
		msgTip,
		//TipInfoFav = $L("#L{收藏成功}！"),
        TipInfoFav ="",
		TipInfoFaved = $L("#L{您已经收藏过此微博}！"),
		DialogTitle = $L("#L{添加收藏标签}"),
        SucTitle = $L("#L{收藏成功!}");
	
	var showMsg = function(msg, el, error) {
		if(!msg) return;
		
		msgTip = $.ui.tipAlert({
			showCallback: function() {
				setTimeout(function() {
					msgTip && msgTip.anihide();
				}, 600);
			},
			hideCallback: function() {
				tipOnMid = undefined;
				msgTip && msgTip.destroy();
				msgTip = null;
			},
			msg: msg,
			type: error?"error":undefined
		});
		msgTip.setLayerXY(el);
		msgTip.aniShow();
	};
	
	var okCallback, hideCallback, confirmTip;
	var getConfirmTip = function(type) {
		return $.ui.tipConfirm({
			info: $L("#L{确认要取消收藏这条微博吗？}"),
			okCallback: function() {
				okCallback && okCallback();
			},
			hideCallback: function() {
				hideCallback && hideCallback();
			}
		});
	};
	
	var favorite = function(that, mid, el, act) {
		
		var tipText = (act == "add") ? FAVTEXT : UNFAVTEXT;
		
		$.common.trans.favorite.getTrans(act, {
			onSuccess: function(data) {
				showMsg(tipText + SUCCTEXT, el);
				$.custEvent.fire(that, "success");
			},
			onFail: function() {
				showMsg(tipText+ FAILTEXT, el, true);
				$.custEvent.fire(that, "fail");
			},
			onError: function(data) {
				showMsg(data.msg || (tipText+FAILTEXT), el, true);
				$.custEvent.fire(that, "error", data);
			}
		}).request(
			/**
			 * Diss
			 */
			$.module.getDiss({mid: mid}, el)
		);
	};
	
	return function(opts) {
		var that = {};
		opts = $.parseParam({
			mid: null,
			node: null
		}, opts);
		
		if(!opts.mid || !opts.node) {
			$.log("opts.mid, opts.node 都不能为空!");
			return;
		}
		$.custEvent.define(that, ["success", "showForward", "fail", "error", "cancel"]);
		
		/**
		 * 添加收藏
		 * @method add
		 */
		that.add = function() {
			favorite(that, opts.mid, opts.node, "add");
		};
		/**
		 * 删除收藏
		 * @method del
		 */
		that.del = function() {
			okCallback = function() {
				favorite(that, opts.mid, opts.node, "del");
			};
			hideCallback = function() {
				$.custEvent.fire(that, "cancel");
			};
			confirmTip = confirmTip || getConfirmTip();
			confirmTip.setLayerXY(opts.node);
			confirmTip.aniShow();
		};
		/**
		 * 隐藏打开的tip
		 * @method hideTip
		 */
		that.hideTip = function() {
			msgTip && msgTip.hide();
		};
		/**
		 * 动画隐藏打开的tip
		 * @method hideTip
		 */
		that.anihideTip = function() {
			msgTip && msgTip.anihide();
		};
		/**
		 * 销毁
		 * @method destroy
		 */
		that.destroy = function() {
			msgTip && msgTip.destroy();
			$.custEvent.undefine(that);
			that = opts = tagSave = msgTip = confirmTip = null;
		};
		
 		return that;
	};
	
});
