/**
 * 关注人选择器
 * @author lianyi | lianyi@staff.sina.com.cn
 */
$Import('common.trans.group');
$Import('common.content.inputTip');
$Import('kit.extra.language');
$Import("kit.extra.codec");
STK.register("common.dialog.contactKit", function($){

	//---短名定义区---------------------------------- 
	
	//---模板---------------------------------- 
	return function(opts) {
		/*
		 * '<div class="layer_menu_list" style="position: absolute; left: 50px; top: 50px;">' + 
														    '<ul>' + 
														        '<li><a href="javascript:void(0)" onclick="return false;">chibin58</a></li>' + 
														        '<li><a href="javascript:void(0)" onclick="return false;">王小莹-patricia</a></li>' + 
														    '</ul>' + 
													'</div>' +
		 * */
		/*
		 *  accordTo 是根据谁来定位的，默认选择器需要插入到body里，所以需要定位
		 *  inited用来标志初始化状态，不是默认就初始化，使用的时候再进行初始化
		 *  nodes用来存放js操作的节点
		 *  contactKitNode是整个关注人选择器的最外层节点
		 *  dEvent是代理事件污染的对象
		 *  dataPrepared用来标志是否已经获取过数据了
		 *  getGroupsTrans : 获取所有分组
		 *  listByGroupTrans ： 获取单个分组中的所有人
		 *  groupData : 我的分组信息
		 *  infoData : 个人资料分组信息
		 *  pushedMap : 使用这个map进行查看，显示current状态
		 *  inputCustObj : 是recommendFollow使用的自定义对象，调用fire
		 *  
		 *  cacheMap = {};是缓存每个分组里面的人
		 *  currentGid  当前处于的分组的gid
		 *  contactIsShow 当前关注人选择器是否处在显示状态
		 *  closeBtn 关闭按钮(用来body上的click判断)
		 *  scrollTimer 用来控制联系人列表的scroll的timer
		 *  staticScrollHeight 默认用于scroll的ul的高度
		 *  lastSelectItem是从来记住下拉中选中的那一个
		 */
		var lang = $.kit.extra.language;
		var that = {} , inited , nodes , accordTo ,contactKitNode , dEvent , custEvent = {} , dataPrepared , getGroupsTrans , listByGroupTrans , groupData , infoData , pushedMap , inputCustObj , contactIsShow = false , closeBtn , lastSelectItem;
		
		var leftB = $.core.str.leftB;
		
		var encodeDecode = $.kit.extra.codec;
		
		var cacheMap = {} , currentGid = 0 , scrollTimer , staticScrollHeight , noMorePage = {};
		
		var inputTipTool;
		
		var getSize = $.core.dom.getSize;
	
		var imgPath = window.$CONFIG && window.$CONFIG.cssPath || "http://img.t.sinajs.cn/t4/";
		
		var labelUniqueId = $.getUniqueKey();

		var html = '<div class="W_layer" style="top:0px;left:0px;display:none;" node-type="contactKitNode">' + 
						'<div class="bg">' + 
							'<table border="0" cellspacing="0" cellpadding="0">' + 
									'<tr>' + 
										'<td>' + 
											'<div class="content" node-type="dialogContent">' + 
												'<div class="title">#L{从我关注的人中选择}</div>' + 
												'<a href="javascript:void(0)" class="W_close" action-type="close_dialog"></a>' + 
												'<div class="layer_attention_choose">' + 
													'<div class="tab_c W_textb">' + 
														'<p>' + 
															'<span class="search"><input type="text" value="#L{输入昵称或备注}" class="input" node-type="searchInput"><a class="btn" href="javascript:void(0)" action-type="search"></a></span>' + 
														    '<a href="javascript:void(0)" action-type="getAllContact" node-type="getAllContact" class="current">#L{全部}</a>' + 
														    '<em class="W_vline">|</em>' + 
														    '<a href="javascript:;" class="W_moredown" node-type="groupHover">#L{按分组筛选}<em class="more"></em></a>' + 
														    '<em class="W_vline">|</em>' + 
														    '<a href="javascript:void(0)" class="W_moredown" node-type="infoHover">#L{按资料筛选}<em class="more"></em></a>' + 
														    '<em class="W_vline">|</em>' + 
														    '<a class="W_texta" href="javascript:void(0)">#L{已选}(<em node-type="chooseCount">0</em>/<em node-type="totalCount">0</em>)</a>' +
														'</p>' +
													'</div>' + 
													'<div class="person_list">' + 
														'<ul class="list" node-type="contactContent">' + 
														'</ul>' + 
														'<div class="func"><label for="' + labelUniqueId + '"><input type="checkbox" class="W_checkbox" action-type="selectAll" node-type="selectAll" id="' + labelUniqueId + '"/>#L{全选}</label></div>' + 
													'</div>' + 
													'<div class="btn"><a class="W_btn_b" href="javascript:void(0)" action-type="close_dialog"><span>#L{确认}</span></a></div>' +
													'<div class="layer_menu_list" style="position: absolute;display:none;z-index:10000;" node-type="groupHoverLayer">' + 
														    '<ul node-type="layerContent"><li><a href="javascript:void(0)">#L{正在加载，请稍候...}</a></li></ul>' + 
													'</div>' +
													'<div class="layer_menu_list" style="position: absolute; display:none;z-index:10000;" node-type="infoHoverLayer">' + 
														    '<ul node-type="infoLayerContent"><li><a href="javascript:void(0)">#L{正在加载，请稍候...}</a></li></ul>' + 
													'</div>' +
												'</div>' + 
											'</div>' + 
										'</td>' + 
									'</tr>' + 
							'</table>' + 
						'</div>' + 
					'</div>';
		var LISTTPL = '<#et list data>' +
		                  '<#if (data.length)>' +
						   		'<#list data as list>' +
									 '<li <#if (list.isChoose)> class="current" </#if> action-type="addRemoveItem" action-data="uid=${list.uid}&name=${list.name}" uid="${list.uid}"><img width="50" height="50" alt="" src="${list.img}" class="face" /><p class="info"><span>${list.name_s}<#if (list.type_p=="orange")><a href="javascript:void(0)"><img class="approve" alt="#L{认证用户}" title="#L{认证用户}" src="' + imgPath + 'style/images/common/transparent.gif" /></a></#if><#if (list.type_p=="blue")><a href="javascript:void(0)"><img class="approve_co" alt="#L{认证用户}" title="#L{认证用户}" src="' + imgPath + 'style/images/common/transparent.gif" /></a></#if><#if (list.type_p=="daren")><a href="javascript:void(0)"><img class="ico_club" alt="#L{微博达人}" title="#L{微博达人}" src="' + imgPath + 'style/images/common/transparent.gif" /></a></#if></span><span></span><span class="W_textb region">${list.location}</span></p><span class="icon_succ"></span></li>' +
								'</#list>' + 
								'<#if (data.length<=6 && data.rendGroupAll)>'+
									'<li class="personList_tips W_tips clearfix">' + 
									'<div class="tipscon tips_warn">' + 
									'<div class="icon"><img class="icon_error" alt="" src="' + imgPath + 'style/images/common/transparent.gif"></div>' + 
									'<p class="txt">#L{微博的乐趣，在于关注一批有趣的人，}<a href="/f/find">#L{快来找找更多有趣的人吧。}</a></p>' + 
									'</div>' + 
									'</li>' + 
								'</#if>' + 
						   '<#else>' +
						   		 '<#if (data.rendGroupAll)>' + 
								 	'<li class="no_person">#L{还没找到要关注的人？}<a href="/f/find">#L{快去找找朋友吧}</a></li>' + 		
								 '<#elseif (data.noDataType=="common")>' + 
								 	'<li class="no_person">#L{该分组没有关注人。想和朋友分享新鲜事}？<a href="/f/find">#L{邀请他们加入吧}</a></li>' + 		
								 '<#else>' + 
								 	'<li class="no_person">#L{抱歉没有找到昵称或备注含}“${data.q}”#L{的人，试试搜索其他词吧}</li>' + 
								 '</#if>' + 
						   '</#if>' + 
					 '</#et>';
		var LAYERITEMTPL = '<#et layergroup data><#if (data.length)><#list data as list><li action-type="showGroup" action-data="type=${data.type}&gid=${list.gid}&gname=${list.gname}"><a href="javascript:void(0)" onclick="return false;">${list.shortWord}</a></li></#list><#else><li><a href="javascript:void(0)">#L{没有可以筛选的资料哟}</a></li></#if></#et>'; 
		
		//---变量定义区----------------------------------

		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			
		};
		
		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {
			
		};
		
		//---组件的初始化方法定义区-------------------------
		var init = function() {
			argsCheck();
			parseDOM();
			bindTrans();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		var argsCheck = function() {
			if(!$.isNode(opts.accordTo)) {
				throw 'accordTo must be a node , please check!';				
			}
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		var parseDOM = function() {
			accordTo = opts.accordTo;
			pushedMap = opts.pushedMap;
			inputCustObj = opts.inputCustObj;
			closeBtn = opts.closeBtn;
			$.core.dom.insertHTML(document.body , lang(html));
			contactKitNode = $.sizzle('>div[node-type="contactKitNode"]' , document.body)[0];
			nodes = $.kit.dom.parseDOM($.builder(contactKitNode).list);
		};
		//-------------------------------------------
		
		var bindTrans = function() {
			getGroupsTrans = $.common.trans.group.getTrans('infolist' , {
				onSuccess : ioFuns.getGroupsSuccess,
				onError : ioFuns.getGroupsError				
			});
		    listByGroupTrans = $.common.trans.group.getTrans('listbygroup' , {
				onSuccess :ioFuns.listByGroupSuccess,
				onError : ioFuns.listByGroupError
			});
			
		};
		var ioFuns = {
			getGroupsSuccess : function(ret , params) {
				groupData = ret.data.group || [];
				custFuncs.delegateGroup();
				custFuncs.setLayerContent();
				ioFuns.getInfoSuccess(ret,params);
			},
			getGroupsError : function() {},
			getInfoSuccess : function(ret , params) {
				infoData = {};
				infoData['comp'] = ret.data.comp;
				infoData['scho'] = ret.data.scho;
				infoData['tag'] = ret.data.tag;
				custFuncs.setInfoContent();				
			} ,
			getInfoError : function() {
								
			},
			listByGroupSuccess:function(ret , params) {
				var type;
				//group：分组，search：搜索，common：学校、公司、或标签
				if(params.type == 'group') {
					type = 'group';			
				} else if(params.type == 'search') {
					type = 'search';				
				} else {
					type = 'common';
				}
				ret.data && custFuncs.setSpecial(ret.data);
				custFuncs.listData(type , ret , params);
			},
			listByGroupError:function() {}
		};
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			groupMousever : function() {
				custFuncs.setHoverPosition('groupHover');
				nodes.groupHoverLayer.style.display = '';		
			},
			groupMouseout : function() {
				nodes.groupHoverLayer.style.display = 'none';				
			},
			infoMouseover : function() {
				custFuncs.setHoverPosition("infoHover");
				nodes.infoHoverLayer.style.display = '';			
			} ,
			infoMouseout : function() {
				nodes.infoHoverLayer.style.display = 'none';				
			} ,
			bodyClick : function(e) {
				if(contactIsShow) {
					var ev = $.fixEvent(e);
					var target = ev.target;
					if(target != closeBtn && !$.contains(closeBtn, target) && !$.contains(contactKitNode, target)) {
						custFuncs.hideContactKit();
						$.custEvent.fire(inputCustObj , 'hide');
						custFuncs.clearAllData();
					}
				}			
			},
			/*
			mousewheel : function(e) {
				e = $.fixEvent(e);
				var direction ;
				if(e.detail) {
					direction = e.detail / 3;
				} else if(e.wheelDelta) {
					direction = e.wheelDelta / -120;
				}
				
			},
			*/
			contentScroll : function() {
				clearTimeout(scrollTimer);
				scrollTimer = setTimeout(bindDOMFuns.contentScrollImpl , 300);		
			},
			contentScrollImpl : function() {
				var scrollHeight = nodes.contactContent.scrollHeight;
				var scrollTop = nodes.contactContent.scrollTop + staticScrollHeight;
				if(scrollTop / scrollHeight > 0.8) {
					custFuncs.loadPageData();
				}
			}
		};
		//---DOM事件绑定方法定义区-------------------------
		var bindDOM = function() {
			//inputTip实例化
			inputTipTool = $.common.content.inputTip(nodes.searchInput, {
				text: lang("#L{输入昵称或备注}"),
				className: 'default'
			});
			dEvent = $.delegatedEvent(contactKitNode);
			dEvent.add('close_dialog' , 'click' , deleEvent.close_dialog);
			dEvent.add('addRemoveItem' , 'click' , deleEvent.addRemoveItem);
			dEvent.add('getAllContact' , 'click' , deleEvent.getAllContact);
			dEvent.add('selectAll' , 'click' , deleEvent.selectAllCheckbox);
			dEvent.add('search' , 'click' , deleEvent.searchSubmit);
			

			$.addEvent(nodes.groupHover , 'mouseover' , bindDOMFuns.groupMousever);
			$.addEvent(nodes.groupHover , 'mouseout' , bindDOMFuns.groupMouseout);
			$.addEvent(nodes.infoHover , 'mouseover' , bindDOMFuns.infoMouseover);
			$.addEvent(nodes.infoHover  , 'mouseout' , bindDOMFuns.infoMouseout);

			$.addEvent(document.body , 'click' , bindDOMFuns.bodyClick);
			//加载lazyload
			staticScrollHeight = parseInt($.getStyle(nodes.contactContent , 'height')) || 0;
			bindLazyload();
		};
		var bindLazyload = function() {
			//nodes.contactContent
			/*
			if(window.addEventListener) {
				nodes.contactContent.addEventListener('DOMMouseScroll' , bindDOMFuns.mousewheel , false);				
			} else {
				nodes.contactContent.onmousewheel = bindDOMFuns.mousewheel;				
			}
			*/
			$.addEvent(nodes.contactContent , 'scroll' , bindDOMFuns.contentScroll);	
		};
		var unbindLazyload = function() {
			$.removeEvent(nodes.contactContent , 'scroll' , bindDOMFuns.contentScroll);			
		};
		var deleEvent = {
			searchSubmit : function() {
				var value = $.trim(nodes.searchInput.value);
				if(value == lang("#L{输入昵称或备注}")) {
					nodes.searchInput.focus();
				} else {
					var storeKey = "search:" + value;
					if(cacheMap[storeKey]) {
						custFuncs.rendGroupContents(storeKey , 'search' , value);						
					} else {
						currentGid = storeKey;
						try {
							listByGroupTrans.abort();	
						}catch(e) {}
						listByGroupTrans.request({
							type : "search",
							q : value,
							page : 1
						});								
					}
				}
			},
			selectAllCheckbox : function(opts) {
				var el = opts.el;
				var isSelectAll = el.checked;
				var data = cacheMap[currentGid].concat([]);
				/*
				var funList = [];
				while(data.length > 10) {
					var tmp = data.splice(0 ,10);
					funList.push((function(tmp) {
						return function() {
							custFuncs.timeChunkForeach(tmp , isSelectAll);	
						};											
					})(tmp));
				}
				if(data.length > 0) {
					funList.push(function() {
						custFuncs.timeChunkForeach(data , isSelectAll);						
					});					
				}
				*/
				if(!data.length){
					return;	
				}
				$.timedChunk(data , {
					process : function(item) {
						custFuncs.timeChunkForeach(item , isSelectAll);						
					},
					execTime : 100
				});				
			},
			close_dialog : function() {
				custFuncs.hideContactKit();
				$.custEvent.fire(inputCustObj , 'hide');
				custFuncs.clearAllData();
			},
			addRemoveItem : function(opts) {
				var el = opts.el;
				var data = opts.data;
				var isCurrent = $.core.dom.hasClassName(el , 'current');
				if(isCurrent) {
					custFuncs.removeOneItem(el , data);
					custFuncs.setChooseNum(-1);
				} else {
					custFuncs.addOneItem(el , data);
					custFuncs.setChooseNum(1);
				}
				custFuncs.setCheckbox();
			},
			showGroup : function(opts) {
				var type = opts.data.type;
				//设置current
				custFuncs.setTabCurrent('group' , opts.el , opts.data.type);
				var gid = opts.data.gid;
				//如果进行过缓存，直接显示
				var isSearch = $.core.arr.indexOf(gid , ['comp' , 'scho' , 'tag']) >= 0;
				if(isSearch) {
					//走搜索的流程
					var q = opts.data.gname;
					var key = gid + ":" + q;
					if(cacheMap[key]) {
						custFuncs.rendGroupContents(key , 'common');
					} else {
						currentGid = key;
						try {
							listByGroupTrans.abort();	
						}catch(e) {}
						listByGroupTrans.request({
							type : gid,
							q : q,
							page : 1
						});	
					}
				} else {
					//走普通分组流程
					if(cacheMap[gid]) {
						custFuncs.rendGroupContents(gid , "common");
					} else {
						currentGid = gid;
						try {
							listByGroupTrans.abort();	
						}catch(e) {}
						listByGroupTrans.request({gid : gid , page : 1 , type : "group"});
					}
				}
				lastSelectItem && $.removeClassName(lastSelectItem , "cur");
				$.addClassName(opts.el , "cur");
				lastSelectItem = opts.el;
				nodes[type + 'HoverLayer'].style.display = 'none';
				try {
					$.fixEvent(opts.evt).target.blur();
				}catch(e) {
				}
			},
			getAllContact : function() {
				custFuncs.rendGroupContents('0' , "common");
				//设置current
				custFuncs.setTabCurrent('all');
				//把上一次的cur状态移除
				lastSelectItem && $.removeClassName(lastSelectItem , "cur");
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		var bindCustEvt = function() {
			$.custEvent.define(custEvent, "resetPosition");
 			$.custEvent.add(custEvent, "resetPosition", custFuncs.setPos);
			$.custEvent.define(custEvent, "removeItem");
			$.custEvent.add(custEvent, "removeItem", custFuncs.custRemoveItem);
			$.custEvent.define(custEvent, "addItem");
			$.custEvent.add(custEvent, "addItem", custFuncs.custAddItem);
			$.custEvent.define(custEvent, "clearAllData");
			$.custEvent.add(custEvent, "clearAllData", custFuncs.clearAllData);
		};
		//-------------------------------------------
		
		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {
			
		};
		//-------------------------------------------
		
		//---组件公开方法的定义区---------------------------
		var destroy = function() {
			dEvent && dEvent.destroy && dEvent.destroy();
			inputTipTool && inputTipTool.destroy && inputTipTool.destroy();
			if(nodes) {
				nodes.groupHover && $.removeEvent(nodes.groupHover , 'mouseover' , bindDOMFuns.groupMousever);
				nodes.groupHover && $.removeEvent(nodes.groupHover , 'mouseout' , bindDOMFuns.groupMouseout);
				nodes.infoHover && $.removeEvent(nodes.infoHover , 'mouseover' , bindDOMFuns.infoMouseover);
				nodes.infoHover && $.removeEvent(nodes.infoHover  , 'mouseout' , bindDOMFuns.infoMouseout);
				nodes.groupHoverLayer && $.removeEvent(nodes.groupHoverLayer , 'mouseover' , bindDOMFuns.groupMousever);
				nodes.groupHoverLayer && $.removeEvent(nodes.groupHoverLayer , 'mouseout' , bindDOMFuns.groupMouseout);
				nodes.infoHoverLayer && $.removeEvent(nodes.infoHoverLayer , 'mouseover' , bindDOMFuns.infoMouseover);
				nodes.infoHoverLayer && $.removeEvent(nodes.infoHoverLayer , 'mouseout' , bindDOMFuns.infoMouseout);
				nodes.contactContent && $.removeEvent(nodes.contactContent , 'scroll' , bindDOMFuns.contentScroll);
			}
			$.removeEvent(document.body , 'click' , bindDOMFuns.bodyClick);
			custEvent && $.custEvent.undefine(custEvent);
		};
		var firstInit = function() {
			if(!inited) {
				init();
				inited = true;				
			}			
		};
		var setPosition = function() {
			var size = getSize(accordTo);
			var pos = $.core.dom.position(accordTo);
			var left = pos.l , top = pos.t + size.height; 
			$.setStyle(contactKitNode , 'left' , left + 'px');
			$.setStyle(contactKitNode , 'top' , top + 'px');
		};
		var hide = function() {
			firstInit();
			contactKitNode.style.display = 'none';			
		};
		var custFuncs = {
			clearAllData : function() {
				nodes.searchInput.value =lang("#L{输入昵称或备注}");
				nodes.searchInput.className = 'input default';
				deleEvent.getAllContact();
			},
			setHoverPosition : function(tNodeName) {
				var tNode = nodes[tNodeName];
				var tNodeLayer = nodes[tNodeName + 'Layer'];
				var pos1 = $.position(nodes.dialogContent);
				var pos2 = $.position(tNode);
				var size = getSize(tNode);
				var left = pos2.l - pos1.l;
				var top = pos2.t + size.height - pos1.t - 7;
				$.setStyle(tNodeLayer , 'left' , left + 'px');
				$.setStyle(tNodeLayer, 'top' , top + 'px');
			},
			setSpecial : function(data) {
				if(data.length) {
					for(var i = 0 , len = data.length ; i < len ; i++) {
						var tmp = data[i];
						var type_p = '';
						var gname = '';
						if(tmp['verified'] === true) {
							if(tmp['verified_type'] == 0) {
								type_p = 'orange';
							} else if(tmp['verified_type'] > 0) {
								type_p = 'blue';
							}
						} else {
							if(tmp['verified_type'] == 220) {
								type_p = 'daren';
							}
						}
						tmp['type_p'] = type_p;
						gname = encodeDecode.decode(tmp.name);
						tmp['name_s'] = encodeDecode.encode($.bLength(gname) > 10 ? $.leftB(gname , 10) : gname);
					}
				}
			} ,
			listData : function(type , ret , params) {
				var storeKey;
				if(type == 'group') {
					storeKey = params.gid;
				} else if(type == 'search') {
					storeKey = 'search:' + params.q;					
				} else {
					storeKey = params.type + ":" + params.q;					
				}
				var noDataType = type != 'search' ? "common" : "search";
				var rendGroupAll = (noDataType === "common" && params.gid === '0');
				//从未请求过分组数据
				if(params.page == 1) {
					//缓存数据
					cacheMap[storeKey] = ret.data;
					//获取列表html
					var data = ret.data.concat([]);
					//为每一个设置current
					custFuncs.addCurrentAttribute(data);
					data.noDataType = noDataType;
					data.rendGroupAll = rendGroupAll;
					if(noDataType == 'search') {
						data.q = params.q;
					}
					var html = $.core.util.easyTemplate(lang(LISTTPL) , data);
					//赋值
					nodes.contactContent.innerHTML = html;
					nodes.contactContent.scrollTop = 0;
					//显示
					custFuncs.showContactKit();
					//请求分组数据
					if(!groupData) {
						//请求全部分类数据
						getGroupsTrans.request();					
					}
					dataPrepared = true;
					//总数赋值
					nodes.totalCount.innerHTML = ret.data.length;
					custFuncs.setChooseNum();
					//为checkbox赋值
					custFuncs.setCheckbox();
					//为noMorePage赋值
					if(data.length != 0) {
						noMorePage[storeKey] = 1; 						
					} else {
						noMorePage[storeKey] = true;						
					}
				} else {
					if(ret.data.length) {
						//按照分页加载新数据
						cacheMap[storeKey] = cacheMap[storeKey].concat(ret.data);
						var data = ret.data.concat([]);
						//为每一个设置current
						custFuncs.addCurrentAttribute(data);
						data.noDataType = noDataType;
						data.rendGroupAll = rendGroupAll;
						if(noDataType == 'search') {
							data.q = params.q;	
						}
						var html = $.core.util.easyTemplate(lang(LISTTPL) , data);
						//使用insertHTML添加html
						$.insertHTML(nodes.contactContent , html);
						//更改count总数
						nodes.totalCount.innerHTML = cacheMap[storeKey].length;
					}
					//为是否需要再请求设置key
					var data = ret.data; 
					if(data.length == 0) {
						noMorePage[storeKey] = true;
					}
					//设置checkbox
					custFuncs.setCheckbox();
					setTimeout(bindLazyload , 300);
				}	
				//重新设置选中了多少个人
				custFuncs.setChooseNum();		
			},
			timeChunkForeach : function(item , isSelectAll) {
					var uid = item.uid;
					if(isSelectAll) {
						if(!pushedMap[uid]) {
							var item = $.sizzle("li[uid='" + uid + "']" , nodes.contactContent)[0];
							deleEvent.addRemoveItem({
								el : item ,
								data : $.queryToJson(item.getAttribute('action-data'))
							});
						}							
					} else {
						if(pushedMap[uid]) {
							var item = $.sizzle("li[uid='" + uid + "']" , nodes.contactContent)[0];
							deleEvent.addRemoveItem({
								el : item ,
								data : $.queryToJson(item.getAttribute('action-data'))
							});
						}
					}
			},
			setCheckbox : function() {
				var checked = true;
				var data = cacheMap[currentGid];
				if(!data || !data.length) {
					checked = false;					
				} else {
					$.foreach(data , function(item , index) {
						var uid = item.uid;
						if(!pushedMap[uid]) {
							checked = false;
							return false;						
						}					
					});					
				}
				nodes.selectAll.removeAttribute("disabled");	
				nodes.selectAll.checked = checked;
				if(!data || !data.length) {
					nodes.selectAll.setAttribute("disabled" , "disabled");	
				} else {
					nodes.selectAll.removeAttribute("disabled");	
				}
			},
			addCurrentAttribute : function(data) {
				$.foreach(data , function(item , index) {
					/**
					 *  uid     id
						name    screen_name
						img     profile_image_url  
						remark  
						location province
					 */
					item['uid'] = item['id'];
					item['name'] = leftB(item['screen_name'] , 12);
					item['img'] = item['profile_image_url'];
					item['remark'] = '';
					if(pushedMap[item.uid]) {
						item.isChoose = 1;	
					} else {
						item.isChoose = 0;						
					}					
				});
			},
			timeChunkHtml : function(data) {
				if(!data.length) {
					var html = $.core.util.easyTemplate(lang(LISTTPL) , data);
					nodes.contactContent.innerHTML = html;	
				} else {
					nodes.contactContent.innerHTML = "";	
					var funList = [];
					while(funList.length >= 50) {
						funList.push((function() {
							var tmp = data.splice(0 , 50);
							return function() {
								custFuncs.tenItemHtml(tmp);	
							};
						})());	
					}
					if(data.length) {
						funList.push((function() {
							return function() {
								custFuncs.tenItemHtml(data);	
							};
						})());	
					}
					$.timedChunk(funList);
				}
			},
			tenItemHtml : function(data) {
				var html = $.core.util.easyTemplate(lang(LISTTPL) , data);
				$.insertHTML(nodes.contactContent , html);
			},
			rendGroupContents : function(gid , noDataType , q) {
				currentGid = gid;
				//渲染innerHTML,更改已选，未选
				var data = cacheMap[gid].concat([]);
				data.noDataType = noDataType;
				data.rendGroupAll = (noDataType === "common" && gid === "0");
				data.q =  q;
				var length = data.length;
				//设置每个的current
				custFuncs.addCurrentAttribute(data);
				custFuncs.timeChunkHtml(data);	
				nodes.contactContent.scrollTop = 0;
				//总数赋值
				nodes.totalCount.innerHTML = length;
				custFuncs.setChooseNum();
				//为checkbox赋值
				custFuncs.setCheckbox();
			} ,
			setChooseNum : function(type) {
				var allData = cacheMap[currentGid] , count = 0 , uid;
				for(var i = 0 ; i < allData.length ; i++) {
					uid = allData[i].uid;
					if(pushedMap[uid]) {
						count ++;						
					}					
				}
				nodes.chooseCount.innerHTML = count;
			} ,
			setPos : function() {
				if(custFuncs.isVisible(contactKitNode)) {
					setPosition();					
				}			
			} ,
			isVisible : function(n) {
				return n.offsetHeight && n.offsetWidth;
			},
			//检测是否已经存在数据，可以直接显示
			checkPrepared : function() {
				return 	dataPrepared;			
			},
			showContactKit : function() {
				contactIsShow = true;
				contactKitNode.style.display = '';
			},
			hideContactKit : function() {
				contactIsShow = false;
				contactKitNode.style.display = 'none';
			},
			delegateGroup : function() {
				//groupEvent是代理事件
				dEvent.add('showGroup' , 'click' , deleEvent.showGroup);
			},
			setShortWord : function(arr) {
				//超过8个字就进行截字，显示成8个字 + ...
				if(arr && arr.length) {
					for(var i = 0 , len = arr.length ; i < len ; i++) {
						var tmp = arr[i];
						var gname = encodeDecode.decode(tmp.gname);
						arr[i].shortWord = encodeDecode.encode($.bLength(gname) > 16 ? $.leftB(gname , 16) + "..." : gname);
					}
				}
			},
			setLayerContent : function() {
				groupData && (groupData.type = 'group');
				custFuncs.setShortWord(groupData);
				var html = $.core.util.easyTemplate(lang(LAYERITEMTPL) , groupData);
				nodes.layerContent.innerHTML = html;
				$.addEvent(nodes.groupHoverLayer , 'mouseover' , bindDOMFuns.groupMousever);				
				$.addEvent(nodes.groupHoverLayer , 'mouseout' , bindDOMFuns.groupMouseout);				
			},
			rendInfo : function(data) {
				var result = [];
				for(var key in data) {
					var arr = data[key];
					if(arr) {
						for(var i = 0 , len = arr.length ; i < len ; i++) {
							arr[i] = {gid : key , gname : arr[i]};	
						}
						result = result.concat(arr);
					}
				}
				return result;
			},
			setInfoContent : function() {
					infoData = custFuncs.rendInfo(infoData);
					infoData && (infoData.type = 'info');
					custFuncs.setShortWord(infoData);
					var html = $.core.util.easyTemplate(lang(LAYERITEMTPL) , infoData);
					nodes.infoLayerContent.innerHTML = html;
					$.addEvent(nodes.infoHoverLayer , 'mouseover' , bindDOMFuns.infoMouseover);
					$.addEvent(nodes.infoHoverLayer , 'mouseout' , bindDOMFuns.infoMouseout);				
			},
			removeOneItem : function(el , data) {
				$.core.dom.removeClassName(el , 'current');
				$.custEvent.fire(inputCustObj , 'removeItem' , data);				
			},
			addOneItem : function(el , data) {
				$.core.dom.addClassName(el , 'current');
				$.custEvent.fire(inputCustObj , 'addItem' , data);
			},
			custRemoveItem : function(evt , uid) {
				var el = $.sizzle("li[uid='" + uid + "']" , nodes.contactContent)[0];
				$.core.dom.removeClassName(el , 'current');
				custFuncs.setChooseNum(-1);
				custFuncs.setCheckbox();			
			},
			custAddItem : function(evt , uid) {
				var el = $.sizzle("li[uid=" + uid + "]" , nodes.contactContent)[0];
				if(el) {
					$.core.dom.addClassName(el , 'current');						
				}
				custFuncs.setChooseNum(1);
				custFuncs.setCheckbox();
			},
			setTabCurrent : function(type , item , itemType) {
				if(type == 'all') {
					$.addClassName(nodes.getAllContact , 'current');
					$.removeClassName(nodes.groupHover , 'current');					
					$.removeClassName(nodes.infoHover , 'current');					
				} else if(type == 'group') {
					$.removeClassName(nodes.getAllContact , 'current');
					$.removeClassName(nodes.groupHover , 'current');
					$.removeClassName(nodes.infoHover , 'current');
					$.addClassName(nodes[itemType + 'Hover'] , 'current');
				}
			},
			loadPageData : function() {
				//如果确定知道没有新数据了，不再请求
				if(noMorePage[currentGid] !== true) {
					var params = {};
					noMorePage[currentGid] ++;
					params.page = noMorePage[currentGid];
					params.gid = currentGid;
					params.type = 'group';
					unbindLazyload();
					try {
						listByGroupTrans.abort();	
					}catch(e) {}
					listByGroupTrans.request(params);						
				} 				
			}
		};
		//显示联系人选择器
		var show = function() {
			firstInit();
			setPosition();
			var hasData = custFuncs.checkPrepared();
			if(hasData) {
				custFuncs.showContactKit();			
			} else {
				currentGid = 0;
				try {
					listByGroupTrans.abort();	
				}catch(e) {}
				listByGroupTrans.request({gid : '0' , page : 1 , type : "group"});				
			}
		};
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		that.show = show;
		that.hide = hide;
		that.contactKitCustObj = custEvent;
		//-------------------------------------------
		return that;
	};
});
