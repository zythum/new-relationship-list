/**
 * 首页引导发话题弹层(真正的实现)
 * 
 * @id comp.content.hotTopicGuide
 * @author Lian yi | lianyi@staff.sina.com.cn
 * 
 */
$Import('common.trans.guide');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('ui.dialog');
$Import('kit.extra.textareaUtils');

STK.register("guide.hotTopicGuide", function($) {
	
	return function() {
		var that = {}, dEvt , html , $L = $.kit.extra.language , clickTopic;
		
		var nodes , dialog;
		var trans = $.common.trans.guide.getTrans('noTopicGuideTip' , {
				onSuccess : $.funcEmpty,
				onError : $.funcEmpty
			});
		var bindDOMFuns = {
			showMore : function(obj) {
				setTimeout(function() {
				    obj.el.removeAttribute("suda-data");
				} , 500);
				nodes.detail.style.display = '';
				return $.preventDefault(obj.evt);
			},
			insertTopic : function(obj) {
				var publish_top = $.E('pl_content_publisherTop');
				var textarea = $.sizzle('textarea' , publish_top);
				if(textarea.length) {
					textarea = textarea[0];
					var value = $.trim(textarea.value);
					if(value.indexOf(obj.data.text) == -1) {
						var rightText = value.length ? value + ' ' + obj.data.text : obj.data.text;
						textarea.value = rightText;
					}
					$.kit.extra.textareaUtils.setCursor(textarea , textarea.value.length , 0);
					textarea.setAttribute('range' , textarea.value.length + '&0');
				}
				clickTopic = obj.data.text;
				dialog.hide();
				trans.request({
					time : "86400"
				});
				return $.preventDefault(obj.evt);
			},
			close : function(obj) {
				//dialog.hide();
				var tmpId = $.getUniqueKey();
				//显示确认层
				var conDom = $.ui.confirm($L('#L{您确认今日不再接收热门话题提示？}') , {
				        title : $L('#L{确认不再提醒}'),
						icon : "question",
				        'textSmall' :"<input type='checkbox' node-type='noMoreMention' id='div_" + tmpId + "'/> " + "<label for='div_" + tmpId + "'>" + $L("#L{7天内不再提醒}") + "</label>",
				        OK : function() {
							var checkbox = $.sizzle("[node-type='noMoreMention']" , conDom.cfm.getOuter())[0];
							var checked = checkbox && checkbox.checked;
							
							if(checked) {
								trans.request({
									time : "604800"									
								});								
							} else {
								trans.request({
									time : "86400"									
								});								
							}
							dialog.hide();
						}
				});
				var checkbox = $.sizzle("[node-type='noMoreMention']" , conDom.cfm.getOuter())[0];
				var oK = $.sizzle("[node-type='OK']" , conDom.cfm.getOuter())[0];
				oK.setAttribute("suda-data" , "key=tblog_publish_guide&value=remind");
				var cancel = $.sizzle("[node-type='cancel']" , conDom.cfm.getOuter())[0];
				cancel.setAttribute("suda-data" , "key=tblog_publish_guide&value=cancel_guide");
				$.addEvent(checkbox , 'click' , function() {
					var state = checkbox.checked;
					if(state) {
						oK.setAttribute("suda-data" , "key=tblog_publish_guide&value=no_remind");
					} else {
						oK.setAttribute("suda-data" , "key=tblog_publish_guide&value=remind");
					}
				});
				return $.preventDefault(obj.evt);				
			}
		};
				
		var init = function() {
			parseDOM();
			setTimeout(bindDOM , 0);
			bindCustEvt();
		};
		
		//-------------------------------------------
						
		var parseDOM = function() {
			dialog = $.ui.dialog({isHold : true});
			dialog.setTitle($L("#L{看看大家都在聊什么？}"));
			dialog.setContent(html);
			dialog.show();
			dialog.setMiddle();
			nodes = $.kit.dom.parseDOM($.builder(dialog.getOuter()).list);
			window.SUDA && window.SUDA.uaTrack && window.SUDA.uaTrack('tblog_publish_guide', 'open_guide');
		};
		
		var publishSuccess = function(evt , data) {
			if(data.params.text.indexOf(clickTopic) != -1) {
				window.SUDA && window.SUDA.uaTrack && window.SUDA.uaTrack('tblog_publish_guide', 'publish');
				$.custEvent.remove(window.$CONFIG || {} , "publish" , publishSuccess);
			}
		};		

		var bindCustEvt = function() {
			$.custEvent.define(window.$CONFIG || {} , 'publish');	
			$.custEvent.add(window.$CONFIG || {} , 'publish' , publishSuccess);	
		};
		
		var bindDOM = function() {
			dEvt = $.core.evt.delegatedEvent(dialog.getOuter());
			dEvt.add("topicMore" , "click" , bindDOMFuns.showMore);
			dEvt.add("insertTopic" , "click" , bindDOMFuns.insertTopic);
			dEvt.add("close" , "click" , bindDOMFuns.close);
		};
		
		var destroy = function() {
			dEvt && dEvt.destroy && dEvt.destroy();
		};
		
		var getHtml = function() {
			var trans = $.common.trans.guide.getTrans('topicGuide' , {
				onSuccess : function(ret) {
					html = ret.data.html;
					init();					
				}
			});
			trans.request();
		};
		
		getHtml();
		
		that.destroy = destroy;
		
		return that;
		
	};
});
