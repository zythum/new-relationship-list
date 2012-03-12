/**
 * 微博单条页
 * @id comp.content.weiboDetail
 * @author zhaobo | zhaobo@staff.sina.com.cn
 * @history
 * L.Ming @ 2011.05.05 转发联调
 */

$Import('ui.confirm');
$Import('ui.dialog');
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('ui.tipConfirm');
$Import("common.comment.commentSingle");
$Import("common.trans.comment");
$Import("common.comment.comment");
$Import("common.channel.feed");
$Import("common.content.report");
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('common.dialog.forward');
$Import('common.forward.layer');
$Import('common.trans.weiboDetail');
$Import('common.comment.reply');
$Import('common.favorite.favorite');
$Import('common.feed.feedList.feedTemps');
$Import('common.content.weiboDetail.utils');
$Import('kit.dom.rotateImage');
$Import('kit.dom.firstChild');
$Import('kit.dom.parentAttr');
$Import("kit.extra.parseURL");
$Import("kit.extra.toFeedText");
$Import('kit.extra.language');
$Import('kit.extra.setPlainHash');
$Import('module.rotateImage');
$Import('common.map');
$Import('common.trans.map');
$Import('common.feed.widget');
$Import('common.dialog.addTag');
$Import('common.dialog.commentDialogue');
$Import('common.trans.mood');
$Import('common.depand.mood');
$Import('kit.extra.codec');
$Import('common.dialog.collect');
$Import('common.layer.ioError');

