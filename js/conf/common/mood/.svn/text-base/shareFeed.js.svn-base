/**
 * @authored by lianyi@staff.sina.com.cn
 * 心情分享微博插件（分享天气和星座） 
 */

$Import("common.trans.mood");
$Import("kit.extra.language");
$Import("common.channel.mood");
$Import("kit.dom.parseDOM");
$Import("common.dialog.publish");
$Import("ui.litePrompt");

STK.register('common.mood.shareFeed', function($) {
    //-------------------------------------------
    return function(opts) {
		
		var that = {} , collestionTrans , DEvent;
		
		var $L = $.kit.extra.language , moodChannel = $.common.channel.mood;
		
		/**
		 * 星座下拉使用
		 * 
		 * hoverNodes 保存服务器数据回来之后的节点
		 * 
		 * dropListIsShow 保存星座下拉层是否处在显示状态 
		 * 
		 * lastCollest 保存上次点击的星座是哪一个
		 * 
		 */
		var hoverNodes , dropListIsShow = 0 , lastCollest;
		
		var ioFuns = {
			/**
			 * 成功的函数
			 * (1)局部刷新
			 * (2)重新赋予分享按钮使用的数据
			 * (3)更改a标签的内容和链接
			 */
			success : function(ret , data) {
				hoverNodes.collestionContent.innerHTML = ret.data.html;
				var shareBtn = hoverNodes.shareCollestion;
				var obj = $.queryToJson(shareBtn.getAttribute("action-data"));
				obj.shareText = ret.data.shareText;
				obj.title = ret.data.title;
				shareBtn.setAttribute("action-data" , $.jsonToQuery(obj));
				hoverNodes.dispCollecstion.innerHTML = lastCollest;
				hoverNodes.collestionDrop.href = decodeURIComponent(ret.data.url);
			},
			/**
			 * 失败的函数
			 */
			error : function() {
				hoverNodes.collestionContent.innerHTML = $L("#L{对不起，加载失败}");
			}
		};
		
		var bindDOMFuns = {
			/**
			 * 星座列表显示出来之后在空白的地方点击会隐藏掉星座列表
			 */
			bodyClick : function(evt) {
				evt = $.fixEvent(evt);
				var target = evt.target;
				if(hoverNodes.collestionDropDown === target || $.core.dom.contains(hoverNodes.collestionList, target)) {
					return;
				} else {
					dropListIsShow = 0;
					$.setStyle(hoverNodes.collestionList , "display" , "none");
					$.removeEvent(document.body , "click" , bindDOMFuns.bodyClick);
				}
			},
			/**
			 * 分享天气，星座
			 */
			shareText : function(obj) {
				$.preventDefault(obj.evt);
				//阻止body冒泡
				moodChannel.fire("bubbleClose" , {type : "stop"});
				/**
				 * 获取title和text
				 */
				var text = decodeURIComponent(obj.data.shareText);
				var publish = $.common.dialog.publish();
				var title = obj.data.title;
				/**
				 * 显示简版发布器，并添加上自定义事件
				 * (1)当简版弹层隐藏的时候，开启body上面的冒泡
				 * (2)当发布成功的时候，弹出分享成功
				 */
				publish.show({
					'title': title,
					'content' : text
				});
				$.custEvent.add(publish, 'publish', function(){
					$.ui.litePrompt($L("#L{分享成功}"),{'type':'succM','timeout':'500','hideCallback':function(){
						publish.hide();					
					}});							
					$.custEvent.remove(publish,'publish',arguments.callee);
				});
				$.custEvent.add(publish, 'hide', function(){
					setTimeout(function() {
						moodChannel.fire("bubbleClose" , {type : "start"});	
					} , 50);
					$.custEvent.remove(publish,'hide',arguments.callee);
				});
				
			},
			/**
			 * 更换具体的星座
			 */
			collestionChange : function(obj) {
				$.preventDefault(obj.evt);
				var collestData = obj.data;
				collestionTrans.abort();
				collestionTrans.request(collestData);
				$.setStyle(hoverNodes.collestionList , "display" , "none");
				dropListIsShow = 0;
				lastCollest = obj.el.innerHTML;
			},
			/**
			 * 点击下拉箭头显示下拉层
			 * (1)重新设置下拉层的位置
			 * (2)为body添加单击事件，点击空白的时候层消失
			 */
			collestionClick : function(obj) {
				$.preventDefault(obj.evt);
				if(dropListIsShow) {
					$.setStyle(hoverNodes.collestionList , "display" , "none");
					dropListIsShow = 0;
					return;
				}
				dropListIsShow = 1;
				var pos1 = $.position(opts.layoutNode);
				var pos2 = $.position(hoverNodes.collestionDrop);
				var size = $.core.dom.getSize(hoverNodes.collestionDrop);
				var left = pos2.l - pos1.l - 5;
				var top = pos2.t - pos1.t + size.height + 2;
				$.setStyle(hoverNodes.collestionList , "left" , left + "px");
				$.setStyle(hoverNodes.collestionList , "top" , top + "px");
				$.setStyle(hoverNodes.collestionList , "display" , "");
				$.addEvent(document.body , "click" , bindDOMFuns.bodyClick);
			}
		};
		
		var argsCheck = function() {
			if(!$.isNode(opts.node)) {
				throw 'shareFeed need opts.node to bind event';
			}
		};
		var bindTrans = function() {
			/**
			 * 切换星座使用的接口Trans
			 */
			collestionTrans = $.common.trans.mood.getTrans("changecollestion" , {
				onSuccess : ioFuns.success,
				onError : ioFuns.error,
				onFail : ioFuns.error
			});
		};
		var parseDOM = function() {
			hoverNodes = $.kit.dom.parseDOM($.builder(opts.node).list);
		}; 
		var bindDOM = function() {
			DEvent = $.delegatedEvent(opts.node);
			/**
			 * 分享天气，星座
			 */
			DEvent.add('shareWeather' , 'click' , bindDOMFuns.shareText);
			DEvent.add('shareCollestion' , 'click' , bindDOMFuns.shareText);
			/**
			 * 显示下拉层
			 */
			DEvent.add('collestionDropDown' , 'click' , bindDOMFuns.collestionClick);
			/**
			 * 更换某一个星座
			 */
			DEvent.add('collestionChange' , 'click' , bindDOMFuns.collestionChange);
		};
		/**
		 * 入口
		 */
		var init = function() {
			argsCheck();
			bindTrans();
			parseDOM();
			bindDOM();
		};
		
		init();
		/**
		 * 抛出buildNodes
		 */
		that.updateBuildNodes = parseDOM;
		/**
		 * 抛出destroy
		 */
		that.destroy = function() {
			DEvent && DEvent.destroy && DEvent.destroy();
		};
						
		return that;
    };
});
