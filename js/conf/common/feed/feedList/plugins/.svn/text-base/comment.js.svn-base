/**
 * 评论的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
//$Import('common.comment.comment');
$Import('common.trans.comment');
$Import('common.depand.feed');
$Import('common.feed.feedList.utils');
$Import('common.feed.feedList.feedTemps');
$Import('kit.extra.language');
$Import('kit.extra.setPlainHash');
$Import('ui.alert');
$Import('common.trans.comment');
$Import('common.content.weiboDetail.utils');
$Import('kit.extra.language');
$Import('common.dialog.commentDialogueTip');

STK.register("common.feed.feedList.plugins.comment", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var $uniqueID = $.core.dom.uniqueID;
	var _feedTemps = $.common.feed.feedList.feedTemps;
	var commentCache = {};
    var commentTrans = $.common.trans.comment.getTrans;
	var CTEXT = $.kit.extra.language("#L{评论}");
	var FTEXT = $.kit.extra.language("#L{转发}");
	var require = $.common.depand.feed;
	 var util = $.common.content.weiboDetail.utils();
	var $L = $.kit.extra.language;
//	var $comment = $.common.comment.comment;
	var trans = $.common.trans.comment;
	 var feedNode =null;
	var tabDomAll = null,allHtml={};
	var setHash = $.kit.extra.setPlainHash;
	return function(base) {
		 var isFilter= false;

		if (!base) {
			$.log("comment : need object of the baseFeedList Class");
			return;
		}
		var node = base.getNode();
		var that = {};
		
		var locked = false;
		
		var asynOpenComment = require.bind('asyn_comment', function(obj){
			locked = false;
			var commentNode	= obj.el,
				euid		= $uniqueID(commentNode),
				cCache		= commentCache[euid],
				mid			= utils.getMid(commentNode, node),
				feedNode	= utils.getFeedNode(commentNode, node),
				repeatNode	= $.sizzle('div[node-type="feed_list_repeat"]', feedNode)[0];
			if(!repeatNode) {
				$.log("feedList.plugins.comment: 评论列表的展示区不存在！");
				return;
			}
			if(!cCache) {
				//obj.data.mid = mid;
				/**
				 * Diss 穿透
				 */
				setHash((+new Date()).toString());
				cCache = commentCache[euid] = $.common.comment.comment($.module.getDiss({
					mid      : mid,
					'appkey' : obj.data.appkey,
					"isMain" : true
				}, obj.el), repeatNode);
                $.custEvent.add(cCache, "count", function(evt, ct) {
					if(parseInt(ct) < 1) return;
					commentNode.innerHTML = CTEXT + "("+ct+")";
					$CONFIG['location'] == 'home' && asynShowCommentDialogueTip(repeatNode); //载入并显示评论对话引导层
				});
				  $.custEvent.add(cCache, "comment", function(evt, data) {
					//蛋疼的假写要切换到全部
					  tabDomAll = $.sizzle('a[node-type="feed_list_commentTabAll"]', feedNode)[0];
					  var commentList = $.sizzle('[node-type="feed_list_commentList"]', feedNode)[0];
					  var ct = data.html,count = parseInt(data.count);
					  var numDom = $.sizzle('[node-type="feed_list_commentListNum"]', feedNode)[0];
					  if(parseInt(count) >0  && numDom)
					  {
						  numDom.innerHTML = $L("#L{共}") + count + $L("#L{条}");
					  }
					  if (!tabDomAll) {
						  ct && $.insertHTML(commentList, ct, "afterbegin");
					  }
					  else {
						  if (!allHtml[mid]) {
							  ct && $.insertHTML(commentList, ct, "afterbegin");
						  }
						  else {
							  commentList.innerHTML = allHtml[mid];
							  util.tabSwitch(tabDomAll, "current", "current W_texta");
							  ct && $.insertHTML(commentList, ct, "afterbegin");
						  }
					  }
					  window.setTimeout(function() {
						  allHtml[mid] = commentList.innerHTML;
					  }, 0);
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
				
				repeatNode.innerHTML = _feedTemps.loadingIMG;
				repeatNode.style.display = "";
			} else {
				$.custEvent.remove(cCache);
				cCache.destroy();
				delete commentCache[euid];
				repeatNode.on = 0;
				repeatNode.innerHTML = "";
				repeatNode.style.display = "none";
				
				$CONFIG['location'] == 'home' && hideCommentDialogueTip(repeatNode); //隐藏评论对话引导层
			}
			return utils.preventDefault();
		}, {'onTimeout': function(){locked = false;}});
		
		var openComment = function(e){
			$.core.evt.preventDefault();
			if(locked){ return; }
			locked = true;
			asynOpenComment(e);
		};
        //根据类型获取评论的数据
        var searchCommentFunc ={
             'getListByType' : function(spec,wrap)
             {

				 var data = spec.data;
				 var mid = data.mid;
				 var commentNode = spec.el,
					feedNode = utils.getFeedNode(commentNode, node);
				 var isSwitch = util.tabSwitch(spec.el, "current", "current W_texta");
				 if (!isSwitch) return util.preventDefault();
				 //wrap. innerHTML = _feedTemps.loadingIMG;
				 setHash((+new Date()).toString());
				 commentTrans("cfilter", {
					 'onSuccess' : function(json) {
						 wrap.innerHTML = json.data.html;
						 if (!isFilter) allHtml[mid] = json.data.html;
						 var numDom = $.sizzle('[node-type="feed_list_commentListNum"]', feedNode)[0];
						 if (numDom && json.data && typeof json.data.count != "undefined") {
							 numDom.innerHTML = $L("#L{共}") + json.data.count + $L("#L{条}");
						 }
						 feedNode = null;
					 },
                     'onFail' : function(json){
                           $.ui.alert(json.msg || $.kit.extra.language("#L{接口返回数据错误}") );
						  feedNode = null;
                     },
                     'onError' : function(json)
                     {
                         $.ui.alert(json.msg || $.kit.extra.language("#L{接口返回数据错误}") );
						  feedNode = null;
                     }
                 }).request(data);
                    return false;
             }
        };
        var searchComment =  function(spec)
        {
			/*解决切换到其他标签下假写问题，如果在common.comment.comment
			 *发请求地方修改 ，可能会使得其他服务出现问题，现在业务逻辑是有
			 *十条后才会出现切换tab加一个比标记，
			 *表明触发了tab切换的事件，评论成功，切换到全部下，写下文字注释。
             xionggq
		     */
			$.preventDefault();
			var mid = spec.data.mid;
			isFilter = spec.el.getAttribute && spec.el.getAttribute("node-type") =="feed_list_commentTabAll" ? false : true;

            var commentNode = spec.el,
                    feedNode = utils.getFeedNode(commentNode, node),
                    data = spec.data,
                    commentList = $.sizzle('[node-type="feed_list_commentList"]', feedNode)[0];
			//默认选中全部
			if(!allHtml[mid])
			{
				allHtml[mid] = commentList.innerHTML;
			}
            if (!commentList) {
                $.log("feedList.plugins.comment: 评论列表不存在！");
                return;
            }
            searchCommentFunc.getListByType(spec, commentList);
        };
        
        /**
         * 评论对话引导层
         */
        //显示
        var asynShowCommentDialogueTip = require.bind('asyn_commentDialogue_tip', function(node){
			$.common.dialog.commentDialogueTip(node).show();
        }, {'onTimeout': function(){}});
		//隐藏
		var hideCommentDialogueTip = function(node){
			$.common.dialog.commentDialogueTip(node).hide();
		};
		
		
		base.getDEvent().add("feed_list_comment", "click", openComment);
		base.getDEvent().add("feed_list_commentSearch", "click", searchComment);

		base.getDEvent().add("feed_private_tipclose", "click", function(obj) {
			var isLink   =obj.data && obj.data.type;
			var feedNode = utils.getFeedNode(obj.el , node);
			var nodes = $.sizzle("[node-type='feed_privateset_tip']" , feedNode);

			var tipNode = nodes.length && nodes[0];
			tipNode && $.setStyle(tipNode , 'display' , 'none');
            trans.getTrans('privateNoMore', {
                onSuccess : function() {
                    isLink && (window.location.href = obj.el.getAttribute("href"));
                },
                onError:$.funcEmpty
			}).request({
				bubbletype : 7,
				time : 7 * 86400
			});
			return 	utils.preventDefault();
		});
		
		that.destroy = function() {
			for (var i in commentCache) {
				commentCache[i].destroy();
			}
			for (var j in allHtml) {
				allHtml[j].destroy();
			}
			tabDomAll = null;
			allHtml = null;
			commentCache = {};
			listNumDom = null;
			feedNode = null;
		};
		
		return that;
	};
	
});
