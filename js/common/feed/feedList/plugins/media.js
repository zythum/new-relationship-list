/**
 * 媒体的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('module.rotateImage');
$Import('common.feed.feedList.utils');
$Import('kit.dom.fix');
$Import('common.magic');
$Import('kit.extra.language');
$Import('common.feed.widget');

STK.register("common.feed.feedList.plugins.media", function($) {
	
	var utils = $.common.feed.feedList.utils;
	var $feedTemps = $.common.feed.feedList.feedTemps;
	var $easyTemplate = $.core.util.easyTemplate;
	var $kitL = $.kit.extra.language
	var LOADERRTEXT = $kitL("#L{加载失败}!");
	var QINGERRTEXT = $kitL("#L{很抱歉，该内容无法显示，请稍后再试。}");
	var IE = $.core.util.browser.IE;
	var MEDIASCROLLTOP = 40;
	
	var MEDIAWIDTH = 450;
	
	var getMediaPDNodes = function(feedNode, isForward) {
		return {
			prev: $.sizzle('[node-type=feed_list_media_prev]', feedNode)[0],
			disp: $.sizzle((isForward? 'dd' : 'dl') + '[node-type="feed_list_media_disp"]', feedNode)[0]
		};
	};
	
	//图片处理事件区start-------------------------------------------------------------
	var smallimgClickFun = function(obj, node, cData) {
		var el = obj.el;
		if(el.loading) {
			return;
		}
		el.loading = 1;

		var bigImgSrc = el.src.replace("/thumbnail/", "/bmiddle/");
		var largeImgSrc = el.src.replace("/thumbnail/", "/large/");
		var feedNode = utils.getFeedNode(el, node);
		var isForward = feedNode.getAttribute("isForward")?1:"";
		var mid = utils.getMid(el, node);
		var cacheImg, loadingImg;
		if(!feedNode) {
			$.log('parents attribute mid node is undefined!');
			return;
		}
		feedNode.isForward = isForward;
		
		var pDNodes = getMediaPDNodes(feedNode, isForward);
		if(!pDNodes || !pDNodes.prev || !pDNodes.disp) {
			$.log('node-type="feed_list_media_prev" or node-type="feed_list_media_disp" in a feed\'s node is undefined!');
			return;
		}
		//清理vote 中生成的对象
		if(cData.voteObj[mid]) {
			cData.voteObj[mid].destroy();
			delete cData.voteObj[mid];
		}
		
		var loadEd = function() {
			el.loading = 0;
			if (cacheImg) {
				el.bigImgWidth = cacheImg.width
				cacheImg.onload = null
			}
			loadingImg && (loadingImg.style.display = "none");
			pDNodes.prev.style.display = "none";
			pDNodes.disp.innerHTML = "";
			pDNodes.disp.appendChild($.builder($easyTemplate($feedTemps.mediaIMGTEMP, {
				notForward: !isForward,
				uniqueId: $.core.util.getUniqueKey(),
				bigSrc: bigImgSrc,
				largeSrc: largeImgSrc,
				bigWidth: el.bigImgWidth > MEDIAWIDTH ? MEDIAWIDTH : el.bigImgWidth
			}).toString()).box);
			pDNodes.disp.style.display = "";
		};
		
		if(el.bigImgWidth) {
			loadEd();
		} else {
			var elW = el.offsetWidth;
			var topBottom = parseInt(el.offsetHeight / 2 - 8);
			(loadingImg = $.core.dom.next(el)).style.cssText = "margin:" + topBottom + "px "+ parseInt(elW / 2 - 8) +"px " + topBottom + "px -" + parseInt(elW / 2 + 8) + "px;";
			(cacheImg = new Image()).onload = loadEd;
			cacheImg.src = bigImgSrc;
		}
	};
	
	var bigimgClickFun = function(obj, node, force) {
		var el = obj.el;
		
		if(!force && !/(img)|(canvas)/.test(obj.evt.target.tagName.toLowerCase())) return;
		var feedNode = utils.getFeedNode(el, node);
		if(!feedNode) {
			$.log('parents attribute mid is undefined!');
			return;
		}
		feedNode.disp = "";
		
		var pDNodes = getMediaPDNodes(feedNode, feedNode.isForward);
		if(!pDNodes || !pDNodes.prev || !pDNodes.disp) {
			$.log('node-type="feed_list_media_prev" or node-type="feed_list_media_disp" in a feed\'s node is undefined!');
			return;
		}
		
		if ($.position(pDNodes.disp).t < $.scrollPos().top) {
			feedNode.scrollIntoView();
		}
		
		pDNodes.prev.style.display = "";
		pDNodes.disp.style.display = "none";
		pDNodes.disp.innerHTML = "";
	};
	
	var rotateImg = function(obj, node, rot) {
		var el = obj.el;
		var feedNode = utils.getFeedNode(el, node);
		//这里是有问题的区域 做为优化的内容 :id的赋值，parentNode的赋值
		if(!el.parentNode.uid) {
			var _bigimg = $.sizzle('img[action-type="feed_list_media_bigimg"]', feedNode)[0];
			el.parentNode.uid = $.core.dom.uniqueID(_bigimg) + "_" + $.core.util.getUniqueKey();
			_bigimg.setAttribute("id", el.parentNode.uid);
		}
		$.module.rotateImage.rotateRight(el.parentNode.uid, rot, function(){}, MEDIAWIDTH);
	};
	//图片处理事件区end-------------------------------------------------------------
	
	//音视频处理事件区start-------------------------------------------------------------
	var smallVideoMusicClickFun = function(obj, node, type, cData) {
		var el = obj.el;
		var data = obj.data;
		var feedNode = utils.getFeedNode(el, node);
		var isForward = feedNode.getAttribute("isForward")?"1":"";
		var mid = utils.getMid(el, node);
		var pDNodes = getMediaPDNodes(feedNode, isForward);
		if(!pDNodes || !pDNodes.prev || !pDNodes.disp) {
			$.log('node-type="feed_list_media_prev" or node-type="feed_list_media_disp" in a feed\'s node is undefined!');
			return;
		}
		//已经展开的媒体不能重复展开
		if(feedNode.disp == data.short_url) {
			return;
		}

		//清理vote 中生成的对象
		if(cData.voteObj[mid]) {
			cData.voteObj[mid].destroy();
			delete cData.voteObj[mid];
		}
		
		feedNode.disp = data.short_url;
		feedNode.isForward = isForward;
		pDNodes.prev.style.display = "none";
		var _t = decodeURIComponent(data.title);
		var _fTitle = $.bLength(_t) > 71 ? $.leftB(_t, 70) + "...":_t;
		_t = $.bLength(_t) > 24 ? $.leftB(_t, 23) + "...":_t;
		pDNodes.disp.innerHTML = "";
		pDNodes.disp.appendChild($.builder($easyTemplate($feedTemps.mediaVideoMusicTEMP, {
			notForward: !isForward,//!isForward
			short_url: decodeURIComponent(data.short_url),
			full_url: decodeURIComponent(data.full_url),
			title: _t,
			fTitle: _fTitle,
			type: type
		}).toString()).box);
		
		pDNodes.disp.style.display = "";
		
		var dispContent = $.sizzle('div[node-type="feed_list_media_big'+type+'Div"]', pDNodes.disp)[0];
		if(!dispContent) {
			$.log("media: node-type=\"feed_list_media_big"+type+"Div\" is not be found in feed_list_media_disp node!");
			return;
		}
		cData.dispContentNode[mid] = dispContent;
		
		var template_name = "default";
		//template_name的确定
		try{
			if(IE) {
				template_name = "object";
			} else if(navigator.plugins["Shockwave Flash"]) {
				template_name = "embed";
			} else {
				template_name = "html5";
			}
		} catch(e) {}
		
		var onFail = function(){
			dispContent.innerHTML = LOADERRTEXT;
		};
		var onSuccess = function(json){
			if(!json['result'] || json['error_code'] || json['error']){
				onFail();
				return;
			}
			var dc = cData.dispContentNode[mid];
				dc.mediaData = json['result'];
				dc.innerHTML = "";
				dc.appendChild($.builder(dc.mediaData).box);
				floatFix && floatFix.setFixed(true);
		};
		utils.getFeedTrans("mediaShow", {
			 onComplete : onSuccess
			,onFail     : onFail
		}).request({
			 'vers': 3
			,'lang': $CONFIG['lang']
			,'mid' : mid
			,'short_url': data.short_url.replace(/http\:\/\/(t|sinaurl)\.cn\//,'')
			,'template_name': template_name
			,'source': '3818214747'
		});//, template_name
		if(type === "video") {
			//动画到音视频位置
			$.scrollTo(pDNodes.disp, {
				step: 1,
				top: MEDIASCROLLTOP
			});
		}
		
	};
	//弹出----------------------------------------------------------
	//弹出的一些变量
	var floatClose, floatFix;
	var toFloatClickFn = function(obj, node, cData) {
		//清理上次的
		floatClose && $.fireEvent(floatClose, "click");
		
		var el = obj.el;
		var title = obj.data.title;
		var mid = utils.getMid(el, node);
		var dispContent = cData.dispContentNode[mid];
		var videoHTML = dispContent.mediaData;
		var _builder = $.builder($easyTemplate($feedTemps.mediaVideoMusicFloatTEMP, {
			title: title
		}).toString());
		var _outer = _builder.list["outer"][0],
			mediaContent = _builder.list["mediaContent"][0];
		floatClose = _builder.list["close"][0];
		document.body.appendChild(_outer);
		floatFix = $.kit.dom.fix(_outer, "rb");
		if(videoHTML) {
			mediaContent.innerHTML = "";
			mediaContent.appendChild($.builder(videoHTML).box);
			floatFix.setFixed(true);
		} else {
			cData.dispContentNode[mid] = mediaContent;
		}
		$.addEvent(floatClose, "click", function() {
			$.removeEvent(floatClose, "click", arguments.callee);
			floatFix && floatFix.destroy();
			//在ie下跨级移聊父级容器会导致报错
			//正确的移除方法是先将flash父级innerHTML=''
			//Last Modify By liusong@staff.sina.com.cn
			if($.IE){
				var o = $.sizzle('object',_outer);
				for(var i=0, len=o.length; i<len; i++){
					var obj = o[i];
					if( obj && (obj = obj.parentNode)){
						obj.innerHTML = '';
					}
				}
			}
			$.removeNode(_outer);
			floatFix = _builder = _outer = floatClose = null;
		});
		bigimgClickFun(obj, node, true);
	};
	//弹出end----------------------------------------------------------
	//视频处理事件区end-------------------------------------------------------------
	//投票处理事件区start-------------------------------------------------------------
//	var voteClickFn = function(obj, node, cData) {
//		//加载投票需要的html
//		var el = obj.el;
//		var data = obj.data;
//		var feedNode = utils.getFeedNode(el, node);
//		var isForward = feedNode.getAttribute("isForward")?1:"";
//		var mid = utils.getMid(el, node);
//		var pDNodes = getMediaPDNodes(feedNode, isForward);
//		if(!pDNodes || !pDNodes.prev || !pDNodes.disp) {
//			$.log('node-type="feed_list_media_prev" or node-type="feed_list_media_disp" in a feed\'s node is undefined!');
//			return;
//		}
//		//已经展开的媒体不能重复展开
//		if(feedNode.disp == data.short_url) {
//			return;
//		}
//		feedNode.disp = data.short_url;
//		feedNode.isForward = isForward;
//		pDNodes.prev.style.display = "none";
//		
//		pDNodes.disp.innerHTML = "";
//		pDNodes.disp.appendChild($.builder($easyTemplate($feedTemps.mediaVoteTEMP, {
//			notForward: !isForward,//!isForward
//			full_url: decodeURIComponent(data.full_url),
//			title: decodeURIComponent(data.title)
//		}).toString()).box);
//		
//		pDNodes.disp.style.display = "";
//		
//		var dispContent = $.sizzle('div[node-type="feed_list_media_voteDiv"]', pDNodes.disp)[0];
//		if(!dispContent) {
//			$.log('media: node-type="feed_list_media_voteDiv" is not be found in feed_list_media_disp node!');
//			return;
//		}
//		cData.dispContentNode[mid] = dispContent;
//		utils.getFeedTrans("voteShow", {
//			onSuccess: function(data) {
//				dispContent.style.textAlign = 'left';
//				//赋予html
//				dispContent.innerHTML = data.data.html;
//				//调用widget组件
//				$.common.feed.widget.add(mid , dispContent);
//				//最后再添加滚动效果
//				$.scrollTo(pDNodes.disp, {
//					step: 1,
//					top: MEDIASCROLLTOP
//				});
//				/*
//				if(!data || !(data = data.data)) return;
//				dispContent.innerHTML = "";
//				dispContent.style.textAlign = "";
//				dispContent.appendChild($.builder(data.html).box);
//				var scrollToFeed = function() {
//					$.scrollTo(pDNodes.disp, {
//						step: 1,
//						top: MEDIASCROLLTOP
//					});
//				};
//				scrollToFeed();
//				if(data.voted) {
//					cData.voteObj[mid] = $.common.vote.textVoteView(dispContent);
//				} else {
//					var textVote = cData.voteObj[mid] = $.common.vote.textVote(dispContent, {
//						'max':data.voteLimit,
//                 		'poll_id':data.voteId
//					});
//					$.custEvent.add(textVote, "success", scrollToFeed);
//					$.custEvent.add(textVote, "error", scrollToFeed);
//				}
//				*/
//			},
//			onFail: function(data) {
//				dispContent.innerHTML = (data && data.msg) || LOADERRTEXT;
//			},
//			onError: function(data) {
//				dispContent.innerHTML = (data && data.msg) || LOADERRTEXT;
//			}
//		}).request(data);
//		
//	};
	//投票处理事件区end-------------------------------------------------------------
	
	//widget-------------------------------------------------------------
	var widgetExpand = function(obj, node, cData){
		var el = obj.el; 
		var mid = utils.getMid(el, node); 
		var data = obj.data;
		var feedNode = utils.getFeedNode(el, node);
		var isForward = feedNode.getAttribute("isForward")?"1":""; 
		var pDNodes = getMediaPDNodes(feedNode, isForward); 
		//已经展开的媒体不能重复展开
		if(feedNode.disp == data.short_url || !pDNodes.disp) {
			return;
		}
		pDNodes.disp.innerHTML = '';
		//防止同一短链抢占展示区重新渲染html后dom丢失，每次站看重新初始化
		$.common.feed.widget.clear(mid);
		//
		pDNodes.disp.appendChild($.builder($easyTemplate($feedTemps.widgetTEMP, {
			notForward: !isForward//!isForward
			,short_url: decodeURIComponent(data.short_url)
			,full_url: decodeURIComponent(data.full_url)
			,title: decodeURIComponent(data.title)
			,suda: decodeURIComponent(data.suda||'')
		}).toString()).box);
		//显示loading状态
		pDNodes.prev.style.display = 'none';
		pDNodes.disp.style.display = ''; 
		
		var dispContent = $.sizzle('div[node-type="feed_list_media_widgetDiv"]', pDNodes.disp)[0];
		//
		utils.getFeedTrans("widget", {
			onSuccess: function(data) {
				data = data.data;
				if(!data.html) return;
				dispContent.innerHTML = data.html;
				//对展示区绑定widget
				$.common.feed.widget.add(mid,pDNodes.disp);
			},
			onFail: function(data) {
				dispContent.innerHTML = (data && data.msg) || LOADERRTEXT;
			},
			onError: function(data) {
				dispContent.innerHTML = (data && data.msg) || LOADERRTEXT;
			}
		}).request({
			short_url: decodeURIComponent(data.short_url),
			isforward: isForward,
			mid: mid
		});
		//下面是全局参！蛋疼
		feedNode.disp = data.short_url;
		feedNode.isForward = isForward;
	};
	//widget-------------------------------------------------------------
	
	//第三方feed改造使用-------------------------------------------------------------
	var thirdExpand = function(obj, node, cData){
		var el = obj.el; 
		var mid = utils.getMid(el, node); 
		var data = obj.data;
		var feedNode = utils.getFeedNode(el, node);
		var isForward = feedNode.getAttribute("isForward")?"1":""; 
		var pDNodes = getMediaPDNodes(feedNode, isForward); 
		//已经展开的媒体不能重复展开
		if(feedNode.disp == data.short_url) {
			return;
		}
		pDNodes.disp.innerHTML = '';
		//防止同一短链抢占展示区重新渲染html后dom丢失，每次站看重新初始化
		$.common.feed.widget.clear(mid);
		//
		pDNodes.disp.appendChild($.builder($easyTemplate($feedTemps.widgetTEMP, {
			notForward: !isForward//!isForward
			,short_url: decodeURIComponent(data.short_url)
			,full_url: decodeURIComponent(data.full_url)
			,title: decodeURIComponent(data.title)
			,suda: decodeURIComponent(data.suda||'')
		}).toString()).box);
		//显示loading状态
		pDNodes.prev.style.display = 'none';
		pDNodes.disp.style.display = ''; 
		
		var dispContent = $.sizzle('div[node-type="feed_list_media_widgetDiv"]', pDNodes.disp)[0];
		//
		utils.getFeedTrans("third_rend", {
			onSuccess: function(data) {
				data = data.data;
				if(!data.html) return;
				dispContent.innerHTML = data.html;
				//对展示区绑定widget
				$.common.feed.widget.add(mid,pDNodes.disp);
			},
			onFail: function(data) {
				dispContent.innerHTML = (data && data.msg) || LOADERRTEXT;
			},
			onError: function(data) {
				dispContent.innerHTML = (data && data.msg) || LOADERRTEXT;
			}
		}).request($.kit.extra.merge({
			isforward: isForward,
			mid: mid
		},data));
		//下面是全局参！蛋疼
		feedNode.disp = data.short_url;
		feedNode.isForward = isForward;
	};
	//第三方改造完成-------------------------------------------------------------


	//新闻+ ---------------------------------
	/*
	 * 改方法主要用于新闻微博中有视频及图片同时展开时，打开视频关闭feed预览区用
	 */
	var newsFeed = function(obj,type){
		var feed = obj.el;
		for(;!$.hasClassName(feed,'feed_list');feed=feed.parentNode);
		
		var newsPrv = $.sizzle('[node-type=feed_list_news]',feed)[0];
		newsPrv&&(newsPrv.style.display=type?'':'none');
	};
	//新闻- ---------------------------------
	var qingExpand = function(obj, node, cData){
		var el = obj.el; 
		var mid = utils.getMid(el, node); 
		var data = obj.data;
		var feedNode = utils.getFeedNode(el, node);
		var isForward = feedNode.getAttribute("isForward")?"1":""; 
		var pDNodes = getMediaPDNodes(feedNode, isForward); 
		//已经展开的媒体不能重复展开
		if(feedNode.disp == data.short_url) {
			return;
		}
		pDNodes.disp.innerHTML = '';
		//防止同一短链抢占展示区重新渲染html后dom丢失，每次站看重新初始化
		$.common.feed.widget.clear(mid);
		//
		pDNodes.disp.appendChild($.builder($easyTemplate($feedTemps.qingTEMP, {
			notForward: !isForward//!isForward
			,short_url: decodeURIComponent(data.short_url)
			,full_url: decodeURIComponent(data.full_url)
			,title: decodeURIComponent(data.title)
			,suda: decodeURIComponent(data.suda||'')
		}).toString()).box);
		//显示loading状态
		pDNodes.prev.style.display = 'none';
		pDNodes.disp.style.display = ''; 
		
		var dispContent = $.sizzle('div[node-type="feed_list_media_qingDiv"]', pDNodes.disp)[0];
		var success = function(data) {
			var code = data.code;
			if((code + '') == '1') {
				data = data.data;
				if(!data.result) return;
				dispContent.innerHTML = data.result;
				//对展示区绑定widget
				$.common.feed.widget.add(mid,pDNodes.disp);	
			} else {
				error(data);	
			}
			
		};
		var error = function(data) {
			dispContent.innerHTML = QINGERRTEXT;
		};
		var template_name = data.template_name;
		if(!template_name) {
			template_name = '';	
		} else if(template_name == 'video') {
			if($.IE) {
				template_name = 'object';	
			}else if(navigator.plugins && navigator.plugins["Shockwave Flash"]) {
				template_name = 'embed';
			} else {
				template_name = 'html5';	
			}
		}
		utils.getFeedTrans('qingShow' , {
			onComplete : success,
			onFail : error
		}).request({
			short_url : data.short_url,
			lang : window.$CONFIG && window.$CONFIG.lang || 'zh-cn',
			mid : mid,
			vers : 3,
			template_name : template_name
		});
		//下面是全局参！蛋疼
		feedNode.disp = data.short_url;
		feedNode.isForward = isForward;
		$.scrollTo(pDNodes.disp, {
			step: 1,
			top: MEDIASCROLLTOP
		});
	};
	return function(base) {
		if (!base) {
			$.log("media : need object of the baseFeedList Class");
			return;
		}
		var node = base.getNode();
		var dEvent = base.getDEvent();
		
		var that = {};
		var cData = {
			dispContentNode: {},//mid->node
			voteObj: {}//mid -> object
		};
		
		var clearTips = function() {
			$.custEvent.fire(base, "clearTips", "media");
		};
		
		//公共----------------------------------------------------
		dEvent.add("feed_list_media_toSmall", "click", function(obj) {
			//单个widget gc
			$.common.feed.widget.clear(utils.getMid(obj.el, node));
			//
			clearTips();
			newsFeed(obj,true);
			bigimgClickFun(obj, node, true);
			return utils.preventDefault(obj.evt);
		});
		//------------------------------------------------------------
		
		//图片处理区start-------------------------------------------------------------
		//小图片的处理事件
		dEvent.add("feed_list_media_img", "click", function(obj) {
			clearTips();
			smallimgClickFun(obj, node, cData);
			return utils.preventDefault(obj.evt);
		});
		//大图片的处理事件
		dEvent.add("feed_list_media_bigimgDiv", "click", function(obj) {
			clearTips();
			bigimgClickFun(obj, node);
			return utils.preventDefault(obj.evt);
		});
		dEvent.add("feed_list_media_toRight", "click", function(obj) {
			clearTips();
			rotateImg(obj, node, 90);
			return utils.preventDefault(obj.evt);
		});
		dEvent.add("feed_list_media_toLeft", "click", function(obj) {
			clearTips();
			rotateImg(obj, node, -90);
			return utils.preventDefault(obj.evt);
		});
		//图片处理区end-------------------------------------------------------------
		
		//音视频处理区
		dEvent.add("feed_list_media_video", "click", function(obj) {
			clearTips();
			newsFeed(obj,false);

			smallVideoMusicClickFun(obj, node, "video", cData);
			return utils.preventDefault(obj.evt);
		});
		dEvent.add("feed_list_media_music", "click", function(obj) {
			clearTips();
			newsFeed(obj,false);
			smallVideoMusicClickFun(obj, node, "music", cData);
			return utils.preventDefault(obj.evt);
		});
		//音视频弹出
		dEvent.add("feed_list_media_toFloat", "click", function(obj) {
			clearTips();
			toFloatClickFn(obj, node, cData);
			return utils.preventDefault(obj.evt);
		});
		//音视频处理区end------------------------------------------------------
		
		//魔法表情处理区 magic-------------------------------------------------------
		dEvent.add("feed_list_media_magic", "click", function(obj) {
			clearTips();
			if(obj.data.swf) {
				$.common.magic(obj.data.swf);
			} else {
				$.log("魔法表情的地址不存在: node上的action-data swf不存在!");
			}
			return utils.preventDefault(obj.evt);
		});
		//魔法表情处理区 magic end-------------------------------------------------------
		//投票处理区 vote-------------------------------------------------------
//		dEvent.add("feed_list_media_vote", "click", function(obj) {
//			clearTips();
//			voteClickFn(obj, node, cData);
//			return utils.preventDefault(obj.evt);
//		});
		//投票处理区 vote end-------------------------------------------------------
		//第三方应用 widget init-------------------------------------------------------
		dEvent.add("feed_list_media_widget", "click", function(obj) {
			var evt = $.fixEvent(obj.evt);
			var target = evt.target;
			var feedNode = utils.getFeedNode(target , node);
			var buildItems = $.kit.dom.parseDOM($.builder(feedNode).list);
			var publishItem = buildItems.feed_list_pulishMood;
			if(publishItem) {
				if(!$.isArray(publishItem)) {
					publishItem = [publishItem];
				}
				for (var i = 0, len = publishItem.length; i < len; i++) {
					var item = publishItem[i];
					if(target == item || $.core.dom.contains(item, target)) {
						return;	
					}					
				}
			}
			clearTips();
			widgetExpand(obj, node, cData);
			return utils.preventDefault(obj.evt);
		});
		//TODO:第三方feed改造使用，暂时copy出一份新代码，电商小子和活动的暂时使用线上的
		dEvent.add("feed_list_third_rend", "click", function(obj) {
			clearTips();
			thirdExpand(obj, node, cData);
			return utils.preventDefault(obj.evt);
		});
		//轻博客展开
		dEvent.add("feed_list_media_qing" , "click" , function(obj) {
			clearTips();
			qingExpand(obj, node, cData);
			return utils.preventDefault(obj.evt);
		});
		//投票处理区 vote end-------------------------------------------------------
		//普通的短链跳转添加统计参数，js统一添加统计参数跳转------------------------------
		dEvent.add("feed_list_url", "click", function(obj) {
			var el = obj.el;
			var mid = utils.getMid(el, node);
			window.open(el.href+'?u='+$CONFIG['oid']+'&m='+mid);
			return utils.preventDefault(obj.evt);
		});
		//投票收起更多信息
		dEvent.add('vote_toSmallInfo' , 'click' , function(obj) {
			var el = obj.el;
			var feedNode = utils.getFeedNode(el , node);
			var nodes = $.kit.dom.parseDOM($.builder(feedNode).list);
			nodes['vote_bigInfo'] && (nodes['vote_bigInfo'].style.display = 'none');
			nodes['vote_smallInfo'] && (nodes['vote_smallInfo'].style.display = '');
			return $.preventDefault(obj.evt);
		});
		//投票查看更多信息
		dEvent.add('vote_toBigInfo' , 'click' , function(obj) {
			var el = obj.el;
			var feedNode = utils.getFeedNode(el , node);
			var nodes = $.kit.dom.parseDOM($.builder(feedNode).list);
			nodes['vote_smallInfo'] && (nodes['vote_smallInfo'].style.display = 'none');
			nodes['vote_bigInfo'] && (nodes['vote_bigInfo'].style.display = '');
			return $.preventDefault(obj.evt);
		});
		//投票验证码处理
		dEvent.add("vote_refresh_code" , "click" , function(obj) {
			var el = obj.el;
			var src = el.src.replace(/ts=.+/ , '') + 'ts=' + $.getUniqueKey();
			el.src = src;
			return $.preventDefault(obj.evt);				
		});
		//普通的短链跳转添加统计参数，js统一添加统计参数跳转------------------------------
		that.destroy = function() {
			floatFix && floatFix.destroy();
			node = dEvent = undefined;
			$.common.feed.widget.destroy();
		};
		return that;
	};
});
