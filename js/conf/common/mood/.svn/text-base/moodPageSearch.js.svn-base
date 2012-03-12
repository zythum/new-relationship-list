/**
 * @author lianyi@staff.sina.com.cn
 * 用来进行心情模块大家的心情的分页
 */
$Import('kit.extra.language');
$Import('kit.extra.merge');
$Import('kit.dom.parseDOM');
$Import('kit.dom.parentElementBy');
$Import('ui.alert');
$Import('kit.extra.codec');
$Import('common.dialog.moodComment');
$Import('common.channel.mood');

STK.register('common.mood.moodPageSearch' , function($) {
	return function(spec) {
		/**
		 * that是返回的对象
		 * delegateNode是代理事件时传入的节点
		 * contentNode是赋予innerHTML的节点
		 * delegate是代理delegated生成的对象
		 * trans是分页的时候发请求的trans句柄
		 * transName是分页的时候getTrans(transName)使用的transName
		 * sendTrans是生成的trans，用来发请求
		 * fromWhere是告诉分页组件是“弹层”还是“气泡”
		 */
		var that = {} , delegateNode = spec && spec.delegateNode , contentNode = spec && spec.contentNode , fromWhere = spec && spec.fromWhere , delegate , trans = spec && spec.trans , transName = spec && spec.transName,sendTrans;
		/**
		 * extra是用来传入额外参数，与服务器交互的时候extra会发送给服务器，
		 * 现有的参数
		 * {
		 * 	style : "simp"
		 * }
		 * 表示列表的样式类型
		 */
		var extra = spec.extra || {};
		/**
		 * 语言转换使用的函数
		 */
		var $L = $.kit.extra.language;
		/**
		 * mood使用的channel
		 */
		var moodChannel = $.common.channel.mood;
		/*
		* isFirst表示第一次调用,完成之后需要进行setMiddle操作，用来把弹框居中显示
		*/
		var isFirst = 1;
		/**
		 * encodeDecode使用的函数
		 */
		var encodeDecode = $.kit.extra.codec;
		/**
		 * 调用之前进行参数检查
		 */
		var argsCheck = function() {
			if(!$.isNode(contentNode)) {
				throw 'moodPage!contentNode';	
			}
			if(!$.isNode(delegateNode)) {
				throw 'moodPage!delegateNode';	
			}
			if(!trans) {
				throw 'moodPage!trans'	
			}
			if(!transName) {
				throw 'moodPage!transName'	
			}
		};
		/**
		 * 与服务器交互成功之后，将内容填入contentNode
		 */
		var getPageSuccess = function(ret , params) {
			var html = ret.data.html;
			contentNode.innerHTML = html;
			if(isFirst) {
				isFirst = 0;
				$.custEvent.fire(that, "setMiddle", {});
				$.custEvent.fire(that, "setHeightFree", {});
			}
		};
		/**
		 * 代理事件点击行为
		 */
		var setPageHtml = function(opts) {
			try{
				sendTrans.abort();
			} catch(e){}
			var param = $.kit.extra.merge(spec.extra , opts.data);
			sendTrans.request(param);
			$.preventDefault(opts.evt);
		};
		
		//TODO : 添加node-type feedItem
		var shareMood = function(obj) {
			/**
			 * isBubble标识当前是气泡
			 */
			var isBubble = fromWhere == 'bubble'; 
			$.preventDefault(obj.evt);
			/**
			 * 如果是从气泡上过来的，需要告诉抢心情层，阻止body上面的bubble冒泡
			 */
			if(isBubble) {
				moodChannel.fire("bubbleClose" , {type : "stop"});
			}
			/**
			 *  得到对应的当前微博
			 */
			var feedItem = $.kit.dom.parentElementBy(obj.el , contentNode , function (e) {
				if(e.nodeName.toLowerCase() == 'li') {
					return true;
				}
			});
			if(!feedItem) {
				feedItem = $.kit.dom.parentElementBy(obj.el , contentNode , function (e) {
					if(e.nodeName.toLowerCase() == 'dl') {
						return true;
					}
				});
			}
			var tmpNodes = $.kit.dom.parseDOM($.builder(feedItem).list);
			//显示出来的Html
			var feedHtml = tmpNodes.feedHtml.innerHTML;
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
			//心情图标
			var mood_url = decodeURIComponent(obj.data.mood_url);
			//心情图标title
			var mood_title = obj.data.title || '';
			shareDialog = $.common.dialog.moodComment({'mid':mid,'title':title,'nickName':nickName,'content':feedHtml , mood_url : mood_url , mood_title : mood_title});
			/**
			 * 如果是气泡上过来的，hide时候需要开启body上面的冒泡 
			 */
			if(isBubble) {
				$.custEvent.add(shareDialog.dialog , "hide" , function() {
					$.custEvent.remove(shareDialog.dialog , "hide" , arguments.callee);
					moodChannel.fire("bubbleClose" , {type : "start"});
				});
			}
			shareDialog.show();
		}; 
		/**
		 * 获取服务器内容失败的时候提示加载失败
		 */
		var getPageErr = function() {
			$.ui.alert($L('#L{加载失败}'));	
		};
		/**
		 * 绑定这四种点击行为均获取服务器内容
		 */
		var bindDOM = function() {
			delegate = $.delegatedEvent(delegateNode);
			delegate.add('feed_list_page_n' , 'click' , setPageHtml);
			delegate.add('feed_list_page_first' , 'click' , setPageHtml);
			delegate.add('feed_list_page_pre' , 'click' , setPageHtml);
			delegate.add('feed_list_page_next' , 'click' , setPageHtml);
			
			delegate.add("commentmood" , 'click' , shareMood);
		};
		/**
		 * 生成使用的trans
		 */
		var bindTrans = function() {
			sendTrans = trans.getTrans(transName , {
				onSuccess : getPageSuccess,
				onError : getPageErr,
				onFail : getPageErr
			});
		};
		/**
		 * 初始化的时候获取第一页的内容
		 */
		var getFirstPage = function() {
			var param = $.kit.extra.merge(spec.extra , {
				page : 1				
			});
			sendTrans.request(param);	
		};
		/**
		* 绑定自定义事件
		*/
		var bindCustEvt = function() {
			$.custEvent.define(that, "setMiddle");
			$.custEvent.define(that, "setHeightFree");
		};
		/**
		* 执行初始化方法
		*/
		var init = function() {
			argsCheck();
			bindTrans();
			bindDOM();
			bindCustEvt();
			getFirstPage();
		};
		/**
		 * 销毁的时候进行delegatedEvent的销毁
		 */
		var destroy = function() {
			delegate && delegate.destroy && delegate.destroy();
			$.custEvent.undefine(that);
			
		};
		init();
		that.destroy = destroy;
		return that;
	};
});
