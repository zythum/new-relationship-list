/**
 * @author Zhoulianyi | lianyi@staff.sina.com.cn
 * 引荐模块
 */
$Import('kit.extra.language');
$Import('module.suggest');
$Import('common.content.inputTip');
$Import('common.dialog.contactKit');
$Import('common.trans.global');
$Import('common.trans.group');
$Import('kit.dom.parseDOM');
$Import('kit.extra.dynamicInputWidth');
$Import('ui.confirm');
$Import('ui.litePrompt');

STK.register('common.relation.recommendFollow', function($){
	return function(node , opts){
		var that = {} , nodes , dEvent , onstatus = 0 , lang = $.kit.extra.language , template = $.core.util.easyTemplate , trans , template = $.core.util.easyTemplate , recommendTrans , lock , keyup;
		//标记是第一次打开
		var firstOpen = 1;
		//------------
		var dynamic , contactkit;
		var suggestHtml = '<#et suggestList data><#list data as list>' +
							'<li action-data="${list.uid}" action-type="followItem"><a onclick="return false;" href="javascript:void(0)">${list.screen_name}</a></li>' +
						'</#list></#et>',suggestIndex = 0,suggestTool;
		var suggestItem = '<#et suggestItem data><a class="W_btn_deltags" href="javascript:void(0)" node-type="addedItem">${data.text}<img class="delicon" src="${data.imgPath}style/images/common/transparent.gif" action-type="delSuggestItem" action-data="value=${data.value}"/></a></#et>';
		var imgPath = $CONFIG['imgPath'];
		var pushedMap = {};
		var inputTipTool; 
		var removeInputLimit ;
		//短名修改
		var parseDOM = $.kit.dom.parseDOM;
		var builder = $.core.dom.builder;
		var dynamicInputWidth = $.kit.extra.dynamicInputWidth;
		var delegate = $.core.evt.delegatedEvent;
		var position = $.core.dom.position;
		var setStyle = $.core.dom.setStyle;
		var removeClassName = $.core.dom.removeClassName;
		var addClassName = $.core.dom.addClassName;
		var insertHTML = $.core.dom.insertHTML;
		var getSize = $.core.dom.getSize;
		var fixEvent = $.core.evt.fixEvent;
		
		var langconf = window.$CONFIG && window.$CONFIG.lang || 'zh-cn';
		/*
		var errorMap = {
			"R01409" : "您输入的验证码有错误|您輸入的驗證碼有錯誤",
			"M00001" : "你提交的内容格式不正确|你提交的內容格式不正確",
			"M01201" : "推荐人不存在|推薦人不存在",
			"M01202" : "请不要为他引荐他自己|請不要為他引薦他自己",
			"MR0050" : "请输入验证码|請輸入驗證碼",
			"M09010" : "这些人他都已经关注了哦，请再引荐一些其他有意思的人吧|這些人他都已經關註了哦，請再引薦一些其他有意思的人吧",
			"M00002" : "系统繁忙，请稍候再试|系統繁忙，請稍候再試",
			"M13001" : "根据对方的设置，你不能进行此操作|根據對方的設置，你不能進行此操作",
			"M00006" : "很抱歉，根据相关法规和政策，此微博/评论无法发布。如需帮助请联系@微博客服，或者致电客服电话400 690 0000|很抱歉，根據相關法規和政策，此微博/評論無法發布。如需幫助請聯系@微博客服，或者致電客服電話400 690 0000",
			"M09005" : "他还没有关注你，暂时不能发私人讯息给他|他還沒有關註你，暫時不能發私人訊息給他"
		};
		*/
		/* 自定义污染的对象，传递给contactKit*/
		var custObj = {};
		/* 联系人选择器使用的自定义对象，进行高度的调整  */
		var contactKitCustObj;
		//用户的性别
		var sex;		
		//----------------------------
		var initPlugin = function() {
		};
		var parseDom = function() {
			nodes = parseDOM(builder(node).list);
			sex = nodes.wrapper.getAttribute('action-data');
			custFuncs.addLayerToBody();
			dynamic = dynamicInputWidth(nodes.fakeInput);
			contactkit =  $.common.dialog.contactKit({
				inputCustObj : custObj,
				accordTo : nodes.peopleList,
				pushedMap : pushedMap,
				closeBtn : nodes.toggleContactKit
			});
			contactKitCustObj = contactkit.contactKitCustObj;
		};
		var delegatedEvent = {
			cancelRecommend : function() {
				$.ui.confirm(lang('#L{确认取消引荐？取消后将不再保留引荐信息}'), {
					'OKText':lang('#L{是}'),
					'cancelText':lang('#L{否}'),
					'icon'  : 'error',
					'OK'    : function() {
						//清除无用信息
						nodes.uiderror.style.display = 'none';					
						nodes.reasonerror.style.display = 'none';
						try {
							nodes.recommendReason.focus();
							nodes.recommendReason.value = '';
							nodes.recommendReason.blur();
						}catch(e){}
						var size = $.sizzle("img[action-type='delSuggestItem']" , nodes.peopleList).length;
						if(size >0) {
							var data = [];
							for(var i = 0 ; i < size ; i++) {
								data.push(1);
							}
							$.timedChunk(data , {
								process : function() {
									custFuncs.clickDelete();
								},
								callback : function() {
									$.custEvent.fire(contactKitCustObj , "clearAllData");			
									delegatedEvent.recommendToggle();
								},
								execTime : 100
							});
						} else {
							$.custEvent.fire(contactKitCustObj , "clearAllData");			
							delegatedEvent.recommendToggle();
						}

					}
				});			
			},
			recommendToggle : function() {
				onstatus = !onstatus;
				nodes.recommendContent.style.display = onstatus ? '' : 'none';
				if(onstatus) {
					//需要变成合起引荐
					var text = lang('#L{收起引荐}');
					nodes.onoffa.innerHTML = text;
					nodes.onoffa.title = text;
					nodes.onoffb.className = 'W_Titarr_on';
					nodes.onoffb.title = text;
					if(firstOpen) {
						custFuncs.autoShow();
						firstOpen = 0;
					}
				} else {
					//需要变成展开引荐
					var text = lang('#L{展开引荐}');
					nodes.onoffa.innerHTML = text;
					nodes.onoffa.title = text;
					nodes.onoffb.className = 'W_Titarr_off';
					nodes.onoffb.title = text;					
				}
			},
			focusFakeInput : function() {
				nodes.fakeInput.focus();
				//显示输入提示层
				custFuncs.showInputTip();
			},
			deleteFollowItemClick : function(opts) {
				delegatedEvent.deleteFollowItem(opts);
				//contactKit里面removeClassName current
				$.custEvent.fire(contactKitCustObj , "removeItem" , opts.data.value);			
				return $.preventDefault(opts.evt);
			},
			deleteFollowItem : function(opts , pointer) {
				var value = opts.data.value;
				delete pushedMap[value];
				//删除那个a
				var item = opts.el.parentNode;
				item.style.display = 'none';
				if(pointer === true) {
					item.parentNode.removeChild(item);	
				} else {
					setTimeout(function() {
						item.parentNode.removeChild(item);
					} , 0);
				}
				//重新设置tip的位置
				custFuncs.resetTipPos();
				custFuncs.reSetPlaceHolder();
				//重新设置contactKit的位置
				$.custEvent.fire(contactKitCustObj , "resetPosition" , {});
			},
			toggleContactKit : function(opts) {
				var willHide = (opts.el.arrow == 'arrowdown');
				if(willHide) {
					opts.el.arrow = '';
					contactkit.hide();
					$.custEvent.fire(contactKitCustObj , "clearAllData");			
				} else {
					opts.el.arrow = 'arrowdown';
					contactkit.show();
				}
			},
			recommendFollow : function() {
				var count = 0 , passReason;
				for(var key in pushedMap) {
					count ++;					
				}
				if(!count) {
					nodes.uidtext.innerHTML = lang('#L{请至少选择一个要引荐的人}');
					nodes.uiderror.style.display = '';								
				} else if(count > 100){
					nodes.uidtext.innerHTML = lang('#L{每次最多引荐100人哦，不如分多次引荐吧}');
					nodes.uiderror.style.display = '';								
				} else {
					nodes.uiderror.style.display = 'none';					
				}
				var reason = $.trim(nodes.recommendReason.value);
				if(!reason || reason == (lang("#L{告诉}") + sex + lang("#L{你为}") + sex + lang("#L{引荐这些人的理由(最多140字)}"))){
					nodes.reasontext.innerHTML = lang('#L{请填写一下引荐理由呦}');
					nodes.reasonerror.style.display = '';
					passReason = false;				
				} else {
					nodes.reasonerror.style.display = 'none';
					passReason = true;
				}
				if(count &&  count <= 100 && passReason) {
					var data = {};
					data.recuid = custFuncs.getUids();
					data.reason = nodes.recommendReason.value;
					data.nick = opts && opts.nick || "";
					if(lock) {
						return;	
					}
					lock =1;
					recommendTrans.request(data);
				}
			}
		};
		var bindDOM = function() {
			dEvent = delegate(node);
			//展开合起操作
			dEvent.add('on-off','click',delegatedEvent.recommendToggle);
			//输入框提示
			inputTipTool = $.common.content.inputTip(nodes.recommendReason, {
				text: lang("#L{告诉}") + sex + lang("#L{你为}") + sex + lang("#L{引荐这些人的理由(最多140字)}"),
				className: 'W_input_default'
			});
			//假输入框点击时focus输入框
			dEvent.add('peopleList' , 'click' , delegatedEvent.focusFakeInput);
			//点击时显示联系人选择器
			dEvent.add('contactkit' , 'click' , delegatedEvent.toggleContactKit);
			//人名输入框blur时隐藏提示
			$.addEvent(nodes.fakeInput , 'blur' , custFuncs.hideInputTip);
			//按键处理
			$.addEvent(nodes.fakeInput , 'keydown' , custFuncs.keyHandler);
			$.addEvent(nodes.recommendReason , "focus" , custFuncs.reasonFocus);
			$.addEvent(nodes.hoverTip , "mouseover" , custFuncs.showHoverTip);
			$.addEvent(nodes.hoverTip , "mouseout" , custFuncs.hideHoverTip);
			//dynamic处理
			$.custEvent.add(dynamic.custObj , "textChange" , custFuncs.textChange);
			//suggest处理
			suggestTool = $.module.suggest({
				'textNode' : nodes.fakeInput,
				'uiNode'   : nodes.suggestList,
				'actionType': 'followItem',
				'actionData': 'index'			
			});
			//选中每一项的处理
			$.custEvent.add(suggestTool, 'onIndexChange', custFuncs.setSuggestIndex);
			$.custEvent.add(suggestTool , 'onSelect' , custFuncs.clickSelectSuggest);
			$.custEvent.add(suggestTool , 'onClose' , custFuncs.escapeSuggest);
			//处理点击叉子删除
			dEvent.add('delSuggestItem' , 'click' , delegatedEvent.deleteFollowItemClick);
			//点击发送引荐时候的操作
			dEvent.add('recommendFollow' , 'click' , delegatedEvent.recommendFollow);
			//点击取消隐藏引荐层
			dEvent.add('cancelRecommend' , 'click' , delegatedEvent.cancelRecommend);
			//文字不能超过140个字的处理
			custFuncs.addInputLimit(nodes.recommendReason , 280);
		};
		var custFuncs = {
			hoverTimer : null,
			showHoverTip : function(e) {
				clearTimeout(custFuncs.hoverTimer);
				custFuncs.hoverTimer = setTimeout(custFuncs.showHoverTipImpl , 200);
			},
			showHoverTipImpl : function() {
				if($.getStyle(nodes.uiderror , 'display') != 'none') {
					return;	
				}
				if(!nodes.tipLayer) {
					var html =  '<div class="layer_tips" style="position:absolute;display:none;">' + 
						 			'#L{可以为}' + sex + '#L{引荐你关注的、}' + sex + '#L{有可能感兴趣的人，每次最多引荐100人哦。}' + 
						 			'<span class="arrow_down"></span>' + 
								'</div>';
					nodes.tipLayer = $.insertHTML(document.body , lang(html));
				}
				var tipSize = getSize(nodes.tipLayer);
				var pos = $.position(nodes.hoverTip);
				pos.t -= tipSize.height;
				$.setStyle(nodes.tipLayer, 'left' , pos.l + 'px');
				$.setStyle(nodes.tipLayer , 'top' , (pos.t - 5) + 'px');
				$.setStyle(nodes.tipLayer , 'display' , '');	
			},
			hideHoverTip : function() {
				clearTimeout(custFuncs.hoverTimer);
				nodes.tipLayer && $.setStyle(nodes.tipLayer , 'display' , 'none');	
			},
			getErrorMsg : function() {
				return lang("#L{啊哦，引荐没有发送成功，请稍候再试吧}");
				/*
				if(errorMap[code]) {
					var str = errorMap[code];
					if(langconf === 'zh-tw') {
							return str.split('|')[1];
					} else {
							return str.split('|')[0];
					}
				} else {
					return lang("#L{发送引荐失败}");	
				}
				*/
			},
			reasonFocus : function() {
				nodes.reasonerror.style.display = 'none';
			},
			autoShow : function() {
				delegatedEvent.toggleContactKit({
					el : nodes.toggleContactKit
				});
			},
			addInputLimit : function(node, nLength) {
				var nValue;
				keyup = function(){
					nValue = node.value;
					var strLen = $.core.str.bLength(nValue);
					if (strLen > nLength) {
						node.value = $.core.str.leftB(nValue, nLength);
					}
				};
				$.addEvent(node, "keyup", keyup);
				$.addEvent(node, "blur", keyup);
				$.addEvent(node, "input", keyup);
				removeInputLimit = function() {
					$.removeEvent(node, "keyup", keyup);
					$.removeEvent(node, "blur", keyup);
					$.removeEvent(node, "input", keyup);					
				};
			} ,
			addLayerToBody : function() {
				var html = '<div style="position:absolute;display:none;z-index:10000;" class="layer_menu_list" node-type="suggestList"><ul node-type="suggestContent"></ul></div>';
				insertHTML(document.body , html);
				nodes.suggestList = $.sizzle('>div[node-type="suggestList"]' , document.body)[0];
				nodes.suggestContent = nodes.suggestList.childNodes[0]; 
			} , 
			clickDelete : function() {
				var items = $.sizzle("img[action-type='delSuggestItem']:last" , nodes.peopleList);
				if(items.length) {
					var link = items[0];
					var value = link.getAttribute('action-data').replace('value=' , '');
					var dataObj = {
						el : link,
						data : {
							value : value
						}					
					};
					delegatedEvent.deleteFollowItem(dataObj , true);
					$.custEvent.fire(contactKitCustObj , "removeItem" , value);
				}	
			},
			keyHandler : function(evt) {
				evt = evt || window.event;
				var keyCode = evt.keyCode || evt.which;
				if(keyCode == 8 && nodes.fakeInput.value == '') {
					custFuncs.clickDelete();
				}
			},
			showInputTip : function() {
				nodes.uiderror.style.display = 'none';
				nodes.focusTip.style.display = '';
			},
			hideInputTip : function() {
				setTimeout(function() {
					nodes.fakeInput.value = '';
					custFuncs.hideFocusTip();
					custFuncs.hideSuggest();						
				}, 200);
			},
			escapeSuggest : function() {
				custFuncs.hideSuggest();				
			},
			textChange : function(evt , data) {
				if(!data) {
					custFuncs.hideSuggest();					
				} else {
					trans.request({q : data});					
				}
			},
			showSuggest : function(data) {
				var html = template(suggestHtml , data);
				nodes.suggestContent.innerHTML = html;
				custFuncs.setSuggestPos(nodes.suggestList);
				custFuncs.hideFocusTip();
				if(data && data.length > 0) {
					nodes.suggestList.style.display = '';	
				 } else {
					nodes.suggestList.style.display = 'none';	 
				}
				//$.custEvent.fire(suggestTool, 'indexChange', 0);
				$.custEvent.fire(suggestTool , 'open' , nodes.fakeInput);
			},
			hideFocusTip : function() {
				nodes.focusTip.style.display = 'none';				
			} ,
			showFocusTip : function() {
				nodes.uiderror.style.display = 'none';
				nodes.focusTip.style.display = '';				
			},
			setSuggestPos : function(dom) {
				var left , top;
				var inputPos = position(nodes.fakeInput);
				left = inputPos.l;
				top = inputPos.t + 20; 
				setStyle(dom , 'left' , left + 'px');
				setStyle(dom , 'top' , top + 'px');
			},
			selectSuggest : function(index) {
				var cur = $.sizzle('li.cur' , nodes.suggestContent);
				if(cur.length) {
					removeClassName(cur[0] , 'cur');					
				}
				var current = $.sizzle('li:eq(' + index + ')' , nodes.suggestContent)[0];
				addClassName(current , 'cur');
				suggestIndex = index;
			},
			setSuggestIndex : function(type, index) {
				custFuncs.selectSuggest(index);
			},
			clickSelectSuggest : function(type , index) {
				var item = $.sizzle("li:eq(" + index + ")" , nodes.suggestList)[0];
				var value = item.getAttribute('action-data');
				var text = $.sizzle('a' , item)[0].innerHTML;
				if(!pushedMap[value]) {
					pushedMap[value] = 1;
					//添加一条进div
					var html = template(lang(suggestItem) , {
						imgPath : imgPath , 
						value : value ,
						text : text
					});
					insertHTML(nodes.fakeInput , html , "beforebegin");
					//重新设置placeHolder宽度
					custFuncs.reSetPlaceHolder();
					//重新设置focusTip位置
					custFuncs.resetTipPos();
					//通过contactKit自定义事件设置current状态
					$.custEvent.fire(contactKitCustObj , "addItem" , value);
				}
				nodes.fakeInput.value = '';
				nodes.fakeInput.focus(); 
				custFuncs.hideSuggest();
				//显示focusTip
				custFuncs.showFocusTip();
			},
			reSetPlaceHolder : function() {
				var items = $.sizzle("a[node-type='addedItem']" , nodes.peopleList);
				if(items.length) {
					var itemPos = position(nodes.fakeInput);
					var holderPos = position(nodes.placeHolder);
					var top = itemPos.t - holderPos.t + 18;
					var holderHeight = getSize(nodes.peopleList).height;
					if(holderHeight != top) {
						setStyle(nodes.peopleList , 'height' , top + 'px');						
					}
				} else {
					setStyle(nodes.peopleList , 'height' , '22px');					
				}
				
			},
			resetTipPos : function() {
				custFuncs.setFocusTipPos();
			},
			setFocusTipPos : function() {
				var pos = position(nodes.placeHolder);
				var inputPos = position(nodes.fakeInput);
				var left = inputPos.l - pos.l;
				var top = inputPos.t - pos.t + 20;
				setStyle(nodes.focusTip , 'left' , left + 'px');
				setStyle(nodes.focusTip , 'top' , top + 'px');
			},
			hideSuggest : function() {
				nodes.suggestList.style.display = 'none';				
			},
			followListSucc : function(data) {
				custFuncs.showSuggest(data.data);				
			},
			followListError: function() {
				custFuncs.hideSuggest();
			},
			custFunAddItem : function(evt , data) {
				//添加一条进div
				var html = template(lang(suggestItem) , {
					imgPath : imgPath , 
					value : data.uid ,
					text : data.name
				});
				insertHTML(nodes.fakeInput , html , "beforebegin");
				//重新设置focusTip位置
				custFuncs.resetTipPos();
				//重新设置placeHolder宽度
				custFuncs.reSetPlaceHolder();
				$.custEvent.fire(contactKitCustObj , "resetPosition" , {});
				//为pushedMap添加映射为1
				pushedMap[data.uid] = 1;
			} ,
			custFunRemoveItem : function(evt,dataObj) {
				var el = $.sizzle("img[action-data='value=" + dataObj.uid + "']" , nodes.peopleList)[0];
				var bigObj = {
					data : {
						value : dataObj.uid
					},
					el : el
				};
				delegatedEvent.deleteFollowItem(bigObj);
				//删除pushedMap中的映射
				delete pushedMap[dataObj.uid];
			},
			hideContactKit : function() {
				nodes.toggleContactKit.arrow = '';
			},
			recommendSuccess : function(ret,data) {
				
			},
			recommendError : function(ret,data) {
				lock =0;
				var msg;
				if(ret.code == 'A00006') {
					msg = lang("#L{发送引荐成功}");
					$.ui.litePrompt(msg ,{'type':'succM','timeout':'500' , hideCallback : function() {
							node.style.display = 'none';
					}});					
				} else {
					msg = custFuncs.getErrorMsg();
					$.ui.alert(msg);	
					//nodes.uidtext.innerHTML = msg;
					//nodes.uiderror.style.display = '';								
				}
			},
			getUids : function() {
				var arr = [];
				for(var key in pushedMap) {
					arr.push(key);
				}
				return arr.join(',');
			}
		};
		var bindTrans = function() {
			trans = $.common.trans.global.getTrans("followList" , {
				onSuccess : custFuncs.followListSucc,
				onError : custFuncs.followListError,
				onFail : custFuncs.followListError,
				onTimeout : custFuncs.followListError
			});
			recommendTrans = $.common.trans.group.getTrans("recommendfollow" , {
				onSuccess : custFuncs.recommendSuccess,
				onError : custFuncs.recommendError,
				onFail : custFuncs.recommendError,
				onTimeout : custFuncs.recommendError
			});
		};
		var bindCustEvent = function() {
			$.custEvent.define(custObj , "addItem");
			$.custEvent.define(custObj , "removeItem");
			$.custEvent.define(custObj , "hide");
			$.custEvent.add(custObj , "addItem" , custFuncs.custFunAddItem);
			$.custEvent.add(custObj , "removeItem" , custFuncs.custFunRemoveItem);
			$.custEvent.add(custObj , "hide" , custFuncs.hideContactKit);
		};
		var init = function() {
			initPlugin();
			parseDom();
			bindTrans();
			bindDOM();
			bindCustEvent();
		};
		var destroy = function() {
			inputTipTool && inputTipTool.destroy && inputTipTool.destroy();
			$.custEvent.undefine(custObj);
			if(nodes) {
				nodes.fakeInput && $.removeEvent(nodes.fakeInput , 'blur' , custFuncs.hideInputTip);
				nodes.fakeInput && $.removeEvent(nodes.fakeInput , 'keydown' , custFuncs.keyHandler);
				nodes.recommendReason && $.removeEvent(nodes.recommendReason, "keyup", keyup);
				nodes.recommendReason && $.removeEvent(nodes.recommendReason, "blur", keyup);
				nodes.recommendReason && $.removeEvent(nodes.recommendReason, "input", keyup);
				nodes.recommendReason && $.removeEvent(nodes.recommendReason , "focus" , custFuncs.reasonFocus);
				nodes.hoverTip && $.removeEvent(nodes.hoverTip , "mouseover" , custFuncs.showHoverTip);
				nodes.hoverTip && $.removeEvent(nodes.hoverTip , "mouseout" , custFuncs.hideHoverTip);
			}
			removeInputLimit && removeInputLimit();
			dEvent && dEvent.destroy && dEvent.destroy();
			contactkit && contactkit.destroy && contactkit.destroy();
		};
		init();
		that.destroy = destroy;
		return that;
	};
});
