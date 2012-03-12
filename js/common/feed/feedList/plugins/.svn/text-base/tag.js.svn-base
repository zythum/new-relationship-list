/**
 * 添加标签的插件
 * @param {Object} base baseFeedList实例
 * @author guoqing5@staff.sina.com.cn
 * @example
 */
$Import('common.depand.feed');
$Import('common.feed.feedList.utils');
$Import('kit.extra.language');
STK.register("common.feed.feedList.plugins.tag", function($) {
	var utils = $.common.feed.feedList.utils;
	var $L = $.kit.extra.language;
	var require = $.common.depand.feed;
	return function(base, opts) {

		if (!base) {
			$.log("forward : need object of the baseFeedList Class");
			return;
		}
		var node = base.getNode();
		var that = {};
		var  addTagNode,addTagDialog,tagList,addTagDom,editTagDom,addTagdivDom;

		/**
		 * 延迟载入
		 */
		var asynShowAddtag = require.bind('asyn_addtag', function(mid, opts) {
			if (!addTagDialog) {
				opts.mid = mid;
				addTagDialog = $.common.dialog.addTag(opts);

				$.custEvent.add(addTagDialog, "success", function(evt, data) {
					if (!tagList) {
						$.log("addtag : there is not 'div[node-type=\"feed_list_tagList\"]' in the feed_item ");
						return;
					}
					var tags = data.data.tags;
					//var addTagDom = $.sizzle('[action-type="feed_list_addTag"]',feedNode)[0];
					if (typeof tags != "undefined") {
						if (tags == "") {
							//addTagDom && $.setStyle(addTagDom,"display","");
							addTagdivDom && $.setStyle(addTagdivDom, "display", "");
							tagList && $.setStyle(tagList, "display", "none");
						}
						else {
							//addTagDom && $.setStyle(addTagDom,"display","none");
							addTagdivDom && $.setStyle(addTagdivDom, "display", "none");
							tagList && $.setStyle(tagList, "display", "");
						}
						addTagDom && addTagDom.setAttribute("_tagList", tags);
						editTagDom && editTagDom.setAttribute("_tagList", tags);
					}

					tagList.innerHTML = data.data.html;
				});

				$.custEvent.add(addTagDialog, "hide", function() {
					var tags = data.data.tags;
					var dom = tagList;
					if (tags == "") {
						dom = addTagdivDom;
					}
					if ($.core.util.browser.IE6) {
						document.body.focus();
					}
					(function(fwNode) {
						setTimeout(function() {
							if (fwNode && fwNode.style.display != "none") {
								fwNode.focus();
							}
							addTagDom = null;
							addTagdivDom = null;
							tagList = null;
						}, 200);
					})(dom);

				});
			}

	  		addTagDialog.show(opts);
		}, {'onTimeout': function(){}});

		var showAddtag = function(el, data) {
			var lastTags = el.getAttribute("_taglist");
			addTagNode = el;
			var mid = utils.getMid(el, node);
			var feedNode = utils.getFeedNode(el, node);
			 tagList =$.sizzle('div[node-type="feed_list_tagList"]',feedNode)[0];
			addTagDom = $.sizzle('[node-type="feed_list_addTag"]',feedNode)[0];
			addTagdivDom = $.sizzle('[node-type="feed_list_addtagDiv"]',feedNode)[0];
			editTagDom =  $.sizzle('[node-type="feed_list_editTag"]',feedNode)[0];
			var tagOpts = {};
			tagOpts.lastTags = lastTags;
			if (!lastTags) {
				tagOpts.title = $L('#L{添加标签}');
			} else {
				tagOpts.title = $L('#L{编辑标签}');
			}
			var contentNode = $.sizzle('p[node-type="feed_list_content"]', feedNode)[0];

			if(!contentNode) {
				$.log("addtag : there is not 'p[node-type=\"feed_list_content\"]' in the feed_item ");
				return utils.preventDefault();
			}
			var reasonEm = $.sizzle(">em", contentNode)[0];
			//获取feed的参数
			var forwardContentNode = $.sizzle('dt[node-type="feed_list_forwardContent"]', feedNode)[0];

			for (var key in data) {
				tagOpts[key] = data[key];
			}
			asynShowAddtag(mid, tagOpts);
		};

		base.getDEvent().add("feed_list_addTag", "click", function(obj) {
			showAddtag(obj.el, obj.data);
			return utils.preventDefault();
		});

		that.showAddtag = showAddtag;

		that.destroy = function() {
			if(addTagDialog){
				$.custEvent.remove(addTagDialog);
				addTagDialog.destroy();
				 addTagDialog = null;
			}
			addTagdivDom = tagList = addTagNode = base = node = null;
		};

		return that;
	};
});
