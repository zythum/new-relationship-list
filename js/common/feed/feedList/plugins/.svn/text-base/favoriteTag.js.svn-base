/**
 * 收藏的标签 有添加和修改标签两个功能的实现 
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 */
$Import('common.favorite.tagSave');
$Import('common.feed.feedList.utils');
$Import('ui.alert');
$Import('kit.extra.language');
STK.register("common.feed.feedList.plugins.favoriteTag", function($) {
	var utils = $.common.feed.feedList.utils, $L = $.kit.extra.language;
	/*
	var TAGACTHTML = '<#et temp data>'+ 
		'<#if (data.newTags)>'+
		'<div class="modify">标签：${data.newTags}<a action-data="tag=${data.newTags}" action-type="favFeed_editTags" href="javascript:void(0);"><cite>修改</cite></a></div>'+
		'<#else>'+
		'<div class="addNew"><a action-type="favFeed_addTags" href="javascript:void(0);"><em>+</em><cite>加标签</cite></a></div>'+
		'</#if>'+
		'</#et>';
	*/
	var showTagSave = function(opts) {
		var favTagDiv = $.sizzle('div[node-type="favorite_tag_act"]', opts.feedNode)[0];

		var tagSave = $.common.favorite.tagSave({
			title: opts.title,
			flag: opts.flag,
			mid: opts.mid,
			lastTags: opts.lastTags
		});
		$.custEvent.add(tagSave, "success", function(event, data) {
			window.location.reload();
			/* 当标签有改动后目前跳页
			//改变收藏区的显示 favTagDiv
			if(!newTags || newTags.length < 1) {
				newTags = null;
			}
			opts.tagAct.innerHTML = $.core.util.easyTemplate(TAGACTHTML, {
				newTags: newTags
			});
			showForward && $.custEvent.fire(opts.that, "showForward");
			*/
		});
		$.custEvent.add(tagSave, "error", function(event, data) {
			$.ui.alert(data ? data.msg : $L('#L{服务器错误！}'));
		});
		
		$.custEvent.add(tagSave, "hide", function() {
			tagSave.destroy();
			tagSave = null;
		});
		tagSave.show();
	};
	
	return function(base) {
		if (!base) {
			$.log("comment : need object of the baseFeedList Class");
			return;
		}
		var node = base.getNode();
		var that = {};
		$.custEvent.define(that, "showForward");
		
		base.getDEvent().add("favFeed_addTags", "click", function(obj) {
			var el = obj.el,
				mid = utils.getMid(el, node),
				feedNode = utils.getFeedNode(el, node);
			var tagAct = $.sizzle('div[node-type="favorite_tag_act"]', feedNode)[0];
			
			showTagSave({
				title:  $L('#L{添加标签}'),
				flag: "add",
				mid: mid,
				feedNode: feedNode,
				that: that,
				tagAct: tagAct
			});
		});
		
		base.getDEvent().add("favFeed_editTags", "click", function(obj) {
			var el = obj.el,
				mid = utils.getMid(el, node),
				feedNode = utils.getFeedNode(el, node),
				tag = obj.data.tag;
			var tagAct = $.sizzle('div[node-type="favorite_tag_act"]', feedNode)[0];
			/* 不需要tag id的一的处理
			var lastTags = [];
			for(var i = 0; i < tag.length; i++) {
				var tagItem = tag[i].split(":");
				lastTags.push({
					tagId: tagItem[0],
					tagName: tagItem[1]
				});
			}
			*/
			showTagSave({
				title: "修改标签",
				flag: "edit",
				mid: mid,
				lastTags: tag,
				feedNode: feedNode,
				that: that,
				tagAct: tagAct
			});
		});
		
		
		that.destroy = function() {
			
		};
		
		return that;
	};
});