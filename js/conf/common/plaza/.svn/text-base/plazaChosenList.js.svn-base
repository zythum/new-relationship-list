/**
 * 广场精选列表模式
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
$Import('common.feed.feedList.plazaChosenFeedList');
$Import('common.trans.plaza');
$Import('common.relation.followPrototype');
$Import('common.channel.relation');
$Import('common.dialog.setGroup');
$Import('common.plaza.contribute');
$Import('common.plaza.feedback');
$Import('comp.content.userCard');
STK.register('common.plaza.plazaChosenList', function($) {
	
	return function(node) {
		var  that = {}
			,plazaChosenFeedList
			,userTopListDEvent
			,lang = $.kit.extra.language
			,page = 2
			,feedListNode = $.sizzle('div[node-type="feed_list"]',node)[0]
			,userTopListNode = $.sizzle('div[node-type="user_top_List"]',node)[0]
			,contributeBtn = $.sizzle('a[node-type="user_contribute"]')[0]
			,feedbackBtn = $.sizzle('a[node-type="user_feedback"]')[0]
			,tipButton = $.sizzle('span[node-type="tipButton"]',userTopListNode)[0]
			,tipDiv = $.sizzle('span[node-type="tipDiv"]',userTopListNode)[0]
			,tipButtonOver
			,tipButtonOut
			,groupDialog = $.common.dialog.setGroup()
			,followPrototype = $.common.relation.followPrototype;
		//左边
		plazaChosenFeedList = $.common.feed.feedList.plazaChosenFeedList(feedListNode);
		$.custEvent.add(plazaChosenFeedList, 'request', function(evt, type, data) {
			//处理加载数据逻辑
			$.common.trans.plaza.getTrans("list", {
				onSuccess: function(data) {
					++page;
					plazaChosenFeedList.updateFeed(data.data, type);
				},
				onFail: function() {
					plazaChosenFeedList.showError(type);
				},
				onError: function(data) {
					plazaChosenFeedList.showError(type);
				}
			}).request({
				 'class': $CONFIG['class']
				,'ts'   : $CONFIG['ts']
				,'page' : page
			});
			
		});
		var feedbackButton = $.sizzle('a[action-type=user_feedback]')[0];
		feedbackButton && $.kit.dom.fix(feedbackButton, 'lt', [0, 230]).setFixed(true);
		
		$.comp.content.userCard(document.body, {
			 'zIndex': 10002
		});
		//右边 的关注列表
		
		//小气泡
		tipButtonOver = function() {
			//document.body.appendChild(tipDiv)
			tipDiv.style.display = "";
			
		};
		tipButtonOut = function() {
			tipDiv.style.display = "none";
		};
		$.addEvent(tipButton, "mouseover", tipButtonOver);
		$.addEvent(tipButton, "mouseout", tipButtonOut);
		//投稿
		var contribute = function(event){
			$.common.plaza.contribute(event.el, event.data);
			$.preventDefault()
		};
		var feedback = function(event){
			$.common.plaza.feedback(event.el, event.data);
			$.preventDefault()
		};
		var dEvt = $.delegatedEvent(document.body);
			dEvt.add('user_contribute', 'click', contribute);
			dEvt.add('user_feedback', 'click', feedback);
		//关注的
		userTopListDEvent = $.core.evt.delegatedEvent(userTopListNode);
		
		userTopListDEvent.add('followBtn', 'click', function(obj) {
			var conf = $.kit.extra.merge({
				'onSuccessCb': function(spec){
					//出分组层
					groupDialog.show({
						'uid': spec.uid,
						'fnick': spec.fnick,
						'groupList': spec.group,
						'hasRemark': true
					});
				}
			}, obj.data || {});
			followPrototype.follow(conf);
		});
		
		$.common.channel.relation.register('follow', function(data) {
			var followButton = $.sizzle('[action-data*="uid='+data.uid+'"]', userTopListNode)[0];
			if(followButton) {
				followButton.innerHTML = followButton.innerHTML.replace(lang('#L{加关注}'), lang('#L{已关注}'));;
				$.removeClassName(followButton, 'W_addbtn');
				$.addClassName(followButton, 'W_addbtn_es');
				followButton.removeAttribute("action-type");
			}
		});
		
		that.destroy = function() {
			$.removeEvent(tipButton, "mouseover", tipButtonOver);
			$.removeEvent(tipButton, "mouseout", tipButtonOut);
			plazaChosenFeedList.destroy();
			userTopListDEvent.destroy();
		};
		return that;
	};
});
