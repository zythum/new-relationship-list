/**
 * UC用户个性域名模块
 * created by lianyi@staff.sina.com.cn
 * 弹层具体内容，有两个按钮的操作，请求同一个ajax告知服务器弹层已经出现
 */
$Import('ui.dialog');
$Import('kit.io.cssLoader');
$Import('kit.dom.parseDOM');
$Import('common.trans.ucUser');
$Import('ui.confirm');
$Import('ui.litePrompt');
$Import('common.trans.feed');
$Import('common.channel.feed');
STK.register('comp.guide.ucUserImpl', function($) {
	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	
	return function(node) {
		//+++ 变量定义区 ++++++++++++++++++
		
		var that = {} , linkDomain = (document.domain == 'www.weibo.com' ? 'http://www.weibo.com' : 'http://weibo.com'),
			dialog,//dialog是对话窗口
		    dialogHtml = '<#et uc data>' + 
		    				'<div class="layer_uc_website">' + 
								'<p class="name">Hi,${data.screen_name}</p>' + 
								'<dl>' + 
									'<dt>#L{UC用户拥有特有的微博地址啦！你的微博地址是：}</dt>' + 
									'<dd>${data.linkDomain}/${data.domain}</dd>' + 
								'</dl>' + 
								'<p class="text">#L{喜欢这个地址吗？如果不喜欢，可以马上修改哦。}</p>' + 
								'<p class="uc_btn"><a class="W_btn_d" href="javascript:void(0)" node-type="likeIt" action-type="likeIt"><span action-type="likeIt">#L{我很喜欢}</span></a><a node-type="hateIt" action-type="hateIt" class="W_btn_f" href="javascript:void(0)"><span action-type="hateIt">#L{我要修改}</span></a></p>' + 
							'</div>' + 
						'</#et>',
			language = {
			    "UC用户拥有特有的微博地址啦！你的微博地址是：": "UC用戶擁有特有的微博地址啦！你的微博地址是：",
			    "喜欢这个地址吗？如果不喜欢，可以马上修改哦。": "喜歡這個地址嗎？如果不喜歡，可以馬上修改哦。",
			    "我很喜欢": "我很喜歡",
			    "您的微博地址升级啦！" : "您的微博地址升級啦！",
			    "常来玩哦！" : "常來玩哦！",
			    "快把新的微博地址告诉您的粉丝吧！":"快把新的微博地址告訴您的粉絲吧！",
			    "推荐成功！" : "推薦成功！",
			    "确定" : "確定",
				"温馨提示":"溫馨提示"
			},
			$L = $.core.util.language,
			template = $.core.util.easyTemplate,
			//用来缓存节点，便于addEvent
			nodes,
			//trans用来ajax请求
			trans = $.common.trans.ucUser.getTrans,
			//fromWhich 代表是谁点的 是点的我很喜欢(1)还是我要修改(2)
			fromWhich,
			//block 表示当前正在请求
			block = 0;
		//-------------------------------------------
		
		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function() {
			var lang = (window.$CONFIG && window.$CONFIG.lang) || 'zh-cn';
			if(lang != 'zh-tw') {
				language = {};
			}
			dialog = $.ui.dialog();
			var data = {
				screen_name : (window.$CONFIG && window.$CONFIG.nick) || '',
				domain : (window.$CONFIG && window.$CONFIG.domain) || '',
				linkDomain : linkDomain
			};
			dialog.setTitle($L('#L{您的微博地址升级啦！}' , language));
			dialog.setContent(template($L(dialogHtml , language) , data).toString());
			nodes = $.kit.dom.parseDOM($.builder(dialog.getOuter()).list);
			nodes.close.style.display = 'none';
			dialog.show();
			dialog.setMiddle();
		};
		var inter = {
			unset : trans('unset' , {
				onSuccess : function() {
					dialog.hide();
					if(fromWhich == 1) {
						$.ui.confirm($L("#L{快把新的微博地址告诉您的粉丝吧！}" , language), {
							title : $L("#L{温馨提示}" , language),
							OK : bindDOMFuns.recommendToFans
						});
					} else {
						window.location.href = linkDomain + '/settings/domain?ucdomain=' + document.domain;
					}
				},
				onError : function(data) {
					$.ui.alert(data.msg);
				},
				onComplete : function() {
					block = 0;
				},
				onFail : function() {
					block = 0;
				},
				onTimeout : function() {
					block = 0;
				}
			}),
			recommend : $.common.trans.feed.getTrans("publish" , {
				onSuccess : function(data) {
					if(data && data.data && data.data.html) {
						$.common.channel.feed.fire('publish', data.data.html);
					}
					$.ui.litePrompt($L('#L{推荐成功！}' , language),{'type':'succM','timeout':'500'});
				},
				onError : function(data) {
					$.ui.alert(data.msg);
				},
				onComplete : function() {
					block = 0;
				},
				onFail : function() {
					block = 0;
				},
				onTimeout : function() {
					block = 0;
				}
			})
		};
		var bindDOMFuns = {
			unsetFun : function() {
				$.preventDefault();
				if(block) {
					return false;
				}
				block = 1;
				var e = $.core.evt.getEvent();
				var target = e.target || e.srcElement;
				var type = target.getAttribute('action-type');
				if(type == 'likeIt') {
					fromWhich = 1;
				} else {
					fromWhich = 2;
				}
				inter.unset.request();
			},
			recommendToFans : function() {
				$.preventDefault();
				if(block) {
					return false;
				}
				block = 1;
				inter.recommend.request({
					text : $L("#L{我的微博地址更新啦！}" + linkDomain + "/#DOMAIN#，#L{常来玩哦！}".replace("#DOMAIN#" , (window.$CONFIG && window.$CONFIG.domain) || '') , language)
				});
			}
		};
		//-------------------------------------------
		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function() {
			$.addEvent(nodes.hateIt , 'click' , bindDOMFuns.unsetFun);
			$.addEvent(nodes.likeIt , 'click' , bindDOMFuns.unsetFun);
		};
		var loadCss = function() {
			$.kit.io.cssLoader('style/css/module/layer/layer_uc_website.css','js_style_css_module_layer_layer_uc_website' , function() {
				parseDOM();
				bindDOM();
			});
		};
		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function() {
			$.Ready(function() {
				loadCss();
			});
		};
		//-------------------------------------------
		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------
		var destroy = function() {
			$.removeEvent(nodes.hateIt , 'click' , bindDOMFuns.unsetFun);
			$.removeEvent(nodes.likeIt , 'click' , bindDOMFuns.unsetFun);
		};
		//------------------------------------------
		that.destroy = destroy;
		return that;
	};
});
