/**
 * 验证码浮层(验证码浮层接管ajax请求，检查code为100027弹出浮层，验证码验证完毕后再次请求原始接口，并将验证码服务返回的pin值加入到原始请求中)
 * @id STK.common.dialog.validateCode
 * @author lianyi | lianyi@staff.sina.com.cn
 * @author jinlong1 | jinlong1@staff.sina.com.cn
 * 公开方法:
 *  1.validateIntercept(用于在原有业务之前拦截ajax请求处理验证码逻辑)
 *  
 *  example1:
 *  
 *  var validCodeLayer = $.common.dialog.validateCode();
 *  var t = $.common.trans.message.getTrans('create',{
		onComplete : function(ret , data) {
			var conf =  {
				onSuccess : onSuccess,			//原AJAX请求onSuccess
				onError : onError,				//原AJAX请求onError
				requestAjax : t,				//原AJAX请求
				param : data,			//原AJAX请求参数
				onRelease : function() {		//取消或关闭dialog时重置状态
						
				}
			};
			//加入验证码检查机制，参见$.common.dialog.validateCode
			validCodeLayer.validateIntercept(ret , data , conf);
		}
	});
	var data = {};		//原AJAX提交参数
	t.request(data);
	 
      
	example2:      

 *  //getParam用于ajax原始请求获取传递给php的参数
	  var getParam  = function() {
	  	 return {
	  	 	param1 : '',
	  	 	param2 : ''
	  	 };
	  };
      //拦截方法调用处,用getTrans的onComplete取代原来的onSuccess,onError，将返回信息交给validateIntercept进行处理
      var helloAjax = $.common.trans.hello.getTrans('helloworld', {
			'onComplete': function(ret , data) {
				//第三个参数传递的对象用于验证码逻辑处理
				//onSuccess:不需要验证码时服务返回10000直接运行onSuccess
				//onError:不需要验证码时服务返回不是10000直接运行onError
				//requestAjax,param:需要验证码并且验证通过时会重新requestAjax.request(param)，并且param中会添加服务器返回的pin码
				//onRelease:当点击取消验证码时执行释放锁定等逻辑，比如发布框确定的时候释放锁定
				validateTool.validateIntercept(ret , data , {
					onSuccess : onSuccess,
					onError : onError,
					requestAjax : helloAjax,
					param : getParam(),
					onRelease : function() {}
				});
			}
		});
	2.destroy(用于页面unload时候进行资源的释放)
 */
