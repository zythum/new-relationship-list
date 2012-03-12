/**
 * 在微博列表中心情微博使用的feed插件
 * 
 * @return {Object} 心情微博的插件。
 * @author xionggq | guoqing5@staff.sina.com.cn
 * @create at 2011-12-07
 */
$Import("kit.extra.language");
$Import('common.depand.mood');
$Import('common.trans.mood');
$Import('kit.extra.codec');
STK.register("common.feed.feedList.plugins.mood", function($) {
	/**
	 * utils用来进行preventDefault操作和获取feed节点
	 */
	var utils = $.common.feed.feedList.utils;
	/**
	 * 添加require机制，加快页面访问速度
	 */
	var require = $.common.depand.mood;
	/**
	 * 简繁体使用的函数
	 */
	var $L = $.kit.extra.language;
	/**
	 * 进行encode和decode的函数
	 * 等gaea_1_19.js上线后，可以去掉
	 */
	var encodeDecode = $.kit.extra.codec;
	
	return function(base, opts) {
		/**
		 * 调用之前的检查
		 */
		if (!base) {
			$.log("forward : need object of the baseFeedList Class");
			return;
		}
		opts = $.parseParam({
		}, opts);
		/**
		 * 获取feed列表外层节点
		 */
		var node = base.getNode();
		/**
		 * 外抛对象
		 */
		var that = {};
		/**
		 * moodDialog是简版心情发布器的对话框
		 * shareDialog是抢心情使用的对话框
		 * detailDialog是显示心情列表使用的对话框
		 */
		var moodDialog,shareDialog,detailDialog;
		var locked = false,shareLocked = false,detailLocked = false;

		/**
		 * 延迟载入，绑定简版心情发布器，并显示出来
		 */
		var asynShowMood = require.bind('asyn_smallPublish', function(mid, opts) {
			locked = false;
			if (!moodDialog) {
				moodDialog = $.common.dialog.moodSmallPublish();
				$.custEvent.add(moodDialog, "success", function(evt, data) {
					
				});
			} else {
				moodDialog.reset();	
			}
			moodDialog.show();
		}, {'onTimeout': function() {
			locked = false;
		}});
		/**
		 * 延迟载入，绑定我的心情，大家的心情，并显示出来
		 */
		var asynShowDetail = require.bind('asyn_detail', function(mid, opts) {
			detailLocked = false;
			detailDialog = $.common.dialog.moodList({
				trans : $.common.trans.mood,
				transName : "myfilter"					
			});
			detailDialog.show();
		}, {'onTimeout': function() {
			detailLocked = false;
		}});
		/**
		 * 延迟载入，抢心情
		 * 需要参数：
		 * 	（1）mid，被评论的微博的mid
		 *  （2）title，显示到弹层上的标题
		 *  （3）nickName，用户的昵称
		 *  （4）显示到弹框中当条被评论的内容
		 *  （5）mood_url ，显示弹框的时候，心情使用的url
		 */
		var asynShowShare = require.bind('asyn_share', function(obj) {
			shareLocked = false;
			//需要mid,因为可能是转发的，从服务器取得
			var mid = obj.data.mid;
			//昵称，用来显示弹层，从服务器取得
			var nickName = obj.data.nickName;
			//title,弹层的title
			var title = nickName + $L("#L{的心情}");
			//根据产品需求，这里需要截字（10个汉字+"..."）
			if($.bLength(title) > 20) {
				title = encodeDecode.decode(title);
				title = encodeDecode.encode($.leftB(title , 20)) + "...";
			}
			//得到根feed，用来获取心情内容
			var feedNode = utils.getFeedNode(obj.el , node);
			var tmpNodes = $.kit.dom.parseDOM($.builder(feedNode).list);
			//心情html
			var content = tmpNodes.mood_content.value;
			//心情图标
			var mood_url = decodeURIComponent(obj.data.mood_url);
			//心情图标title
			var mood_title = obj.data.title || '';
			shareDialog = $.common.dialog.moodComment({'mid':mid,'title':title,'nickName':nickName,'content':content , mood_url : mood_url , mood_title : mood_title});
			$.custEvent.add(moodDialog, "success", function(evt, data) {
				
			});
			shareDialog.show();
		}, {'onTimeout': function() {
			shareLocked = false;
		}});
		
		/**
		 * 从接口取得状态锁
		 */
		var sendStateRequest = 0;
		
		/**
		 * 绑定发心情的操作，如果用户当天发过心情，则显示心情列表弹层，如果用户当天没有发过心情，则显示发心情弹层
		 * 通过getpublishstate获取用户当天是否发过心情，来决定使用哪个js进行调用
		 * TODO : 这里可以改用一个接口做这个事情，php开发时间短，暂时解决方案
		 */
		base.getDEvent().add("feed_list_pulishMood", "click", function(obj) {
			utils.preventDefault();
			//首先获取一下用户当天是否发过心情，published为1代表已经发过微博，为0代表没有发过微博
			//如果用户当天发过心情了，则弹出大家的心情层,如果用户当天没有发过心情，则弹出发心情层
			if(sendStateRequest) {
				return;			
			}
			sendStateRequest = 1;
			$.common.trans.mood.getTrans('getpublishstate' , {
				onSuccess : function(ret , data) {
					sendStateRequest = 0;
					var publishd = parseInt(ret.data.published || '0');
					if(publishd) {
						if (detailLocked) return;
						detailLocked = true;
						asynShowDetail();			
					} else {
						if (locked) return;
						locked = true;
						asynShowMood();						
					}
				},
				onError : function() {
					sendStateRequest = 0;
				},
				onFail : function() {
					sendStateRequest = 0;
				}
			}).request();
		});
		
		/**
		 * 绑定抢心情进行的操作
		 */
		base.getDEvent().add("feed_list_shareMood", "click", function(obj) {
			utils.preventDefault();
			if (shareLocked) return;
			shareLocked = true;
			asynShowShare(obj);
		});
		/**
		 * 检测，如果存在了弹层，进行销毁
		 */
		that.destroy = function() {
			if (moodDialog) {
				$.custEvent.remove(moodDialog);
				moodDialog.destroy && moodDialog.destroy();
				moodDialog = null;
			}
			if (shareDialog) {
				$.custEvent.remove(shareDialog);
				shareDialog.destroy && shareDialog.destroy();
				shareDialog = null;
			}
			if(detailDialog) {
				detailDialog.destroy && detailDialog.destroy();
				detailDialog = null;		
			}
			detailDialog = shareDialog = moodDialog = base = node = null;
		};

		return that;
	};
});