STK.register('comp.content.weiboDetail', function($) {

	return function(node, opts) {
		var that = {};

		//---变量定义区----------------------------------
		var nodes,
				pageQuery,
			//计数器
				counter,
			//事件代理对象
				dEvt,
			//评论组件
				comment,
			//评论会话层
				commentDialogue,
			//删除微博提示对话框
				confirmTip,
			//转发对象
				forwardEditor,
				forwardDiv,
				forwardDialog,
			//收藏实例
				favorite,
			//收藏按钮
				favoriteBtn,
			//收藏状态
				favoriteStatus = true,
			//收藏锁
				favLock = false,
			//多媒体对象，图片，视频，音乐等
				media,
				showForwardCallBackFn = null,
				mapObj,
				mapShowed,
				mapEl,
				cData = {
					dispContentNode : {}
				},
				forwardNode,
				page,
				mid,
				MYPROFILEURL = "/",
				lang = $.kit.extra.language,
				replys = [],
				isComment = true,
				sizzle = $.core.dom.sizzle,
				getStyle = $.core.dom.getStyle,
				setStyle = $.core.dom.setStyle,
				Reply = $.common.comment.reply,
				$toFeedText = $.kit.extra.toFeedText,
				trans = $.common.trans.weiboDetail,
				hookKey,
				getTrans = $.common.trans.weiboDetail.getTrans,addTagDialog,
				setHash = $.kit.extra.setPlainHash,
				encodeDecode = $.kit.extra.codec;
		var isFilter = false;
		var allHtml = null;
		//语言包
		var msg = {
			'commentCounter' : lang('#L{评论$commentCounter$}')
			,'forwardCounter' : lang('#L{转发$forwardCounter$}')
			,'notice' : lang('#L{请输入转发理由}')
			,'forwardSucc' : lang('#L{转发成功!}')
			,'forwardText' : lang('#L{转发}')
			,'favorite' : lang('#L{收藏}')
			,'favoriteCancel' : lang('#L{取消收藏}')
			,'noComment' : lang('#L{还没有人评论，赶快抢个沙发}')
			,'noForwward' : lang('#L{还没有人转发，赶快抢个沙发}')
			,'notAllowForwward' : lang('#L{还没有人转发，赶快抢个沙发}')
			,'notAllowComment' : lang('#L{还没有人转发，赶快抢个沙发}')
			,'delete'  : lang('#L{确定要删除该回复吗}')
			,'blcok'   : lang('#L{同时将此用户加入黑名单}')
		};
		/**
		 * 心情微博使用require绑定
		 */
		var requireMood = $.common.depand.mood;
		//心情微博使用
		var mood = {
			//发心情微博使用弹层
			locked : 0,
			moodDialog : null,
			//显示详细心情列表使用
			detailLocked : 0,
			detailDialog : null,
			//抢心情使用
			shareLocked : 0,
			shareDialog: null,
			//是否正在获取当日心情状态
			sendStateRequest : 0
		};
		//发心情弹层require绑定
		var asynShowMood = requireMood.bind('asyn_smallPublish', function(mid, opts) {
			mood.locked = false;
			if (!mood.moodDialog) {
				mood.moodDialog = $.common.dialog.moodSmallPublish();
				$.custEvent.add(mood.moodDialog, "success", function(evt, data) {
					
				});
			} else {
				mood.moodDialog.reset();	
			}
			mood.moodDialog.show();
		}, {'onTimeout': function() {
			mood.locked = false;
		}});
		//显示大家的心情弹层
		var asynShowDetail = requireMood.bind('asyn_detail', function(mid, opts) {
			mood.detailLocked = false;
			mood.detailDialog = $.common.dialog.moodList({
				trans : $.common.trans.mood,
				transName : "myfilter"					
			});
			mood.detailDialog.show();
		}, {'onTimeout': function() {
			mood.detailLocked = false;
		}});
		//显示抢心情弹层
		var asynShowShare = requireMood.bind('asyn_share', function(obj) {
			mood.shareLocked = false;
			//需要mid,因为可能是转发的，从服务器取得
			var mid = obj.data.mid;
			//昵称，用来显示弹层，从服务器取得
			var nickName = obj.data.nickName;
			//title,弹层的title
			var title = nickName + lang("#L{的心情}");
			//根据产品需求，这里需要截字（10个汉字+"..."）
			if($.bLength(title) > 20) {
				title = encodeDecode.decode(title);
				title = encodeDecode.encode($.leftB(title , 20)) + "...";
			}
			//得到根feed，用来获取心情内容
			var feedNode = util.getFeedNode(obj.el , node);
			var tmpNodes = $.kit.dom.parseDOM($.builder(feedNode).list);
			//心情html
			var content = tmpNodes.mood_content.value;
			//心情图标
			var mood_url = decodeURIComponent(obj.data.mood_url);
			//心情title
			var mood_title = obj.data.title || '';
			mood.shareDialog = $.common.dialog.moodComment({'mid':mid,'title':title,'nickName':nickName,'content':content , mood_url : mood_url , mood_title : mood_title});
			$.custEvent.add(mood.moodDialog, "success", function(evt, data) {
				
			});
			mood.shareDialog.show();
		}, {'onTimeout': function() {
			mood.shareLocked = false;
		}});
		// 当前是否支持 bigPipe
		var isBigPipe = ($CONFIG != null && $CONFIG.bigpipe != null && ($CONFIG.bigpipe === 'true' || $CONFIG.bigpipe === true));

		//----------------------------------------------
		//公用部分
		//显示转发模块
		var showForward = function() {
//			if (!forwardEditor) {
			//实例化
			forwardTo();
//			}
			//show forwardEditor
		};

		function parseForwardActData(inData) {
			var data = $.core.json.queryToJson(nodes.weibo_info.getAttribute("action-data"));
			for (var id in data) {
				inData[id] = decodeURIComponent(data[id]);
			}
			return inData;
		}

		// 转发功能
		function forwardTo(tabName) {
			var needInit = !tabName;
			if (!tabName) {
				var microNode = sizzle("a", nodes.forward_tab)[0];
				if (microNode) {
					util.tabSwitch(microNode, "W_textb", "W_textb");
				}
			}
			tabName = tabName || "microblog";
			var types = {
				'microblog' : 1,
				'privatemsg' : 2,
				'microgroup' : 3
//				,'mail' : 4
			};
			var data = parseForwardActData(util.getForwardOptions(nodes.weibo_info));
			if (needInit) {
				$.custEvent.remove(forwardDiv);
				forwardDiv.destroy && forwardDiv.destroy();
				forwardDiv = null;
				delete forwardDiv;
				forwardDiv = $.common.forward.layer({
					styleId : "2"
				});
			}
			forwardDiv.init(nodes.forward, data);
			forwardDiv.show(types[tabName]);
			if (showForwardCallBackFn) {
				showForwardCallBackFn(function() {
					forwardDiv.shine();
				});
			}
		}


		var util = $.common.content.weiboDetail.utils();
		/**
		 * 列表中删除相关操作
		 */
		var feedListDelete = {

			DERRORTEXT : "#L{删除失败}!",
			tipOnMid: "",
			msgTip : null,
			confirmTip : null,

			/**
			 * 删除信息提示
			 * @param {String} msg
			 * @param {Object} el
			 */
			deleteMsg : function(msg, el) {
				var _this = this;
				var msgTip = _this.msgTip;
				msgTip = $.ui.tipAlert({
					showCallback: function() {
						setTimeout(function() {
							msgTip.anihide();
						}, 600);
					},
					hideCallback: function() {
						_this.tipOnMid = undefined;
						msgTip.destroy();
						msgTip = null;
					},
					msg: msg,
					type: "error"
				});
				msgTip.setLayerXY(el);
				msgTip.aniShow();
			},
			/**
			 * 返回选择对话框
			 * return {Object} $.ui.tipConfirm
			 */
			getConfirmTip : function() {
				var _this = this;
				var tipMsg = lang(_this.delType ? '#L{确定要删除该回复吗？}' : '#L{确认要删除这条微博吗？}');
				return $.ui.tipConfirm({
					info: tipMsg,
					okCallback: function() {
						_this.okCallback();
					},
					hideCallback: function() {
						_this.tipOnMid = undefined;
					}
				});
			},
			/**
			 * 动画删除feed
			 * @param {Number} mid
			 * @param {Object} el
			 */
			deleteFeed : function(el) {
				var feedNode = util.getFeedNode(el),
						_oldH = feedNode.offsetHeight;
				feedNode.style.height = _oldH + "px";
				feedNode.innerHTML = "";
				//动画
//				$.log("DELETE");
				/*$.tween(feedNode, "height", "0px", 0.5, 'easeOutQuad', {
				 end: function() {
				 $.removeNode(feedNode);
				 node = el = feedNode = null;
				 }
				 });*/
				$.tween(feedNode, {
					end: function() {
						$.removeNode(feedNode);
						bindCustEvtFuns.makeCounter(undefined, isComment, true);
						node = el = feedNode = null;
						if ($.sizzle(">dl", nodes.feed_list) == 0) {
							//nodes.feed_list.innerHTML = isComment ? msg.noComment : msg.noForwward;
							window.location.reload();
							//bindDOMFuns.getList();
						}
					}
				}).play({'height':0});
			},

			/**
			 * 删除按钮点击事件函数
			 * @param {Object} obj 事件对象
			 */
			deleteClickFunc : function(obj) {
				var _this = this;
				var _el = obj.el;
//				var _mid = util.getMid(_el, node);
				if (_this.tipOnMid == obj.data) {
					return;
				}
				_this.tipOnMid = obj.data;
				var type = isComment ? "delete" : "delmblog";
				_this.delType = type;
				if (isComment) {
					$.log(obj.data['block'])
					var block = obj.data['block'] == "1" ? ['<input node-type="block_user" id="block_user" name="block_user" value="1" type="checkbox"/><label for="block_user">',msg['blcok'],'</label>'].join('') : '';
					var cfm = $.ui.confirm(msg['delete'], {
						'OK' : function(_dia) {
							var isBlock = _dia['block_user'];
							var data, cid;
							if ((data = obj.data) && (cid = data.cid)) {
								getTrans(type, {
									onSuccess: function() {
										_this.deleteFeed(_el);
									},
									onFail: function(ret) {
										_this.deleteMsg(_this.DERRORTEXT, _el);
									},
									onError: function(data) {
										if(data.code == "100003") {
											$.common.layer.ioError(data.code , data);
											return;	
										}
										_this.deleteMsg(data.msg, _el);
									}
								}).request({
											   'act' : 'delete',
											   'cid' : cid,
											   'is_block': isBlock ? '1' : '0'
										   });
							}

						},
						'textComplex': block
					})
				} else {
					_this.okCallback = function() {
						getTrans(type, {
							onSuccess: function() {
								_this.deleteFeed(_el);
							},
							onFail: function() {
								_this.deleteMsg(_this.DERRORTEXT, _el);
							},
							onError: function(data) {
								_this.deleteMsg(data.msg, _el);
							}
						}).request(obj.data);
					};

					_this.confirmTip = _this.confirmTip || _this.getConfirmTip();
					_this.confirmTip.setLayerXY(_el);
					_this.confirmTip.aniShow();
				}
				return util.preventDefault(obj.evt);
			},

			/**
			 * 销毁
			 */
			destroy : function() {
				this.msgTip && this.msgTip.destroy();
				this.confirmTip && this.confirmTip.destroy();
				this.confirmTip = this.msgTip = this.okCallback = null;
			}

		};
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			closePrivateTip : function(obj) {
				var isLink = obj.data && obj.data.type;
				nodes.feed_privateset_tip && $.setStyle(nodes.feed_privateset_tip, 'display', 'none');
				$.common.trans.comment.getTrans('privateNoMore', {
					onSuccess : function() {
						isLink && (window.location.href = obj.el.getAttribute("href"));
					},
					onError:$.funcEmpty
				}).request({
							   bubbletype : 7,
							   time : 7 * 86400
						   });
				return	 util.preventDefault(obj.evt);
			},
			/**
			 * 列表中删除按钮事件
			 * @param {Object} obj
			 */
			feedListDelete : function(obj) {
				return feedListDelete.deleteClickFunc(obj);
			},

			/**
			 * 收藏按钮点击事件函数
			 * @param {Object} obj
			 */
			favorite : function(obj) {
				if (favLock) return;
				var _el = obj.el;
				if (!favorite) {
					favorite = $.common.favorite.favorite({
						mid : util.getMid(_el, nodes.weibo_info)
						,node : _el
					});

					favoriteBtn = _el;
					favoriteStatus = obj.data.status === "1";

					//收藏添加（取消）成功回调函数
					$.custEvent.add(favorite, "success", bindCustEvtFuns.favorite);
					$.custEvent.add(favorite, "cancel", function() {
						favLock = false;
					});

					//收藏添加（取消）失败回调函数
					$.custEvent.add(favorite, "fail", function() {
						favLock = false;
					});

					//收藏添加（取消）出错回调函数
					$.custEvent.add(favorite, "error", function() {
						favLock = false;
					});

				}
				var type = favoriteStatus ? "add" : "del";
				favLock = true;
				favorite[type]();
				return util.preventDefault(obj.evt);
			},

			/**
			 * 举报按钮点击事件函数
			 * @param {Object} obj
			 */
			report : function(obj) {
				return $.common.content.report(obj);
			},

			searchType : function(obj) {
				isFilter = obj.el.getAttribute && obj.el.getAttribute("node-type") == "feed_list_commentTabAll" ? false : true;
				if (!allHtml && nodes.feed_list && !isFilter) {
					allHtml = nodes.feed_list.innerHTML;
				}
				var isSwitch = util.tabSwitch(obj.el, "current", "current W_texta");
				if (!isSwitch) return util.preventDefault(obj.evt);
				return bindDOMFuns.getList(obj);
			},
			/**
			 * 获取列表内容
			 * @param {Object} obj
			 */
			getList : function(obj) {
				var _reqType = isComment ? "feedlist" : "forward";
				var req = getTrans(_reqType, bindCustEvtFuns.getList);
				var el = obj.el, feedCate = nodes.feed_cate;
				hookKey = trans.hookComplete(_reqType, function() {
					el.getAttribute("action-type") === "feed_list_page" && feedCate.parentNode.scrollIntoView();
					trans.removeHook(_reqType, hookKey);
				});
				setHash((+new Date()).toString());
				req.request(obj.data);
				return util.preventDefault(obj.evt);
			},
			/**
			 * 列表中转发按钮事件
			 * @param {Object} obj 事件对象
			 */
			feedListForward : function(obj) {
				forwardNode = obj.el;
				var _el = forwardNode;
				if (obj.data['allowForward'] == "0") {
					$.ui.alert(msg["notAllowForwward"]);
					return util.preventDefault(obj.evt);
				}
				var feedNode = util.getFeedNode(_el);

				var forwardOpts = util.getForwardOptions(nodes.weibo_info);
				forwardOpts.reason = $toFeedText(sizzle(">dd >em", feedNode)[0].innerHTML) + (forwardOpts.forwardNick == null ? "" : "//@" + forwardOpts.forwardNick) + (forwardOpts.reason == null ? "" : forwardOpts.reason);
				forwardOpts.forwardNick = sizzle(">dd >a", feedNode)[0].getAttribute("nick-name");
				var _mid = feedNode.getAttribute("mid");
				forwardOpts.mid = _mid;
				var data = obj.data;
				for (var key in data) {
					forwardOpts[key] = data[key];
				}
				forwardDialog.show(_mid, forwardOpts);

				return util.preventDefault(obj.evt);
			},
			/**
			 * 转发标签切换
			 * @param {Object} obj 事件对象
			 */
			forwardTabClick : function(obj) {
				util.tabSwitch(obj.el, "W_textb", "W_textb", nodes);
				// 切换到不同的 tab
				var type = obj.el.getAttribute("action-data") || "";
				forwardTo(type);
				return util.preventDefault(obj.evt);
			},

			/**
			 * 小图片点击事件
			 * @param {Object} obj 事件对象
			 */
			smallimgClickFun : function(obj) {
				return util.smallImgFun(obj);
			},


			/**
			 * 大图片点击事件
			 * @param {Object} obj 事件对象
			 */
			bigimgClickFun : function(obj, node, force) {
				return util.bigImgFun(obj, node, force);
			},



			/**
			 * 收起图片按钮事件
			 * @param {Object} obj 事件对象
			 */
			toSmallClickFun : function(obj) {
				util.newsFeed(obj, true);
				return bindDOMFuns.bigimgClickFun(obj, null, true);
			},

			/**
			 * 旋转图片函数(向左)
			 * @param {Object} obj 事件对象
			 */
			rotateImageLeft : function(obj) {
				util.rotateImg(obj, "left");
				return util.preventDefault(obj.evt);
			},
			/**
			 * 旋转图片函数(向右)
			 * @param {Object} obj 事件对象
			 */
			rotateImageRight : function(obj) {
				util.rotateImg(obj, "right");
				return util.preventDefault(obj.evt);
			},



			smallVideoClickFun : function(obj) {
				util.newsFeed(obj, false);
				util.smallVideoMusicClickFun(obj, node, "video", cData);
				return util.preventDefault(obj.evt);
			},

			smallMusicClickFun : function(obj) {
				util.newsFeed(obj, false);
				util.smallVideoMusicClickFun(obj, node, "music", cData);
				return util.preventDefault(obj.evt);
			},

			toFloatClickFun : function(obj) {
				return util.toFloatFun(obj, nodes.weibo_info, cData);
			},

			magicClickFun : function(obj) {
				if (obj.data.swf) {
					$.common.magic(obj.data.swf);
				} else {
					$.log("魔法表情的地址不存在: node上的action-data swf不存在!");
				}
				return util.preventDefault(obj.evt);
			},
			/**
			 * 评论/转发 标签切换事件
			 * @param obj
			 */
			tabClick : function(obj) {
				var type = obj.data.type, el = obj.el, curr;

				util.tabSwitch(el, "current", "current W_texta", nodes);
				util.tabSwitch(sizzle("a", nodes.feed_cate)[0], "current", "current W_texta");
				isComment = (type === "comment");
				if (isComment) {
					nodes.forward_tab.style.display = "none";
					nodes.comment.style.display = "";
					nodes.forward.style.display = "none";
					if(nodes.forwardTip) {
						nodes.forwardTip.style.display ="none";
					}
					if(nodes.commentTip)
					{
						nodes.commentTip.style.display ="";
					}
					if(nodes.feed_list_commentTabAuth)
					{
						  nodes.feed_list_commentTabAuth.style.display = "";
					}
					if(nodes.feed_list_commentTabAuthline)
					{
						  nodes.feed_list_commentTabAuthline.style.display = "";
					}
					getTrans("feedlist", bindCustEvtFuns.getList).request({id : mid});
					// Li Ming 修复转发层预览图切换到评论仍然不消失的BUG
					if (forwardDiv) {
						forwardDiv.destory();
					}
				} else {
					nodes.forward_tab.style.display = "";
					 if(nodes.commentTip)
					 {
						 nodes.commentTip.style.display ="none";
					 }
					 if(nodes.forwardTip)
					 {
						 nodes.forwardTip.style.display ="";
					 }
					if(nodes.feed_list_commentTabAuth)
					{
						  nodes.feed_list_commentTabAuth.style.display = "none";
					}
					if(nodes.feed_list_commentTabAuthline)
					{
						  nodes.feed_list_commentTabAuthline.style.display = "none";
					}
					getTrans("forward", bindCustEvtFuns.getForwardList).request({id : mid});
					nodes.comment.style.display = "none";
					nodes.forward.style.display = "";
					showForward();
				}

				return util.preventDefault(obj.evt);
			},
			/**
			 * 回复按钮事件函数
			 * @param {Object} opts 事件对象参数
			 */
			showReply : function(opts) {
				var el = opts.el,node,status,ins;

				while (el.tagName.toLowerCase() != 'dl') {
					el = el.parentNode;
				}
				node = $.sizzle('[node-type="commentwrap"]', el)[0];

				var reply = opts.el;
				status = reply.getAttribute('status');
				if (getStyle(node, 'display') != 'none' && status == 'true') {
					reply.setAttribute('status', 'false');
					setStyle(node, 'display', 'none');
				} else {
					reply.setAttribute('status', 'true');
					setStyle(node, 'display', '');
					if (ins) {
						ins.focus();
					}
				}
				if (!status) {
					ins = Reply(node, opts.data);
					bindListenerFuns.replyFuns.add(ins);
				}

				return util.preventDefault(opts.evt);
			}

			, delComment : function() {

			},
			/**
			 *  投票展示
			 * @param obj
			 */
//			voteClickFn : function(obj) {
//				try {
//					util.voteClickFn(obj, nodes.weibo_info, cData);
//					return util.preventDefault(obj.evt);
//				} catch(e) {
//					return false;
//				}
//
//			},
			//qing微博解析
			qingClickFn : function(obj) {
				try {
					util.qingExpand(obj, nodes.weibo_info, cData);
					return util.preventDefault(obj.evt);
				}catch(e) {
					return false;	
				}
			},
			widgetExpand : function(obj) {
				var evt = $.fixEvent(obj.evt);
				var target = evt.target;
				var feedNode = util.getFeedNode(target , node);
				var buildItems = $.kit.dom.parseDOM($.builder(feedNode).list);
				var publishItem = buildItems.feed_list_pulishMood;
				if(publishItem) {
					if(!$.isArray(publishItem)) {
						publishItem = [publishItem];
					}
					for(var i = 0 , len = publishItem.length ; i < len ; i++) {
						var item = publishItem[i];
						if(target == item || $.core.dom.contains(item, target)) {
							return;	
						}														
					}
				}
				util.widgetExpand(obj, nodes.weibo_info, cData);
				return util.preventDefault(obj.evt);
			},
			thirdExpand : function(obj) {
				util.thirdExpand(obj, nodes.weibo_info, cData);
				return util.preventDefault(obj.evt);
			}
			,showGeo : function(obj) {
				var el = obj.el;
				var elData = obj.data;
				var elGeo = elData.geo;
				if (!elGeo) {
					$.log("map: feed_list_geo_info node geo is empty");
					return;
				}
				var onFail = function(json) {

				};
				var onSuccess = function(json) {
					if (typeof json == 'object' && json.code == 1) {
						var internal = json.data.geo.type;
						var geo = elGeo.split(",");
						if (!mapObj) {
							mapObj = $.common.map();
						}
						mapEl != el && mapObj && mapObj.refresh();
						mapObj.show(el, {
							"latitude" : geo[1],
							"longitude": geo[0],
							"head": elData["head"],
							"addr": elData["title"],
							"internal": internal
						});
						mapEl = el;
						return;
					}
					onFail();
				};

				$.common.trans.map.getTrans("getInternalInfo", {
					onComplete : onSuccess
					,onFail	 : onFail
				}).request({
							   'coordinates': elGeo + ',geo'
							   ,'source': '4526198296'
						   });//, template_name
				return util.preventDefault(obj.evt);
			}
			,docClickFn : function(event) {
				if (!mapObj || !mapShowed) return;
				event = $.fixEvent(event);
				if (!$.contains(mapObj.getDom("outer"), event.target)) {
					mapObj.hide();
				}
			},
			//心情微博抢心情
			shareMood : function(obj) {
				if (mood.shareLocked) return;
				mood.shareLocked = true;
				asynShowShare(obj);	
				util.preventDefault(obj.evt);
			},
			//心情微博发心情
			publishMood : function(obj) {
				util.preventDefault(obj.evt);
				if(mood.sendStateRequest) {
					return;										
				}
				mood.sendStateRequest = 1;
				//首先获取一下用户当天是否发过心情，published为1代表已经发过微博，为0代表没有发过微博
				//如果用户当天发过心情了，则弹出大家的心情层,如果用户当天没有发过心情，则弹出发心情层
				$.common.trans.mood.getTrans('getpublishstate' , {
					onSuccess : function(ret , data) {
						mood.sendStateRequest = 0;
						var publishd = parseInt(ret.data.published || '0');
						if(publishd) {
							if (mood.detailLocked) return;
							mood.detailLocked = 1;
							asynShowDetail();			
						} else {
							if (mood.locked) return;
							mood.locked = 1;
							asynShowMood();						
						}
					},
					onError : function() {
						mood.sendStateRequest = 0;
					},
					onFail : function() {
						mood.sendStateRequest = 0;
					}
				}).request();
			},
			//采集
			collect: function(spec){
				var el = spec.el;
				$.common.dialog.collect({
					mid:spec.data.mid,
					collected: el.getAttribute('collected') == '1',
					showRecord: true,
					success: function(data) {
						//el.innerHTML = lang('#L{采集}');
						el.setAttribute('collected', '1');
						el.setAttribute('title', data.msg);
					}
				});
				return $.preventDefault(spec.evt);
			},
			//评论对话弹层显示
			showCommentDialogue : function(spec){
				commentDialogue.show(spec);
			}
		};
		//-------------------------------------------

		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			//添加（取消）收藏成功
			favorite : function() {

				favLock = false;

				favoriteStatus = !favoriteStatus;

				favoriteBtn.innerHTML = favoriteStatus ? msg['favorite'] : msg['favoriteCancel'];
			},
			//获取列表信息
			getList : {
				onSuccess : function(rs, parm) {
					//$.log("succ:", nodes.feed_list, rs.data);
					nodes.feed_list.innerHTML = rs.data.html;
					if (!isFilter) allHtml = rs.data.html;
				},
				onError : function(rs, parm) {
					$.log("err:", rs, parm);
					nodes.feed_list.innerHTML = msg.noComment;
				},
				onFail : function(rs, parm) {
					$.log("fail:", rs, parm);
					nodes.feed_list.innerHTML = msg.noComment;
				}
			},
			//获取转发列表信息
			getForwardList : {
				onSuccess : function(rs, parm) {
					//$.log("succ:", nodes.feed_list, rs.data);
					nodes.feed_list.innerHTML = rs.data.html;

				},
				onError : function(rs, parm) {
					$.log("err:", rs, parm);
					nodes.feed_list.innerHTML = msg.noForwward;
				},
				onFail : function(rs, parm) {
					$.log("fail:", rs, parm);
					nodes.feed_list.innerHTML = msg.noForwward;
				}
			},
			/**
			 * 转发层转发成功回调函数
			 * @param {Object} evt
			 * @param {Object} data
			 */
			forwardDialogSucc : function(evt, data) {
				forwardNode = undefined;
				if (!forwardNode || !data.isToMiniBlog) return;
				var count = util.getCount(forwardNode.innerHTML);
				forwardNode.innerHTML = msg['forwardText'] + "(" + (count + 1) + ")";
				//bindCustEvtFuns.makeForwardData(data);
				return false;
			},
			/**
			 * 转发层关闭事件回调函数
			 */
			forwardDialogHide : function() {
				forwardNode = undefined;
			},
			/**
			 * 当前微博转发成功事件回调函数
			 */
			forwardSucc : function() {
			},
			replySuccessSwritten : function(obj, parm){
				//bindCustEvtFuns.commentSucc(null, parm.data.comment);
				bindCustEvtFuns.makeCommentCounter(obj);
				if (parm.forward) {
					bindCustEvtFuns.makeForwardCounter();
				}
				//实现假写,只切换标签到全部，把缓存的allHtml塞到feed_list里面，然后把假写的新的一条添到最上面
				var tabAlldom = nodes.feed_list_commentTabAll;
				if(!$.hasClassName(tabAlldom , "current")) {
					util.tabSwitch(tabAlldom, "current", "current W_texta");
					nodes.feed_list.innerHTML = allHtml;
				}
				if(parm && parm.data && parm.data.comment) {
					$.insertHTML(nodes.feed_list , parm.data.comment , "afterbegin");
					allHtml = nodes.feed_list.innerHTML;
					return true;
				}
				return false;
			},
			/**
			 * 回复事件函数
			 */
			reply : function(obj, parm) {
				if(bindCustEvtFuns.replySuccessSwritten(obj, parm)){
					var $first = $.kit.dom.firstChild(nodes.feed_list);
					var pos = $.position($first);
					var scrollPos = $.core.util.scrollPos();
					if(pos.t < scrollPos.top) {
						window.scrollTo(0 , pos.t - 50);
						//$first.scrollIntoView(true);	
					}
				}
			}
			/**
			 * 删除当前微博
			 * @param obj
			 */
			,deleteWeibo : function(obj) {
				confirmTip = confirmTip || $.ui.tipConfirm({
					okCallback : function() {
						getTrans("deleteWeibo", bindCustEvtFuns.deleteFunc).request({mid:util.getMid(obj.el, nodes.weibo_info)});
					}
				});
				var _el = obj.el;
				confirmTip.setLayerXY(_el);
				confirmTip.aniShow();
				return util.preventDefault(obj.evt);
			}

			/**
			 * 删除当前微博回调函数
			 */
			,deleteFunc : {
				onSuccess : function(rs, parm) {
					window.location.href = MYPROFILEURL;
				},
				onError : function(rs, parm) {
					$.common.layer.ioError(rs.code , rs);
				},
				onFail : function(rs, parm) {
					$.log("fail:", rs, parm);
				}
			}


			,makeForwardData : function(data, updata, isDialog) {

				if (data.isComment) bindCustEvtFuns.makeCommentCounter(data);
				var html = data.html;
				if (isDialog) return;
				//if(parseInt(nodes.weibo_info.getAttribute("isForward")) ==1) return;
				if (html && !isComment && data.isToMiniBlog) {

					if (sizzle('>dl', nodes.feed_list).length == 0) {
						nodes.feed_list.innerHTML = html;
					} else {
						$.insertHTML(nodes.feed_list, html, "AfterBegin")
					}
					bindCustEvtFuns.makeCounter();
				}
			}
			,makeForwardCounter : function(obj) {
				bindCustEvtFuns.makeCounter();
			}
			/**
			 * 设置计数器
			 * @param {Number}count
			 */
			,makeCommentCounter : function(obj, count) {
				/*var _comment = counter.commentCounter;

				 for (var i = 0; i < _comment.length; i++) {
				 var ct = _comment[i];
				 if(count == true){
				 count = util.getCount(ct.innerHTML) + 1;
				 }
				 ct.innerHTML = msg.commentCounter.replace("$commentCounter$", count ? "("+count+")" : "");//"评论(" + count + ")";
				 }*/
				bindCustEvtFuns.makeCounter(count, 1);
			}
			/**
			 * 设置计数器
			 * @param {Number}count
			 */
			,makeCounter : function(count, type, minus) {
				type = type ? "commentCounter" : "forwardCounter";
				var _counter = counter[type];

				for (var i = 0; i < _counter.length; i++) {
					var ct = _counter[i];
					if (typeof count === "undefined") {
						count = util.getCount(ct.innerHTML) + (minus ? 0 - 1 : 1);
					}
					ct.innerHTML = msg[type].replace("$" + type + "$", count ? "(" + count + ")" : "");//"评论(" + count + ")";
				}
			},
			gotoAll  : function(ct) {
				var tabAlldom = nodes.feed_list_commentTabAll;
				util.tabSwitch(tabAlldom, "current", "current W_texta");
				var count = parseInt(ct.count, 10);
				if (!allHtml) {
					if (count > 1) {
						ct && $.insertHTML(nodes.feed_list, ct.html, "afterbegin");
					}
					else {
						nodes.feed_list.innerHTML = ct.html;
					}
				}
				else {
					if (count > 1) {
						nodes.feed_list.innerHTML = allHtml;
						window.setTimeout(function() {
						ct && $.insertHTML(nodes.feed_list, ct.html, "afterbegin");
					}, 0);
					}
					else {
						nodes.feed_list.innerHTML = ct.html;
					}
				}
			}
			/**
			 * 评论成功
			 * @param {Number}count
			 */
			,commentSucc : function(obj, ct) {
				$.ui.litePrompt('评论成功!', {'type':'succM','timeout':'500','hideCallback':function(){allHtml = nodes.feed_list.innerHTML;}});
				/*if(sizzle('>dl' , nodes.feed_list).length == 0){
				 nodes.feed_list.innerHTML = html;
				 } else {
				 $.insertHTML(nodes.feed_list, html, "AfterBegin")
				 }*/
				bindCustEvtFuns.gotoAll(ct);
			}

		};
		//----------------------------------------------

		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {
			replyFuns : {
				add : function(replyObj) {
					var ins = bindListenerFuns.replyFuns.get(replyObj);
					if (!replys[ins]) {
						replys.push(replyObj);
						$.custEvent.add(replyObj, 'reply', bindCustEvtFuns.reply);
					}
				},
				remove : function(ins) {
					if (replys[ins]) {
						$.custEvent.remove(ins);
						replys[ins] = null;
						delete replys[ins];
					}
				},
				get : function(replyObj) {
					var ret, isIn = false;
					for (var i = 0; i < replys.length; i++) {
						var obj = replys[i];
						if (obj == replyObj) {
							ret = i;
							isIn = true;
							break;
						}
					}
					return ret;
				},
				destroy : function() {
					for (var i = 0; i < replys.length; i++) {
						bindListenerFuns.replyFuns.remove(i);
					}
				}
			},
			//回复的channel代理
			reply : function(spec){
				bindCustEvtFuns.reply(spec.obj, spec.ret);
			}
		};
		//-------------------------------------------

		//---组件的初始化方法定义区-------------------------
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function() {
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------

		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			if (node == null || (node != null && !$.core.dom.isNode(node))) {
				throw "[comp.content.weiboDetail]:argsCheck()-The param node is not a DOM node.";
			}
			opts = $.core.obj.parseParam({
				html: ''
			}, opts);
			// 从地址栏获取参数
			pageQuery = (function() {
				var url = $.kit.extra.parseURL();
				return $.core.json.queryToJson(url.query);
			})();
			page = pageQuery.page || 1;
		};
		//-------------------------------------------


		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			if (opts.html) {
				node.innerHTML = opts.html;
			}
			nodes = $.kit.dom.parseDOM($.builder(node).list);
			if (nodes.forward[0]) {
				nodes.forward = nodes.forward[0];
			}
			/*var img = sizzle('[action-type="feed_list_media_img"]', node)[0] || sizzle('[action-type="feed_list_media_bigimg"]', node)[0];
			 imgUrl = "";*///img.src;
			/*var _dom = $.kit.dom.parseDOM($.builder(node).list);
			 $.log(nodes);*/
			media = {
				video : sizzle('[action-type="feed_list_media_video"]', nodes.weibo_info),
				music : sizzle('[action-type="feed_list_media_music"]', nodes.weibo_info)
			};

			var tabDoms = $.sizzle(".current", nodes.feed_cate);
			if (tabDoms && tabDoms.getAttribute && tabDoms.getAttribute("node-type") != "feed_cate") {
				isFilter = true;
			}
			else
			{
				allHtml = nodes.feed_list.innerHTML;
			}
//			var img = sizzle('[action-type="feed_list_media_img"]', node)[0] || sizzle('[action-type="feed_list_media_bigimg"]', node)[0];
			if (!nodes.feed_list_forwardContent) {
				var _buttons = sizzle("a", nodes.weibo_info);
				for (var i = 0; i < _buttons.length; i++) {
					var _button = _buttons[i];
					var _type = _button.getAttribute("action-type");
					if (_type === "feed_list_media_news") {
						util.newsFeed({el:_button}, true);
						break;
					} else if (_type === "feed_list_media_video" || _type === "feed_list_media_music") {
						util.smallVideoMusicClickFun({el:_button, data : $.core.json.queryToJson(_button.getAttribute("action-data"))}, node, _type.replace("feed_list_media_", ""), cData);
						break;
//					} else if (_type === "feed_list_media_vote") {
//						util.voteClickFn({el:_button, data : $.core.json.queryToJson(_button.getAttribute("action-data"))}, nodes.weibo_info, cData);
//						break;
					} else if (_type === "feed_list_media_widget") {
						util.widgetExpand({el:_button, data : $.core.json.queryToJson(_button.getAttribute("action-data"))}, nodes.weibo_info, cData);
						break;
					} else if (_type === "feed_list_third_rend") {
						util.thirdExpand({el:_button, data : $.core.json.queryToJson(_button.getAttribute("action-data"))}, nodes.weibo_info, cData);
						break;
					}else if(_type === 'feed_list_media_qing') {
						util.qingExpand({el:_button, data : $.core.json.queryToJson(_button.getAttribute("action-data"))}, nodes.weibo_info, cData);
						break;
					} else if (_type === "feed_list_media_magic") {
						break;
					}
				}
			}
			/*for (var _mtype in media) {
			 var _media = media[_mtype];
			 for (var i = 0; i < _media.length; i++) {
			 var obj = _media[i];
			 if (obj.getAttribute("isForward") !== '1') {
			 util.smallVideoMusicClickFun({el:obj, data : $.core.json.queryToJson(obj.getAttribute("action-data"))}, node, "music", cData);
			 }
			 }
			 }*/


			//计数器
			counter = {
				//转发计数器
				forwardCounter : sizzle('[node-type="forward_counter"]', node),
				//评论计数器
				commentCounter : sizzle('[node-type="comment_counter"]', node)
			};

			mid = sizzle(">dl", nodes.weibo_info)[0].getAttribute("mid");


			//整个区域Event代理对象
			dEvt = $.core.evt.delegatedEvent(node);
		};
		//-------------------------------------------

		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var showAddTag = function(spec)
		{
			var addTagDom = nodes.feed_list_addTag;
			var addTagDomDiv = nodes.feed_list_addtagDiv;
			var tagList = nodes.feed_list_tagList;
			var editTagDom = nodes.feed_list_editTag;
			var dialogopts = $.parseParam({
				title: "",//标题
				tipType: "",//提示的样式 success/error
				//tipInfo: "",//提示的内容tipType或tipInfo为空时不显示提示
				flag: "add", //add:添加标签，edit:修改标签
				mid: "",//添加和修改标签时必需的feed编号
				lastTags: "",//{Array}上一次的 如: abc ssss
				myTags: ""
			}, spec.data);
			 var feedNode = util.getFeedNode(spec.el);
			var feedMid = feedNode.getAttribute("mid");
			dialogopts.mid = feedMid;
			var lastTags = spec.el.getAttribute("_taglist");
			dialogopts.lastTags = lastTags;
			if (!lastTags) {
				dialogopts.title = lang('#L{添加标签}');
			} else {
				dialogopts.title = lang('#L{编辑标签}');
			}
			if (!addTagDialog) {
				addTagDialog = $.common.dialog.addTag(dialogopts);
				$.custEvent.add(addTagDialog, "success", function(evt, data) {
					if (!tagList) {
						$.log("addtag : there is not 'div[node-type=\"feed_list_tagList\"]' in the feed_item ");
						return;
					}
					var tags = data.data.tags;
					if (typeof tags != "undefined") {
						if (tags == "") {
							addTagDomDiv && $.setStyle(addTagDomDiv, "display", "");
							tagList && $.setStyle(tagList, "display", "none");
						}
						else {
							addTagDomDiv && $.setStyle(addTagDomDiv, "display", "none");
							tagList && $.setStyle(tagList, "display", "");
						}
						addTagDom && addTagDom.setAttribute("_tagList", tags);
						editTagDom && editTagDom.setAttribute("_tagList", tags);
					}
					tagList.innerHTML = data.data.html;
				});
				$.custEvent.add(addTagDialog, "hide", function(evt, data) {
					var tags = data.data.tags;
					var dom = tagList;
					if (tags == "") {
						dom = addTagDomDiv;
					}
					if ($.core.util.browser.IE6) {
						document.body.focus();
					}
					(function(fwNode) {
						setTimeout(function() {
							if (fwNode && fwNode.style.display != "none") {
								fwNode.focus();
							}
						}, 200);
					})(dom);
				});
			}
			addTagDialog && addTagDialog.show(dialogopts);
		};
		var initPlugins = function() {


			forwardDiv = $.common.forward.layer({
				styleId : "2"
			});
			if (sizzle('[load-forward="1"]', node)[0]) {
				isComment = false;
				showForward();
			}

			//评论组件
			var _reqData = parseForwardActData({});
			_reqData.needFocus = isComment;
			comment = $.common.comment.commentSingle({mid:mid, type:"big"}, nodes.comment, _reqData);

			//转发
			forwardDialog = $.common.dialog.forward({
				styleId : "2"
			});
			
			//评论会话层
			commentDialogue = $.common.dialog.commentDialogue();
		};
		//-------------------------------------------

		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			//删除按钮事件绑定
			dEvt.add('delete', 'click', bindCustEvtFuns.deleteWeibo);
			//回复按钮事件绑定
			dEvt.add('replycomment', 'click', bindDOMFuns.showReply);
			//评论会话层
			dEvt.add('commentDialogue', 'click', bindDOMFuns.showCommentDialogue);
			//删除评论按钮事件
			dEvt.add('delComment', 'click', bindDOMFuns.feedListDelete);
			//隐私状态切换事件
			dEvt.add('feed_private_tipclose', 'click', bindDOMFuns.closePrivateTip);
			//切换标签按钮事件绑定
			dEvt.add('tab_click', 'click', bindDOMFuns.tabClick);
			//转发切换标签按钮事件绑定
			dEvt.add('forword_tab_click', 'click', bindDOMFuns.forwardTabClick);
			//转发标签按钮事件绑定
