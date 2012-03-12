/**
 *  他的个人资料
 *
 */
$Import('kit.dom.firstChild');
$Import('kit.extra.language');
$Import('common.channel.relation');
$Import('common.trans.relation');
$Import('ui.tipFollow');
$Import('kit.dom.hover');
$Import('kit.extra.merge');
$Import('common.dialog.publish');
$Import('common.dialog.setGroup');
$Import('common.dialog.setRemark');
$Import('common.dialog.sendMessage');
$Import('ui.confirm');
$Import('ui.alert');
$Import('common.dialog.setGroup');
$Import('common.relation.suggestFollow');
$Import('common.dialog.inviteFollow');
$Import('common.dialog.sendMessage');
$Import('common.content.block');
//$Import('comp.content.creditCard');
$Import('comp.content.darenCard');
$Import('common.relation.quietFollow');
STK.register('comp.content.hisPersonalInfo', function($) {
	return function(node) {
		var lang = $.kit.extra.language;
		var setGroup = $.common.dialog.setGroup();
		var addEvent=$.core.evt.addEvent;
		var removeEvent=$.core.evt.removeEvent;
		var quietFollow;
		var sizzle = $.sizzle;
		//加关注取消关注操作
		var focusLink = sizzle("div.handle_btn", node)[0];
//		var nodeData = $.queryToJson(focusLink.getAttribute("node-data") || '');//节点数据
//		var uid = nodeData.uid;
		var uid = $CONFIG['oid'];
		var nickName = $CONFIG['onick'];
		//私信功能是否开放
		var allowConnect = $CONFIG['allowConnect'] === 'true';
//		var relation = nodeData.relation === '1' ? 'both' : 'single';
		//var relation = 'single';

		//toFix 依赖php的输出，认为这些节点都有
		var morebtn = $.sizzle("a.W_moredown", node)[0];//更多按钮
		var moreMenu = $.sizzle("ul.handle_menu", node)[0];//更多的内容区域
		var handle_more = $.sizzle("div.handle_more span", node)[0];//加关注右侧的功能条\
		var suggestPanel = $.sizzle('div[node-type="suggestedFollows"]', node)[0];
//		handle_more.innerHTML = '<span></span>';
//		handle_more = $.kit.dom.firstChild(handle_more);
		var nameEl = $.sizzle("div.name div", node)[0];
        var remark =  $.sizzle('a[action-type="set"]', node)[0];

		var SET_REMARK ='(设置备注)';
		var delegate = $.core.evt.delegatedEvent(node);
		var followChannel = $.common.channel.relation;
		var groupDialog = $.common.dialog.setGroup();
		var suggest = $.common.relation.suggestFollow(suggestPanel);
		var sendMsg = $.common.dialog.sendMessage({
			'uid': uid,
			'userName': nickName
		});
        //var creditDom  = sizzle('[node-type=credit]',node)[0];
        //var credit = $.comp.content.creditCard(creditDom);
        //var  darenDom = sizzle('[node-type=daren]',node)[0];
        var  darenDom = sizzle('[node-type=daren]',node)[0];
		 var daren = null;
        daren = darenDom && $.comp.content.darenCard(darenDom,{'uid':$CONFIG['oid']});


		var doPost = function (type, spec) {
			spec = $.kit.extra.merge({
				'onSuccess':function(ret) {
					followChannel.fire(type, {
						'uid':uid,
						'relation': ret.data.relation
					});
				},
				'onError':function(ret) {
					$.ui.alert(ret.msg);
				}
			}, spec);

			var trans = $.common.trans.relation.getTrans(type, spec);
			trans.request({'uid': uid, 'f':1});

		};
		/**
		 * 加关注之后的整套流程目前存在问题，暂时已全页刷新来做为解决方案
		 */
		var reloadWin = function(){
			setTimeout(function(){
				if ($CONFIG['bigpipe'] === 'true' && $.historyM) {
					$.historyM.setQuery({}, true);
					return;
				}
				window.location.reload();
			}, 500);
		};
		
		var tipFollow = $.ui.tipFollow(focusLink, uid, nickName);

		/**
		 * 更多层状态
		 */
		var moreMenuToggle = {
			show : function(){
				var pos = $.position(morebtn);
				var hei = morebtn.offsetHeight;
				moreMenu.style.left = pos.l + "px";
				moreMenu.style.top = pos.t + hei + "px";
				moreMenu.style.display = "";
			},
			hide : function(){
				moreMenu.style.display = "none";
			}
		}
		/**
		 * 更多按钮/层事件绑定
		 */
		var moreMenuBindEvt = function(){
			$.core.evt.addEvent(morebtn, "mouseover", moreMenuToggle.show);
			$.core.evt.addEvent(moreMenu, "mouseover", moreMenuToggle.show);
			$.core.evt.addEvent(morebtn, "mouseout", moreMenuToggle.hide);
			$.core.evt.addEvent(moreMenu, "mouseout", moreMenuToggle.hide);
		}
		/**
		 * 更多按钮/层事移除
		 */
		var moreMenuRemoveEvt = function(){
			$.core.evt.removeEvent(morebtn, "mouseover", moreMenuToggle.show);
			$.core.evt.removeEvent(moreMenu, "mouseover", moreMenuToggle.show);
			$.core.evt.removeEvent(morebtn, "mouseout", moreMenuToggle.hide);
			$.core.evt.removeEvent(moreMenu, "mouseout", moreMenuToggle.hide);
		}
		
		/**
		 * 设置“更多”下拉菜单的位置
		 */
		var setMoreMenuXY = function(morebtn, moreMenu) {
			moreMenuBindEvt();
		};
				
		var publish = $.common.dialog.publish();

		/**
		 * 求关注——获取提示问题
		 */
		var quesTrans = $.common.trans.relation.getTrans('questions', {
			'onSuccess': function(spec, parm){
				$.common.dialog.inviteFollow({
					'name': nickName,
					'uid': uid,
					'questionList': spec.data
				});
			},
			'onError': function(rs, parm){
				if(rs && rs.code === "100060"){
                    rs.msg &&
                    $.ui.confirm(rs.msg, {
						icon:'warn',
                        OKText: lang("#L{立刻绑定}"),
                        OK: function(){
                        	window.location.href = "http://account.weibo.com/settings/mobile";
							return $.preventDefault();
                        }
                    });
				}else{
					rs.msg && $.ui.alert(rs.msg);
				}
			}
		});
		
		var actionFunc = {
			//修改备注事件
			'modify':function() {
				//$.log("", "   --modify ");
			},
			//添加备注
			'set':function(specs) {
                 var  oldRemark =remark.innerHTML;
                  if(oldRemark== "(" + lang("#L{设置备注}") + ")")   oldRemark ="";
                    else   oldRemark =oldRemark.replace(/^\(/,"").replace(/\)$/,"");
				$.common.dialog.setRemark({
                    'remark' :$.core.str.decodeHTML(oldRemark),
					'uid' : uid,
					'callback' : function(data){
                        if( $.trim(data)== "") specs.el.innerHTML =SET_REMARK;
                        else specs.el.innerHTML = "("+$.core.str.encodeHTML(data)+")";
					}
				});
			},
			//@ta
			'at':function(obj) {
				//弹出发布层
				publish.show({
					'title':lang('#L{有什么话想对#{nickName\\} 说}', {'nickName':nickName}),
					'info':lang('#L{可以直接输入音乐或视频的url地址}'),
//					'defaultValue' : '',
					'content' : lang('#L{对@#{nickName\\} 说：}', {'nickName':nickName})
				});
				return $.preventDefault(obj.evt);
			},
			//设置分组
			'set_group':function() {
				setGroup.show({
					'uid' : uid,
					'fnick' : nickName,
					'hasRemark' : false
				});
			},
			//为他引荐朋友
			'introduce':function() {

			},
			// 移出粉丝
			'remove':function(obj) {
				var removeConfirm = $.ui.tipConfirm({
					info:lang('#L{确认移除粉丝吗？}')
				});

				removeConfirm.okCallback = function() {
					//发请求
					doPost('removeFans', {
						'onSuccess':function(ret) {
							followChannel.fire('removeFans', {
								'uid':uid,
								'relation': ret.data.relation
							});
							removeConfirm.destroy();
							removeConfirm = null;
						}
					});
				};

				removeConfirm.setLayerXY(obj.el);
				removeConfirm.aniShow();
			},
			//推荐给朋友
			'recommend':function(opts) {
				publish.show({
					'title':lang('#L{把#{nickName\\}推荐给朋友}', {'nickName':nickName}),
					'info':lang('#L{说说推荐理由吧:}'),
//					'defaultValue' : '',
					'content' : lang(('#L{快来看看 @#{nickName\\}  的微博}' + ' ' + window.location.href), {'nickName':nickName})

				});
				opts.evt && $.preventDefault(opts.evt);		
			},
			//加入黑名单
			"block":function() {
				$.common.content.block();
				/*$.ui.confirm(lang('#L{你和他将自动解除关注关系，并且他不能再关注你他不能再给你发评论、私信、@通知}'),
				{
					'title' : lang('#L{确认将#{nickName\\} 加入到我的黑名单中么？}', {'nickName':nickName}),
					'icon' : 'icon_errorB',
					'OK' : function() {
						//发请求
						doPost('block', {
							'onSuccess':function(ret) {
								//成功后触发
								followChannel.fire('block', {
									'uid': $CONFIG['oid'],
									'relation': ret.data.relation
								});
							}
						});
					}
				});*/
			},

			'sendMessage' : function(){
				var postMsg = $.common.dialog.sendMessage({
					'uid' : uid,
					'userName' : nickName
				});

				postMsg.show();
			},
			
			'inviteFollow': function(){
				quesTrans.request({'uid': uid});
			},
			
			'postMsg': function(){
				sendMsg.show();
			}
		};
		//   广播

		var removeFans = function(fireConf) {
			if(fireConf.uid != uid){ return; }
			nameEl.innerHTML = nickName;
			var rel = fireConf.relation;
			if (rel.following) {
				changHTML('singleRelation');
			} else {
				changHTML('notRelation')
			}
		};
		
		var recommendusers = $.common.trans.relation.getTrans('recommendusers', {
			'onSuccess': function(spec){
				suggest.setContent(spec.data);
			},
			'onError': function(spec){
				$.ui.alert(spec.msg);
			}
		});
		
		var addRelation = function(fireConf) {
			if(fireConf.uid != uid){ return; }
			var rel = fireConf.relation;
			if (rel.following && rel.follow_me) {
				changHTML('bothRelation');
			} else {
				changHTML('singleRelation')
			}
			groupDialog.show({
				'uid': uid,
				'fnick': nickName,
				'hasRemark': true,
				'successCb': function(spec, parm){
					var rm = parm.remark || lang('#L{设置备注}');
					nameEl.innerHTML = $CONFIG['onick']+'&nbsp;<a action-type="set" class="remark W_linkb" href="javascript:void(0);">('+ rm +')</a>';
					remark =  $.sizzle('a[action-type="set"]', node)[0];
				},
				'groupList' : fireConf.groupList
			});
			
			recommendusers.request({'uid': uid});
		};


		var unFollow = function(fireConf) {
			if(fireConf.uid != uid){ return; }
			nameEl.innerHTML = nickName;
			var rel = fireConf.relation;
			if (rel.follow_me) {
				changHTML('myFans');
			} else {
				changHTML('notRelation')
			}
		};

		//block
		var block = function(fireConf) {
			if(fireConf.uid != uid){ return; }
			nameEl.innerHTML = nickName;
			changHTML('block');
		};

		//unBlock
		var unBlock = function(fireConf) {
			if(fireConf.uid != uid){ return; }
			changHTML('unBlock');
		};
		
		followChannel.register('removeFans', removeFans);
		followChannel.register('unFollow', unFollow);
		followChannel.register('unBlock', unBlock);
		followChannel.register('block', block);
		followChannel.register('follow', addRelation);
		/**
		 * 事件代理类型
		 */
		var delegateHandleType = [
			'at',
			'set',
			'postMsg',
			'set_group',
			'introduce',	 //为他引荐朋友
			'remove',
			'recommend',
			'block', //加黑名单
			'postMsg',
			'inviteFollow'
		];
		/**
		 * 事件代理的方法
		 */
		var delegateHandleFunc = [
			actionFunc.at,
			actionFunc.set,
			actionFunc.postMsg,
			actionFunc.set_group,
			actionFunc.introduce,
			actionFunc.remove,
			actionFunc.recommend,
			actionFunc.block,
			actionFunc.sendMessage,
			actionFunc.inviteFollow
		];

		var handleHtml = [
/*0 发私信*/		'<a action-type="postMsg" class="black_list" href="javascript:void(0);" suda-data="key=profile_message_send_page&value=profile_message_send_page">' + lang('#L{发私信}') + '</a>',
/*1 @他*/		'<a action-type="at" class="black_list" href="javascript:void(0);">' + lang('#L{@他}') + '</a>',
/*2 设置分组*/		'<a action-type="set_group" class="black_list" href="javascript:void(0);">' + lang('#L{设置分组}') + '</a>',
/*3 为他引荐朋友*/		'<a action-type="introduce" class="black_list" href="/f/recommend/add?name=' + nickName + '">' + lang('#L{为他引荐朋友}') + '</a>',
/*4 移除粉丝*/		'<a action-type="remove" class="black_list" href="javascript:void(0);">' + lang('#L{移除粉丝}') + '</a>',
/*5 加入黑名单*/		'<a action-type="block" class="black_list" href="javascript:void(0);">' + lang('#L{加入黑名单}') + '</a>',
/*6 求关注*/		'<a action-type="inviteFollow" class="black_list" href="javascript:void(0);" suda-data="key=profile_invitefollow_page&value=profile_invitefollow_page">' + lang('#L{求关注}') + '</a>',
/*7 推荐给朋友*/		'<a action-type="recommend" class="black_list" href="javascript:void(0);">' + lang('#L{推荐给朋友}') + '</a>',
/*8悄悄关注*/   '<a action-data="fuid='+$CONFIG['oid']+'&amp;fname='+$CONFIG['onick']+'&amp;action=add" action-type="addQuietFollow" class="watch" href="javascript:void(0);">'+lang('#L{悄悄关注}')+ '</a>'
		];


		var lineHtml = '<em class="W_vline">|</em>';


		for (var i = 0,len = delegateHandleType.length; i < len; i++) {
			delegate.add(delegateHandleType[i], "click", delegateHandleFunc[i]);
		}

		/**
		 * 对照表
		 */
		var toHandleHtmlMap = {
			'bothRelation':'0,1,2,4,7,3,5,8',	  //互相关注
			'myFans':'0,7,3,4,8',	//只他关注我
			'singleRelation': allowConnect ? '0,6,1,2,7,5,8' : '6,1,2,7,5,8', //只我关注了他
			'notRelation': allowConnect ? '0,7,3,8' : '7,8',	//无关系
			'block':'8',   //黑名单
			'unBlock': allowConnect ? '0,7,3,8' : '7,8'   //解除黑名单 无关系
		};

		//悄悄关注
		var _quietFollow=function(){
			//当页面假写之后 提示黄色气泡将无效 （不处理）
			var nd=sizzle('[action-type=addQuietFollow]',node)[0];
			var pop=sizzle('[node-type=quiet_pop]',node)[0];
			var know=sizzle('[node-type=quiet_know]',node)[0];
			if(nd && pop){
				var pos,sz,st1,st2;
				document.body.appendChild(pop);
				
				var on=function(){
					clearTimeout(st1);
					clearTimeout(st2);
					try{
					    moreMenuToggle.show();						
					}catch(e){};

					pop && (pop.style.display="");
					st1=setTimeout(function(){
						pos=$.core.dom.position(nd);
						sz=$.core.dom.getSize(nd);
						pos.l+=sz.width+10;
						pos.t-=20;
						$.core.dom.setXY(pop,pos);		
					},1);
				
				};
				var out=function(){
					st2=setTimeout(function(){
						pop && (pop.style.display="none");
					},40);
				};
				var close=function(){
					var trans = $.common.trans.relation.getTrans('quiet_know');
					trans.request({'type':12});

					removeEvent(pop,'mouseover',on);
					removeEvent(pop,'mouseout',out);
					
					removeEvent(nd,'mouseover',on);
					removeEvent(nd,'mouseout',out);
					
					removeEvent(know,'click',close);
					$.core.dom.removeNode(pop);
				};

				addEvent(pop,'mouseover',on);
				addEvent(pop,'mouseout',out);
				
				addEvent(nd,'mouseover',on);
				addEvent(nd,'mouseout',out);
				know && addEvent(know,'click',close);
			};
			
			
			var opts={
				'addQFollow':function(rs){
					if(rs && rs.code=='100000'){
						setTimeout(function(){
							window.location.reload();
						},1000);
						
					}else{
						
					}
				},
				'removeQFollow':function(rs){
					if(rs && rs.code=='100000'){
						setTimeout(function(){
							window.location.reload();
						},1000);
					}else{
						
					}
				}
			}
			quietFollow=$.common.relation.quietFollow(node,opts);
		};
		_quietFollow();

		/**
		 * 变换innerHTML
		 * @param key
		 */
		var changHTML = function(key) {
			var arrayKey = toHandleHtmlMap[key];
			if (!arrayKey) {
				handle_more.innerHTML = '';
				morebtn.style.display = "none";
				return;
			}
			var toHtmlKey = arrayKey.split(",");
			var len = toHtmlKey.length;
			var html = [];
			
			var _max = $CONFIG['isnarrow']?3:4;
			if (len > _max) {
				for (var i = 0; i < _max; i++) {
					html.push(handleHtml[toHtmlKey[i]],lineHtml);
				}
				handle_more.innerHTML = html.join("");
				morebtn.style.display = "";
				html = [];
				for (var j = _max; j < len; j++) {
					html.push('<li>', handleHtml[toHtmlKey[j]], '</li>');
				}
				moreMenu.innerHTML = html.join("");
				
				moreMenuRemoveEvt();
				setMoreMenuXY(morebtn, moreMenu);
				
				$.kit.dom.hover({
					act: morebtn,
					extra:[moreMenu],
					onmouseover:  function() {
						moreMenu.style.display = "";
					},
					onmouseout:  function() {
						moreMenu.style.display = "none";
					}
				});
			} else {
				for (var i = 0; i < len - 1; i++) {
					html.push(handleHtml[toHtmlKey[i]]);
				}
				html.push(handleHtml[toHtmlKey[len - 1]]);
				handle_more.innerHTML = html.join(lineHtml);
				morebtn.style.display = "none";
			}
		};

		//更多下拉框
		setMoreMenuXY(morebtn, moreMenu);
		
		var that = {};
		that.destroy = function() {
			followChannel.remove('removeFans', removeFans);
			followChannel.remove('unFollow', unFollow);
			followChannel.remove('unBlock', unBlock);
			followChannel.remove('block', block);
			followChannel.remove('follow', addRelation);
			sendMsg.destroy();
             daren && daren.destroy &&daren.destroy();
			tipFollow.destroy();
			tipFollow = null;
			delegate.destroy();
			groupDialog.destroy();
			groupDialog = null;
			moreMenuRemoveEvt();
			quietFollow && quietFollow.destroy();
		}
		return that;
	}
});
