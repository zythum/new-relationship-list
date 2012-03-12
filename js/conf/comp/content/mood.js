/**
 * @author lianyi@staff.sina.com.cn
 * 
 * 模块说明：该模块是首页右侧最上面的小块，提供发心情的入口（一个按钮），判断用户是否发过心情，来显示不同的bubble
 * 如果用户当天没有发过心情，则显示的是发心情层，如果用户当天已经发过了心情，则显示的是心情列表层
 * 判断逻辑是插件common.bubble.moodFeedPublish完成的，接受一个showDialogType，为moodlist,或publish
 * 是publish的时候显示的是发心情的bubble层，是moodlist的时候显示的是心情列表层，本文件只完成了事件绑定，
 * channel更改状态绑定（发完心情后，需要改变该模块的文案为已发心情），组件调用(common.bubble.moodFeedPublish)
 */
/**
 * 添加 "气泡提醒模块" 展开心情气泡的支持，使用versionTip解决
 * callBackId为show_mood_bubble，用来标识当前模块与主站运营气泡的唯一标识
 */
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.depand.mood');
$Import('common.channel.mood');
$Import('common.channel.versionTip');
STK.register("comp.content.mood", function($) {
	return function(node) {
		/**
		 * that 用于返回句柄调用
		 * nodes是[node-type]的节点保存对象
		 * bub是生成的bubble，需求要求根据用户是否发过心情显示不同的层
		 * locked用于防止require的时候多次点击，出现多个层
		 * require使用require插件对心情进行后置加载，提高页面加载速度
		 * moodChannel用于用户成功发布完心情后，将右侧的心情模块的文案改为已发心情，因为是不同的模块，使用channale解决。
		 * $L简繁体语言转换函数
		 */
		var that = {} , nodes , bub,locked = false;
		var require = $.common.depand.mood , moodChannel = $.common.channel.mood , $L = $.kit.extra.language , tipChannel = $.common.channel.versionTip;
		//气泡自定义事件ID，用来标识与气泡进行交互
		var tipCallBackId = 'show_mood_bubble';
		/**
		 * 这个变量用于保存住应该显示哪个bubble，是发心情的bubble还是查看心情列表的bubble
		 */
		var showDialogType ;
		/**
		 * showArrow用来标记是不是龙年，默认不是龙年，龙年不要bubble的箭头
		 */
		var showArrow = 1;
		/**
		 * 调用之前检查的函数
		 */
		var argsCheck = function() {
			if (!$.isNode(node)) {
				throw 'mood publish need a node argument';
			}
		};
		/**
		 * 调用builder,parseDOM进行node-type解析，便于后续dom操作
		 */
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.builder(node).list);
		};
		/**
		 * 把点击心情这块的冒泡解决了，现在使用stopEvent会造成点击的时候其他的bubble隐藏不掉
		 */
		var bodyClick = {
			isShow :  0
		};
		
		/**
		 * 使用requrie进行发心情bubble的绑定，加快页面加载速度
		 */
		var asynOpenComment = require.bind('asyn_publish', function(obj) {
					locked = false;
					if (!bub || bub.error) {
						bub = $.common.bubble.moodFeedPublish({
							showDialogType : showDialogType	
						});
						bub.setBubbleContent();
					} else {
						bub.reset();
					}
					/*ui要求将气泡显示位置进行了调整，为了1024分辨率的朋友*/
					bub.setLayout(node, {
						offsetX : -130
					});
					var tmpBub = bub.getBubble();
					tmpBub.setArrow({
						style : showArrow ? "left:auto;right:30px" : "left:auto;right:30px;display:none"
					});
					var showCust = function() {
						bodyClick.isShow = 1;						
					};
					$.custEvent.add(tmpBub , "show" , showCust);
					$.custEvent.add(tmpBub , "hide" , function() {
						bodyClick.isShow = 0;
						$.custEvent.remove(tmpBub , "show" , showCust);
						$.custEvent.remove(tmpBub , "hide" , arguments.callee);
					});
					/*ui要求将气泡显示位置进行了调整，为了1024分辨率的朋友*/
					bub.show();
				}, {'onTimeout': function() {
					locked = false;
				}});
		/**
		 * 绑定事件使用的函数包装句柄，封装一下，看起来更明白
		 */
		var bindDOMFuns = {
			/**
			 * 点击发布心情的函数，对bubble类型赋值，然后判断显示不同的bubble
			 * @param {Object} e
			 * 事件对象
			 */
			moodPublish : function(e) {
				e && $.preventDefault(e);
				if (locked) {
					return;
				}
				locked = true;
				if(bodyClick.isShow) {
					locked = 0;
					return;					
				}
				var target = nodes.moodPublish;
				var datas = $.queryToJson(target.getAttribute("action-data"));
				showDialogType = datas.showType;
				if(!$.core.util.browser.IE6 && typeof datas.showArrow != 'undefined') {
					showArrow = parseInt(datas.showArrow);
				}
				asynOpenComment();
			}
		};
		/**
		 * 绑定事件的函数，添加addEventListener与attachEvent
		 */
		var bindDOM = function() {
			$.addEvent(nodes.moodPublish, 'click', bindDOMFuns.moodPublish);
		};
		/**
		 * 绑定心情channel的句柄，别的模块通知mood_channel将右上角模块内的状态变更
		 */
		var bindListenerFuns = {
			changeMoodState : function() {
				//$.addClassName(nodes.moodPublish , "W_texta");
				$.addClassName(nodes.moodPublishBtn , 'ed');
				nodes.moodPublishBtn.setAttribute('title' , $L('#L{点击这里可以看大家的心情}'));
				var datas = $.queryToJson(nodes.moodPublish.getAttribute("action-data"));
				datas['showType'] = 'moodlist';
				nodes.moodPublish.setAttribute("action-data" , $.jsonToQuery(datas));
				
				//龙年特殊处理，一开始没箭头，发成功了就会有箭头  错了，要求无论如何龙年这一个月都有
				/*
				if(showArrow == 0) {
					showArrow = 1;
					var tmpBub = bub.getBubble();
					tmpBub.setArrow({
						style : "left:auto;right:30px"
					});
				}
				*/
			},
			/**
			 * 如果发现"运营气泡的频道抛出的ID"为show_mood_bubble，则展开心情气泡 
			 */
			callBack : function(datas) {
				if(datas.callBackId == tipCallBackId) {
					bindDOMFuns.moodPublish();					
				}
			}
		};
		/**
		 * 绑定心情channel的函数
		 */
		var bindListener = function() {
			moodChannel.register('changeMoodState' , bindListenerFuns.changeMoodState);
			/**
			 * 气泡channel注册频道支持，展开心情气泡
			 */
			tipChannel.register("callBack" , bindListenerFuns.callBack);
		};
		/**
		 * 初始化这个模块
		 */
		var init = function() {
			argsCheck();
			parseDOM();
			bindDOM();
			bindListener();
		};
		init();
		/**
		 * 页面卸载和bigpipe刷新的时候进行内存释放
		 */
		var destroy = function() {
			$.removeEvent(nodes.moodPublish, 'click', bindDOMFuns.moodPublish);
			bub && bub.destroy && bub.destroy();
			moodChannel && moodChannel.remove("changeMoodState" , bindListenerFuns.changeMoodState);
			tipChannel && tipChannel.remove("callBack" , bindListenerFuns.callBack);
		};
		/**
		 * 提供外层destroy句柄调用
		 */
		that.destroy = destroy;
		return that;
	};
});