//			dEvt.add('forward_tab_click','click',bindDOMFuns.tabClick);
			//小图片的处理事件
			dEvt.add("feed_list_media_img", "click", bindDOMFuns.smallimgClickFun);
			//大图片的处理事件
			dEvt.add("feed_list_media_bigimgDiv", "click", bindDOMFuns.bigimgClickFun);
			//收起图片按钮事件
			dEvt.add("feed_list_media_toSmall", "click", bindDOMFuns.toSmallClickFun);

			//旋转图片按钮事件(向左)
			dEvt.add('feed_list_media_toLeft', 'click', bindDOMFuns.rotateImageLeft);
			//旋转图片按钮事件(向右)
			dEvt.add('feed_list_media_toRight', 'click', bindDOMFuns.rotateImageRight);
			//视频播放按钮事件
			dEvt.add("feed_list_media_video", "click", bindDOMFuns.smallVideoClickFun);
			//音乐播放按钮事件
			dEvt.add("feed_list_media_music", "click", bindDOMFuns.smallMusicClickFun);
			//视频弹出按钮事件
			dEvt.add("feed_list_media_toFloat", "click", bindDOMFuns.toFloatClickFun);
			//魔法表情点击播放
			dEvt.add("feed_list_media_magic", "click", bindDOMFuns.magicClickFun);

			//列表中转发按钮事件
			dEvt.add('feed_list_forward', 'click', bindDOMFuns.feedListForward);
			//列表中删除按钮事件
			dEvt.add('feed_list_delete', 'click', bindDOMFuns.feedListDelete);
			//获取列表内容
			dEvt.add('search_type', 'click', bindDOMFuns.searchType);
			//收藏按钮事件
			dEvt.add('favorite', 'click', bindDOMFuns.favorite);
			//举报按钮事件
			dEvt.add('report', 'click', bindDOMFuns.report);
			//投票点击
