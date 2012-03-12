/**
 * Feed屏蔽
 *
 * author runshi@staff.sina.com.cn
 */

$Import('kit.dom.parents');
$Import('kit.dom.layoutPos');
$Import('kit.extra.language');
$Import('common.trans.feed');
$Import('ui.confirm');
$Import('ui.litePrompt');
$Import('common.feed.feedList.utils');

STK.register("common.feed.feedList.plugins.feedShield", function($) {

	var utils = $.common.feed.feedList.utils;
	var $L = $.kit.extra.language;
	var $T = $.templet;
	var trans = $.common.trans.feed ;

	var TEMP = {
		'FRAME' : '<div style="display:none;position:absolute" node-type="FSLayer" action-type="feed_list_layer" class="layer_menu_list"></div>',
		'SHIELD' : {
			'USER' : {
				'ITEM' : $L('<li><a action-type="feed_list_shield_by_user" href="javascript:void(0)" action-data="filter_type=1&uid=#{UID}&nickname=#{NICKNAME}&gender=#{GENDER}">#L{屏蔽} #{NICKNAME} #L{的微博}</a></li>'),
				'CONFIRM' : $L('<span>#L{确认屏蔽}<strong> #{NICKNAME}</strong> #L{的微博吗？}</span>'),
				'SMALLTEXT' :$L('#L{在“我的首页”将自动屏蔽}#{GENDER}#L{的新微博。}<br />#L{可以在}<a href="http://account.weibo.com/set/feed" target="_blank">#L{帐号设置-隐私设置}</a>#L{中增加或取消屏蔽。}')
			},
			'MID' :{
				'ITEM' : $L('<li><a action-type="feed_list_shield_by_mid" href="javascript:void(0)" action-data="filter_type=0&mid=#{MID}">#L{隐藏这条微博}</a></li>'),
				'CONFIRM' : $L('<span>#L{确认屏蔽} <strong>#{NICKNAME} #L{的微博吗？}</strong></span>') ,
				'SMALLTEXT' :$L('#L{系统将在你的首页自动屏蔽}#{GENDER}#L{的新微博。}<br />#L{可以在}<a href="http://account.weibo.com/set/feed" target="_blank">#L{帐号设置-隐私设置}</a>中设置和取消屏蔽。}')
			},
			'APP' :
			{
				'ITEM'	: $L('<li><a action-type="feed_list_shield_by_app" href="javascript:void(0)" action-data="filter_type=2&uid=#{UID}&nickname=#{NICKNAME}&mid=#{MID}&appname=#{APPNAME}&gender=#{GENDER}">#L{屏蔽来自} #{APPNAME} #L{的微博}</a></li>'),
				'CONFIRM' : $L('<span>#L{确认屏蔽来自}<strong> #{APPNAME} </strong> #L{的微博吗？}</span><br />') ,
				'SMALLTEXT' :$L('#L{在“我的首页”将自动屏蔽来自它的新微博。}<br />#L{可以在}<a href="http://account.weibo.com/set/feedsource" target="_blank">#L{帐号设置-隐私设置}</a>#L{中取消屏蔽。}')
			}
		}
	};

	var FSLayer, FSbtnLast;

	return function(base) {
		if (!base) {
			throw "that : need object of the baseFeedList Class"
			return;
		}

		var FSData,
				FSbtn,
				that = {},
				node = base.getNode(),
				BDEvent = base.getDEvent(), timer,
				dEvt;

		var that = {
			create : function() {
				FSLayer = $.kit.dom.parseDOM($.core.dom.builder(TEMP.FRAME).list).FSLayer;
				$.sizzle('body')[0].appendChild(FSLayer);
				dEvt = $.core.evt.delegatedEvent(FSLayer);
				dEvt.add("feed_list_shield_by_user", "click", shield.user.behavior);
				dEvt.add("feed_list_shield_by_mid", "click", shield.mid.behavior);
				dEvt.add("feed_list_shield_by_app", "click", shield.app.behavior);
			},
			toggle : function(ret) {
				//timer && clearTimeout(timer);
				//$.core.evt.addEvent(document.body, "mousemove", that.outLayer);
				  //is_new_filter = ret.data.is_new_filter;
				//if (typeof is_new_filter =="undefined" || is_new_filter != "0") {
					FSbtn = ret.el;
					if (!FSLayer) {
						that.create();
					}

					if (FSbtnLast === FSbtn) {
						if (FSLayer.style.display == 'none') {
							that.show();
							that.setLayerPos();
						}
						else {
							that.hide();
						}
					} else {
						FSData = ret.data;
						that.reDisplay();
					}
				//}
				/*else
				{
						FSbtn = ret.el;
					  ret.data.filter_type = 1;
					  shield.user.behavior(ret);
				}*/
			},
			reDisplay : function() {
				var tmp = [];
				for (var type in shield) {
					tmp.push(shield[type]['item']());
				}
				FSLayer.innerHTML = '<ul>' + tmp.join('') + '</ul>';
				tmp = null;
				that.setLayerPos();
				that.show();
				FSbtnLast && $.addClassName(FSbtnLast, 'hover');
				FSbtnLast = FSbtn;
			},
			show : function() {
				$.removeClassName(FSbtn, 'hover');
				FSLayer && $.setStyle(FSLayer, 'display', '');
				$.addEvent(document.body, 'click', that.autoHide);
			},
			hide : function() {
				$.addClassName(FSbtn, 'hover');
				FSLayer && $.setStyle(FSLayer, 'display', 'none');
				$.removeEvent(document.body, 'click', that.autoHide);
			},
			setLayerPos : function() {
				var sizeFS = $.core.dom.getSize(FSLayer);
				var sizeE = $.core.dom.getSize(FSbtn);
				var posE = $.core.dom.position(FSbtn);
				$.setStyle(FSLayer, 'top', posE.t + sizeE.height + 'px');
				$.setStyle(FSLayer, 'left', posE.l + sizeE.width - sizeFS.width + 'px');
			},
			outLayer : function() {
				timer && clearTimeout(timer);
				timer = window.setTimeout(function() {
					that.autoHide()
				}, 50);
			},
			autoHide : function(e) {

				var ev = $.core.evt.getEvent();
				var evt = $.fixEvent(ev);
				if (!$.core.dom.contains(FSLayer, evt.target) && !$.core.dom.contains(FSbtn, evt.target) && evt.target !== FSbtn) {
					that.hide();
					//$.core.evt.removeEvent(document.body, "mousemove", that.outLayer);
				}
			},
			/*hitTest	:function () {
			 var shieldnode = $.sizzle("[action-type='feed_list_shield']", feedDom)[0];
			 var ev = $.core.evt.getEvent();
			 var hit1 = $.core.evt.hitTest(shieldnode, ev);
			 var hit2 = $.core.evt.hitTest(FSLayer, ev);
			 var isHit = (hit1 || hit2);
			 if (!isHit) {
			 var isShow = ($.core.dom.getStyle(FSLayer, "display") != "none");
			 if (isShow) {
			 that.hide();
			 }
			 $.core.evt.removeEvent(document.body, "mousemove", that.hitTest);
			 }
			 }, */
			reflushFeedList : function() {

			}
		};
		//删除feed
		var deleteFeed = function(base, el, node) {
			var feedNode = utils.getFeedNode(el, node);
			feedNode.style.height = feedNode.offsetHeight + "px";
			feedNode.style.overflow = 'hidden';
			//动画
			var feedNodeT = $.tween(feedNode, {
				'duration': 200,
				'end' : function() {
					feedNode.innerHTML = '';
					$.removeNode(feedNode);
					node = el = feedNode = null;
					feedNodeT.destroy();
					if (base.getFeedCount() < 1) window.location.reload();
				}}).play({'height':0});
		};

		var shield = {
			mid:{
				item : function() {
					if (FSData["mid"]) {
						return $T(TEMP.SHIELD.MID.ITEM, {
							MID:FSData["mid"]
						});
					}
					return '';
				},
				behavior : function(ret) {
					var el = FSbtn;
					var data = ret.data;
					data.location = $CONFIG['location'];
					//var _mid = utils.getMid(el, node);
					/*$.ui.confirm($T(TEMP.SHIELD.USER.CONFIRM, {UID:ret.data.uid, NICKNAME:ret.data.nickname, GENDER: (ret.data.gender == "m" ? '他':'她')}), {
					 'textSmall' :$T(TEMP.SHIELD.USER.SMALLTEXT,{GENDER: (ret.data.gender == "m" ? '他':'她')}),
					 'OK' : function(){*/
					trans.getTrans('feedShield', {
						'onComplete' : function(json) {
							shield.user.handle(json, el);

						}
					}).request(data);
					/*}
					 });*/
					that.hide();
				},
				handle : function(ret, el) {
					shieldCallback(ret, el,0);
				}
			},
			user : {
				item : function() {
					if (FSData["uid"] && FSData["nickname"]) {
						return $T(TEMP.SHIELD.USER.ITEM, {
							UID	  : FSData["uid"],
							NICKNAME : FSData["nickname"],
							GENDER : FSData["gender"]
						});
					}
					return '';
				},
				behavior : function(ret) {
					var data = ret.data;
					data.location = $CONFIG['location'];
					var el = FSbtn;
					//var _mid = utils.getMid(el, node);
					$.ui.confirm($T(TEMP.SHIELD.USER.CONFIRM, {UID:ret.data.uid, NICKNAME:ret.data.nickname, GENDER: (ret.data.gender == "m" ? '他' : '她')}), {
						'textSmall' :$T(TEMP.SHIELD.USER.SMALLTEXT, {GENDER: (ret.data.gender == "m" ? '他' : '她')}),
						'OK' : function() {
							trans.getTrans('feedShield', {
								'onComplete' : function(json) {
									shield.user.handle(json, el);
								}
							}).request(data);
						}
					});
					//that.hide();
				},
				handle : function(ret, el) {
					shieldCallback(ret, el,1);
				}
			},
			app : {
				item : function() {
					if (FSData["uid"] && FSData["nickname"] && FSData["mid"] && FSData["appname"] && FSData["isactive"] && FSData["isactive"] == "1") {
						return $T(TEMP.SHIELD.APP.ITEM, {
							UID	  : FSData["uid"],
							NICKNAME : FSData["nickname"],
							APPNAME : FSData["appname"],
							MID : FSData["mid"],
							GENDER : FSData["gender"]
						});
					}
					return '';
				},
				behavior : function(ret) {
					var el = FSbtn;
					var data = ret.data;
					data.location = $CONFIG['location'];
					//var _mid = utils.getMid(el, node);
					$.ui.confirm($T(TEMP.SHIELD.APP.CONFIRM, {UID:ret.data.uid, NICKNAME:ret.data.nickname,APPNAME:ret.data.appname, GENDER: (ret.data.gender == "m" ? '他' : '她')}), {
						'textSmall' :$T(TEMP.SHIELD.APP.SMALLTEXT, {GENDER: (ret.data.gender == "m" ? '他' : '她')}),
						'OK' : function() {
							trans.getTrans('feedShield', {
								'onComplete' : function(json) {
									shield.user.handle(json, el);

								}
							}).request(data);
						}
					});
					that.hide();
				},
				handle : function(ret, el) {
					shieldCallback(ret, el,2);

				}
			}
		};
		var shieldCallback = function(ret, el,isApp) {
			var type  = "error";
			if (ret['code'] == '100000') {
				// || ret['code'] == '100001'
				type = 'succM';
				deleteFeed(base, el, node);
			} else if (ret['code'] == '100033') {
				var json = {msg:$L('#L{已经达到屏蔽用户的上限。}'),smalltext:$L('#L{去}<a href="http://account.weibo.com/set/feed" target="_blank">#L{帐号设置-隐私设置}</a>#L{中管理屏蔽。}')};
				if(isApp ==2)
				{
					json.msg = $L('#L{已经达到屏蔽来源的上限。}') ;
					json.smalltext =$L('#L{去}<a href="http://account.weibo.com/set/feedsource" target="_blank">#L{帐号设置-隐私设置}</a>#L{中管理屏蔽。}');
				}
				if(isApp == 0)
				{
					//json = {msg:$L('#L{已经达到100个屏蔽用户的上限制。}')};
					return;
				}

				shieldTranError(json);
				return;
			}
			else if (ret['code'] == '100034') {
				var json = {'msg':$L('#L{该来源暂时不可屏蔽哦。}'),'smalltext':$L('<a href="http://weibo.com/zt/s?k=9286" target="_blank">#L{我要提建议。}</a>')};
				shieldTranError(json);
				return;
			}
			$.ui.litePrompt(ret['msg'], {'type':type,'timeout':'1000'});
		};
		var shieldTranError = function(json) {
			$.ui.alert(json.msg, {'type':'warn','textSmall' :json.smalltext});

		};
		var init = function() {
			BDEvent.add("feed_list_shield", "click", that.toggle);
		};

		init();

		that.destroy = function() {

		};

		return that;

	};
});