$Import("ui.dialog");
$Import('kit.extra.language');
$Import('common.trans.validateCode');
$Import('kit.io.cssLoader');
STK.register("common.dialog.validateCode", function($){

	//---常量定义区----------------------------------
	//L用于在window.$LANG中添加繁体字支持,$L用于调用方法替换简体为繁体
	var L = window.$LANG,$L = $.kit.extra.language;
	//验证码服务基础地址
	var picBase = '/aj/pincode/pin?type=rule&lang=' + $CONFIG.lang + '&ts=';
	//TEMPLATE模板，用于初始化验证码弹层
	var TEMPLATE = {
			dialog_html : '<div class="layer_veriyfycode">' +
								'<div class="v_image"><img height="50" width="450" class="yzm_img" /></div>' + 
									'<p class="v_chng"><a href="#" onclick="return false;" class="yzm_change" action-type="yzm_change">#L{换另一组题目}</a></p>' + 
									'<p class="v_ans_t">#L{请输入上面问题的答案}：</p>' +
									'<p class="v_ans_i"><input type="text" class="W_inputStp v_inp yzm_input ontext" action-type="yzm_input"/><div class="M_notice_del yzm_error" style="display:none;"><span class="icon_del"></span><span class="txt"></span></div></p>' + 
									'<p class="v_btn">' + 
										'<a class="W_btn_b yzm_submit" href="#" action-type="yzm_submit"><span>#L{确定}</span></a><a class="W_btn_a yzm_cancel" href="#" action-type="yzm_cancel" action-data="value=frombtn"><span>#L{取消}</span></a>' + 
									'</p>' +
						  '</div>'
		};
	//-------------------------------------------
	//使用单例模式，验证码弹层不会同时出现,对于没有destory方法的模块请手动调用addUnloadEvent方法,以释放内存
	var singleton;
	
	return function(){
        if(singleton) {
			return singleton;
		}
		$.kit.io.cssLoader('style/css/module/layer/layer_verifycode.css','js_style_css_module_layer_layer_verifycode');
		var that = {};
		//---变量定义区----------------------------------
		var nodes = {};
		var dialog;
		//保存住验证服务之前的服务参数
		var saveCallback;
		//验证码正在验证的变量(防止多次提交)
		var isValidating;
		//使用代理的方式进行事件处理
		var delegateObj;
		//验证码弹层隐藏错误
		var hideError = function() {
			nodes.yzm_error.innerHTML = '';
			nodes.yzm_error.parentNode.style.display = 'none';
		};
		//验证码弹层显示错误
		var showError = function(msg) {
			nodes.yzm_error.innerHTML = msg;
			nodes.yzm_error.parentNode.style.display = '';
		};
		//显示验证码弹层
		var showValidateLayer = function() {
            if(!dialog) {
				init_dialog();
			}
			hideError();
			nodes.input_text.value = '';
			dialog.show();
			bindDOMFuns.changesrc();
			dialog.setMiddle();
			$.hotKey.add(document.documentElement , ['esc'] , bindDOMFuns.closeDialog , {type : 'keyup' , 'disableInInput' : true});
		};
		//第一次初始化验证码弹层
		var init_dialog = function() {
			dialog = $.ui.dialog({isHold : true});
			dialog.setTitle($L("#L{请输入验证码}"));
			dialog.setContent($L(TEMPLATE.dialog_html));
			var outer = dialog.getOuter();
			//节点的获取方法
			parseDOM(outer);
			//节点事件的绑定方法
			bindDOM();
		};
		//与后台交互，验证验证码，完成逻辑
		var validateTrans = $.common.trans.validateCode.getTrans('checkValidate', {
			'onError' : function() {
				showError($L('#L{验证码错误}'));
				bindDOMFuns.changesrc();
				isValidating = false;
			},
			'onFail' : function() {
				showError($L('#L{验证码错误}'));
				bindDOMFuns.changesrc();
				isValidating = false;
			},
			'onSuccess' : function(ret , param){
				var retcode = ret.data.retcode;
				hideError();
				nodes.input_text.value = '';
				dialog.hide();
				var requestAjax = saveCallback.requestAjax;
//				var params = saveCallback.param;
				var params = $.kit.extra.merge(saveCallback.param,{
					retcode: retcode
				});
				requestAjax.request(params);
				isValidating = false;
			}
		});
		//---模块的初始化方法定义区-------------------------
		var initPlugins = function(){
			
		};
		//---组件的初始化方法定义区-------------------------
		var init = function(){

		};
		//---Dom的获取方法定义区---------------------------
		var parseDOM = function(outer){
			//验证码弹层上的图片
			nodes.vImg = $.core.dom.sizzle('img.yzm_img' , outer)[0];
			//验证码弹层上的换一换
			nodes.yzm_change = $.core.dom.sizzle('a.yzm_change' , outer)[0];
			//验证弹层的确定
			nodes.yzm_submit = $.core.dom.sizzle('a.yzm_submit' , outer)[0];
			//验证码弹层的取消
			nodes.yzm_cancel = $.core.dom.sizzle('a.yzm_cancel' , outer)[0];
			//验证码弹层的输入框
			nodes.input_text = $.core.dom.sizzle('input.yzm_input' , outer)[0];
			//验证码弹层的错误提示
			nodes.yzm_error = $.core.dom.sizzle('div.yzm_error span.txt' , outer)[0];
			//弹层上的小叉子
			nodes.close_icon = dialog.getDom('close');
		};
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			changesrc : function() {
				var codeImgUrl = picBase+$.getUniqueKey();
				nodes.vImg.setAttribute('src' , codeImgUrl);
				try{nodes.yzm_change.blur();}catch(e){}
			},
			checkValidateCode : function() {
				hideError();
				var value = $.core.str.trim(nodes.input_text.value);
				if(!value) {
					showError($L('#L{请输入验证码}'));
				} else {
					if(!isValidating) {
						isValidating = true;
						validateTrans.request({secode : value , type : "rule"});
					}
				}
				try{nodes.yzm_submit.blur();}catch(e) {}
			},
			closeDialog : function(obj) {
				if(typeof obj == 'object' && obj.el) {
					dialog.hide();
				}
				//执行原始操作的释放操作
				if(typeof saveCallback == 'object' && saveCallback.onRelease && typeof saveCallback.onRelease == 'function') {
					saveCallback.onRelease();
				}
				$.hotKey.remove(document.documentElement , ['esc'] , bindDOMFuns.closeDialog , {type : 'keyup'});
				try {
					$.preventDefault();
				} catch(e) {}
			},
			onFocus : function(e) {
				e = $.core.evt.getEvent();
				var target = e.target || e.srcElement;
				var val = target.value;
				if(!val) {
					hideError();
				}
			}
		};
		//---DOM事件绑定方法定义区-------------------------
		var bindDOM = function(){
			var outer = dialog.getOuter();
			delegateObj = $.core.evt.delegatedEvent(outer);
			//换一换
			delegateObj.add('yzm_change' , 'click' , function(){
				bindDOMFuns.changesrc();	
				$.preventDefault();
			});
			//确定
			delegateObj.add('yzm_submit' , 'click' , function(){
				bindDOMFuns.checkValidateCode();
				$.preventDefault();	
			});
			//取消
			delegateObj.add('yzm_cancel' , 'click' , bindDOMFuns.closeDialog);
			//小叉子关闭
			$.core.evt.addEvent(nodes.close_icon , 'click' , bindDOMFuns.closeDialog);
			$.core.evt.addEvent(nodes.input_text , 'focus' , bindDOMFuns.onFocus);
			$.core.evt.addEvent(nodes.input_text , 'blur' , bindDOMFuns.onFocus);
		};
		//组件销毁方法的定义区
		var destroy = function(){
            if(dialog) {
				delegateObj.destroy();
				$.core.evt.removeEvent(nodes.close_icon , 'click' , bindDOMFuns.closeDialog);
				$.core.evt.removeEvent(nodes.input_text , 'focus' , bindDOMFuns.onFocus);
				$.core.evt.removeEvent(nodes.input_text , 'blur' , bindDOMFuns.onFocus);
				dialog && dialog.destroy && dialog.destroy();
			}
            dialog = singleton = null;
		};
		//---组件公开方法的定义区---------------------------
		var validateIntercept = function(ret , param , confObj) {
			$.kit.io.cssLoader('style/css/module/layer/layer_verifycode.css','js_style_css_module_layer_layer_verifycode' , function() {
				if(ret.code == '100027') {
					saveCallback = confObj;
					showValidateLayer();
				} else {
					if(ret['code'] === '100000'){
						try{
							var fun = confObj.onSuccess;
							fun && fun(ret , param);
						}catch(exp){}
					}else{
						try{
							if(ret['code'] === '100002'){
								window.location.href=ret['data'];
								return;
							}
							var fun = confObj.onError;
							fun && fun(ret, param);
						}catch(exp){}
					}
				}
			});
			
		};
		//---执行初始化---------------------------------
		init();
		init = null;
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		that.validateIntercept = validateIntercept;
		that.addUnloadEvent = function() {
			if(dialog) {
				$.core.evt.addEvent(window , 'unload' , destroy);
			}
		};
		singleton = that;
		return that;
	};
});
