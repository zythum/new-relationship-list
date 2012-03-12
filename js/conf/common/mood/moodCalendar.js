/**
 * @author lianyi@staff.sina.com.cn
 * 
 * 模块功能：用于在首页（右侧心情模块）和我的微博页（心情标签），他人微博页（心情标签），进行心情日历的渲染
 * 
 * 原理：通过底层的module.calendar，和服务器返回的json数据，渲染一个月的html
 * 
 * 
 */
$Import('kit.extra.merge');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.trans.mood');
$Import('module.calendar');

STK.register('common.mood.moodCalendar' , function($) {
	/**
	 * 参数说明：
	 * nodeOuter: 用于提供代理事件，必须的node-type节点
	 * 	     monthPrev 前一个月份箭头
	 *       monthNext 后一个月份箭头
	 *       year 更改年份innerHTML的节点
	 *       month 更改月份innerHTML的节点
	 *       contentArea 更改月份后把内容填入到这个节点
     * custObj : 用于提供custEvent调用
     * 		 stopClose 事件，用于阻止bubble上面的body冒泡
     * 		 startClose事件，用于开启bubble上面的body冒泡
	 * style : 显示日历的时候心情图标显示的是大图还是小图
	 * 		 big ： 显示的是大图标
	 * 		 small : 显示的是小图标(默认)
	 *  
	 *  附加说明：
	 *  	需要action-type进行事件代理
	 *  	action-type:monthPrev 点击显示前一个月的日历信息
	 *  	action-type:monthNext 点击显示后一个月的日历信息
	 */
	return function(spec) {
		spec = $.kit.extra.merge({
			style : "small",
			requestData : {}	
		} , spec);
		/**
		 * 日历模板，使用js进行渲染，由2个ul组成，第一个写死，第二个配合后台返回的数据，使用module.calendar渲染
		 */
		var TEMPLATE = '<#et moodlist data><ul class="week clearfix W_linecolor"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class="day clearfix">' + 
			   '<#list data as list>' + 
			   '<li class="W_linecolor"><span>${list._day_}</span><#if (list.face)><img moodconf="day=${list.date}" src="${list.face}" alt="" /></#if></li>' + 
			   '</#list>' + 
			   '</ul></#et>';
		/**
		 * 语言处理函数
		 */
		var $L = $.kit.extra.language;
		/**
		 * LOADING样式，用于查看某一天日历上的心情，先显示loading，再读取数据
		 */
		var LOADING = $L('<div class="W_loading" style="padding-top:15px;padding-bottom:15px;text-align:center"><span>#L{正在加载，请稍候}...</span></div>');
		/**
		 * 延迟500毫秒以后进行显示心情详情层
		 */
		var SHOWDELAY = 500;
		var HIDEDELAY = 200;
		/**
		 * that是最终返回对象
		 * nodes是build出来的节点，方便的使用node-type进行控制
		 * delegate用于代理事件
		 * calTrans用于按照月份去服务端请求相应月份的数据
		 * tipTimer用于500毫秒请求记一个timer，你懂的
		 * tipInserted用于第一次显示心情提示层的时候，向document.body里添加一段html，状态标记位，只执行一次。
		 * firstMonth that向外抛出一个reset方法，可以重置日历，firstMonth用于记住第一次显示日历的时候是哪个月份，调用reset
		 * 			重置方法的时候将会重新显示到这个月份。
		 * firstCall 用来标记一个变量告诉外层调用一次清空外层div高度，数据获取比较慢
		 */
		var that = {} , nodes  , delegate , calTrans , tipTimer , tipInserted , firstMonth , firstCall;
		/**
		 * calUtil用来调用module层的calendar，module层calendar提供了底层的日历支持，使用json数据就可画出日历，减少了php的工作量
		 */
		var calUtil = $.module.calendar;
		/**
		 * 调用参数检查，使用delegate进行事件绑定，必须传入nodeOuter外层容器进行事件绑定，没有就抛出异常，便于程序猿检查错误
		 */
		var argsCheck = function() {
			if(!$.isNode(spec.nodeOuter)) {
				throw 'moodCalendar need a node argument';
			}
		};
		var parseDOM = function() {
			/**
			 * nodes赋值，后面会调用nodes.xxx操作dom
			 */
			nodes = $.kit.dom.parseDOM($.builder(spec.nodeOuter).list);
			/**
			 * 加载了日历控件以后，会获取php打印出来的月份，并且请求这个月份的数据 
			 */
			var curDate = utils.getCurrentMonth();
			curDate = curDate.year + "-" + curDate.month;
			/**
			 * 为默认显示月份赋值，这个值在that.reset的时候需要，重置到这个默认月份显示
			 */
			if(!firstMonth) {
				firstMonth = curDate;	
			}
			/**
			 * 发送请求，请求默认显示月份的数据
			 */
			try {
				calTrans.abort();
			}catch(e){}
			
			var requestObj = $.kit.extra.merge({
				month : curDate,
				style : spec.style
			} , spec.requestData);
			calTrans.request(requestObj);
		};
		/**
		 * tipCache是用来获取和存储心情详细说明层html的工具，避免重复请求获取
		 */
		var tipCache = {
			/**
			 * Map，用来键值对应
			 */
			cache : {},
			/**
			 * 根据id获取某一天的心情html
			 */
			get : function(id) {
				if(this.cache[id]) {
					return this.cache[id];	
				} else {
					return null;	
				}
			},
			/**
			 * 根据id存储某一天的心情html
			 */
			set : function(id , html) {
				this.cache[id] = html;
			}
		};
		/**
		 * 逻辑函数，使用一个句柄进行封装
		 */
		var utils = {
			/**
			 * 获得心情微博上线的年月份
			 */
			getOnlineDate : function() {
				//使用本地时间获取当前月
				var getCur = function() {
					return {
						year : 2011,
						month : 12 						
					};					
				};
				var actionData = nodes.monthPrev.getAttribute("action-data");
				//获取action-data，然后得到online属性
				if(actionData) {
					var result = $.queryToJson(actionData);
					if(result.online) {
						var arr = result.online.split("-");
						return {
							year : arr[0],
							month : parseInt(arr[1] , 10)							
						};
					} else {
						return getCur();
					}										
				} else {
					return getCur();
				}
			},
			/**
			 * 用来缓存日历中的每个月份，键值对为 月份 对应 html
			 */
			calCache : {},
			/**
			 * 获得当前显示在页面上的月份 根据innerHTML获取年和月
			 */
			getCurrentMonth : function() {
				return {
					year : nodes.year.innerHTML,
					month : nodes.month.innerHTML
				};
			},
			/**
			 * 给一个月份+1个月或-1个月的时候，获取新的年和月的值
			 * @param {Object} date    
			 * {
			 * 	year : 4位的年份
			 *  month : 4位的月份	
			 * }
			 * @param {Object} indicator
			 * +1或-1，用来算前一个月或后一个月
			 * @return {
			 * 	year : 4位的年份
			 *  month : 4位的月份
			 * }
			 */
			getDate : function(date , indicator) {
				date.month -= 1;
				var d = new Date(date.year , date.month);
				d.setMonth(d.getMonth() + indicator);
				return {
					year : d.getFullYear(),
					month : d.getMonth() + 1
				};
			},
			/**
			 * 根据服务器返回的json对象，直接获取日历最终html，获取html之前，将心情详情html保存到了缓存中
			 * @param {Object} month   月份字符串   "2011-12"
			 * @param {Object} list    服务器返回Map
			 * {
			 * 	 2011-12-03 : {face ： "当天心情img_url" , date : "当天日期" , content : "鼠标移到这一天的时候显示的提示层html"}
			 * 	 2011-12-04 : {face ： "当天心情img_url" , date : "当天日期" , content : "鼠标移到这一天的时候显示的提示层html"}
			 * }
			 */
			getCalHtml : function(month , list) {
				month = month + '-1';
				for(var key in list) {
					tipCache.set(key , list[key]['content']);					
				}
				return calUtil.parseMapHtml(month , list , TEMPLATE);
			},
			/**
			 * 从服务器获取一个月份成功之后的回调函数
			 * 根据json对象使用module.calendar获取月份对应的日历的innerHTML，并且保存到了缓存中。
			 * 为[node-type='contentArea']赋值，并且更新了年和月的innerHTML
			 * @param {Object} ret 服务器返回json {code : 100000 , msg : "succ" , data : {
			 * 	 2011-12-03 : {face ： "当天心情img_url" , date : "当天日期" , content : "鼠标移到这一天的时候显示的提示层html"}
			 * 	 2011-12-04 : {face ： "当天心情img_url" , date : "当天日期" , content : "鼠标移到这一天的时候显示的提示层html"}
			 * }}
			 * @param {Object} 传递给服务器的参数
			 * {
			 * 	month : 2011-12
			 * }
			 */
			calPageSuc : function(ret , data) {
				if(!firstCall) {
					var cust = spec.custObj;
					if(cust) {
						$.custEvent.fire(cust,'setHeightFree',{});
					}
					firstCall = 1;					
				}
				var month = data.month;
				var list = ret.data;
				var html = utils.getCalHtml(month,list);
				utils.calCache[month] = html;
				nodes.contentArea.innerHTML = html;
				utils.changeMonth(data.month);
			},
			/**
			 * 为年和月对应的节点赋值innerHTML
			 * @param {Object} monthStr
			 * monthStr 为 "2011-12" 的字符串
			 */
			changeMonth : function(monthStr) {
				var result = monthStr.split("-");
				nodes.year.innerHTML = result[0];
				nodes.month.innerHTML = result[1];
			},
			/**
			 * 检查是否缓存过html，当缓存不存在时，去服务器取数据
			 * @param {Object} month   "2011-12"
			 */
			checkCacheSendRequest : function(month) {
				month = month.replace(/^(\d{4}\-)(\d{1})$/ , function($0,$1,$2) {
					return $1 + "0" + $2;
				});
				if(utils.calCache[month]) {
					nodes.contentArea.innerHTML = utils.calCache[month];	
					utils.changeMonth(month);
				} else {
					var requestObj = $.kit.extra.merge({
						month : month,
						style : spec.style
					} , spec.requestData);
					calTrans.request(requestObj);
				}	
			},
			/**
			 * 显示心情提示层的时候阻止bubble的冒泡，避免产生bug
			 */
			showTip : function() {
				clearTimeout(tipTimer);
				nodes.moodTip && (nodes.moodTip.style.display = '');
				utils.fireStopClose();
			},
			/**
			 * 隐藏心情提示层的时候，开启冒泡，让bubble能够正常关闭
			 */
			hideTip : function() {
				clearTimeout(tipTimer);
				tipTimer = setTimeout(function() {
					nodes.moodTip && (nodes.moodTip.style.display = 'none');	
					utils.fireStartClose();						
				} , HIDEDELAY);
			},
			/**
			 * 使用custEvent阻止冒泡
			 */
			fireStopClose : function() {
				var cust = spec.custObj;
				if(cust) {
					$.custEvent.fire(cust,'stopClose',{});
				}
			},
			/**
			 * 使用custEvent开启冒泡
			 */
			fireStartClose : function() {
				var cust = spec.custObj;
				if(cust) {
					$.custEvent.fire(cust,'startClose',{});
				}
			}
		};

		var bindDOMFuns = {
			/**
			 * 显示心情提示，根据target上的moodconf属性决定是否延迟显示心情提示
			 * @param {Object} e
			 * 事件对象
			 */
			showCard : function(e) {
				e = $.fixEvent(e);
				var target = e.target;
				var moodconf = target.getAttribute('moodconf');
				if(moodconf) {
					clearTimeout(tipTimer);
					var data = $.queryToJson(moodconf);	
					tipTimer = setTimeout(function() {
						bindDOMFuns.showCardImpl({
							event : e,
							data : data
						});
					} , SHOWDELAY);
				}
			} ,
			/**
			 * 真正显示心情提示的函数，测试一下左边和右边的距离，哪边距离多就在哪边显示心情提示层
			 * @param {Object} spec
			 * spec {
			 * 			event : 事件对象
			 * 			data : 数据对象，具体为某一天
			 * }
			 */
			showCardImpl : function(spec) {
				if(!tipInserted) {
					tipInserted = 1;
					nodes.moodTip = $.insertHTML(document.body , '<div node-type="moodTip" class="layer_one_mood" style="display:none;z-index:10000"><div node-type="moodContent"></div><p class="arrow" node-type="arrow_l"></p><p class="arrow_r" node-type="arrow_r"></p></div>');
					var nodesTmp = $.kit.dom.parseDOM($.builder(nodes.moodTip).list);
					nodes = $.kit.extra.merge(nodes , nodesTmp);
					bindDOMFuns.bindMoodTipEvent();
				}
				nodes.moodContent.innerHTML = LOADING;
				var evt = spec.event;
				//要针对显示提示的节点
				var target = evt.target;
				//目标元素的大小
				var targetSize = $.core.dom.getSize(target);
				//目标元素的位置
				var pos = $.position(target);
				//外围用来控制显示在左边还是右边的节点
				var outerPos = $.position(nodes.moodOuter);
				//外层节点大小
				var outerSize = $.core.dom.getSize(nodes.moodOuter);
				//左边剩余位置
				var leftSpace = pos.l - outerPos.l;
				//右边剩余位置
				var rightSpace = outerPos.l + outerSize.width - pos.l;
				//在左边还是右边
				var dir = 'r';
				if(leftSpace > rightSpace) {
					dir = 'l';		
				}
				//切换一下箭头显示状态
				var dirs = {
					l : nodes.arrow_r,
					r : nodes.arrow_l
				};
				for(var key in dirs) {
					if(key == dir) {
						dirs[key].style.display = '';
					} else {
						dirs[key].style.display = 'none';
					}
				}
				//定义、左上坐标
				var top,left;
				//得到提示的大小
				var tipSize = $.core.dom.getSize(nodes.moodTip);
				top = pos.t + targetSize.height / 2 - 17;
				if(dir == 'l') {
					left = 	pos.l - tipSize.width - 5;
				} else {
					left =  pos.l + targetSize.width + 5;
				}
				var day = spec.data.day;
				var tipHtml = tipCache.get(day);
				nodes.moodContent.innerHTML = tipHtml;
				$.setStyle(nodes.moodTip , 'left' , left + 'px');
				$.setStyle(nodes.moodTip , 'top' , top + 'px');
				$.setStyle(nodes.moodTip , 'display' , '');
			},
			/**
			 * 隐藏提示层，参数没用到
			 * @param {Object} e
			 */
			hideCard : function(e) {
				utils.hideTip();
			},
			/**
			 * 显示前一个月的日历
			 * @param {Object} opts
			 */
			monthPrev:function(opts) {
				bindDOMFuns.showMonth("prev");
			},
			/**
			 * 显示 前一个月和 显示下一个月 都使用这个方法，显示下一个月的时候检查一下月份的界限是否大约当前月份
			 * @param {Object} type
			 */
			showMonth : function(type) {
				var cur = utils.getCurrentMonth();
				//当前的年月
				var now = (function() {
					var arr = firstMonth.split("-");
					return {
						year : arr[0],
						month : parseInt(arr[1] , 10)
					}
				})(); 
				//应该到的那一个月
				var shouldBe = utils.getDate(cur , type == "prev" ? -1 : 1);
				//上线的那一个月
				var onlineDate = utils.getOnlineDate();
				//如果大于当前年月，就return
				if(shouldBe.year > now.year || (shouldBe.year == now.year && shouldBe.month > now.month)) {
					return;						
				} else {
					//如果小于上线年月，就return
					if(shouldBe.year  < onlineDate.year || (shouldBe.year == onlineDate.year && shouldBe.month < onlineDate.month)) {
						return;
					}
				}
				var month = shouldBe.year + '-' + shouldBe.month;
				utils.checkCacheSendRequest(month);
			},
			/**
			 * 显示下一个月的日历数据
			 * @param {Object} opts
			 */
			monthNext:function(opts) {
				bindDOMFuns.showMonth("next");
			},
			/**
			 * 第一次插入心情提示层的时候为提示层加载事件处理
			 */
			bindMoodTipEvent : function() {
				$.addEvent(nodes.moodTip , "mouseover" ,bindDOMFuns.tipMouseover);
				$.addEvent(nodes.moodTip , "mouseout" ,bindDOMFuns.tipMouseout);
			},
			/**
			 * 心情提示层mouseover的事件处理
			 */
			tipMouseover : function() {
				utils.showTip();
			},
			/**
			 * 心情提示层mouseout的事件处理
			 */
			tipMouseout : function() {
				utils.hideTip();
			}
		};
		/**
		 * 一次绑定trans，不进行多次绑定
		 */
		var bindTrans = function() {
			var error = function(ret , data) {
				$.ui.alert((ret && ret.msg) || $L("#L{对不起，心情日历读取失败}"));			
			};
			calTrans = $.common.trans.mood.getTrans('page' , {
				onSuccess : utils.calPageSuc,
				onError : error,
				onFail : error
			});
		};
		/**
		 * 事件绑定，绑定上一个月，下一个月，和心情层的mouseover，mouseout
		 */
		var bindDelegate = function() {
			delegate = $.delegatedEvent(spec.nodeOuter);
			delegate.add('monthPrev' , 'click' , bindDOMFuns.monthPrev);
			delegate.add('monthNext' , 'click' , bindDOMFuns.monthNext);
			$.addEvent(nodes.contentArea , 'mouseover' , bindDOMFuns.showCard);
			$.addEvent(nodes.contentArea , 'mouseout' , bindDOMFuns.hideCard);
		};
		/**
		 * 初始化执行方法
		 */
		var init = function() {
			argsCheck();
			bindTrans();
			parseDOM();
			bindDelegate();
		};
		/**
		 * 添加destroy方法
		 */
		var destroy = function() {
			delegate && delegate.destroy && delegate.destroy();
			$.removeEvent(nodes.contentArea , 'mouseover' , bindDOMFuns.showCard);
			$.removeEvent(nodes.contentArea , 'mouseout' , bindDOMFuns.hideCard);
		};
		/**
		 * 为日历添加reset方法，用于重置日历到第一次显示的状态
		 */
		that.reset = function() {
			nodes.contentArea.innerHTML = utils.calCache[firstMonth];	
			utils.changeMonth(firstMonth);			
		};
		/**
		 * 提供外层destory入口，用于bp跳转和页面刷新的时候执行内存销毁，减少内存消耗
		 */
		that.destroy = destroy;
		init();
		return that;
	};
});
