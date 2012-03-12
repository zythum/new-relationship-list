/**
 * @fileoverview
 * 转发到私信
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 * L.Ming @2011.06.08 提交接口补提图片ID这个参数
 */
$Import("kit.extra.language");
$Import("common.editor.base");
$Import('common.editor.widget.face');
$Import('common.editor.widget.image');
$Import('kit.dom.autoHeightTextArea');
$Import('common.extra.shine');
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('common.channel.feed');
$Import('common.trans.forward');
$Import('common.forward.utils');
$Import('common.trans.message');
$Import('common.bubble.myFollowSuggest');
$Import('common.content.message.upload.loadSwf');
$Import('common.dialog.validateCode');
$Import('common.content.message.upload.delegateEvt');
$Import('common.content.message.upload.getFlash');
$Import('common.channel.flashUpImg');
$Import('common.layer.ioError');

STK.register("common.forward.toPrivateMsg", function ($){
	//---常量定义区----------------------------------
	var lang = $.kit.extra.language;
    var swfId, sendParams;
	// 编辑器初始选项
	var options={
		'limitNum' : 300
		,'count':'disable'
	};	// HTML 模板
	var TEMPLATE = lang(''
	+ '<#et userlist data>'
	+ '<div node-type="toPrivateMsg_client" class="toPrivateMsg<#if (data.isDialog == true)>Layer</#if>">'
		+ '<dl class="${data.className} clearfix">'
			+ '<dt>收信人：</dt>'
			+ '<dd><input type="text" name="" class="W_input" node-type="msgTo" value="${data.msgTo}" /></dd>'
			+ '<dt>内　容：</dt>'
			+ '<dd>'
				+ '<div class="feed_repeat">'
					+ '<div class="input clearfix" node-type="uploadTd">'
						+ '<div class="action clearfix actionControl" node-type="widget">'
							+ '<a class="face" title="#L{表情}" href="#" onclick="return false;" node-type="smileyBtn">#L{表情}</a>'
							+ '<a class="img" title="#L{图片}" href="#" onclick="return false;" node-type="picBtn">#L{图片}</a>'
							+ '<a class="fujian" title="#L{文件}" href="#" onclick="return false;" node-type="attachBtn">#L{文件}</a>'
							/*+ '<span class="faces" title="#L{表情}" node-type="smileyBtn"></span>'
							+ '<span class="img" title="#L{图片}" node-type="picBtn"></span>'
							+ '<span class="fujian" title="#L{附件}" node-type="attachBtn"></span>'*/
							+ '<div id="uploadSwf" node-type="uploadSwf" class="flash"></div>'
						+ '</div>'
						+ '<p class="num" node-type="num">还可输入  <span>' + options.limitNum + '</span> 字</p>'
						+ '<textarea name="" rows="" cols="" title="#L{转发到}#L{私信}#L{内容}" node-type="textEl">#L{给你推荐一条微博：}'
							+ '<#if (data.forwardNick)>'
							+ '//@${data.forwardNick}:${data.reason}'
							+ '</#if>'
							+ '<#if (data.originNick)>'
							+ ' - //@${data.originNick}:${data.origin}'
							+ '</#if>'
							+ '<#if (data.allowForward==="0")>'
							+ ' - //${data.origin}'
							+ '</#if>'
							+ '<#if (data.url)>'
							+ ' - #L{原文地址：}${data.url}'
							+ '</#if>'
							+ '</textarea>'
						+ '<p class="btn"><a href="#" title="#L{转发}#L{按钮}" onclick="return false;" class="W_btn_b btn_noloading" node-type="submit"><span><b class="loading"></b><em node-type="btnText">#L{发送}</em></span></a></p>'
						+ '<ul class="p_sendlist" node-type="uploadList" style="display:none" fid=""></ul>'
					+ '</div>'
				+ '</div>'
			+ '</dd>'
		+ '</dl>'
	+ '</div>');
	// 文案
	var MSG = {
		'notice' : '#L{请输入转发理由}',
		'nameNotice' : '#L{请输入收信人昵称}',
		'defUpdate' : '#L{转发微博}',
		'netError' : '#L{系统繁忙}',
		'success' : '#L{转发成功}!',
		'retry' : '#L{读取失败，请}<a href="#" onclick="return false;" action-type="retry" value="retry">#L{重试}</a>',
		'off' : '#L{关闭}',
		'on' : '#L{开启}'
	};
	//改变按钮文字函数
	var changeBtnText = function(tNode , type) {
		if(type == 'normal') {
			tNode.innerHTML = lang('#L{发送}');
		} else {
			tNode.innerHTML = lang('#L{提交中...}');				
		}
	};
	/**
	 * 
	 * @param {Object} client	外容器，这里是 dialog.inner
	 * @param {Object} mid		微博ID
	 * @param {Object} opts		选项
	 */
	return function(client, mid, opts){
		//add by zhangjinlong | jinlong1
		var validCodeLayer = $.common.dialog.validateCode();
		
		if(client == null || mid == null){
			throw new Error('[common.forward.toPrivateMsg]Required parameter client is missing');
		}
//		var data = opts.data;
//		var forwardReason = data.reason || lang(MSG.defUpdate);
		var editor,		// 编辑器对象
			doms,		// dom 集合
			conf, lock, lockReason/*=loading or error=*/,
			trans,		// 转发接口
			node,		// 外容器
			isInDialog,
			clock,
			uploadList,
			utils = $.common.forward.utils,
			sugg;
		var that = {};
		that.client = client;
		that.opts = opts || {};
		that.isInit = false;

		// 自定义事件定义
		$.custEvent.define(that, ['forward', 'hide', 'center']);
           var cannelUpload = function()
        {
        // _this.createTrans
          lock = false;
                lockReason = '';
                doms.submit.className = 'W_btn_b btn_noloading';
                changeBtnText(doms.btnText, 'normal');
        };
        var cannelUpload = function() {
            if (sendParams) {
                lock = false;
                lockReason = '';
                sendParams = null;
                doms.submit.className = 'W_btn_b btn_noloading';
                changeBtnText(doms.btnText, 'normal');
            }
        };
        var checkUploadComplete = function() {

            if (sendParams) {
                var flashObj = $.common.content.message.upload.getFlash(swfId);
                var isOk = 1;
                if (flashObj && flashObj['getUploadStatus']) {
                    try {
                        isOk = flashObj.getUploadStatus()
                    } catch(e) {
                        isOk = flashObj.getUploadStatus
                    }
                }else{
					isOk = 0;
				}
                if (isOk == 0) {
                    var fids = doms.uploadList.getAttribute('fid') || '';
                    if (fids.length != 0) {//截取最后的逗号
                        fids = fids.substring(0, fids.length - 1);
                    }
                    sendParams['fids'] = fids;
                    /**
		             * Diss
		             */
           			sendParams = $.module.getDiss(sendParams, doms.submit);
                    trans.request(sendParams);
                    //custFuncs.enableSubmit();
                }
            }

        };

		// 提交转发
		var updateForward = function(){
			var extraInfo = editor.API.getExtra();
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
			var nick = $.trim(doms.msgTo.value);
			if(nick === lang(MSG.nameNotice)){
				nick = '';
			}
			if(content === ""){
				$.common.extra.shine(doms.textEl);
				return;
			}
			lock = true;
			lockReason = 'loading';
			doms.submit.className = 'W_btn_a_disable';	// 提交中状态
			//更改文字为loading
			changeBtnText(doms.btnText , 'loading');
			
			var params = {};
			params.text = content || lang(MSG.defUpdate);


			var fids = doms.uploadList.getAttribute('fid') || '';
			if(fids.length !=0){//截取最后的逗号
				fids = fids.substring(0,fids.length-1);
				params['fids'] = fids;
			}	


			//if(extraInfo){
 //因为私信附件id是存在uploadList，暂时没有写入extraInfo，所以取extraInfo无法取到fids，此代码注释 by WK
			//	params.fids = extraInfo;		// TODO 附件ID列表，等待被开启
			//}
			params.appkey =  that.opts.data.appkey;
			params.id = mid;	// 被转发的资源ID，这里是mid
			params.screen_name = nick;		// 转发的目标用户，有昵称就不传uid了
            sendParams = params;
			/*
			if(utils.checkAtNum(content)>5){
				$.ui.confirm(lang('#L{单条微博里面@ 太多的人，可能被其它用户投诉。如果投诉太多可能会被系统封禁。是否继续转发？}'), {
					OK : function(){
                        checkUploadComplete();
					},
					cancel : function(){
                        sendParams = null;
						lock = false;
						lockReason = '';
						doms.submit.className = 'W_btn_b btn_noloading';
						//更改文字为normal
						changeBtnText(doms.btnText , 'normal');
					}
				});
				return ;
			}
			*/
			checkUploadComplete();
		};

		// Ctrl + Enter 处理
		var ctrlUpdateForward = function(e){
			if((e.keyCode === 13 || e.keyCode === 10) && e.ctrlKey){
				//updateForward();
				editor.API.blur();
				$.core.evt.fireEvent(doms.submit, "click");
			}
		};
		// 判断是否能转发
		/*var canForward = function(evt,infos){
			var key = infos.isOver, count = editor.API.count();
			if(!key || count === 0){
				lock = false;
				lockReason = '';
//				doms.submit.className = 'W_btn_b';
				if(count>0){
					doms.submit.className = 'W_btn_b';
				}else{
					doms.submit.className = 'W_btn_a_disable';
					lock = true;
				}
				if(!key){
					doms.num.innerHTML = lang('#L{还可以输入}' + (options.limitNum - count) + ' #L{字}');
				}
			} else {
				lock = true;
				lockReason = 'error';
				doms.submit.className = 'W_btn_a_disable';
				//doms['num'].innerHTML = '已经超过<span class="W_error">' + Math.abs(300 - count) + '</span> 字';
			}
		};*/

		var canForward = function(){
			var count = editor.API.count();
			var diff = options.limitNum - count;
			var key = diff>=0?true:false;
			if(key){
				lock = false;
				lockReason = '';
				if(key){
					doms.num.innerHTML = lang('#L{还可以输入}<span>' + (diff) + '</span> #L{字}');
				}
			}else{
				lock = true;
				lockReason = 'error';
				doms['num'].innerHTML =  lang('#L{已经超过}<span class="W_error">' + Math.abs(diff) + '</span> #L{字}');
			}
		};

		// 提交成功的处理
		var success = function(ret, params){
            sendParams = null;
			lock = false;
			lockReason = '';
			doms.submit.className = 'W_btn_b btn_noloading';
			changeBtnText(doms.btnText , 'normal');
			try {
				$.custEvent.fire(that, 'forward', [ret.data, params, opts.inDialog]);
				$.common.channel.feed.fire('forward', [ret.data, params, opts.inDialog]);
			}catch(exp){}
			/*
			var alt = $.ui.alert(lang(MSG.success), {'icon':'success'});
			$.custEvent.fire(that, 'hide');
			setTimeout(function(){
				alt.dia.hide();	/////// 隐藏对话框
			},500);
			*/
			$.custEvent.fire(that, 'hide');
			$.ui.litePrompt(lang(MSG.success),{'type':'succM','timeout':'500'});
			editor.API.reset();
			uploadList.reset();
		};
		// 提交出错的处理
		var error = function(ret, params){
			lock = false;
            sendParams = null;
			lockReason = '';
			doms.submit.className = 'W_btn_b btn_noloading';
			changeBtnText(doms.btnText , 'normal');
//			$.ui.alert(ret.msg || lang(MSG.netError));
			$.common.layer.ioError(ret.code, ret);
		};
		// 提交接口异常处理
		var fail = function(ret, params){
			lock = false;
			lockReason = '';
            sendParams = null;
			doms.submit.className = 'W_btn_b btn_noloading';
			changeBtnText(doms.btnText , 'normal');
//			$.ui.alert(lang(MSG.netError));
			$.common.layer.ioError(ret.code, ret);
		};
		// 初始化 suggest
		function initSuggest () {
			$.removeEvent(doms.msgTo, 'focus', initSuggest);
			sugg = new $.common.bubble.myFollowSuggest({
				'textNode' : doms.msgTo,
				'callback' : function (user){}
			});
			sugg.show();

		}

		function msgBlurFun(){
			if($.trim(doms.msgTo.value) === ""){
				doms.msgTo.value = lang(MSG.nameNotice);
			}
		}
		function msgFocusFun(){
			if($.trim(doms.msgTo.value) === lang(MSG.nameNotice)){
					doms.msgTo.value = "";
				}
		}
		/*------------lazyInit-------------*/
		// 绑定编辑器
		var parseDOM = function(){
			var nodelist;
			node = $.builder(client);
			nodelist = $.kit.dom.parseDOM(node.list);
			node = nodelist.toPrivateMsg_client;
				
			editor = $.common.editor.base(node, options);
			editor.widget($.common.editor.widget.face(),'smileyBtn');
			 swfId =$.common.content.message.upload.loadSwf(nodelist.uploadTd);
			uploadList = $.common.content.message.upload.delegateEvt(nodelist.uploadList);
//			editor.API.insertText(forwardReason);
			doms = editor.nodeList;
			$.addEvent(doms.textEl,'focus',function(){
				clock = setInterval(function(){canForward();},200);
			});
			$.addEvent(doms.textEl,'blur',function(){
				clearInterval(clock);
			});
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
			$.addEvent(doms.msgTo, 'focus', initSuggest);
			$.addEvent(doms.msgTo, 'focus', msgFocusFun);
			$.addEvent(doms.msgTo, 'blur', msgBlurFun);
		};
		// 监听自定义事件
		var bindCustEvt = function(){
		};
		
		// 取得接口
		var bindTrans = function(){
			trans = $.common.trans.message.getTrans('create',{
				'onComplete': function(req,params){
					//zhangjinlong || jinlong1@staff.sina.com.cn
					var conf =  {
						onSuccess : success,
						onError : error,
						requestAjax : trans,
						param : params,
						onRelease : function() {
							lock = false;
                            sendParams = null;
							lockReason = '';
							doms.submit.className = 'W_btn_b btn_noloading';
							changeBtnText(doms.btnText , 'normal');
						}
					};
					//加入验证码检查机制，参见$.common.dialog.validateCode
					validCodeLayer.validateIntercept(req , params , conf);
				},
				'onFail'	: fail
			});
		};
		var bindListener = function(){
		   $.common.channel.flashUpImg.register("completeUpload",checkUploadComplete);
          $.common.channel.flashUpImg.register("cannelUpload",cannelUpload);
		};
		var lazyInit = function(){
			bindTrans();
			parseDOM();
			bindDOM();
			bindCustEvt();
            bindListener();
		};
		// 显示界面
		var show = function (isDialog) {
			if(that.isInit == false){
				opts.data.className = isDialog ? 'layer_forward_group' : 'forward__letter';
				isInDialog = isDialog;
				opts.data.msgTo = lang(MSG.nameNotice);
                opts.data.isDialog = isDialog;
				$.addHTML(client, $.core.util.easyTemplate(TEMPLATE, opts.data));
				if(!editor){
					lazyInit();
				}
				that.isInit = true;
			} else {
				node && $.setStyle(node, 'display', '');
			}
			//为啥去掉了捏？李明童鞋

			editor.API.focus(0);
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
			$.removeEvent(doms.msgTo, 'focus', msgFocusFun);
			$.removeEvent(doms.msgTo, 'blur', msgBlurFun);
			$.custEvent.undefine(that);
			sugg && sugg.destroy();
			editor.closeWidget();
            sendParams = null;
			clock && clearInterval(clock);
            validCodeLayer && validCodeLayer.destroy && validCodeLayer.destroy();
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
