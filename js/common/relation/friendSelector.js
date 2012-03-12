/**
 * 关注人选择器
 * ChengJian | chengjian2@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('kit.extra.dynamicInputWidth');
$Import('common.dialog.contactKit');
$Import('common.bubble.myFollowSuggest');
STK.register('common.relation.friendSelector', function($){
	return function(node){
		var that	= {},nodes, contactkit, dEvent, dynamic, contactkit, sugg, contactKitCustObj;
		var custObj = {};
		var pushedMap = {};
		var suggestItem = '<#et suggestItem data><span class="W_btn_deltags" href="javascript:void(0)" node-type="addedItem">${data.text}<img class="delicon" src="${data.imgPath}style/images/common/transparent.gif" action-type="delSuggestItem" action-data="value=${data.value}"/></span> </#et>';
		var imgPath = $CONFIG['imgPath'] || "http://img.t.sinajs.cn/t4/";
		var delegatedEvent = {
			focusFakeInput : function() {
				nodes.fakeInput.focus();
				custFuncs.showInputTip();
			},
			deleteFollowItemClick : function(opts) {
				delegatedEvent.deleteFollowItem(opts);
				$.custEvent.fire(contactKitCustObj , "removeItem" , opts.data.value);			
				return $.preventDefault(opts.evt);
			},
			deleteFollowItem : function(opts , pointer) {
				var value = opts.data.value;
				delete pushedMap[value];
				var item = opts.el.parentNode;
				item.style.display = 'none';
				if(pointer === true) {
					item.parentNode.removeChild(item);	
				} else {
					setTimeout(function() {
						item.parentNode.removeChild(item);
					} , 0);
				}
				custFuncs.resetTipPos();
				$.custEvent.fire(contactKitCustObj , "resetPosition" , {});
			},
			toggleContactKit : function(opts) {
				var willHide = (opts.el.arrow == 'arrowdown');
				if(willHide) {
					opts.el.arrow = '';
					contactkit.hide();
					$.custEvent.fire(contactKitCustObj , "clearAllData");
					$.core.dom.removeClassName(opts.el,"on");			
				} else {
					opts.el.arrow = 'arrowdown';
					contactkit.show();
					$.core.dom.addClassName(opts.el,"on");
				}
			}
		};
		
		var custFuncs = {
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
				if(nodes.fakeInput.value == '') {
					if (keyCode == 8) {
						custFuncs.clickDelete();
					}else{
						custFuncs.hideFocusTip();
					}
				}
			},
			showInputTip : function() {
				nodes.focusTip.style.display = '';
			},
			hideInputTip : function() {
					nodes.fakeInput.value = '';
					custFuncs.hideFocusTip();
			},
			hideFocusTip : function() {
				if(nodes.focusTip.style.display !== 'none'){
					nodes.focusTip.style.display = 'none';	
				}			
			} ,
			showFocusTip : function() {
				nodes.focusTip.style.display = '';				
			},
			clickSelectSuggest : function(item) {
				var value = item.uid;
				var text = item.screen_name;
				if(!pushedMap[value]) {
					pushedMap[value] = 1;
					var html = $.core.util.easyTemplate(suggestItem , {
						imgPath : imgPath , 
						value : value ,
						text : text
					});
					$.insertHTML(nodes.fakeInput , html , "beforebegin");
					custFuncs.resetTipPos();
					$.custEvent.fire(contactKitCustObj , "addItem" , value);
				}
				
				nodes.fakeInput.value = '';
				nodes.fakeInput.focus(); 
				custFuncs.showFocusTip();
			},
			resetTipPos : function() {
				custFuncs.setFocusTipPos();
			},
			setFocusTipPos : function() {
				var pos = $.position(nodes.placeHolder);
				var inputPos = $.position(nodes.fakeInput);
				var left = inputPos.l - pos.l;
				var top = inputPos.t - pos.t + 20;
				$.setStyle(nodes.focusTip , 'left' , left + 'px');
				$.setStyle(nodes.focusTip , 'top' , top + 'px');
			},
			custFunAddItem : function(evt , data) {
				var html = $.core.util.easyTemplate(suggestItem , {
					imgPath : imgPath , 
					value : data.uid ,
					text : data.name
				});
				$.insertHTML(nodes.fakeInput , html , "beforebegin");
				custFuncs.resetTipPos();
				$.custEvent.fire(contactKitCustObj , "resetPosition" , {});
				pushedMap[data.uid] = 1;
				nodes.fakeInput.focus();
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
				delete pushedMap[dataObj.uid];
			},
			hideContactKit : function() {
				nodes.toggleContactKit.arrow = '';
				$.core.dom.removeClassName(nodes.toggleContactKit,"on");
			},
			getUids : function() {
				var arr = [];
				for(var key in pushedMap) {
					arr.push(key);
				}
				return arr.join(',');
			}
		};
		var bindDOM = function() {
			dEvent = $.core.evt.delegatedEvent(node);
			dEvent.add('peopleList' , 'click' , delegatedEvent.focusFakeInput);
			dEvent.add('contactkit' , 'click' , delegatedEvent.toggleContactKit);
			dEvent.add('delSuggestItem' , 'click' , delegatedEvent.deleteFollowItemClick);
			$.addEvent(nodes.fakeInput , 'blur' , custFuncs.hideInputTip);
			$.addEvent(nodes.fakeInput , 'keydown' , custFuncs.keyHandler);
			sugg = $.common.bubble.myFollowSuggest({
						'transName':"myFollowList",
						'type':0,
						'textNode' : nodes.fakeInput,
						'width':137,
						'callback' : function (item){
							custFuncs.clickSelectSuggest(item);
						}
			});
			sugg.show();
		};
		var bindCustEvent = function() {
			$.custEvent.define(custObj , "addItem");
			$.custEvent.define(custObj , "removeItem");
			$.custEvent.define(custObj , "hide");
			$.custEvent.add(custObj , "addItem" , custFuncs.custFunAddItem);
			$.custEvent.add(custObj , "removeItem" , custFuncs.custFunRemoveItem);
			$.custEvent.add(custObj , "hide" , custFuncs.hideContactKit);
		};
		
		var bindTrans = function() {
		};
		var bindListener = function(){};
		var init = function(){
			argsCheck();
			parseDOM();
			bindTrans();
			bindDOM();
			bindListener();
			bindCustEvent();
		};
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.common.relation.friendSelector]:node is not a Node!";
			}
		};
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
			dynamic = $.kit.extra.dynamicInputWidth(nodes.fakeInput);
			contactkit =  $.common.dialog.contactKit({
				inputCustObj : custObj,
				accordTo : nodes.peopleList,
				pushedMap : pushedMap,
				closeBtn : nodes.toggleContactKit
			});
			contactKitCustObj = contactkit.contactKitCustObj;
			var list = $.sizzle('ul[node-type="userListBox"]>li');
			if(list && !list.length){
				nodes.toggleContactKit.arrow = 'arrowdown';
				contactkit.show();
				$.core.dom.addClassName(nodes.toggleContactKit,"on");
			}
		};
		var destroy = function(){
			$.custEvent.undefine(custObj);
			nodes.fakeInput && $.removeEvent(nodes.fakeInput , 'blur' , custFuncs.hideInputTip);
			nodes.fakeInput && $.removeEvent(nodes.fakeInput , 'keydown' , custFuncs.keyHandler);
			sugg.hide();
			sugg.destroy();
			dEvent && dEvent.destroy && dEvent.destroy();
			contactkit && contactkit.destroy && contactkit.destroy();
			dynamic && dynamic.destroy && dynamic.destroy();
			dEvent = custObj = contactkit = sugg = nodes = null;
		};
		init();
		that.destroy = destroy;
		that.getUids = custFuncs.getUids;
		return that;

	};
});