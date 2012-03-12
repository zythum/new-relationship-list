/**
 * 工具包
 */
$Import('kit.dom.parentAttr');
$Import('kit.dom.firstChild');
$Import('kit.dom.rotateImage');
$Import('common.trans.weiboDetail');
$Import("kit.extra.toFeedText");
$Import("kit.extra.parseURL");
$Import('kit.extra.language');
$Import('common.feed.widget');

STK.register("common.content.weiboDetail.utils", function($) {
	return function(){
	var $preventDefault = $.core.evt.preventDefault,
			lang = $.kit.extra.language,
			$firstChild = $.kit.dom.firstChild,
			$parentAttr = $.kit.dom.parentAttr,
			$getUniqueKey = $.core.util.getUniqueKey,
			$uniqueID = $.core.dom.uniqueID,
			sizzle = $.core.dom.sizzle,
			$next = $.core.dom.next,
			MEDIASCROLLTOP = 40,
			MEDIAWIDTH = 450,
			LOADERRTEXT = lang("#L{加载失败}!"),
			QINGERRTEXT = lang("#L{很抱歉，该内容无法显示，请稍后再试。}"),
			floatFix,
			floatClose,
			$fix = $.kit.dom.fix,
			$easyTemplate = $.core.util.easyTemplate,
			$feedTemps = $.common.feed.feedList.feedTemps,
			hasClassName = $.core.dom.hasClassName,
			addClassName = $.core.dom.addClassName,
			removeClassName = $.core.dom.removeClassName,
			getTrans = $.common.trans.weiboDetail.getTrans,
			$rotateRight = $.module.rotateImage,
			$toFeedText = $.kit.extra.toFeedText,
			$url = $.kit.extra.parseURL().url,
			loadingPIC = $CONFIG['imgPath'] + '/style/images/common/loading.gif',
			widget,
			TEMP = {
				mediaVideoMusicTEMP : lang('<#et temp data>' +
						'<#if (data.notForward)><dd class="expand"></#if>' +
						'<p class="W_no_border"><a href="${data.short_url}" title="${data.short_url}" class="show_big" target="_blank">${data.title}</a></p>' +
						'<div node-type="feed_list_media_big${data.type}Div" style="text-align:center;min-height:18px;"><img class="loading_gif" src="' + loadingPIC + '"/></div>' +
						'<#if (data.notForward)></dd></#if>' +
						'</#et>')
//				,mediaVoteTEMP: lang('<#et temp data>'+
//				'<#if (data.notForward)><dd class="expand"></#if>'+
//					'<p class="W_no_border"><#if (!data.notForward)><a href="javascript:void(0);" action-type="feed_list_media_toSmall" class="retract">#L{收起}</a></#if></p>'+
//					'<div note-type="feed_list_media_voteDiv" class="vote" style="text-align:center;"><img class="loading_gif" src="' + loadingPIC + '"/></div>'+
//				'<#if (data.notForward)></dd></#if>'+
//				'</#et>')
				,widgetTEMP: lang('<#et temp data>'+
				'<#if (data.notForward)><dd class="expand"></#if>'+
					'<p class="W_no_border"><#if (!data.notForward)><a href="javascript:void(0);" action-type="feed_list_media_toSmall" class="retract">#L{收起}</a><i class="W_vline">|</i></#if><a <#if (data.suda)>suda-data="${data.suda}"</#if> href="${data.full_url}" title="${data.full_url}" class="show_big" target="_blank">${data.title}</a></p>'+
					'<div node-type="feed_list_media_widgetDiv"><img class="loading_gif" src="' + loadingPIC + '"/></div>'+
				'<#if (data.notForward)></dd></#if>'+
				'</#et>')
				,qingTEMP : lang('<#et temp data>'+
				'<#if (data.notForward)><dd class="expand"></#if>'+
					'<p class="W_no_border"><#if (!data.notForward)><a href="javascript:void(0);" action-type="feed_list_media_toSmall" class="retract">#L{收起}</a><i class="W_vline">|</i></#if><a <#if (data.suda)>suda-data="${data.suda}"</#if> href="${data.full_url}" title="${data.full_url}" class="show_big" target="_blank">${data.title}</a></p>'+
					'<div node-type="feed_list_media_qingDiv"><img class="loading_gif" src="' + loadingPIC + '"/></div>'+
				'<#if (data.notForward)></dd></#if>'+
				'</#et>')
			};
	var util = {
		/**
		 * 获取mid
		 * @param {Object} el
		 * @param {Object} node
		 * @return {String} mid
		 */
		getMid : function(el, node) {
			return el.mid || (el.mid = $parentAttr(el, "mid", node));
		},

		/**
		 * 获取单条feed根节点
		 * @param {Object} el 当前dom节点
		 * @return {Object} el feed根节点
		 */
		getFeedNode : function(el) {
			while (el.tagName.toLowerCase() != 'dl') {
				el = el.parentNode;
			}
			return el;
		},
		/**
		 * 阻止事件冒泡
		 * @param {Object} e 事件对象
		 */
		preventDefault :  function(e) {
			$preventDefault(e);
			return false;
		},

		/**
		 *  切换标签
		 * @param {object}el
		 * @param {string}currentClass
		 * @param {string} setClass
		 * @return {boolean}
		 */
		tabSwitch : function(el, currentClass, setClass, nodes) {
			var container = el.parentNode, ret = false, classes = setClass.split(" "),currentTab;
			if(nodes){
				var at = el.getAttribute("action-type"), ad = el.getAttribute("action-data");
				var bhide = (at === "forword_tab_click" && (ad === "privatemsg" || ad === "microgroup"));
				nodes.feed_list.style.display = bhide ? "none" : "";
				nodes.feed_cate.style.display = bhide ? "none" : "";
			}
			if (!hasClassName(el, currentClass)) {
				currentTab = sizzle('.' + currentClass, container)[0];
				for (var i = 0; i < classes.length; i++) {
					removeClassName(currentTab, classes[i]);
				}
				addClassName(el, setClass);
				ret = true;
			}
			el.blur();
			return ret;
		},

		//获取多媒体外层容器
		getMediaPDNodes : function(feedNode, isForward) {
			return {
				prev: $.sizzle('[node-type=feed_list_media_prev]', feedNode)[0],
				disp: $.sizzle((isForward ? 'dd' : 'dl') + '[node-type="feed_list_media_disp"]', feedNode)[0]
			};
		},

		smallImgFun : function(obj) {
			var el = obj.el;
			var ret = util.preventDefault(obj.evt);
			if (el.loading) {
				return ret;
			}
			el.loading = 1;
			var bigImgSrc = el.src.replace("/thumbnail/", "/bmiddle/");
			var largeImgSrc = el.src.replace("/thumbnail/", "/large/");
			var feedNode = util.getFeedNode(el);
			var isForward = feedNode.getAttribute("isForward")?1:"";
			var cacheImg, loadingImg;
			if (!feedNode) {
				$.log('parents attribute mid node is undefined!');
				return ret;
			}
			feedNode.isForward = isForward;

			var pDNodes = util.getMediaPDNodes(feedNode, isForward);
			if (!pDNodes || !pDNodes.prev || !pDNodes.disp) {
				$.log('node-type="feed_list_media_prev" or node-type="feed_list_media_disp" in a feed\'s node is undefined!');
				return ret;
			}

			var loadEd = function() {
				el.loading = 0;
				if (cacheImg) {
					el.bigImgWidth = cacheImg.width;
					cacheImg.onload = null
				}
				loadingImg && (loadingImg.style.display = "none");
				pDNodes.prev.style.display = "none";
				pDNodes.disp.innerHTML = "";
				pDNodes.disp.appendChild($.builder($easyTemplate($feedTemps.mediaIMGTEMP, {
					notForward: !isForward,
					uniqueId: $getUniqueKey(),
					bigSrc: bigImgSrc,
					largeSrc: largeImgSrc,
					bigWidth: el.bigImgWidth > MEDIAWIDTH ? MEDIAWIDTH : el.bigImgWidth
				}).toString()).box);
				pDNodes.disp.style.display = "";
			};

			if (el.bigImgWidth) {
				loadEd();
			} else {
				var elW = el.offsetWidth;
				var topBottom = parseInt(el.offsetHeight / 2 - 8); 
				(loadingImg = $.core.dom.next(el)).style.cssText = "margin:" + topBottom + "px "+ parseInt(elW / 2 - 8) +"px " + topBottom + "px -" + parseInt(elW / 2 + 8) + "px;";
				loadingImg.style.display = "";
				(cacheImg = new Image()).onload = loadEd;
				cacheImg.src = bigImgSrc;
			}
			return ret;
		},

		bigImgFun : function(obj, node, force) {
			var el = obj.el;
			var ret = util.preventDefault(obj.evt);
			if (!force && !/(img)|(canvas)/.test(obj.evt.target.tagName.toLowerCase())) return ret;
			var feedNode = util.getFeedNode(el);
			if (!feedNode) {
				$.log('parents attribute mid is undefined!');
				return;
			}
			feedNode.disp = "";

			var pDNodes = util.getMediaPDNodes(feedNode, feedNode.isForward);
			if (!pDNodes.prev) {
				$.log("media: node-type=\"feed_list_media_prev\" is not be found in feed item");
				return;
			}
			if (!pDNodes.disp) {
				$.log("media: node-type=\"feed_list_media_disp\" is not be found in feed item");
				return;
			}

			if ($.position(pDNodes.disp).t < $.scrollPos().top) {
				feedNode.scrollIntoView();
			}

			pDNodes.prev.style.display = "";
			pDNodes.disp.style.display = "none";
			pDNodes.disp.innerHTML = "";
			//进行widget回收
			var mid = feedNode.getAttribute("mid");
			mid && $.common.feed.widget.clear(mid);
			return ret;
		},

		toFloatFun : function(obj, node, cData) {
			//清理上次的
			floatClose && $.fireEvent(floatClose, "click");

			var el = obj.el;
			var title = decodeURIComponent(obj.data.title);
			var mid = util.getMid(el, node);
			var dispContent = cData.dispContentNode[mid];
			var videoHTML = dispContent.mediaData;
			var _builder = $.builder($easyTemplate($feedTemps.mediaVideoMusicFloatTEMP, {
				title: decodeURIComponent(title)
			}).toString());
			var _outer = _builder.list["outer"][0],
					mediaContent = _builder.list["mediaContent"][0];
			floatClose = _builder.list["close"][0];
			document.body.appendChild(_outer);
			floatFix = $fix(_outer, "rb");
			if (videoHTML) {
				mediaContent.innerHTML = "";
				mediaContent.appendChild($.builder(videoHTML).box);
				floatFix.setFixed(true);
			} else {
				cData.dispContentNode[mid] = mediaContent;
			}
			$.addEvent(floatClose, "click", function() {
				$.removeEvent(floatClose, "click", arguments.callee);
				floatFix && floatFix.destroy();
				$.removeNode(_outer);
				floatFix = _builder = _outer = floatClose = null;
			});
			return util.bigImgFun(obj, node, true);
		},


		//新闻+ ---------------------------------
	//type 是否显示
	newsFeed : function(obj,type){
		var feed = obj.el;
		for(;!$.hasClassName(feed,'feed_list');feed=feed.parentNode);

		var newsPrv = $.sizzle('[node-type=feed_list_news]',feed)[0];
		newsPrv&&(newsPrv.style.display=type?'':'none');
	},
	//新闻- ---------------------------------
	smallVideoMusicClickFun : function(obj, node, type, cData) {
			try {
				var el = obj.el;

				var data = obj.data;
				var feedNode = util.getFeedNode(el);
				var isForward = feedNode.getAttribute("isForward")?1:"";
				var mid = util.getMid(el, node);
				var pDNodes = util.getMediaPDNodes(feedNode, isForward);
				if (!pDNodes.prev) {
					$.log("media: node-type=\"feed_list_media_prev\" is not be found in feed item");
					return;
				}
				//已经展开的媒体不能重复展开
				if (feedNode.disp == data.short_url) {
					return;
				}
				feedNode.disp = data.short_url;

				feedNode.isForward = isForward;
				pDNodes.prev.style.display = "none";
				var _t =decodeURIComponent(data.title);
				var _fTitle = $.bLength(_t) > 71 ? $.leftB(_t, 70) + "..." : _t;
				_t = $.bLength(_t) > 24 ? $.leftB(_t, 23) + "..." : _t;
				pDNodes.disp.innerHTML = "";
				pDNodes.disp.appendChild($.builder($easyTemplate(isForward ? $feedTemps.mediaVideoMusicTEMP : TEMP.mediaVideoMusicTEMP, {
					notForward: !isForward,//!isForward
					short_url: decodeURIComponent(data.short_url),
					full_url: decodeURIComponent(data.full_url),
					title: _t,
					fTitle: _fTitle,
					type: type
				}).toString()).box);

				if (!pDNodes.disp) {
					$.log("media: node-type=\"feed_list_media_disp\" is not be found in feed item");
					return;
				}
				pDNodes.disp.style.display = "";

				var dispContent = $.sizzle('div[node-type="feed_list_media_big' + type + 'Div"]', pDNodes.disp)[0];
				if (!dispContent) {
					$.log("media: note-type=\"feed_list_media_big" + type + "Div\" is not be found in feed_list_media_disp node!");
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
						dc.mediaData = json.result;
						dc.innerHTML = "";
						dc.appendChild($.builder(dc.mediaData).box);
						floatFix && floatFix.setFixed(true);
				};
				getTrans("mediaShow", {
					 onComplete : onSuccess
					,onFail     : onFail
				}).request({
					 'vers': 3
					,'lang': $CONFIG['lang']
					,'mid' : mid
					,'short_url': data.short_url.replace(/http\:\/\/(t|sinaurl)\.cn\//,'')
					,'template_name': template_name
					,'source': '3818214747'
				});
//				if (type === "video") {
					//动画到音视频位置
					$.scrollTo(pDNodes.disp, {
						step: 1
					});
//				}
			} catch(e) {
				$.log("video err : ", e.message);
			}

		},

		//旋转图片
		rotateImg : function(obj, rot) {
			var el = obj.el;
			var feedNode = util.getFeedNode(el);
			//这里是有问题的区域 做为优化的内容 :id的赋值，parentNode的赋值
			if (!el.parentNode.uid) {
				var _bigimg = $.sizzle('img[action-type="feed_list_media_bigimg"]', feedNode)[0];
				el.parentNode.uid = $uniqueID(_bigimg) + "_" + $getUniqueKey();
				_bigimg.setAttribute("id", el.parentNode.uid);
			}
			var rotateType = rot === "right" ? "rotateRight" : "rotateLeft";
			$rotateRight[rotateType](el.parentNode.uid, 90, function() {
			}, MEDIAWIDTH);
		},

		/**
		 * 获取转发所需数据
		 * return {Object} options
		 */
		getForwardOptions : function(node) {
			var _el = $firstChild(node);
			var feedNode = util.getFeedNode(_el);
			var mid = feedNode.getAttribute("mid");
			var contentNode = sizzle(">dl >dd", node)[0];
			var forwardContentNode = sizzle('[node-type="feed_list_forwardContent"]', feedNode)[0];
			var img = sizzle('[action-type="feed_list_media_img"]', node)[0] || sizzle('[action-type="feed_list_media_bigimg"]', node)[0];
			var imgId = img && img.src && img.src.replace(/^.*?\/([^\/]+).gif$/, "$1");
			contentNode = sizzle('em', contentNode)[0];
			var origin = $toFeedText(contentNode.innerHTML);
			var originNick = contentNode.getAttribute("nick-name");
			var reason = null;
			var forwardNick = null;
			if (forwardContentNode) {
				reason = origin;
				forwardNick = originNick;
				origin = $toFeedText(sizzle('>em', forwardContentNode)[0].innerHTML);
				originNick = $firstChild(forwardContentNode).getAttribute("nick-name");
			}
			return {
				mid : mid
				,appkey: ''
				,url : $url
				,originNick : originNick
				,reason : reason
				,origin : origin
				,forwardNick : forwardNick
				,pid : imgId
				,styleId : 2
			};
		}

		,getCount : function(str) {
			var count = str.match(/\(([\d]*)\)/);
			count = !count ? 0 : parseInt(count[1]);
			return count;
		},
		//qing博客处理事件区start
		qingExpand : function(obj, node, cData) {
			//加载qing博客需要的html
			var el = obj.el; 
			var mid = util.getMid(el, node); 
			var data = obj.data;
			var feedNode = util.getFeedNode(el, node);
			var isForward = feedNode.getAttribute("isForward")?"1":""; 
			var pDNodes = util.getMediaPDNodes(feedNode, isForward); 
			//已经展开的媒体不能重复展开
			if(feedNode.disp == data.short_url) {
				return;
			} 
			feedNode.isForward = isForward;
			//防止反复点击其他的影响preview区域的短链反复刷新feed去widget无法启动
			$.common.feed.widget.clear(mid);
			
			pDNodes.disp.innerHTML = '';
			//
			pDNodes.disp.appendChild($.builder($easyTemplate(TEMP.qingTEMP, {
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
			getTrans('qingShow' , {
				onComplete : success,
				onFail : error
			}).request({
				short_url : data.short_url,
				lang : window.$CONFIG && window.$CONFIG.lang || 'zh-cn',
				mid : mid,
				vers : 3,
				template_name : template_name
			});
			$.scrollTo(pDNodes.disp, {
				step: 1,
				top: MEDIASCROLLTOP
			});
		}
		//qing博客处理事件区end
		//投票处理事件区start-------------------------------------------------------------
//		,voteClickFn : function(obj, node, cData) {
//			//加载投票需要的html
//			var el = obj.el;
//			var data = obj.data;
//			var feedNode = util.getFeedNode(el);
//			var isForward = feedNode.getAttribute("isForward")?1:"";
//			var mid = util.getMid(el, node);
//			var pDNodes = util.getMediaPDNodes(feedNode, isForward);
//			if(!pDNodes || !pDNodes.prev || !pDNodes.disp) {
//				$.log('node-type="feed_list_media_prev" or node-type="feed_list_media_disp" in a feed\'s node is undefined!');
//				return;
//			}
//			//已经展开的媒体不能重复展开
//			if(feedNode.disp == data.short_url) {
//				return;
//			}
//			feedNode.disp = data.short_url;
//			feedNode.isForward = isForward;
//			pDNodes.prev.style.display = "none";
//
//			pDNodes.disp.innerHTML = "";
//			pDNodes.disp.appendChild($.builder($easyTemplate(TEMP.mediaVoteTEMP, {
//				notForward: !isForward,//!isForward
//				full_url: decodeURIComponent(data.full_url),
//				title: decodeURIComponent(data.title)
//			}).toString()).box);
//
//			pDNodes.disp.style.display = "";
//
//			var dispContent = sizzle('div[note-type="feed_list_media_voteDiv"]', pDNodes.disp)[0];
//			if(!dispContent) {
//				$.log('media: note-type="feed_list_media_voteDiv" is not be found in feed_list_media_disp node!');
//				return;
//			}
//			cData.dispContentNode[mid] = dispContent;
//			getTrans("voteShow", {
//				onSuccess: function(data) {
//					dispContent.style.textAlign = 'left';
//					//赋予html
//					dispContent.innerHTML = data.data.html;
//					//调用widget组件
//					$.common.feed.widget.add(mid , dispContent);
//					//最后再添加滚动效果
//					$.scrollTo(pDNodes.disp, {
//						step: 1,
//						top: MEDIASCROLLTOP
//					});
//					/*
//					if(!data || !(data = data.data)) return;
//					dispContent.innerHTML = "";
//					dispContent.style.textAlign = "";
//					dispContent.appendChild($.builder(data.html).box);
//					var scrollToFeed = function() {
//						$.scrollTo(pDNodes.disp, {
//							step: 1,
//							top: MEDIASCROLLTOP
//						});
//					};
//					scrollToFeed();
//					if(data.voted) {
//						cData.voteObj[mid] = $.common.vote.textVoteView(dispContent);
//					} else {
//						var textVote = cData.voteObj[mid] = $.common.vote.textVote(dispContent, {
//							'max':data.voteLimit,
//							'poll_id':data.voteId
//						});
//						$.custEvent.add(textVote, "success", scrollToFeed);
//						$.custEvent.add(textVote, "error", scrollToFeed);
//					}
//					*/
//				},
//				onFail: function() {
//					dispContent.innerHTML = LOADERRTEXT;
//				},
//				onError: function() {
//					dispContent.innerHTML = LOADERRTEXT;
//				}
//			}).request(data);
//
//		}
		//投票处理事件区end-------------------------------------------------------------
		
		//TODO:第三方改造feed展示-------------------------------------------------------------
		,thirdExpand : function(obj, node, cData){
			var el = obj.el; 
			var mid = util.getMid(el, node); 
			var data = obj.data;
			var feedNode = util.getFeedNode(el, node);
			var isForward = feedNode.getAttribute("isForward")?"1":""; 
			var pDNodes = util.getMediaPDNodes(feedNode, isForward); 
			//已经展开的媒体不能重复展开
			if(feedNode.disp == data.short_url) {
				return;
			}
			feedNode.disp = data.short_url;
			//
			feedNode.isForward = isForward;
			//防止反复点击其他的影响preview区域的短链反复刷新feed去widget无法启动
			$.common.feed.widget.clear(mid);
			
			pDNodes.disp.innerHTML = '';
			//
			pDNodes.disp.appendChild($.builder($easyTemplate(TEMP.widgetTEMP, {
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
			getTrans("third_rend", {
				onSuccess: function(data) {
					data = data.data;
					if(!data.html) return;
					dispContent.innerHTML = data.html;
					//
					$.scrollTo(pDNodes.disp, {
						step: 1
					});
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
		}
		//第三方改造feed展示-------------------------------------------------------------
		//widget-------------------------------------------------------------
		,widgetExpand : function(obj, node, cData){
			var el = obj.el; 
			var mid = util.getMid(el, node); 
			var data = obj.data;
			var feedNode = util.getFeedNode(el, node);
			var isForward = feedNode.getAttribute("isForward")?"1":""; 
			var pDNodes = util.getMediaPDNodes(feedNode, isForward); 
			//已经展开的媒体不能重复展开
			if(feedNode.disp == data.short_url) {
				return;
			} 
			feedNode.disp = data.short_url;
			feedNode.isForward = isForward;
			//防止反复点击其他的影响preview区域的短链反复刷新feed去widget无法启动
			$.common.feed.widget.clear(mid);
			
			pDNodes.disp.innerHTML = '';
			//
			pDNodes.disp.appendChild($.builder($easyTemplate(TEMP.widgetTEMP, {
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
			getTrans("widget", {
				onSuccess: function(data) {
					data = data.data;
					if(!data.html) return;
					dispContent.innerHTML = data.html;
					//
					$.scrollTo(pDNodes.disp, {
						step: 1
					});
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
		}
		//widget-------------------------------------------------------------
	};
	return util;
	};
});
