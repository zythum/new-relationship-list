/**
 * @author lianyi@staff.sina.com.cn
 * @date 2011年10月23日 20:56
 * 评论隐私设置浮层，弹出条件为（缺一不可）：
 * 1.收到的评论页面
 * 2.当用户评论设置为所有人的时候
 * 3.当用户成功举报一条评论或成功删除一条评论的时候
 * 
 * 具体条件可以在收到的评论页面完成，本文件只是完成了浮层上面的操作
 */
$Import('ui.dialog');
$Import('ui.confirm');
$Import('ui.tipAlert');
$Import('ui.litePrompt');
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('common.trans.comment');
STK.register('common.comment.privateSetting' , function($) {
	//showType代表弹出框类型，
	//1代表删除评论或者举报评论成功之后自动弹出的层，弹出的条件是用户的隐私设置是所有人，下方按钮是“保存”，“不再提示”
	//2代表在收到的评论页面上方醒目位置放置的链接，“设置我的评论隐私”，下方按钮是“保存”，“不再提示”，这种类型显示出来的时候需要读取用户当前隐私设置
	var showType = 1, userSetting = 0;
	var that = {},
		dialog,
		delegate,
		chooseValue = 0,
		nodes,
		trans = {},
		ioBlock = 0,
		noMoreBlock = 0,
		$L = $.kit.extra.language;
	
	var parseDOM = function() {
		var uniqueKey = $.getUniqueKey , template = $.core.util.easyTemplate , parseDOMFun = $.kit.dom.parseDOM  ;
		var data = {
			id1 : 'key' + uniqueKey(),
			id2 : 'key' + uniqueKey(),
			id3 : 'key' + uniqueKey(),
			showType: showType,
			set: userSetting
		};
		var html = '<#et privateSetting data><div class="detail layer_setup_privacy" node-type="content">' + 
						'<div class="text_tips">#L{为了避免受到不必要的骚扰，建议设置“可信用户”可以评论我的微博。}</div>' + 
						'<p class="privacy_title">#L{设置谁可以评论我的微博}</p>' + 
						'<ul class="privacy_repliable">' + 
						'	<li><label for="${data.id1}"><input type="radio" class="W_radio" value="0" name="comment" id="${data.id1}" action-type="choose" <#if (data.showType == 1)>checked="checked"</#if><#if (data.showType==2 && data.set==0)>checked="checked"</#if>/>&nbsp;#L{所有人}<span class="W_textb">#L{（不包括你的黑名单用户）}</span></label></li>' + 
						'  <li><label for="${data.id2}"><input type="radio" class="W_radio" value="2" name="comment" id="${data.id2}" action-type="choose" <#if (data.showType==2 && data.set==2)>checked="checked"</#if>/>&nbsp;#L{可信用户}<span class="W_textb">#L{（包括我关注的人、新浪认证用户、微博达人以及手机绑定用户）}</span></label></li>' + 
						'  <li><label for="${data.id3}"><input type="radio" class="W_radio" value="1" name="comment" id="${data.id3}" action-type="choose" <#if (data.showType==2 && data.set==1)>checked="checked"</#if>/>&nbsp;#L{我关注的人}</label></li>' + 
						'</ul>' + 
						'<div class="btn"><a href="javascript:void(0)" class="W_btn_b" action-type="OK" node-type="OK" style="visibility:hidden;"><span>#L{保存}</span></a><#if (data.showType==1)><a href="javascript:void(0)" class="W_btn_a" action-type="cancel" node-type="noMore"><span>#L{不再提示}</span></a></#if><#if (data.showType==2)><a href="javascript:void(0)" class="W_btn_a" action-type="hide" node-type="hide"><span>#L{取消}</span></a></#if></div>' +
					'</div></#et>';
		dialog = $.ui.dialog();
		dialog.setTitle($L('#L{评论隐私设置}'));
		dialog.setContent(template($L(html) , data).toString());
		nodes = parseDOMFun($.builder(dialog.getOuter()).list);
	};
	var bindDOMFuns = {
		chooseItem : function(opts) {
			chooseValue = opts.el.value;
            if(showType == 1) {
				$.setStyle(nodes.OK, "visibility", chooseValue == 0 ? "hidden" : "visible");
			} else {
				$.setStyle(nodes.OK, "visibility", chooseValue == userSetting ? "hidden" : "visible");
			}
		},
		save : function(opts) {
			chooseValue = parseInt(chooseValue , 10);
            if(chooseValue > -1){
				if(ioBlock) {
					return;
				}
				ioBlock = 1;
				trans.save.request({"comment" : chooseValue});
			}
			return $.preventDefault(opts.evt);
		},
		cancel : function(opts) {
			if(noMoreBlock) {
				return;
			}
			noMoreBlock = 1;				
			destroy();
			dialog.hide();
			trans.noMore.request({
				bubbletype : 5,
				time : 7 * 86400
			});
			return $.preventDefault(opts.evt);
		},
		hide : function(opts) {
			destroy();
			dialog.hide();
			return $.preventDefault(opts.evt);
		}
	};
	var ioFuns = {
		getSetErr : function() {
			$.ui.alert($L('#L{对不起，评论隐私设置获取失败}'));	
		},
		getAlert : function(isSuccess , msg , callback) {
			var tipAlert = $.ui.tipAlert({
				showCallback: function() {
					setTimeout(function() {
						tipAlert && tipAlert.anihide();
					} , 500);
				},
				hideCallback: function() {
					tipAlert && tipAlert.destroy();
					if(isSuccess) {
						setTimeout(function() {
							//ioBlock = 0;
							callback && callback();
							destroy();
							dialog.hide();
						} , 200);
					} else {
					    //ioBlock = 0;
						callback && callback();
					}
				},
				msg : msg,
				type: isSuccess ? undefined : 'del'
			});
			return tipAlert;
		},
		saveSuccess : function(ret, data) {
			dialog.hide();
			$.ui.litePrompt($L("#L{保存成功}"), {'type':'succM','timeout':'1000','hideCallback':function(){window.location.reload();}});
		},
		saveError : function() {
			var tipAlert = ioFuns.getAlert(false , $L("#L{保存失败，请重试}") , function() {
				ioBlock = 0;
			});
			tipAlert.setLayerXY(nodes.OK);
			tipAlert.aniShow();
		},
		noMoreSuccess : function() {
			noMoreBlock = 0;
		},
		noMoreError : function() {
			noMoreBlock = 0;
		}

	};
	var bindDOM = function() {
		chooseValue = 0;
		noMoreBlock = 0;
		delegate = $.delegatedEvent(nodes.content);
		delegate.add('choose' , 'click' , bindDOMFuns.chooseItem);
		delegate.add('OK' , 'click' , bindDOMFuns.save);
		delegate.add('cancel' , 'click' , bindDOMFuns.cancel);
		delegate.add('hide' , 'click' , bindDOMFuns.hide);
	};
	var bindTrans = function() {
		trans.save = $.common.trans.comment.getTrans('privateSetting' , {
			onSuccess :  ioFuns.saveSuccess,
			onError : ioFuns.saveError
		});
		trans.noMore = $.common.trans.comment.getTrans('privateNoMore' , {
			onSuccess : ioFuns.noMoreSuccess,
			onError : ioFuns.noMoreError
		});
	};
	var show = function(spec) {
		if(spec){
			spec["data"] && spec["data"]["set"] && (userSetting = spec.data.set);
			showType = !!userSetting ? 2 : 1;
		}
		//绑定接口
		bindTrans();
		parseDOM();
		bindDOM();
		//显示
		dialog.show();
		dialog.setMiddle();
	};
	var destroy = function() {
		delegate && delegate.destroy();
	};
	/*
	测试使用代码
	var insertCss = function(url) {
		var link = document.createElement('link');
		link.type = 'text/css';
		link.charset = 'UTF-8';
		link.rel = 'stylesheet';
		link.href = url;
		document.getElementsByTagName('HEAD')[0].appendChild(link);
	};
	$.Ready(function() {
		insertCss('http://img.t.sinajs.cn/t4/style/css/module/global/text_tips.css');
		insertCss('http://img.t.sinajs.cn/t4/style/css/module/layer/layer_setup_privacy.css');
		setTimeout(show , 3000);
	});
	*/
	that.show = show;
	return that; 	
});
