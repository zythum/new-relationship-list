/**
 *   心情微博发布气泡
 * @id
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xionggq | guoqing5@staff.sina.com.cn
 * @modified lianyi@staff.sina.com.cn
 * @create at 2011-12-02
 * @comment at 2011-12-15
 * 模块说明：
 * 	   根据传入的showDialogType参数为moodlist和publish进行判断显示不同的bubble层
 * 	   moodlist为显示心情列表层（分为我的心情：日历，他人的心情：分页列表） 调用 common.mood.moodFilter
 *     publish 为显示发心情层 调用 common.mood.moodPublish
 */
$Import('common.extra.shine');
$Import('ui.bubble');
$Import('common.trans.mood');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('ui.alert');
$Import('common.mood.moodPublish');
$Import('common.channel.mood');
$Import('common.mood.moodFilter');
$Import('common.mood.shareFeed');
$Import('common.channel.mood');

STK.register('common.bubble.moodFeedPublish', function($) {
    //---常量定义区----------------------------------
	
    //-------------------------------------------
    return function(opts) {
		/**
		 * that用于抛出句柄，custObj为自定义污染对象，在心情日历模块中需要阻止bubble的body冒泡，提供自定义事件进行调用，bubble是
		 * 在本文件中进行实例化的，而日历是在common.mood.moodCalendar中，存在直接引用关系，所以使用custEvent进行调用
		 */
        var that = {} , custObj = {};
		/**
		 * $L用来进行繁体简体转换
		 */
        var $L = $.kit.extra.language;
		/**
		 * 心情的channel
		 */
		var moodChannel = $.common.channel.mood;
        /**
         * 模板都是从后端读取的，一开始加载的时候显示一个loading的html，提高用户体验
         */
		var LOADING = $L('<div class="W_loading" style="width:325px;padding-top:15px;padding-bottom:15px;text-align:center"><span>#L{正在加载，请稍候}...</span></div>');
        /**
         * DEvent用来进行代理事件
         * publishHtml用来缓存读取过来的html，避免多次请求
         * filterMood是我的心情和大家的心情的插件
         * bubbleListDom用来获取发布心情的dom nodes,用来事件绑定，dom操作
         * publisher是调用common.mood.moodPublish获取到的插件对象
         * shareFeed是分享微博（天气和星座）使用的
         */
		var DEvent = null,  publishHtml = null,filterMood = null, bubbleListDom = null, publisher = null , shareFeed;
        /**
         * 使用isHold避免模块被多次创建，优化页面性能
         * 默认如果不传showDialogType则认为是弹出发布层
         */
		opts = $.parseParam({
            //'template':LOADING,
            'isHold': true,
            //publish 弹出发布层 , moodlist 弹出列表层
            'showDialogType' : "publish"
        }, opts);
        /**
         * 取出showDialogType，便于调用
         */
		var showDialogType = opts.showDialogType;
		/**
		 * 生成bubble层，设置默认文案，显示loading信息，提高用户体验
		 */
        var bubble = $.ui.bubble(opts);
        bubble.setContent(LOADING);
		/**
		 * 绑定channel的方法
		 */
		var bindChannel = function() {
			/**
			 * 绑定channel用来进行bubble的startClose操作和stopClose操作
			 */
			moodChannel.register('bubbleClose' , bindListenerFuns.bubbleClose);
		};
		/**
		 * 绑定channel使用的函数
		 */
		var bindListenerFuns = {
			bubbleClose : function(data) {
				var type = data.type;
				if(type == "start") {
					setTimeout(function() {
						bindCustFuncs.startClose();												
					} , 50);
				} else if(type == "stop") {
					bindCustFuncs.stopClose();
				}
			}
		};
		//入口
        var init = function() {
            bindEvent();
            bindCustEvt();
			bindChannel();
        };
		/**
		 * 如果获取心情层的弹层html失败了，进行提示，并告诉外层comp.content.mood，下次点击的时候继续读取服务器内容
		 */
        var getBubbleError = function(evt, json) {
            $.ui.alert(json.msg || $L("#L{获取心情数据失败}"));
            bubble && bubble.hide();
			//告诉外层出错了，外层重新请求
			that.error = 1;
        };
		/**
		 * 发布成功之后，将服务器返回的信息重新写入bubble，并实例化心情列表层，通过channel告诉comp.content.mood，更改一下右侧模块
		 */
        var publishSuccess = function(evt, json) {
                var html = json.data.html;
                publishHtml = html;
                bubble.setContent(html);
				var nodesT = $.kit.dom.parseDOM($.builder(bubble.getDomList().outer[0]).list);
                $.setStyle(nodesT.moodCalendar , "height" , "236px");
				var loadingHtml = $L('<div class="W_loading"><span>#L{正在加载，请稍候}...</span></div>');
				nodesT.contentArea.innerHTML = loadingHtml;
				//$.setStyle(nodesT.contentArea , "borderBottomWidth" , "0px");
				filterMood = $.common.mood.moodFilter(bubble.getDomList().outer[0], {
                	custObj : custObj
            	});	
                moodChannel.fire("changeMoodState", {state : "published"});
				showDialogType = 'moodlist';
				/**
				 * 返回数据后里面html的数据绑定
				 */
				bindDomInner();
        };
        var publishError = function(evt, json) {
//			var doms = publisher && publisher.getDom();
//			var el = doms && doms.postFeed[0];
//			if(el) {
//				var tipAlert = $.ui.tipAlert({
//					showCallback: function() {
//						setTimeout(function() {
//							tipAlert && tipAlert.anihide();
//						}, 600);
//					},
//					hideCallback: function() {
//						tipAlert && tipAlert.destroy();
//						tipAlert = undefined;
//					},
//					msg: json.msg,
//					type: "error"
//				});
//				tipAlert.setLayerXY(el);
//				tipAlert.aniShow();				
//			}
        };
		/**
		 * 设置bubble内容，根据showDialogType来判断bubble里是发心情层还是心情列表层
		 * 如果显示的是心情列表层，传递参数published给服务器，告诉他，我要心情列表层
		 * 在这里设置了发布成功之后的自定义事件，使发布那个组件可定制化
		 */
        var setBubbleContent = function() {
			var params = {};
			if(showDialogType != 'publish') {
				params.published = 1;				
			}
			$.common.trans.mood.getTrans('getMoodFeed', {
                'onSuccess' : function(json) {
					//告诉外层，出错又好了
					that.error = 0;
					//弹出发布层
                    if (showDialogType == 'publish') {
                        var html = json.data.html;
                        publishHtml = html;
						bubble.setContent(html);
						
                        bubbleListDom = $.builder(bubble.getDomList().outer[0]).list;

                        publisher = $.common.mood.moodPublish(bubble.getDomList().inner[0] , custObj);
                        
						$.custEvent.add(publisher, "success", publishSuccess);
                        $.custEvent.add(publisher, "error", publishError);
						/**
						 * 表情显示出来的时候阻止body冒泡
						 */
						$.custEvent.add(publisher, "faceShow" , function() {
							bindCustFuncs.stopClose();							
						});
						/**
						 * 表情显示出来的时候开启body冒泡
						 */
						$.custEvent.add(publisher, "faceHide" , function() {
							setTimeout(function() {
								bindCustFuncs.startClose();									
							} , 10);
						});
						/**
						 * 返回数据后里面html的数据绑定
						 */
						bindDomInner();
                    } else {
                        //弹出心情层
                        publishSuccess({}, {
                            data : {
                                html : json.data.html
                            }
                        });
                    }
                },
                'onError' : getBubbleError,
                'onFail' : getBubbleError
            }).request(params);
        };
        /**
         * 心情发布层上面的关闭，先隐藏，再发请求，告诉服务器这个点了关闭，服务器记住一个状态
         * 发送给服务器的数据是打在action-data里的，这样改起来不用js进行参与。
         */
		var colseTip = function(obj) {
			var data = obj.data;
			if (bubbleListDom.bubbleTip) {
                bubbleListDom.bubbleTip[0].style.display = "none";
            }
			$.common.trans.mood.getTrans('closetip', {
				onSuccess : $.funcEmpty,
				onError:$.funcEmpty
			}).request(data);
            return $.preventDefault();
        };
		/**
		 * 向外层提供reset方法，重置bubble
		 */
        var reset = function() {
			if(showDialogType == 'publish') {
				publisher && publisher.reset && publisher.reset();	
			}
		};
		/**
		 * 向外部提供一个设置箭头的方法，代表显示bubble的时候
		 */
        var setLayout = function(node, bubOpt) {
            if (!$.isNode(node)) return;
            if (bubble) {
                bubble.setLayout(node, bubOpt);
            }
        };
		/**
		 * 向外部提供一个隐藏的函数，用来隐藏bubble
		 */
        var hide = function() {
            bubble && bubble.hide();
        };
		/**
		 * 向外部提供一个显示的函数，用来显示bubble
		 */
        var show = function() {
            bubble && bubble.show();
        };
		/**
		 * 重新build一下dom
		 */
		var bindDomInner = function() {
			shareFeed && shareFeed.updateBuildNodes(bubble.getDomList().inner[0]);
			bubbleListDom = $.builder(bubble.getDomList().outer[0]).list;
		};
		/**
		 * 绑定代理事件，用来进行事件控制
		 */	
        var bindEvent = function() {
			var contentNode = bubble.getDomList().inner[0];
			var layoutNode = bubble.getDomList().layoutContent[0];
			DEvent = $.delegatedEvent(contentNode);
            DEvent.add('closeTip', 'click', colseTip);
			shareFeed = $.common.mood.shareFeed({
				node : contentNode,
				layoutNode : layoutNode
			});
		};
		/**
		 * 自定义事件使用的函数句柄，用来找到函数
		 * 
		 * startClose : 当在bubble上面某一天的日历上面mouseover显示一个心情提示层的时候，停止bubble在body上的冒泡
		 * 
		 * stopClose :  当在bubble上面某一天的日历上面mouseout的时候，开始bubble在body上的冒泡
		 */
        var bindCustFuncs = {
            startClose : function() {
                bubble && (bubble.startBoxClose());
            },
            stopClose : function() {
                bubble && (bubble.stopBoxClose());
            },
			setHeightFree : function() {
				var nodesT = $.kit.dom.parseDOM($.builder(bubble.getDomList().outer[0]).list);
                $.setStyle(nodesT.moodCalendar , "height" , "");
			}
        };
		/**
		 * 绑定自定义事件，
		 * 		鼠标移到某一个日历上显示一个提示层的时候，触发的事件
		 * 		鼠标移出某一个日历上隐藏一个提示层的时候，触发的事件
		 */
        var bindCustEvt = function() {
            $.custEvent.define(custObj, "stopClose");
            $.custEvent.add(custObj, "stopClose", bindCustFuncs.stopClose);
            $.custEvent.define(custObj, "startClose");
            $.custEvent.add(custObj, "startClose", bindCustFuncs.startClose);
			$.custEvent.define(custObj , "setHeightFree");
			$.custEvent.add(custObj , "setHeightFree"  , bindCustFuncs.setHeightFree);
        };
		/**
		 * 提供destroy函数，供外部调用
		 * 分别卸载发心情的组件
		 * 	   卸载心情列表的组件
		 *     bubble的卸载
		 */
        var destroy = function() {
			moodChannel.remove('bubbleClose' , bindListenerFuns.bubbleClose);
			DEvent && DEvent.destroy && DEvent.destroy();
            publisher && publisher.destroy && publisher.destroy();
            filterMood && filterMood.destroy && filterMood.destroy();
            bubble && bubble.destroy && bubble.destroy();
			DEvent = publisher = filterMood = bubble = undefined;
        };
		/**
		 * 执行初始化函数
		 */
        init();
		/**
		 * 向外层提供函数支持，分别是
		 * 	（1）显示bubble
		 *  （2）隐藏bubble
		 *  （3）设置箭头位置并显示
		 *  （4）外层destroy函数
		 *  （5）判断并调用设置bubble内容
		 *  （6）重新设置bubble中的内容
		 */
        that.show = show;
        that.hide = hide;
        that.setLayout = setLayout;
        that.destroy = destroy;
        that.setBubbleContent = setBubbleContent;
        that.reset = reset;
		that.getBubble = function() {
			return bubble;	
		};
        return that;
    };
});
