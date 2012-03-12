/**
 * 
 * @id $.comp.content.messageDetail
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
 * demo待完善
 */
$Import('kit.extra.language');
$Import('common.dialog.sendMessage');
$Import('common.channel.message');
$Import('common.content.messageDetailList');
$Import('common.trans.message');
$Import('kit.dom.parseDOM');
$Import('comp.content.tipsBar');
$Import('comp.content.messageSearchForm');
$Import('common.content.message.upload.loadSwf');
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('common.editor.widget.video');
$Import('common.editor.widget.music');
$Import('common.extra.shine');
$Import('common.dialog.validateCode');
$Import('kit.dom.autoHeightTextArea');
$Import('kit.dom.firstChild');
$Import('common.channel.flashUpImg');
$Import('common.layer.ioError');

STK.register('comp.content.messageDetail', function($){
	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	var custEvent = $.core.evt.custEvent;
	var $L = $.kit.extra.language;
    //设置flash方法。
    var  runFlash,sendParams;
	//改变按钮文字函数
	var changeBtnText = function(tNode , type) {
		if(type == 'normal') {
			tNode.innerHTML = $L('#L{发送}');
		} else {
			tNode.innerHTML = $L('#L{提交中...}');				
		}
	};
	return function(node){
		var that = {};
		var editor,isPublishAvailable,clock,textHeight;
		//add by zhangjinlong | jinlong1	验证码弹层
		var validCodeLayer = $.common.dialog.validateCode();
         var scrollToEdit = function(){ //跳转到编辑框的位置。
               if(_this.DOM.textEl)
                {
                    var callback = function()
                    {
                        try{ //如果 textEl被禁用 此时是不可被聚焦的
							_this.DOM.textEl.focus();
						}catch(e){};
						
                    };
                 $.scrollTo(_this.DOM.textEl,{top:150, onMoveStop:callback,'step' :2});
			}
         };
        var getIsSameDay = function(firstDay,secondDay)
        {     //没有时间传递就直接返回fasle。
            if(!firstDay || !secondDay) {
                return false;
            }
            if(typeof firstDay =="string")
            {
                 firstDay = parseInt(firstDay);
            }
            if(typeof secondDay == "string")
            {
                  secondDay = parseInt(secondDay);
            }
            //判断两个日期时间差大于半个小时
         if(Math.abs(firstDay -secondDay) <3600/2)
        {
             var a = new Date(firstDay);
             var b = new Date(secondDay);
             return(a.getDay() == b.getDay());
        }
            return false;
        };
        var cannelUpload = function() {
            // _this.createTrans
            if (sendParams) {
                editor.API.disableEditor(false);
                isPublishAvailable = true;
                _this.DOM['publishBtn'].className = 'W_btn_b btn_noloading';
                changeBtnText(_this.DOM['btnText'], "normal");
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
                }else{
					isOk = 0;
				}
                if (isOk == 0) {
                 var fids = _this.DOM.uploadList.getAttribute('fid') || '';
					if(fids.length !=0){//截取最后的逗号
						fids = fids.substring(0,fids.length-1);
					}
                    sendParams.fids  =fids;
                    /**
                     * Diss
                     */
                    sendParams = $.module.getDiss(sendParams, _this.DOM['publishBtn']);
                    _this.createTrans.request(sendParams);
                }
            }
        };
        var getFlashVersion = function() {
            var f = "1", n = navigator;
            if (n.plugins && n.plugins.length) {
                for (var ii = 0; ii < n.plugins.length; ii++) {
                    if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) {
                        f = n.plugins[ii].description.split('Shockwave Flash ')[1];
                        break;
                    }
                }
            } else if (window.ActiveXObject) {
                for (var ii = 10; ii >= 2; ii--) {
                    try {
                        var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + ii + "');");
                        if (fl) {
                            f = ii + '.0';
                            break;
                        }
                    } catch (e) {
                    }
                }
            }
            return f.split(".")[0];
        };
		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			channel: {
				message: $.common.channel.message
			},
			DOM_eventFun:{//DOM事件行为容器
				clickPostMsg: function (evt) {
					var e = $.fixEvent(evt);
					var oE = e.target;
					if(!oE.dialog) {
                        var touid = editor.nodeList.textEl.getAttribute('touid');
						oE.dialog = $.common.dialog.sendMessage({"touid":touid, style_id:1});
					}
					oE.dialog.show();

					$.preventDefault();
				},
				submitBtn : function(){
					var touid = editor.nodeList.textEl.getAttribute('touid');
					//$.log('[comp.content.messageDetail] touid = '+touid);
					if(!isPublishAvailable){
						$.common.extra.shine(editor.nodeList.textEl);
						return;
					}
					//$.log('send Message in messageDetail');
					editor.API.disableEditor(true);
                    if(getFlashVersion()== '1')
                    {

                    }
					_this.DOM['publishBtn'].className = 'W_btn_a_disable';
					changeBtnText(_this.DOM['btnText'] , "loading");
					var fids = _this.DOM.uploadList.getAttribute('fid') || '';
					if(fids.length !=0){//截取最后的逗号
						fids = fids.substring(0,fids.length-1);
					}
					//_this.createTrans.request({text:editor.API.getWords(),uid:touid,fids:fids, style_id:1});
					sendParams = {text:editor.API.getWords(),uid:touid,fids:fids, style_id:1};
                    checkUploadComplete();
					$.preventDefault();
				},
                updataDetailMes : function(data) {
	                //$.log(_this.objs.messageDetailList);
	                if (_this.objs.messageDetailList) {
		                _this.objs.messageDetailList.updateDelMsg(data);
//	                    _this.objs.messageDetailList.getMessageList();
	                }

                }
            },
			ioEvent: {
				createSuccess: function (ret, params) {
                    try{
					//$.log('comp.content.messageDetail createSuccess');
					//$.common.channel.message.fire('publish', ret.data.html);
                    sendParams = null;
                    $.common.channel.message.fire('create', ret.data);
					editor.API.reset();
					editor.nodeList.successTip.style.display = '';
				/*	setTimeout(function(){
						window.location.reload();
					},500);*/
					//反正都刷页了。。下面的重置都别做了
					setTimeout(function(){
						editor.nodeList.successTip.style.display = 'none';
						editor.API.disableEditor(false);
					},2*1000);
					editor.API.reset();
                    _this.ioEvent.refreshFlash();
					_this.custFuncs.delWord();
					editor.closeWidget();
                      $.setStyle(_this.DOM.textEl, "height" ,textHeight);
                    isPublishAvailable = false;
					_this.DOM['publishBtn'].className = 'W_btn_b btn_noloading';
					changeBtnText(_this.DOM['btnText'] , "normal");
                    }catch(e){}
				},
                refreshFlash : function()
                {
                     _this.DOM.uploadList.innerHTML="";
                     _this.DOM.uploadList.setAttribute("fid","");
                    $.setStyle(_this.DOM.uploadList,"display","none");
                    var swfId = _this.DOM.uploadList.getAttribute('swfid');
				    var flash = $.common.content.message.upload.getFlash(swfId);
					//解决chrome12下flash接口无法调用的问题
                    if(!flash) return;
					runFlash = $.kit.extra.runFlashMethod(flash , 'setInitSize' , function() {
								flash.setInitSize(0, 0);
						});
                },
				createError: function (data) {
					//$.log('comp.content.messageDetail createError');
                    sendParams = null;
                    data.msg = data.msg||$L("#L{操作失败}");
					$.common.layer.ioError(data.code, data);
					//$.ui.alert(data && data.msg || $L("#L{操作失败}"));
					editor.API.disableEditor(false);
					isPublishAvailable = true;
					_this.DOM['publishBtn'].className = 'W_btn_b btn_noloading';
					changeBtnText(_this.DOM['btnText'] , "normal");
				},
				createFail: function () {
                     sendParams = null;
					//$.log('comp.content.messageDetail createFail');
					editor.API.disableEditor(false);
					isPublishAvailable = true;
				}
			},
			custFuncs :{
				restore : function(){
					var word = STK.core.util.storage.get('msg_word'+$CONFIG.uid);
					if(word != 'null' && word != null && word.length!=0){
						return word;
					}else{
						return false;
					}
				},
				store : function(){
					var words = editor.API.getWords();
					STK.core.util.storage.set('msg_word'+$CONFIG.uid,words);
				},
				delWord : function(){
					STK.core.util.storage.del('msg_word'+$CONFIG.uid);
				},

				filterWords : function(){
					var _s = editor.API.getWords();
					for(var i=0,l=FORBIDDENWORDS.length;i<l;i++){
						var _b =_s.replace(new RegExp(FORBIDDENWORDS[i],"g"),'');
					}
					////$.log('filter',_b);
					return _b;
				},
				publishBtn : function(){
					//$.log('editor',editor);
					var words = editor.API.getWords();
					var _count = editor.API.count();
					//$.log('count = ',_count);
					var inLimit = (_count <= 300 && _count>0)?true:false;
					if(!inLimit || words.length  === 0){//空话题不让发布
						isPublishAvailable = false;
					}else{
						isPublishAvailable = true;
					}
				}
			}
			//属性方法区
		};
		//----------------------------------------------
		
		
		
		
		
		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		//-------------------------------------------
		
		
		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if(!_this.DOM['messageSearchInput']) {
				throw new Error('必需的节点 messageSearchInput 不存在');
			}
			if(!_this.DOM['messageList']) {
				//throw new Error('必需的节点 messageList 不存在');
				//$.log('必需的节点 messageList 不存在');
			}
			if(!_this.DOM['postMsg']) {
				throw new Error('必需的节点 postMsg 不存在');
			}
			if(!_this.DOM['searchMessage']) {
				throw new Error('必需的节点 searchMessage 不存在');
			}
			if(_this.DOM['messageList'] && $.swf.check() == -1){
				var repStr = '<img src="'+$CONFIG['imgPath']+'style/images/accessory/default.png">'+$L('#L{包含文件：}');
				var audioPlayerList = $.sizzle('div[node-type="audioPlayer"]',_this.DOM['messageList']);
				for(var i=audioPlayerList.length;i--;){
					audioPlayerList[i].innerHTML = repStr;
				}
				
			}
			
		};
		//-------------------------------------------
		
		
		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){
			if(_this.DOM['messageList']){
				_this.objs.messageDetailList = $.common.content.messageDetailList(node);//加载私信详细展示列表功能
                $.custEvent.add(_this.objs.messageDetailList, "toEdit", scrollToEdit);
            }
			if(_this.DOM['tipsBar']) {//加载提示条功能
				//私信页面关闭黄条使用的值为2，见common.trans.global的closetipsbar
				var CLOSE_TIP_TYPE = 2; 
				_this.objs.tipsBar = $.comp.content.tipsBar(_this.DOM['tipsBar'] , CLOSE_TIP_TYPE);
			}
			_this.objs.messageSearchForm = $.comp.content.messageSearchForm(_this.DOM['messageSearchForm']);//加载私信搜索框功能
			////$.log(_this.DOM)
                editor = $.common.editor.base(node,{
				limitNum:300,
				storeWords : _this.custFuncs.restore()
			});

			editor.widget($.common.editor.widget.face(),'smileyBtn');
			editor.widget($.common.editor.widget.video(),'videoBtn');
			editor.widget($.common.editor.widget.music(),'musicBtn');
			//有一个bug说需要在页面加载完后将光标置于发布框
			setTimeout(function(){editor.API.focus();

            //setTimeout(function() {
                       //初始化输入框，如果这个地方有bug的话，把settimeout打开。
                       // 页面没有加载完成。读取的lineheight有问题
                        $.kit.dom.autoHeightTextArea({
                            'textArea': _this.DOM.textEl,
                            'maxHeight': 9999,
                            'inputListener': function() {

                            }
                        });
                   textHeight = $.getStyle(_this.DOM.textEl,"height") || _this.DOM.textEl.offsetHeight;
                   // }, 400);
            },200);
			//flash 上传按钮 暂时先不要flash
			$.common.content.message.upload.loadSwf(_this.DOM['publisher_wrap'],{
                    flashvars:{'space' : '15',
                    'width' : '42',
                    'height' :'15' }});
			//为上传列表初始化delegateEvt
			setTimeout(function(){
				$.common.content.message.upload.delegateEvt(_this.DOM.uploadList);
			},100);//取得flash对象需要一点时间
			//绑定字数检测,不想使用发布器本身的，因为要改
			$.addEvent(_this.DOM.textEl,'focus',function(){
				clock = setInterval(function(){_this.custFuncs.publishBtn();},200);
			});
			$.addEvent(_this.DOM.textEl,'blur',function(){
				clearInterval(clock);
			});
			_this.createTrans = $.common.trans.message.getTrans('create',{
				'onComplete': function(req,params){
					//zhangjinlong || jinlong1@staff.sina.com.cn
					var conf =  {
						onSuccess : _this.ioEvent.createSuccess,			
						onError : _this.ioEvent.createError,				
						requestAjax : _this.createTrans,				
						param : params,			
						onRelease : function() {		
							editor.API.disableEditor(false);
							isPublishAvailable = true;
							_this.DOM['publishBtn'].className = 'W_btn_b btn_noloading';
							changeBtnText(_this.DOM['btnText'] , "normal");	
						}
					};
					//加入验证码检查机制，参见$.common.dialog.validateCode
					validCodeLayer.validateIntercept(req , params , conf);
					
				},
				'onFail'	: _this.ioEvent.createError,
				'onTimeout' : _this.ioEvent.createError
			});
		};
		//-------------------------------------------
		
		
		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			$.addEvent(_this.DOM['postMsg'], 'click', _this.DOM_eventFun.clickPostMsg);
			$.addEvent(_this.DOM['publishBtn'], 'click', _this.DOM_eventFun.submitBtn);
			$.core.evt.hotKey.add(_this.DOM['textEl'], ["ctrl+enter"], _this.DOM_eventFun.submitBtn);
			
		};
		//-------------------------------------------
		
		
		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		var bindCustEvt = function(){


		};
		//-------------------------------------------
		var createSuc = function(oD){
                 _this.DOM_eventFun.updataDetailMes(oD);
			};
		
		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		var bindListener = function(){
			_this.channel.message.register('create', createSuc);
		   $.common.channel.flashUpImg.register("completeUpload",checkUploadComplete);
          $.common.channel.flashUpImg.register("cannelUpload",cannelUpload);
		};
		//-------------------------------------------
		
		
		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
            sendParams = null;
			 $.custEvent.remove(_this.objs.messageDetailList, "toEdit", scrollToEdit);
             $.common.channel.flashUpImg.remove("completeUpload",checkUploadComplete);
            $.common.channel.flashUpImg.remove("cannelUpload",cannelUpload);
             if(runFlash){runFlash.destroy();}
		};
		//-------------------------------------------
		
		
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
		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------
		
		
		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		
		//-------------------------------------------
		
		
		return that;
	};
	
});
