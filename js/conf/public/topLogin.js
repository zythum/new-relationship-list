/**
 * @author lianyi | lianyi@staff.sina.com.cn
 * 创建日期:2011年7月8日
 * 顶部导航-登录层
 * WBtopPublicLogin.showLoginLayer为暴露出的方法，显示登录弹层
 * 调用方法
   1.WBtopPublicLogin.showLoginLayer('zh-cn');   显示简体中文版本的登录弹层
   2.WBtopPublicLogin.showLoginLayer('zh-tw');   显示繁体中文版本的登录弹层
 */

var WBtopPublicLogin = function() {
	var URLS={
		'loginEncode':'http://js.t.sinajs.cn/t4/home/js/public/loginEncode.js'
	};
	$Import('core.STK');
    var $ = STK;
	$Import("core.util.hideContainer");
	$Import("core.dom.getStyle");
	$Import("core.util.language");
	$Import("core.util.templet");
	$Import("core.obj.parseParam");
	$Import("core.util.cookie");
	$Import("core.arr.foreach");
	$Import("core.dom.position");
	$Import("core.dom.builder");
	$Import("core.dom.uniqueID");
	$Import("core.evt.custEvent");
	$Import("core.str.encodeHTML");
	$Import("core.str.decodeHTML");
	$Import("core.dom.cascadeNode");
	$Import("core.evt.addEvent");
	$Import("core.obj.sup");
	$Import("core.dom.contains");
	$Import("core.util.winSize");
	$Import("core.util.scrollPos");
	$Import("core.dom.removeNode");
	$Import("core.arr.isArray");
	$Import("core.dom.isNode");
	$Import("core.evt.removeEvent");
	$Import("core.util.getUniqueKey");
	$Import("core.dom.ready");
	$Import("core.arr.indexOf");
	$Import("core.dom.insertElement");
	$Import("core.dom.sizzle");
	$Import("core.util.drag");
	$Import("core.util.pageSize");
	$Import("core.obj.cut");
	$Import("core.evt.getEvent");
	$Import("core.dom.getSize");
	$Import("core.str.trim");
	$Import("core.evt.hotKey");
	$Import("core.evt.delegatedEvent");
	$Import("core.json.queryToJson");
	$Import("core.evt.preventDefault");
	$Import('core.io.jsonp');
	$.jsonp=$.core.io.jsonp;
	$.isNode = $.core.dom.isNode;
    $.parseParam = $.core.obj.parseParam;
    $.addEvent = $.core.evt.addEvent;
    $.custEvent = $.core.evt.custEvent;
    $.objSup = $.core.obj.sup;
    $.drag = $.core.util.drag;
    $.builder = $.core.dom.builder;
    $.sizzle = $.core.dom.sizzle;
    $.contains = $.core.dom.contains;
    $.isArray = $.core.arr.isArray;
    $.Ready = $.core.dom.ready;
    $.getUniqueKey = $.core.util.getUniqueKey;
    $.hotKey = $.core.evt.hotKey;
    $.removeEvent = $.core.evt.removeEvent;
	$.preventDefault = $.core.evt.preventDefault;
    $.removeNode=$.core.dom.removeNode;
    $Import("kit.io.cssLoader");
    $Import("kit.dom.parseDOM");
    $Import("ui.dialog");
	//私有变量定义区
	//------------------------
	//justEmpty为用户名什么都没有时，按backspace没有反应
	var cssLoaded , dialog , nodes , defaultText = '#L{邮箱/会员帐号/手机号}' , suggestTitle = '<li class="title">#L{请选择邮箱类型}</li>' , suggestTimer , suggestIndex , justEmpty , suggestIsShow , lang_type , params;
	var emailDomain = ['sina.com','163.com','qq.com','126.com','vip.sina.com','sina.cn','hotmail.com','gmail.com','sohu.com','yahoo.cn','139.com','wo.com.cn','189.cn','3g.sina.cn'];
	var _lang = {
	    "邮箱/会员帐号/手机号": "郵箱/會員帳號/手機號",
	    "请选择邮箱类型": "請選擇郵箱類型",
	    "已有新浪博客、新浪邮箱帐号，可直接登录": "已有新浪博客、新浪郵箱帳號，可直接登錄",
	    "请输入密码": "請輸入密碼",
	    "登录": "登錄",
	    "还未开通？": "還未開通？",
	    "赶快免费注册一个吧！": "趕快免費注冊一個吧！",
	    "注册微博": "注冊微博",
	    "请输入用户名": "請輸入用戶名",
	    "登录或注册": "登錄或注冊",
	    "下次自动登录":"下次自動登錄"
	};
	//当前语言判断是否有了语言包
	var _language;
	//用于代理item的click事件
	var delegateObj;
	var inviteCode=(window.$CONFIG && window.$CONFIG.inviteCode)||'';
	var entry=(window.$CONFIG && window.$CONFIG.entry)||'';

	var registUrl = 'http://' + (document.domain == 'www.weibo.com' ? 'www.weibo.com' : 'weibo.com') + '/signup/signup.php?c=&type=&inviteCode='+inviteCode+'&entry='+entry+'&code=&spe=&lang=zh';
	
	var _dHtml = '<div class="layer_login">' + 
					'<dl class="signin">' + 
						'<form method="post" node-type="form" action="http://login.sina.com.cn/sso/login.php">' + 
							'<dt>#L{已有新浪博客、新浪邮箱帐号，可直接登录}</dt>' + 
							'<dd>' + 
								'<input type="text" autocomplete="off" class="W_input W_input_default" value="#L{邮箱/会员帐号/手机号}" node-type="username" tabindex="1"/>' + 
								'<input type="hidden" name="su" value="" node-type="username1"/>' +
							'</dd>' + 
							'<dd>' + 
								'<input type="text" class="W_input W_input_default" value="#L{请输入密码}" node-type="passwordtext" tabindex="2"/>' + 
								'<input type="password" name="sp" class="W_input" value="" node-type="password" style="display:none;" tabindex="3" autocomplete="off"/>' + 
								'<input type="hidden" name="url" value="" node-type="location"/>' + 
								'<input type="hidden" name="returntype" value="META"/>' + 
								'<input type="hidden" name="entry" value="miniblog"/>' + 
								'<input type="hidden" name="encoding" value="utf-8"/>' +
								'<input type="hidden" name="pwencode" value="" node-type="pwencode"/>' +
								'<input type="hidden" name="servertime" value="" node-type="servertime"/>' +
								'<input type="hidden" name="nonce" value="" node-type="nonce"/>' +
								'<input type="hidden" name="gateway" value="1" node-type="gateway"/>' +
							'</dd>' + 
							'<dd><a href="javascript:void(0)" class="W_btn_b" tabindex="4" node-type="submitBtn"><span>#L{登录}</span></a><label for="weibo_top_login_savestate"><input value="7" type="checkbox" name="savestate" class="W_checkbox" tabindex="5" id="weibo_top_login_savestate" node-type="saveState" checked="checked"/>#L{下次自动登录}</label><button type="submit" value="提交表单" hideFocus="true" style="width:1px;height:1px;background:none;border:none;outline:none;" node-type="submit"></button></dd>' + 
						'</form>' + 
					'</dl>' + 
					'<dl class="login">' + 
						'<dt>#L{还未开通？} <br />#L{赶快免费注册一个吧！}</dt>' + 
						'<dd><a href="' + registUrl + '" class="W_btn_b" tabindex="6" node-type="registUrl"><span>#L{注册微博}</span></a></dd>' + 
					'</dl>' + 
				'</div>';
	var emailHtml = '<div style="position:absolute;width:244px;display:none;z-index:100002" class="layer_menu_list" node-type="suggest" tabindex="-1">' + 
									'<ul node-type="suggestContent"></ul>' + 
								'</div>';
	var errorHtml = '<div class="layer_tips" style="z-index:100002;display:none;">' + 
						'<p><span class="W_error"></span></p>' + 
						'<a class="W_close_color" href="javascript:void(0)"></a>' + 
						'<span class="arrow_down"></span>' + 
					'</div>';
	var $L = $.core.util.language;
	//ie6遮罩iframe
	var iframe ;
	//公开方法定义区
	//------------------------
	var that = {};
	that.showLoginLayer = function(_params) {
		params = _params;
		lang_type = params.lang;
		if(lang_type == 'zh-tw') {
			_language = _lang;
		} else {
			_language = null;
		}
		loadCss();
	};
	//私有方法定义区
	//------------------------
	var loadCss = function() {
		if(cssLoaded) {
			runJs();
		} else {
			$.kit.io.cssLoader('style/css/module/layer/layer_login_out.css','js_style_css_module_layer_layer_login' , function() {
				cssLoaded = true;
				runJs();
			}, undefined , true);
		}
	};
	var runJs = function() {
		if(!dialog) {
			buildDialog();
			parseDOM();
			bindDOM();
		}
		showDialog();
	};
	var showIframe = function() {
		if(!iframe) {
			iframe = $.C('iframe');
			iframe.style.position = 'absolute';
			iframe.style.left = '0px';			
			iframe.style.top = '0px';
			iframe.frameBorder = 0;
			iframe.tabIndex = -1;
			iframe.src = 'about:blank';
			iframe.style.border = 'none';
			iframe.style.filter = 'alpha(opacity=0)';
			iframe.style.backgroundColor = '#ffffff';
			document.body.appendChild(iframe);
			iframe.style.width = '100%';
		}
		var size = $.core.util.pageSize();
		iframe.style.height = size.page.height + 'px';
		iframe.style.display = '';
		addResize();
	};
	var addResize = function() {
		$.addEvent(window , "resize" , resizeFun);		
	};
	var removeResize = function() {
		$.removeEvent(window , "resize" , resizeFun);		
	};
	var resizeTimer;
	var resizeFun = function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(resizeFunImpl , 500);		
	};
	var resizeFunImpl = function() {
		if(iframe) {
			var size = $.core.util.pageSize();
			iframe.style.height = size.page.height + 'px';			
		}		
	};
	var hideIframe = function() {
		iframe.style.display = 'none';
		removeResize();
	};
	var saveCookie = function(username) {
		$.core.util.cookie.set('un' , username , {
			expire : 240			
		});	
	};
	var showDialog = function() {
		nodes.location.value = params.loginSuccessUrl;
		var un = $.core.util.cookie.get('un');
		if(un) {
			un = unescape(un);
			$.core.dom.removeClassName(nodes.username , "W_input_default");
			nodes.username.value = un;
		} else {
			nodes.username.value = $L(defaultText , _language);
			$.core.dom.addClassName(nodes.username , "W_input_default");				
		}
		nodes.password.value = '';
		nodes.password.style.display = 'none';
		nodes.passwordtext.style.display = '';
		nodes.saveState.checked = true;
		dialog.show();
		dialog.setMiddle();
		var pos = $.core.dom.position(nodes.username);
		var size = $.core.dom.getSize(nodes.username);
		var style = nodes.suggest.style;
		style.left = (pos.l + 5) + 'px';
		style.top = (pos.t + size.height - 5) + 'px';
		//对于ie6添加遮罩
		if($.core.util.browser.IE6) {
			showIframe();			
		}
	};
	var parseDOM = function() {
		nodes = $.kit.dom.parseDOM($.builder(dialog.getOuter()).list);
		var div = $.C('div');
		div.innerHTML = emailHtml;
		var dom = div.childNodes[0]
		document.body.appendChild(dom);
		nodes.suggest = dom;
		nodes.suggestContent = dom.getElementsByTagName('UL')[0];
		var div1 = $.C('div');
		div1.innerHTML = errorHtml;
		var dom1 = div1.childNodes[0];
		document.body.appendChild(dom1);
		nodes.error = dom1;
		nodes.errorContent = $.sizzle('span.W_error')[0];
		nodes.errorClose = nodes.error.getElementsByTagName('A')[0];
		var cloneTitle = nodes.title.cloneNode(true);
		var newTitle = $.C('div');
		var tmp = $.C('div');
		tmp.appendChild(cloneTitle);
		newTitle.innerHTML = tmp.innerHTML;
		newTitle = newTitle.childNodes[0];
		nodes.title.parentNode.replaceChild(newTitle , nodes.title);
		nodes.title = newTitle;
		newTitle.style.cursor = 'default';
		nodes.registUrl.href = registUrl.replace(/lang=(.+?)$/ , function() {
			if(lang_type == 'zh-tw') {
				return 'lang=zh-tw';
			} else {
				return 'lang=zh';
			}
		});
	};
	
	//绑定dom事件
	var bindDOMFuns = {
		userNameFocus : function(e) {
			e = $.core.evt.getEvent();
			var target = e.target || e.srcElement;
			if(target.value == $L(defaultText , _language)) {
				target.value = '';
				$.core.dom.removeClassName(target , 'W_input_default');
				justEmpty = true;
			} else {
				justEmpty = false;
				setTimeout(function() {
					var selectAll = bindDOMFuns.checkSelectAll();
					if(selectAll) {
						bindDOMFuns.suggestKeyUpImpl();
					}
				} , 20);
			}
		},
		checkSelectAll : function() {
			var inputNode = nodes.username;
			var start,len;
			if(typeof inputNode.selectionStart !== 'undefined') {
				start = inputNode.selectionStart;
				len = inputNode.selectionEnd - inputNode.selectionStart;
			} else if(inputNode.createTextRange) {
				var workRange = document.selection.createRange();
				var surveyRange = inputNode.createTextRange();
				surveyRange.setEndPoint('EndToStart', workRange);
				start = surveyRange.text.length;
				len = workRange.text.length;
				workRange = null;
				surveyRange = null;
			}
			return inputNode.value !== '' && start === 0 && len === inputNode.value.length;
		},
		userNameBlur : function(e) {
			e = $.core.evt.getEvent();
			var target = e.target || e.srcElement;
			if($.core.str.trim(target.value) == '') {
				$.core.dom.addClassName(target , 'W_input_default');
				target.value = $L(defaultText , _language);
			}
			suggestIsShow = false;
			justEmpty = false;
			nodes.suggest.style.display = 'none';
		},
		passwordTextFocus : function(e) {
			e = $.core.evt.getEvent();
			var target = e.target || e.srcElement;
			target.style.display = 'none';
			nodes.password.style.display = '';
			try{nodes.password.focus()}catch(e){};
		},
		passwordBlur : function(e) {
			e = $.core.evt.getEvent();
			var target = e.target || e.srcElement;
			if(target.value == '') {
				target.style.display = 'none';
				nodes.passwordtext.style.display = '';
			}
		},
		suggestKeyUp : function(e) {
			e= $.core.evt.getEvent();
			var code = e.keyCode || e.which;
			var noTrim = nodes.username.value;
			var value = $.core.str.trim(noTrim);
			if(!value && justEmpty && (value == noTrim)) {
				return;
			}
			switch(code) {
				case 38 :
					if(suggestIsShow) {
						justEmpty = false;
						bindDOMFuns.suggestSelect(-1);
					}
					break;
				case 40 :
					if(suggestIsShow) {
						justEmpty = false;
						bindDOMFuns.suggestSelect(1);
					}
					break;
				case 13 :
					if(suggestIsShow) {
						justEmpty = false;
						bindDOMFuns.selectEnter();
					}
					(e.preventDefault && e.preventDefault()) || (e.returnValue = false);
					break;
				case 9 :
					break;
				case 27 :
					nodes.suggest.style.display = 'none';
					justEmpty = false;
					break;
				default :
					justEmpty = false;
					clearTimeout(suggestTimer);
					suggestTimer = setTimeout(bindDOMFuns.suggestKeyUpImpl , 50);
			}
		},
		selectEnter : function() {
			var items = nodes.suggestContent.getElementsByTagName('LI');
			var value = $.core.str.trim(items[suggestIndex].getElementsByTagName('A')[0].innerHTML);
			nodes.username.value = value;
			nodes.suggest.style.display = 'none';
			suggestIsShow = false;
			nodes.passwordtext.style.display = 'none';
			nodes.password.style.display = '';
			try{nodes.password.focus()}catch(e){};
		},
		suggestSelect : function(dir) {
			var backIndex = suggestIndex;
			if(dir > 0) {
				suggestIndex ++;
			} else {
				suggestIndex --;
			}
			var items = nodes.suggestContent.getElementsByTagName('LI');
			var count = items.length - 1;
			if(suggestIndex <= 0) {
				suggestIndex = count;
			} else if(suggestIndex > count){
				suggestIndex = 1;
			}
			$.core.dom.removeClassName(items[backIndex] , 'cur');
			$.core.dom.addClassName(items[suggestIndex] , 'cur');
		},
		suggestKeyUpImpl : function(e) {
			suggestIndex = 1;
			var value = $.core.str.trim(nodes.username.value);
			var htmlArr = [];
			htmlArr.push($L(suggestTitle , _language));
			var atIndex = value.indexOf('@');
			htmlArr.push('<li class="cur" action-type="email_item"><a href="javascript:void(0)">' + (value?value:'\u3000') + '</a></li>');
			if(atIndex > -1) {
				//有@
				var domain = value.substr(atIndex + 1);
				value = value.replace(/@.*$/ , '') + '@';
				for(var i = 0 , len = emailDomain.length; i < len ; i++) {
					if(!domain || emailDomain[i].indexOf(domain) == 0) {
						htmlArr.push('<li action-type="email_item"><a href="javascript:void(0)">' + value + emailDomain[i] + '</a></li>');
					}
				}
			} else {
				//没有@，全部添加
				for(var i = 0 , len = emailDomain.length ; i <  len; i++) {
					htmlArr.push('<li action-type="email_item"><a href="javascript:void(0)">' + value + '@' + emailDomain[i] + '</a></li>');
				}
			}
			nodes.suggestContent.innerHTML = htmlArr.join('');
			nodes.suggest.style.display = '';
			suggestIsShow = true;
		},
		checkSubmit : function(e) {
			nodes.error.style.display = 'none';
			e = $.core.evt.getEvent();
			var username = $.core.str.trim(nodes.username.value);
			if(!username || (username == $L(defaultText , _language))) {
				//显示错误提示：用户名
				(e.preventDefault && e.preventDefault()) || (e.returnValue = false);
				try{nodes.username.focus()}catch(e){}
				bindDOMFuns.showLayerError($L('#L{请输入用户名}' , _language) , nodes.username);
			} else {
				var password = nodes.password.value;
				if(!password) {
					//显示错误提示：密码
					(e.preventDefault && e.preventDefault()) || (e.returnValue = false);
					nodes.passwordtext.style.display = 'none';
					nodes.password.style.display = '';
					try{nodes.password.focus()}catch(e){};
					bindDOMFuns.showLayerError($L('#L{请输入密码}' , _language) , nodes.password);
					return false;
				}
//				setTimeout(function() {
//					dialog.hide();
//				} , 0);
				saveCookie(username);
				return true;
			}
		},
		showLayerError : function(msg , nodeTo) {
			nodes.errorContent.innerHTML = msg;
			var size = $.core.dom.getSize(nodes.error);
			var pos = $.core.dom.position(nodeTo);
			nodes.error.style.left = pos.l + 'px';
			nodes.error.style.top = (pos.t - size.height - 10 ) + 'px';
			nodes.error.style.display = '';
		},
		closeErrorLayer : function() {
			nodes.error.style.display = 'none';
		},
		submitBtnClick : function(e) {
			e = $.core.evt.getEvent();
			(e.preventDefault && e.preventDefault()) || (e.returnValue = false);
			var result = bindDOMFuns.checkSubmit();			
			if(!result){
				return false;
			}
			var spec={
				'un': nodes.username.value,
				'pwd': nodes.password.value,
				'callbk': function(opts){
					nodes.username1.value=opts.un;
					nodes.password.value=opts.pwd;
					nodes.pwencode.value='wsse';
					nodes.servertime.value=opts.servertime;
					nodes.nonce.value=opts.nonce;
					nodes.form.submit();
				}
			};
			if(window.WBtopLoginEncode && WBtopLoginEncode.encode){
				WBtopLoginEncode.encode(spec);
				return;
			}else{
				nodes.username1.value=nodes.username.value; //保证不可编译情况下，正常登陆
				$.removeNode(nodes.pwencode);
				$.removeNode(nodes.servertime);
				$.removeNode(nodes.nonce);
				nodes.form.submit();
			}
		},
		autoFocus : function(e) {
			e = $.core.evt.getEvent();
			var code = e.keyCode;
			if(code == 13) {
				bindDOMFuns.submitBtnClick(e);
				//nodes.submit.focus();
			}
		},
		closeDialog : function() {
			nodes.error.style.display = 'none';
			nodes.suggest.style.display = 'none';
		},
		emailItemClick : function(spec) {
			var text = spec.el.childNodes[0].innerHTML;
			$.core.dom.removeClassName(nodes.username , "W_input_default");
			nodes.username.value = text;
		}
	};
	var bindDOM = function() {
		delegateObj = $.core.evt.delegatedEvent(nodes.suggest);
		$.addEvent(nodes.username , 'focus' , bindDOMFuns.userNameFocus);
		$.addEvent(nodes.username , 'blur' , bindDOMFuns.userNameBlur);
		$.addEvent(nodes.passwordtext , 'focus' , bindDOMFuns.passwordTextFocus);
		$.addEvent(nodes.password , 'blur' , bindDOMFuns.passwordBlur);
		$.addEvent(nodes.username , 'keydown' , bindDOMFuns.suggestKeyUp);
		
		$.addEvent(nodes.password , 'keydown' , bindDOMFuns.autoFocus);
		$.addEvent(nodes.username , 'keyup' , bindDOMFuns.autoFocus);
		//$.addEvent(nodes.form , 'submit' , bindDOMFuns.autoFocus);
		$.addEvent(nodes.errorClose , 'click' , bindDOMFuns.closeErrorLayer);
		$.addEvent(nodes.submitBtn , 'click' , bindDOMFuns.submitBtnClick);
		$.addEvent(nodes.close , 'click' , bindDOMFuns.closeDialog);
		if($.core.util.browser.IE8 || $.core.util.browser.IE9) {
			$.addEvent(nodes.form , 'keypress' , bindDOMFuns.autoFocus);
		}
		delegateObj.add("email_item" , 'mousedown' , bindDOMFuns.emailItemClick);
	};
	var buildDialog = function() {
		dialog = $.ui.dialog({isHold : true});
		dialog.setTitle($L('#L{登录或注册}' , _language));
		dialog.setContent($L(_dHtml , _language));
		if($.core.util.browser.IE6) {
			$.custEvent.add(dialog, 'hide', function(){
				hideIframe();
			});						
		}
	};
	//
	(function(){
		$.jsonp({'url':URLS['loginEncode']});
	})();
	return that;
}();
