$Import('common.channel.relation');
$Import('common.channel.feed');
$Import('comp.content.darenCard');
//$Import('common.dialog.darenPublish');

STK.register('comp.content.litePersonInfo', function($) {
	return function(node) {
		var that = {},
				nodes = {},
				nodeType,
				feedChannel = $.common.channel.feed,
			//todo  feedChannel是否应该返回定义的广播名
				feedChannelType = {
					'forward':true,
					'publish':true,
					'comment':true,
					'delete':true
				},
//		        followChannelType = {
//					'forward':true,
//					'publish':true,
//					'comment':true,
//					'delete':true
//				};
				followChannel = $.common.channel.relation;
		var dEvt = $.core.evt.delegatedEvent(node);
		var isMyPlace = $CONFIG['oid'] === $CONFIG['uid'];     //页面主人的ID和访问者的ID相同
		var fuid = $CONFIG['oid'];          //页面主人的ID
        var daren;

		var checkId = function(fireConf) {
			fireConf = fireConf || {};
			//他的微博页，如果fireConf的id 和页面主人的id不同，那么litePersonalInfo的信息不需要变化
			if (!isMyPlace && fireConf.fuid !== fuid) {
				return;
			}
		};
		var listenerTypeToNodeType;
		var listenerFunc = {};
		var bindListener = function() {

			if (isMyPlace) {

				//我的微博页
				listenerTypeToNodeType = {
					'forward':'weibo',			//加微博
					'publish':'weibo',			//加微博
					'comment':'weibo',			//加微博
					'delete':'weibo-'		//减微博
//					,'removeFans':'fans-',	 //移除粉丝
//					'follow':'follow',				  //加关注
//					'unFollow':'follow-'	// 移除关注
				};

			} else {
				//他的微博页
				listenerTypeToNodeType = {	  // 加上后缀"-"代表是减1操作
//					'publish':'weibo',			//加微博
					//'addFriends':'friends',			 //加好友
					//'removeFriends':'friends-',	  //减好友
					'removeFans':'follow-',	 //移除他粉丝 ，他的关注-1
					'follow':'fans',				  //加他关注，他的粉丝+1
					'unFollow':'fans-'	// 移除他关注  ，他的粉丝-1
				};
			}



			var regex = new RegExp(/(\w*)(-?)$/);
			var regexRet = {};

			/**
			 * dom 中的数字 +1 或-1
			 * @param dom
			 * @param operation
			 */
			var changNum = function(dom, operation) {
				if (!dom) { return; }
				var num = 0 | dom.innerHTML;
				dom.innerHTML = operation ? --num : ++num;
			};

			for (var i in listenerTypeToNodeType) {
				listenerFunc[i] = (function(i) {
					regexRet[i] = regex.exec(listenerTypeToNodeType[i]);
					return function() {
						checkId();
						changNum(nodes[regexRet[i][1]], regexRet[i][2]);
					}
				})(i);

				if (i in feedChannelType) {
					feedChannel.register(i, listenerFunc[i]);
				} else {
					followChannel.register(i, listenerFunc[i]);
				}
			}

		};
		var share = function(obj){
			var title = obj.data.title;
			var content = obj.data.content;
			var publish = $.common.dialog.publish({
				'styleId':'0',
				'smileyBtn' : false,
				'picBtn' : false
			});

			publish.show({
				'title': title,
				'content': content
			});
			publish.disableEditor(true);
		};
		var bindDom = function(){
			dEvt.add("share", "click", share);
           var darenDom = $.sizzle("[node-type='daren']",node);
           daren = darenDom[0] && $.comp.content.darenCard(darenDom[0],{'uid':$CONFIG["oid"]});
            //$CONFIG['daren'] && $.common.dialog.darenPublish();
		};
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function() {
			argsCheck();
			parseDOM();
			bindDom();
			bindListener();
		};

		var argsCheck = function() {
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.litePersonInfo]:node is not a Node!";
			}
		};


		var parseDOM = function() {
			nodeType = {
				'follow' :'follow',
				'fans' :'fans',
				//'friends' :'friends',
				'weibo' :'weibo'
			};
			for (var i in nodeType) {
				nodes[i] = $.core.dom.sizzle('.W_person_Num strong[node-type=' + nodeType[i] + ']', node)[0];
//				if (!nodes[i]) {
//					throw '[STK.comp.content.litePersonInfo]:nodes["' + nodeType[i] + '"] is undefined';
//				}
			}
		};

		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
            daren && daren.destroy &&daren.destroy();
			for (var i in listenerTypeToNodeType) {
				if (i in feedChannelType) {
					feedChannel.remove(i, listenerFunc[i]);
				} else {
					followChannel.remove(i, listenerFunc[i]);
				}
			}

		};
		init();

		that.destroy = destroy;

		return that;
	};
});