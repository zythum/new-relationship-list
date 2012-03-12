/**
 *
 * feed区域插件，抢心情层，其实是一个评论
 * @id  抢心情弹层
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xionggq | guoqing5@staff.sina.com.cn
 * @create at 2011-12-06
 */
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('ui.dialog');
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('common.trans.comment');
$Import('kit.dom.btnState');
$Import("common.layer.ioError");

STK.register('common.dialog.moodComment', function($) {
	//---常量定义区----------------------------------

	return function(opts) {
		/**
		 * 生成uniqueKey用来使checkbox与label能够映射，包括ie6 
		 */
		var uniqId = $.getUniqueKey();
		/**
		 * 抢心情模板 
		 */
		var temp = '<#et comment data><div class="layer_mood_detail" node-type="moodContent">' +
				'<dl class="details">' +
				'<dt><img height="32" width="32" src="${data.mood_url}"<#if (data.mood_title)> title="${data.mood_title}"</#if>/></dt>' +
				'<dd><span class="arrow"></span>${data.content}</dd>' +
				'</dl>' +
				'<div class="input" node-type="widget">' +
				'<p class="btn_face" node-type="smileyBtn" title="#L{表情}"><span class="faces"></span></p>' +
				'<p class="num W_textb" node-type="numCount">#L{还可以输入}<span>140</span>#L{字}</p>' +
				'<textarea cols="" rows="" name="" node-type="textEl"></textarea>' +
				'<ul class="forword">' +
				'<li><label for="' + uniqId + '"><input type="checkbox" class="W_checkbox" node-type="isForward" id="' + uniqId + '">#L{同时转发到我的微博}</label></li>' +
				'</ul>' +
				'<p class="btn" title="#L{评论}"><a href="javascript:void(0)" class="W_btn_b btn_noloading" action-type="comment" node-type="commentBtn"><span><b class="loading"></b><em node-type="btnText">#L{评论}</em></span></a></p>' +
				'</div>' +
				//'<div class="tips">#L{多多参与评论有助于更好的跟朋友们在微博上保持亲密关系每天评论至少3个好友的心情还可以参与活动领取勋章和其他奖品哦~} <a href="javascript:void(0)">#L{查看详细»}</a></div>' +
				'</div>';
		/**
		 * that是返回的对象,countTimer用来进行字数计算,nodes用来保存节点
		 */
		var that = {} , countTimer , nodes;
		/**
		 * 是多语言使用的函数
		 */
		var $L = $.kit.extra.language;
		/**
		 * editor是实例化textarea之后的实例,option是实例textarea的参数
		 */
		var editor = null, option = {
			//plugin:['smiley','','count'],
			limitNum:140,
			count:'disable'
			//tipText:'rrrrrrrrrrrrr',
			//storeWords : custFuncs.restore()
		};
		/**
		 * DEvent是代理事件使用的对象
		 */
		var DEvent = null;
		/**
		 * dig是最终生成的dialog
		 */
		var dig = $.ui.dialog(opts);
		/**
		 * 进行设置内容和绑定事件的操作
		 */
		var init = function() {
			$.custEvent.define(that, ["success","error"]);
			setBubbleContent();
			bindEvent();
		};
		/**
		 * 根据state值进行按钮中间状态的切换
		 */
		var changeBtn = function(state) {
			var postBtn = nodes.commentBtn;
			//更改字的状态 loading normal
			$.kit.dom.btnState({
				btn : postBtn,
				state : state,
				loadText : $L("#L{提交中...}"),
				commonText : $L("#L{发布心情}")						
			});
		};
		/**
		 * 设置层中的具体内容
		 */
		var setBubbleContent = function()
		{
			dig.setTitle($L(opts.title));
			var html = $.core.util.easyTemplate($L(temp), opts).toString();
			dig.setContent(html);
			parseDOM();
			editor = $.common.editor.base( nodes.moodContent,option);
			editor.widget($.common.editor.widget.face(), 'smileyBtn');
			initCount();
		};
		/**
		 * 保存builder的结果到nodes中
		 */
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.builder(dig.getInner()).list);
		};
		/**
		 * 当输入框focus的时候开始setInterval
		 */
		var startCount = function() {
			countTimer = setInterval(startCountImpl , 200);
		};
		/**
		 * 真正轮询的时候使用的函数，将算出的文字填入numCount节点
		 */
		var startCountImpl = function() {
			var num = editor.API.count();
			var text ;
			if(num > 140) {
				text = $L("#L{已经超过}") + '<span class="W_error">' + (num - 140) + '</span>' + $L("#L{字}");		
			} else {
				text = $L("#L{还可以输入}") + '<span>' + (140 - num) + '</span>' + $L("#L{字}");				
			}
			editor.nodeList.numCount.innerHTML = text;
		};
		/**
		 * 当blur的时候清除掉轮询的timer
		 */
		var stopCount = function(e) {
			clearInterval(countTimer);
		};
		/**
		 * 初始化的时候，为textarea绑定进行字数统计的代码，使用setInterval避免ubuntu系统上的计数错误
		 */
		var initCount = function() {
			$.addEvent(editor.nodeList.textEl , 'focus' , startCount);
			$.addEvent(editor.nodeList.textEl , 'blur' , stopCount);
		};
		/**
		 * 外抛隐藏方法
		 */
		var hide = function() {
			dig && dig.hide();
		};
		/**
		 * 外抛显示方法
		 */
		var show = function() {
			dig && dig.show();
			dig && dig.setMiddle();
			setTimeout(function() {
				try {
					editor.API.focus();	
				} catch(e){}
			} , 100);
		};
		/**
		 * 接口出错的时候进行错误提示
		 */
		var commentError = function(json)
		{
			 isRequest = 0;
			 changeBtn("normal");
			 $.custEvent.fire(that,"error",json);
			 //身份验证
			 json.msg = json.msg||$L("#L{评论失败}");
			 $.common.layer.ioError(json.code,json);
//			 $.ui.alert(json.msg || $L("#L{评论失败}"));
			 //dig && dig.hide();
		};
		/**
		 * 是否正在提交
		 */
		var isRequest = 0;
		/**
		 * 发送评论的点击动作
		 */
	   	var comment =  function()
		   {
			    /**
			     * 因为绑定了输入框的ctrl+enter,所以使用blur先将焦点失去 
			     */
				try {
					nodes.textEl.blur();
				} catch(e){}
				/**
				 * 获取文本框内容 
				 */
				var feedContent = $.trim(editor.API.getWords() || '');
				/**
				 * 输入框没有值的时候进行提示 
				 */
				if (!$.trim(feedContent)) {
					$.common.extra.shine(nodes.textEl);
					return;
				}
				/**
				 * 输入框超出140个字的时候同样进行提示 
				 */
				var count = editor.API.count();
				if(count > 140) {
					$.common.extra.shine(nodes.textEl);
					return;				
				}
				if(isRequest) {
					return;					
				}
				isRequest = 1;
				/**
				 * 制造评论使用的post数据 
				 * act post 表明是一条评论，而不是一个回复
				 * content 是提交给后台的输入框内容
				 * mid是微博id
				 * isroot表示 是否评论的转发的微博，并评论为原作者，因为抢心情，永远评论的是原微博，所以isroot永远是0
				 * location传过去当前页面对应的$CONFIG里的location,行为日志使用，如果以后使用行为日志，需要调用module.getDiss
				 * uid是当前用户的uid
				 * forward是"是否转发给原作者"
				 */
				var param = {};
				param.act = 'post';
				param.content = feedContent;
		   		param.mid = opts.mid;
				param.isroot = 0;
				if(window.$CONFIG && window.$CONFIG.location) {
					param.location = window.$CONFIG.location;						
				}
				param.uid = window.$CONFIG && window.$CONFIG.uid || '';
			   if(nodes["isForward"].checked)
			   {
				       param.forward = 1 ;
			   } else{
					   param.forward = 0 ;
			   }
			   /**
			    * 将按钮置为提交状态 
			    */
			   changeBtn("loading");
			   /**
			    * 调用评论接口进行评论
			    */
			   $.common.trans.comment.getTrans('add', {
				'onSuccess' : function(json) {
					isRequest = 0;
					/**
					 * 成功的时候更改回提交按钮的状态，并使用统一提醒样式，提示评论成功。 
					 */
			       changeBtn("normal");
				   dig && dig.hide();
				   $.ui.litePrompt($L("#L{评论成功}"),{'type':'succM','timeout':'1000'});
				   $.custEvent.fire(that,"success",json);
				   /**
					*	suda布码需求(完成抢心情 key : tblog_mood ,  value : grab_sofa)
					*/
					window.SUDA && window.SUDA.uaTrack && window.SUDA.uaTrack('tblog_mood' , 'complete_grab_sofa');
				},
				'onError' : commentError,
				'onFail' : commentError
			}).request(param);
		   };
		var bindEvent = function() {
			/**
			 * 绑定点击评论按钮的时候进行提交 
			 */
			DEvent = $.delegatedEvent(nodes.moodContent);
			DEvent.add("comment","click",comment);
			/**
			 * 绑定按下ctrl+回车的时候，也进行提交的操作
			 */
			$.hotKey.add(editor.nodeList.textEl, "ctrl+enter", comment);
		};
		/**
		 * 绑定destroy方法供外部调用
		 */
		var destroy = function() {
			countTimer && clearInterval(countTimer);
			editor && editor.nodeList && $.removeEvent(editor.nodeList.textEl , 'focus' , startCount);
			editor && editor.nodeList && $.removeEvent(editor.nodeList.textEl , 'blur' , stopCount);
			$.hotKey.remove(editor.nodeList.textEl, "ctrl+enter", comment);
			DEvent && DEvent.destroy();
			DEvent = null;
			editor.closeWidget();
			editor && editor.destroy && editor.destroy();
			editor = null;
			dig && dig.destroy && dig.destroy();
		};
		init();
		that.show = show;
		that.hide = hide;
		/**
		 * 向外层抛出dialog句柄，用于显示和隐藏的时候，添加一些自定义事件
		 */
		that.dialog = dig;
		that.destroy = destroy;
		return that;
	};
});
