/**
 * 
 * @id $.common.dialog.sendMessage 
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
	data = {
		uid: 567,//可选
		userName: '收信人昵称'//可选
	};
	
	转发私信
	var data={
		title: ‘转发私信’,
		ext: 我会写在属性里面，先交ext好了
	}
	if(!_this.sendMessageDialog) {
		_this.sendMessageDialog = $.common.dialog.sendMessage(data);
	}
_this.sendMessageDialog.show();
此代码太需要重构了 wk
顶上面的...       zjq
 */
$Import('kit.extra.language');
$Import('ui.dialog');
$Import('ui.alert');
//$Import('ui.timerNotice');
$Import('ui.litePrompt');
$Import('common.trans.message');
$Import('common.channel.message');
$Import('common.bubble.myFollowSuggest');
$Import('kit.dom.smartInput');
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('common.content.message.upload.loadSwf');
$Import('common.extra.shine');
$Import('common.content.message.upload.delegateEvt');
$Import('common.content.message.upload.getFlash');
$Import('kit.extra.runFlashMethod');
$Import('common.dialog.validateCode');
$Import('common.channel.flashUpImg');
$Import('common.layer.ioError');

//$LANG = {
	//'这是一个回复私信的弹层。': 'This is a dialog for reply message.'
//};

STK.register('common.dialog.sendMessageMain', function($) {
	//+++ 常量定义区 ++++++++++++++++++
	$L = $.kit.extra.language;
    var sendParams;
	var nameInputTip = $L('#L{请输入对方昵称}');
	var FORBIDDENWORDS = [nameInputTip];
	//改变按钮文字函数
	var changeBtnText = function(tNode , type) {
		if(type == 'normal') {
			tNode.innerHTML = $L('#L{发送}');
		} else {
			tNode.innerHTML = $L('#L{提交中...}');				
		}
	};
	//-------------------------------------------
	
	return function(data) {
		var that = {};
        data = data ||{ };
		var editor,clock,sugg,fids;
		var status_id=0;
		var isPublishAvailable = false;
		var clickPubBtn = false;
		var clickCloseBtn = false;
        var touid =  data.touid || 0;
		var style_id = data.style_id || 1;
		//add by jinlong1  验证码弹层
		var validCodeLayer = $.common.dialog.validateCode();
		$.log('common.dialog.sendMessage data=',data);
		var type;
		if(data&&data.mid){
			type='forward';
			$.log('initialize message layer',data);
			var mid = data.mid;
			var is_send = data.is_send;
		}
		var title = (type=='forward')?$L('#L{转发私信}'):$L('#L{发私信}');
		//用来轮询flash接口方法
		var runFlash;

		//+++ 变量定义区 ++++++++++++++++++

		//var $L = function (s) {
			//var rS = s.replace(/#L\{([^\}]+)*?\}/ig, function (w) {
				//var sT;
				//if(w && langPack[arguments[1]]) {
					//sT = langPack[arguments[1]];
				//}
				//return '#L{'+sT+'}';
			//});
			//rS = $.kit.extra.language(rS);

			//return rS;
		//};

		var custFuncs = {
			enableSubmit : function() {
				_this.DOM.submit.isSending = false;
				_this.DOM.submit.className = 'W_btn_b btn_noloading';
				//更改文字
				changeBtnText(_this.DOM.btnText , "normal");
			} ,
			disableSubmit : function() {
				_this.DOM.submit.isSending = true;
				_this.DOM.submit.className = 'W_btn_a_disable';
				//更改文字
				changeBtnText(_this.DOM.btnText , "loading");
			} ,
			isSending : function() {
				return _this.DOM.submit.isSending;
			}
		};
        var cannelUpload = function() {
            // _this.createTrans
            if (sendParams) {
                custFuncs.enableSubmit();
            }
        };
        var checkUploadComplete = function() {
            if (sendParams) {
                var swfId = _this.DOM.uploadList.getAttribute('swfid');
                var flashObj = $.common.content.message.upload.getFlash(swfId);
                var isOk = 1;
                if (flashObj && flashObj['getUploadStatus']) {
                    try {
                        isOk = flashObj.getUploadStatus()
                    } catch(e) {
                        isOk = flashObj.getUploadStatus
                    }
                } else {
                	isOk = 0;
                }
                if (isOk == 0) {
                    window.setTimeout(function(){
	                    var fid = _this.DOM.uploadList.getAttribute('fid') || '';
						if(fid.length !=0){//截取最后的逗号
							fid = fid.substring(0,fid.length-1);
						}
	                    sendParams.fids  =fid;
	                    /**
	                     * Diss
	                     */
	                    sendParams = $.module.getDiss(sendParams, _this.DOM.submit);
	                    _this.createTrans.request(sendParams);
                    }, 0);
                    //custFuncs.enableSubmit();
                }
            }

        };
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			//属性方法区
			isShowed: false,
			DOM_eventFun: {

				submitsendMessage: function (o) {
					if(custFuncs.isSending()) {
						return;		
					}
					if(!isPublishAvailable){
						$.common.extra.shine(editor.nodeList.textEl);
						return;
					}
					//如果用户名为空或者默认文字，也不要提交
					if($.trim(_this.DOM.screen_name.value) == nameInputTip || $.trim(_this.DOM.screen_name.value).length ==0){
						$.ui.alert(nameInputTip);
						//_this.DOM.screen_name.focus();//由于alert不支持回调，所以此功能没用
						return;
					}
					$.log('common.dialog.sendMessage send Message');
					//editor.API.disableEditor(true);
					var fids = _this.DOM.uploadList.getAttribute('fid') || '';
					if(fids.length !=0){//截取最后的逗号
						fids = fids.substring(0,fids.length-1);
					}
					var params = {text:editor.API.getWords(),screen_name:_this.DOM.screen_name.value,id:status_id,fids:fids,touid:touid, style_id : style_id};
					custFuncs.disableSubmit();
					try {
						_this.DOM.textEl.blur();
					} catch(e){}
                    sendParams = params;
					checkUploadComplete();
					$.preventDefault();
					clickPubBtn = true;
				},

				attachDel : function(){
					$.log('common.dialog.sendMessage attach del');
					//_this.attachDel.request({});
				},
				initLayer : function(){
					_this.dialogDom.innerHTML = '';
					_this.dialogDom.appendChild(_this.getDialogHTMLOfsendMessage(data));
					editor = $.common.editor.base(_this.dialogDom, {limitNum:300});
					editor.widget($.common.editor.widget.face(),'smileyBtn');
					//如果是转发
					if(type=='forward'){
						$.common.trans.message.getTrans('getDetail',{
							'onSuccess'	: function(ret){
								editor.API.insertText(ret.data.content);
								status_id=ret.data.status_id;
								var initSize=0,initFileNum=0;
								//$.log(ret.data.fids,ret.data.fids.length);
								for(var i=0, l=ret.data.fids.length; i<l; i++){
									//$.log(ret.data.fids[i]['file_name'],_this.DOM.uploadList);
									try{//此接口返回的经常有错误
									$.common.content.message.upload.addItem(_this.DOM.uploadList,ret.data.fids[i]['file_name'],ret.data.fids[i]);
									initSize+=ret.data.fids[i]['size']*1;
									initFileNum+=1;
									}catch(e){}
								}
								$.log('We had '+initFileNum+' files and total file size is ',initSize);
								var swfId = _this.DOM.uploadList.getAttribute('swfid');
								var flash = $.common.content.message.upload.getFlash(swfId);
								//解决chrome12下flash接口无法调用的问题
								runFlash = $.kit.extra.runFlashMethod(flash , 'setInitSize' , function() {
									flash.setInitSize(initFileNum, initSize);									
								});
								$.log('setInitSize Done');
							},
							'onError'	: function(data){
								$.ui.alert(data.msg);
							}
						}).request({'mid':mid,'is_send':is_send});
					}

					//初始化人名联想
					sugg = new $.common.bubble.myFollowSuggest({
						'type':1,
						'textNode' : _this.DOM.screen_name,
						'list_template' : '',
						'callback' : function (){
//							console.dir(arguments);
						}
					});
					sugg.show();

					var smartInput = $.kit.dom.smartInput(_this.DOM.screen_name, {
						notice: nameInputTip
					});
					$.addEvent(_this.DOM.textEl,'focus',function(){
						clock = setInterval(function(){_this.custFuns.publishBtn();},200);
					});
					$.addEvent(_this.DOM.textEl,'blur',function(){
						clearInterval(clock);
					});

					//为上传列表初始化delegateEvt
					setTimeout(function(){
						$.common.content.message.upload.delegateEvt(_this.DOM.uploadList);
					},100);//取得flash对象需要一点时间

				}
			},
			ioEvent: {
				createSuccess: function (rt) {
					$.log('common.dialog.sendMessage createSuccess');
					/*$.ui.timerNotice($L('#L{私信发送成功}'),{'icon':'success','timer':3000,'OK':function(){
						$.common.channel.message.fire('create');
					}});*/
                    sendParams = null;
					custFuncs.enableSubmit();
					_this.actHide();

					$.ui.litePrompt($L('#L{恭喜，私信发送成功啦。}'),{'type':'succM','timeout':'500','hideCallback':function(){
						$.common.channel.message.fire('create',rt.data);
					}});
				},
				createError: function (data) {
                    sendParams = null;
					$.log('common.dialog.sendMessage createError');
					custFuncs.enableSubmit();
//					$.ui.alert(data.msg);
					$.common.layer.ioError(data.code, data);
				},
				createFail: function () {
					$.log('common.dialog.sendMessage createFail');
                    sendParams = null;
					custFuncs.enableSubmit();
				}
			},
			custFuns : {
				publishBtn : function(){
					var words = editor.API.getWords();
					var _count = editor.API.count(words);
					var inLimit = (_count <= 300 && _count>0)?true:false;
					if(!inLimit || words.length  === 0){//空话题不让发布
						isPublishAvailable = false;
					}else{
						isPublishAvailable = true;
					}
				},
				filterWords : function(){
					var _s = editor.API.getWords();
					for(var i=0,l=FORBIDDENWORDS.length;i<l;i++){
						var _b =_s.replace(new RegExp(FORBIDDENWORDS[i],"g"),'');
					}
					return _b;
				},
				checkContent : function(){
					//if(_this.DOM.uploadList.getAttribute('fid').length != 0 || _this.DOM.textEl.value.length != 0){
					if(_this.DOM.uploadList.getAttribute('fid').length != 0){
						return true;
					}else{
						return false;
					}
				}
			},
			show: function () {

				var own = arguments.callee;
				if(_this.isShowed !== true) {
					own.toDispatchDefaultAct = true;
					$.custEvent.fire(that, 'showBefore');
					if(own.toDispatchDefaultAct) {
						//默认行为
						$.log('common.dialog.sendMessage => actShow()');
						_this.actShow();
					}
					$.custEvent.fire(that, 'show');
					//_this.isShowed = true;
				}	
			},
			hide: function () {

				var own = arguments.callee;
				if(_this.isShowed === true) {
					own.toDispatchDefaultAct = true;
					$.custEvent.fire(that, 'hideBefore');
					if(own.toDispatchDefaultAct) {
						//默认行为
						$.log('common.dialog.sendMessage => actHide()');
						_this.actHide();
					}

					$.custEvent.fire(that, 'hide');
					//_this.isShowed = false;
				}

			},
			actShow: function () {

				if(data&&data.allowForward&&data.allowForward==0){
					$.ui.alert($L('#L{不能转发此条私信。}'));
					return;
				}
				_this.objs.dialog = $.ui.dialog();
				_this.objs.dialog.setTitle($L('#L{'+title+'}'));
				_this.objs.dialog.appendChild(_this.dialogDom);
				_this.objs.dialog.show();
				_this.DOM_eventFun.initLayer();
				_this.loadSwf();
				_this.objs.dialog.setMiddle();
				editor.API.focus();

				/*window.onbeforeunload = function(){
					if(_this.custFuns.checkContent()&&clickPubBtn != true&&clickCloseBtn==false){
						return $L('#L{你的私信尚未发送，确定要丢弃该条私信吗}?');
					}
				};*/
				_this.objs.dialog.setBeforeHideFn(function(){
					clickCloseBtn = true;
					if(_this.custFuns.checkContent()&&clickPubBtn != true){
						$.ui.confirm($L('#L{你的私信尚未发送，确定要丢弃该条私信吗}?'),{
							'OK':function(){
								_this.objs.dialog.hide(true);
								clickCloseBtn = false;
								_this.objs.dialog.clearBeforeHideFn();
							},
							'cancel':function(){
								return true;
							}
						});
						return false;
					}
				//此处是为了弹出的at层和人名联想层没有使用layoutPos而做的
					_this.DOM.screen_name.blur();
					_this.DOM.textEl.blur();
					_this.DOM.submit.focus();
					sugg.hide();
					sugg.destroy();
					return true;
				});
			},
			actHide: function () {
				_this.objs.dialog.hide();
			},
			reset : function(){
				_this.DOM['screen_name'].value=nameInputTip;
				editor.API.reset();
				//todo 附件reset
			},
			loadSwf : function(){
				$.common.content.message.upload.loadSwf(_this.DOM.uploadTd,{
                    flashvars:{'space' : '15',
                    'width' : '42',
                    'height' :'15' }});
			},
			getDialogHTMLOfsendMessage: function (data) {

                var idInput,idContent,
                        idInputName = (data && data.userName) ? data.userName : nameInputTip;
				if(data && data.uid) {
					if(!data.userName) {
						throw new Error('未得到收信人昵称。Cannot retrieve nickname.');
					}
					idInput = data.userName+'<input type="hidden" name="'+idInputName+'" value="'+data.uid+'" />';
				}else{
					idInput = '<input type="text" name="'+idInputName+'" />';
				}
                if (data) {
                    idContent = data.content || '';
                }
				var sendMessageHTML = 
				'<div class="W_private_letter" node-type="outer">' +
				'<table class="form_private">' +
				'  <tbody><tr>' +
				'    <th>#L{发&nbsp;&nbsp;给：}</th>' +
				'    <td><input node-type="screen_name" type="text" value="'+idInputName+'" class="text"></td>' +
				'  </tr>' +
				'  <tr>' +
				'    <th>#L{内&nbsp;&nbsp;容：}</th>' +
				'    <td node-type="uploadTd">'+
				'<p class="num" node-type="num">#L{还可以输入}<span>300</span>#L{字}</p>'+
				'<textarea class="W_no_outline" name="" node-type="textEl">'+idContent+'</textarea><div node-type="successTip" style="display: none;" class="send_succpic"></div>' +
				'      <div class="kind fl" node-type="widget"><a class="face" onclick="return false;" href="javascript:void(0);" node-type="smileyBtn" title="#L{表情}">#L{表情}</a><a class="img" onclick="return false;" href="javascript:void(0);" title="#L{图片}">#L{图片}</a><a class="doc" onclick="return false;" href="javascript:void(0);" title="#L{文件}">#L{文件}</a><div id="uploadSwf" node-type="uploadSwf" class="flash"></div></div>' +
				'      <div class="btn_s fr"><a class="W_btn_b btn_noloading" href="javascript:void(0);" diss-data="module=msglayout" node-type="submit" action-type="submit"><span><b class="loading"></b><em node-type="btnText">#L{发送}</em></span></a></div>'+
				'      <ul class="p_sendlist" node-type="uploadList" style="display:none" fid=""></ul>'+
				'    </td>' +
				'  </tr>' +
				'</tbody></table>' +
				'</div>'

				;
				var _build = $.builder($L(sendMessageHTML));
				_this.DOM = $.kit.dom.parseDOM(_build.list);
				//$.log(_build.box);
				//return sendMessageHTML;
				return _build.box;

			}
		};
		//----------------------------------------------



		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------


		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			//if(!node) {
			//throw new Error('common.dialog.sendMessage node没有定义');
			//}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			if(!1) {
				throw new Error('common.dialog.sendMessage 必需的节点不完整');
			}


		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){

			_this.dialogDom = $.C('div');
			_this.DEvent = $.core.evt.delegatedEvent(_this.dialogDom);
		

			_this.createTrans = $.common.trans.message.getTrans('create',{
				'onComplete': function(ret,data){		//zhangjinlong || jinlong1@staff.sina.com.cn
					var conf = {
						onSuccess: _this.ioEvent.createSuccess,
						onError: _this.ioEvent.createError,
						requestAjax: _this.createTrans,
						param: data,
						onRelease: function(){
							custFuncs.enableSubmit();							
						}
					};	
					//加入验证码检查机制，参见$.common.dialog.validateCode
					validCodeLayer.validateIntercept(ret , data , conf);									
				},
				'onFail'	: _this.ioEvent.createFail
			});
			//_this.attachDelTrans = $.common.trans.message.getTrans('attachDel',{
			//	'onSuccess' : _this.ioEvent.attachDelSuccess
		//});

		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){

			//_this.DEvent.add('sendMessageForm', 'submit', _this.DOM_eventFun.submitsendMessage);
			_this.DEvent.add('submit', 'click',  _this.DOM_eventFun.submitsendMessage);
			_this.DEvent.add('attachDel', 'click',  _this.DOM_eventFun.attachDel);
			_this.DEvent.add('attachCancel', 'click',  _this.DOM_eventFun.attachCancel);
			$.core.evt.hotKey.add(_this.dialogDom, ["ctrl+enter"], _this.DOM_eventFun.submitsendMessage);
		};
		//-------------------------------------------

		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		var bindCustEvt = function(){

			$.custEvent.define(that, 'showBefore');
			$.custEvent.define(that, 'show');
			$.custEvent.define(that, 'hideBefore');
			$.custEvent.define(that, 'hide');
		};
		//-------------------------------------------

		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		var bindListener = function(){
          $.common.channel.flashUpImg.register("completeUpload",checkUploadComplete);
          $.common.channel.flashUpImg.register("cannelUpload",cannelUpload);
		};
		//-------------------------------------------


		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
            sendParams = null;
			if(_this.objs.dialog){
				_this.objs.dialog.hide();
				_this.objs.dialog.clearBeforeHideFn();
			}
			_this.DOM.dialog = null;
			runFlash && runFlash.destroy && runFlash.destroy();
		};
		//-------------------------------------------


		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------


		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		that.show = function () {
			_this.show.apply(_this, arguments);
		};
		that.hide = function () {
			_this.hide();
		};
		//-------------------------------------------


		return that;
	};

});
