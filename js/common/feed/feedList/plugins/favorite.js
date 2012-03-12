/**
 * 收藏的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 */
$Import('ui.tipAlert');
$Import('kit.dom.parentAttr');
$Import('common.feed.feedList.utils');
$Import('kit.extra.language');
$Import('common.favorite.favorite');
STK.register("common.feed.feedList.plugins.favorite", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var $L = $.kit.extra.language;
	var tipOnMid;
	var UNFAVTEXT = $L("#L{取消收藏}");
	var FAVTEXT = $L("#L{收藏}");
	var favoriteObj;

    var refreshFav = function()
    {
       var favParam  =  $.queryToJson(location.search.slice(1));
        favParam.page =1;
        if($CONFIG['bigpipe'] === 'true' && $.historyM){
				$.historyM.setQuery(favParam, true);
				return;
			}
        var  favurl = window.location.href;
         window.location.href = favurl.replace(/([?|&]page=)\d+/ , "$1"+"1");
    };
	var favoriteFn = function(base, el, feedNode, mid, isFavoritePage, favoriteFlag) {
		favoriteObj && favoriteObj.destroy();
		favoriteObj = $.common.favorite.favorite({
			mid: mid,
			node: el
		});
		if(!favoriteObj) {
			$.log("favoriteObj is undefined!");
			return;
		}
        //modify by xionggq 修改取消收藏后只有hover才能显示的bug。
		var elHtml = UNFAVTEXT, elClass = "W_textb", elParentClass = "";
		
		$.custEvent.add(favoriteObj, "success", function() {
			if(isFavoritePage && !favoriteFlag) {
				favoriteObj && favoriteObj.destroy();
				feedNode.style.height = feedNode.offsetHeight + "px";
				feedNode.innerHTML = "";
				var feedNodeT = $.tween(feedNode, {'end' : function(){
					feedNodeT.destroy();
					$.removeNode(feedNode);
					el = feedNode = null;
					if(base.getFeedCount() < 1) {
                          refreshFav();
                    }
				}}).play({'height':0});
			} else {
				el.innerHTML = elHtml;
				el.className = elClass;
				el.parentNode.className = elParentClass;
				el.setAttribute("favorite", favoriteFlag?"1":"0");
			}
			tipOnMid = null;
		});
		$.custEvent.add(favoriteObj, "fail", function() {
			tipOnMid = null;
		});
		$.custEvent.add(favoriteObj, "error", function() {
			tipOnMid = null;
		});
		$.custEvent.add(favoriteObj, "cancel", function() {
			tipOnMid = null;
		});
		
		if(favoriteFlag) {
			elParentClass = "";
			favoriteObj.add();
		} else {
			elClass = "";
			elHtml = FAVTEXT;
			favoriteObj.del();
		}
	};
	
	var favoriteClickFun = function(base, obj, node, isFavoritePage, that) {
		var el = obj.el,
			mid = utils.getMid(el, node),
			feedNode = utils.getFeedNode(el, node);
		if(tipOnMid == mid) return;
		tipOnMid = mid;
		var favoriteFlag = (el.getAttribute("favorite") != "1");
		favoriteFn(base, el, feedNode, mid, isFavoritePage, favoriteFlag);
	};
	
	return function(base, opts) {
		if (!base) {
			$.log("favorite : need object of the baseFeedList Class");
			return;
		}
		opts = $.parseParam({
			isFavoritePage: false//是否是属于收藏页
		}, opts);
		
		var node = base.getNode();
		var that = {};
		$.custEvent.define(that, "showForward");
		
		base.getDEvent().add("feed_list_favorite", "click", function(obj) {
			$.custEvent.fire(base, "clearTips", "favorite");
			favoriteClickFun(base, obj, node, opts.isFavoritePage, that);
			return utils.preventDefault(obj.evt);
		});
		
		that.hideTip = function(flag) {
			favoriteObj && (flag ? favoriteObj.hideTip() : favoriteObj.anihideTip());
		};
		
		that.destroy = function() {
			favoriteObj && favoriteObj.destroy();
		};
		
		return that;
	};
});