//			dEvt.add("feed_list_media_vote", "click", bindDOMFuns.voteClickFn);
			//qing博客点击
			dEvt.add("feed_list_media_qing", "click",bindDOMFuns.qingClickFn);
			//widget组件点击行为
			dEvt.add("feed_list_media_widget", "click", bindDOMFuns.widgetExpand);
			//第三方组件改造点击行为
			dEvt.add("feed_list_third_rend", "click", bindDOMFuns.thirdExpand);
			//投票收起更多信息
			dEvt.add('vote_toSmallInfo', 'click', function(obj) {
				var el = obj.el;
				var feedNode = util.getFeedNode(el, node);
				var nodes = $.kit.dom.parseDOM($.builder(feedNode).list);
				nodes['vote_bigInfo'] && (nodes['vote_bigInfo'].style.display = 'none');
				nodes['vote_smallInfo'] && (nodes['vote_smallInfo'].style.display = '');
				return $.preventDefault(obj.evt);
			});
			//投票查看更多信息
			dEvt.add('vote_toBigInfo', 'click', function(obj) {
				var el = obj.el;
				var feedNode = util.getFeedNode(el, node);
				var nodes = $.kit.dom.parseDOM($.builder(feedNode).list);
				nodes['vote_smallInfo'] && (nodes['vote_smallInfo'].style.display = 'none');
				nodes['vote_bigInfo'] && (nodes['vote_bigInfo'].style.display = '');
				return $.preventDefault(obj.evt);
			});
			//投票验证码处理
			dEvt.add("vote_refresh_code", "click", function(obj) {
				var el = obj.el;
				var src = el.src.replace(/ts=.+/, '') + 'ts=' + $.getUniqueKey();
				el.src = src;
				return $.preventDefault(obj.evt);
			});
			//显示地理信息
			dEvt.add("feed_list_geo_info", "click", bindDOMFuns.showGeo);

			dEvt.add('feed_list_comment', 'click', function(obj) {
				$.log(arguments);
				return util.preventDefault(obj.evt);
			});

			dEvt.add('feed_list_reply', 'click', function(obj) {
				$.log("reply:", arguments);
				return util.preventDefault(obj.evt);
			});
			 //添加标签
			 	dEvt.add('feed_list_addTag', 'click', function(obj) {
				$.log("add:", arguments);
				showAddTag(obj);
				return util.preventDefault(obj.evt);
			});
			dEvt.add('feed_list_shareMood' , 'click' , bindDOMFuns.shareMood);
			/**
			 * 心情微博，发心情 
			 */
			dEvt.add('feed_list_pulishMood' , 'click' , bindDOMFuns.publishMood);
			//心情微博结束
			
			dEvt.add('feed_list_collect', 'click', bindDOMFuns.collect);
			
			//分页
			dEvt.add('feed_list_page', 'click', bindDOMFuns.getList);

			$.core.evt.addEvent(counter.commentCounter[0], "click", function(obj) {
				$.core.evt.fireEvent(counter.commentCounter[1], "click");
				$.scrollTo(counter.commentCounter[1], {top:30,
					onMoveStop : comment.shine
				});
				comment.focus(0);
				return util.preventDefault(obj.evt);
			});
			$.core.evt.addEvent(counter.forwardCounter[0], "click", function(obj) {
				try {
					showForwardCallBackFn = function(_callback) {
						$.scrollTo(counter.forwardCounter[1], {
							top:30,
							onMoveStop : _callback
						});
						showForwardCallBackFn = null;
					};
					//bindDOMFuns.tabClick({el : counter.forwardCounter[1], data : {type : "forward"}});
					$.core.evt.fireEvent(counter.forwardCounter[1], "click");
					//$.scrollTo(counter.forwardCounter[1], {top:30});
				} catch(e) {
					$.log(e.message);
				}
				return util.preventDefault(obj.evt);
			});


			$.addEvent(document, "click", bindDOMFuns.docClickFn);
		};
		//-------------------------------------------

		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {

			//评论组件count事件绑定
			$.custEvent.add(comment, 'count', bindCustEvtFuns.makeCommentCounter);
			$.custEvent.add(comment, 'comment', bindCustEvtFuns.commentSucc);
			$.custEvent.add(comment, 'forward', bindCustEvtFuns.makeForwardCounter);


			//转发成功事件回调函数
			$.custEvent.add(forwardEditor, "forward", bindCustEvtFuns.forwardSucc);

			//转发层转发成功事件回调函数
			$.custEvent.add(forwardDialog, "forward", bindCustEvtFuns.forwardDialogSucc);


			//转发层关闭事件回调函数
			$.custEvent.add(forwardDialog, "hide", bindCustEvtFuns.forwardDialogHide);
		};
		//-------------------------------------------

		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {
			$.common.channel.feed.register("forward", bindCustEvtFuns.makeForwardData);
			
			//评论对话reply
			$.common.channel.feed.register("reply", bindListenerFuns.reply);
		};
		//-------------------------------------------

		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			try {
				comment && $.custEvent.remove(comment) && comment.destroy();
				forwardDiv && $.custEvent.remove(forwardDiv) && forwardDiv.destroy();
				forwardDialog && $.custEvent.remove(forwardDialog) && forwardDialog.destory();
				favorite && favorite.destroy();
				feedListDelete.destroy();
				$.common.feed.widget.destroy();
				addTagDialog && addTagDialog.destroy && addTagDialog.destroy();
				allHtml = null;
				commentDialogue && commentDialogue.destroy();
				/*comment && comment.destroy() && $.custEvent.remove(comment);
				 forwardEditor && forwardEditor.destory() && $.custEvent.remove(forwardEditor);
				 forwardDialog && forwardDialog.destory() && $.custEvent.remove(forwardDialog);
				 favorite && favorite.destroy();
				 feedListDelete.destroy();*/
			} catch(e) {
				$.log("ERR", e.message)
			}
		};
		//-------------------------------------------

		//---执行初始化---------------------------------
		init();
		//-------------------------------------------

		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		//-------------------------------------------

		return that;
	};


});
