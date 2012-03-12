/**
 * @fileoverview
 * 转发到邮件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
$Import('ui.litePrompt');
STK.register("common.forward.toMail", function ($){
	//---常量定义区----------------------------------
	var lang = $.kit.extra.language;
	// HTML 模板
	var TEMPLATE = lang(''
	+ '<#et userlist data>'
	+ '<div node-type="toMail_client">'
		+ '<dl class="layer_forward_group clearfix">'
			+ '<dt>电子邮箱：</dt>'
			+ '<dd><input type="text" name="" class="W_input" /></dd>'
			+ '<dt>邮件内容：</dt>'
			+ '<dd>'
				+ '<div class="feed_repeat">'
					+ '<div class="input clearfix">'
						+ '<textarea name="" rows="" cols="" node-type="textEl">//@${data.forwardNick}${data.reason}//@${data.originNick}:${data.origin}</textarea>'
						+ '<div class="action clearfix" node-type="widget">'
							+ '<span class="faces" title="#L{表情}" node-type="smileyBtn"></span>'
							+ '<span class="img" title="#L{图片}" node-type="picBtn"></span>'
							+ '<span class="fujian" title="#L{附件}" node-type="attachBtn"></span>'
						+ '</div>'
						+ '<p class="btn"><a href="#" onclick="return false;" class="W_btn_a" node-type="preview"><span>预览邮件</span></a>'
							+ '<a href="#" onclick="return false;" class="W_btn_b" node-type="submit"><span>发送</span></a></p>'
					+ '</div>'
				+ '</div>'
			+ '</dd>'
		+ '</dl>'
	+ '</div>');
	// 文案
	var MSG = {
		'notice' : '#L{请输入转发理由}',
		'defUpdate' : '#L{转发微博}',
		'netError' : '#L{系统繁忙}',
		'success' : '#L{转发成功}!',
		'retry' : '#L{读取失败，请}<a href="#" onclick="return false;" action-type="retry" value="retry">#L{重试}</a>',
		'off' : '#L{关闭}',
		'on' : '#L{开启}'
	};
	// 编辑器初始选项
	var options={
		'tipText' : lang(MSG.notice),
		'storeWords' : true,
		'count' : 'disable'
	};
	/**
	 * 
	 * @param {Object} client	外容器，这里是 dialog.inner
	 * @param {Object} mid		微博ID
	 * @param {Object} opts		选项
	 */
	return function(client, mid, opts){
		if(client == null || mid == null){
			throw new Error('[common.forward.toMail]Required parameter client is missing');
		}
		var editor,		// 编辑器对象
			doms,		// dom 集合
			conf, lock, lockReason/*=loading or error=*/,
			trans,		// 转发接口
			simpleForwardLinks,	// 简版转发链接口
			detailForwardLinks,	// 全部转发链接口
			node,		// 外容器
			status,		// 转发链开关
			currentStatus,	//
			delegate;
		var that = {};
		that.client = client;
		that.opts = opts || {};
		that.isInit = false;
		
		// 提交参数的 style_type
		conf = $.parseParam({
			'styleId' : '1'
		}, opts);
		
		// 自定义事件定义
		$.custEvent.define(that, ['forward', 'hide', 'center']);
		
		// 提交转发
		var updateForward = function(){
			if(lock){
				if(lockReason === 'error'){
					$.common.extra.shine(doms.textEl);
				}
				return;
			}
			var content = $.trim(editor.API.getWords() || '');
			if(content === lang(MSG.notice)){
				content = '';
			}
			lock = true;
			lockReason = 'loading';
			doms.submit.className = 'W_btn_a_disable';	// 提交中状态
			
			var params = {};
			params.mid = mid;
			params.style_type = conf.styleId;
			params.reason = content || lang(MSG.defUpdate);
            /**
             * Diss
             */
            params = $.module.getDiss(params, doms.submit);
			trans.request(params);
		};
		// Ctrl + Enter 处理
		var ctrlUpdateForward = function(e){
			if((e.keyCode === 13 || e.keyCode === 10) && e.ctrlKey){
				updateForward();
			}
		};
		// 判断是否能转发
		var canForward = function(evt,infos){
			var key = infos.isOver;
			if(!key || infos.count === 0){
				lock = false;
				lockReason = '';
				// 长度大于1正常显示，否则显示灰色按钮
//				doms.submit.className = (infos.count > 0) ? 'W_btn_b' : 'W_btn_a_disable';
				doms.submit.className = 'W_btn_b';
				if(!key){
					doms.num.innerHTML = lang('#L{还可以输入}<span>' + (140 - infos.count) + '</span> #L{字}');
				}
			}else{
				lock = true;
				lockReason = 'error';
				doms.submit.className = 'W_btn_a_disable';
				//doms['num'].innerHTML = '已经超过<span class="W_error">' + Math.abs(140 - infos.count) + '</span> 字';
			}
		};

		// 提交成功的处理
		var success = function(ret, params){
			lock = false;
			lockReason = '';
			doms.submit.className = 'W_btn_b';
			try {
				$.custEvent.fire(that, 'forward', [ret.data, params]);
				$.common.channel.feed.fire('forward', [ret.data, params]);
			}catch(exp){}
			
			$.ui.litePrompt(lang(MSG.success),{'type':'succM','timeout':'500'});
			$.custEvent.fire(that, 'hide');
			
		};
		// 提交出错的处理
		var error = function(ret, params){
			lock = false;
			lockReason = '';
			doms.submit.className = 'W_btn_b';
			$.ui.alert(ret.msg || lang(MSG.netError));
		};
		// 提交接口异常处理
		var fail = function(ret, params){
			lock = false;
			lockReason = '';
			doms.submit.className = 'W_btn_b';
			$.ui.alert(lang(MSG.netError));
		};

		/*------------lazyInit-------------*/
		// 绑定编辑器
		var parseDOM = function(){

			node = $.builder(client);
			node = $.kit.dom.parseDOM(node.list).toMail_client;
				
			editor = $.common.editor.base(node, options);
			editor.widget($.common.editor.widget.face(),'smileyBtn');
			editor.widget($.common.editor.widget.image(),'picBtn');
			doms = editor.nodeList;
			$.kit.dom.autoHeightTextArea({
				'textArea': doms.textEl,
				'maxHeight': 145,
				'inputListener': $.funcEmpty
			});
		};
		// 绑定事件
		var bindDOM = function(){
			$.addEvent(doms.submit, 'click', updateForward);
			$.addEvent(doms.textEl, 'keypress', ctrlUpdateForward);
			
		};
		// 监听自定义事件
		var bindCustEvt = function(){
//			$.custEvent.add(editor, 'textNum', canForward);
		};
		
		// 取得接口
		var bindTrans = function(){
			trans = $.common.trans.forward.getTrans('toMail',{
				'onSuccess'	: success,
				'onError'	: error,
				'onFail'	: fail
			});
		};
		
		var lazyInit = function(){
			bindTrans();
			parseDOM();
			bindDOM();
			bindCustEvt();
		};
		// 显示界面
		var show = function () {
			if(that.isInit == false){
				$.addHTML(client, $.core.util.easyTemplate(TEMPLATE, opts.data));
				if(!editor){
					lazyInit();
				}
				that.isInit = true;
			} else {
				node && $.setStyle(node, 'display', '');
			}
			editor.API.focus();
		};
		// 隐藏
		var hide = function () {
			editor.API.blur();
			if (node != null){
				$.setStyle(node, 'display', 'none');
			}
		};
		// 销毁
		var destory = function () {
			$.removeEvent(doms.submit, 'click', updateForward);
			$.removeEvent(doms.textEl, 'keypress', ctrlUpdateForward);
			$.custEvent.remove(editor, 'textNum', canForward);
			$.custEvent.undefine(that);
			editor.closeWidget();
			editor = null;
			doms = null;
			trans = null;
			node = null;
			for(k in that){
				delete that[k];
			}
			that = null;
		};
		
		that.show = show;
		that.hide = hide;
		that.destory = destory;

		return that;
	};
});
