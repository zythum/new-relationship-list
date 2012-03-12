/**
 *
 * @id
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xionggq | guoqing5@staff.sina.com.cn
 * @create at 2011-12-05
 * @comment at 2011-12-15
 * 
 * 模块说明：
 * 	发心情发布器组件支持，有两种调用情况
 * 		（1）在首页右侧最上边的发心情入口处，显示在bubble内 common.bubble.moodFeedPublish调用的
 * 		（2）在feed中心情微博内，点击发心情按钮的时候，显示在dialog内 common.dialog.moodSmallPublish调用的
 * 
 * 提供功能说明：
 * 		（1）点击某个心情的时候，会将心情对应的文案，填入发布框
 * 		（2）发布器限制了输入字符130个，因为心情短链占据了10个字符
 * 		（3）发布器含有at功能
 * 		（4）当没有填入发布框内容的时候，进行发布框闪烁提醒，告诉用户要输入内容后方可提交
 * 		（5）点击发布按钮的时候，进行按钮中间状态提醒
 * 		（6）发布器添加了ctrl+enter支持
 * 
 *  调用参数 node
 *  	例如：$.common.mood.moodPublish(node);
 *  	
 *    node为外层节点，里面需要的node-type如下
 *  	[node-type="moodList"] 心情列表中的每一项
 *  	[node-type="textEl"]   发布框textarea
 *  	[node-type="postFeed"] 发布按钮节点，用来进行中间状态渲染
 *  	[node-type="btnText"]  发布按钮，中间状态的时候更改其中的字符使用的节点
 *    action-type如下：
 *    	moodSelect : 点击某一个心情，将心情对应的文字填入输入框中
 *    	postFeed : 发微博按钮
 */
/**
 * 2011年12月29日
 * 加入验证码机制
 */
$Import('kit.dom.parseDOM');
$Import('common.extra.shine');
$Import('common.trans.mood');
$Import('common.editor.base');
$Import('common.trans.editor');
$Import("ui.tipAlert");
$Import("kit.extra.language");
$Import("kit.dom.btnState");
$Import("common.dialog.validateCode");
$Import("common.editor.widget.face");
$Import("common.layer.ioError");

STK.register('common.mood.moodPublish', function($) {
	//---常量定义区----------------------------------

	//-------------------------------------------
	return function(node, custObj) {
		/**
		 * 用于代理事件
		 */
		var DEvent = null;
		/**
		 * 对应返回给外部的对象
		 */
		var that = {};
		/**
		 * 用于语言转换的函数 
		 */
		var $L = $.kit.extra.language;
		/**
		 * 选中的传递给后台参数moodid
		 */
		var isSelectMood = false;
		/**
		 *选中的传递给后台参数content_id 
		 */
		var content_id = false;
		/**
		 * 心情上一次的默认文案，切换心情的时候会进行比较，如果两个值不同，切换的时候就不改变textarea的内容
		 */
		var lastMoodText;
		
		/**
		 * 默认显示第一组心情
		 */
		var moodGroupIndex = 0;
		/**
		 * 当前是否正在进行动画
		 */
		var isTweening = 0;
		/**
		 * editor是实例化textarea之后的对象
		 * option是实例化textarea的参数
		 */
		var editor , option = {
			//plugin:['smiley','','count'],
			limitNum:130,
			count:'disable'
			//tipText:'rrrrrrrrrrrrr',
			//storeWords : custFuncs.restore()
		} , countTimer;
		//---变量定义区----------------------------------
		//----------------------------------------------
		/**
		 * 用来更改提交按钮中间状态的函数，传入loading和normal进行按钮状态切换
		 */
		var changeBtn = function(state) {
			var postBtn = _this.DOM.postFeed[0];
			//更改字的状态 loading normal
			$.kit.dom.btnState({
				btn : postBtn,
				state : state,
				loadText : $L("#L{提交中...}"),
				commonText : $L("#L{发布心情}")						
			});	
		};
		var startClose = function() {
			setTimeout(function() {
				custObj && $.custEvent.fire(custObj,'startClose',{});
			} , 500);
		};
		var stopClose = function() {
			custObj && $.custEvent.fire(custObj,'stopClose',{});
		};
		
		/**
		 * 切换某一心情分组里面的第一个元素
		 */
		var moodGroupClickIndex = function(index) {
			var nodesArr = _this.DOM["moodGroup"];
			var tmpNodes = $.kit.dom.parseDOM($.builder(nodesArr[index]).list);
			if(tmpNodes.moodList && tmpNodes.moodList.length) {
				var moodSelect = tmpNodes.moodList[0];
				var data = $.queryToJson(moodSelect.getAttribute("action-data"));
				_this.DOM_eventFun.moodSelectChange({
					el : moodSelect,
					data : data							
				});
			}
		};
		/**
		 * 验证码组件句柄 
		 * 
		 * submitting是防止多次提交的状态变量
		 */
		var validateTool = $.common.dialog.validateCode() , addTrans , submitting = 0;
		/**
		 * 获取当前心情对应的节点
		 */
		var getCurrentMoodData = function() {
			var nodesArr = _this.DOM["moodGroup"];
			var tmpNodes = $.kit.dom.parseDOM($.builder(nodesArr[moodGroupIndex]).list);
			if(tmpNodes.moodList && tmpNodes.moodList.length) {
				for(var i = 0 , len = tmpNodes.moodList.length ; i < len ; i++) {
					var moodSelect = tmpNodes.moodList[i];
					var data = $.queryToJson(moodSelect.getAttribute("action-data"));
					if(data.moodid == isSelectMood) {
						return data;				
					}						
				}
			}
			return null;
		};
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			'DOM_eventFun' :{
				insertDefault : function() {
					var textarea = _this.DOM.textEl[0];
					var value = $.trim(textarea.value);
					if(value == '') {
						var data = getCurrentMoodData();
						if(data) {
							lastMoodText = data.content;
							textarea.value = lastMoodText;							
						}			
					}
				},
				itemMouseover : function(obj) {
					$.addClassName(obj.el , 'current');
				},
				itemMouseout : function(obj) {
					var j = $.queryToJson(obj.el.getAttribute('action-data'));
					if(j.moodid != isSelectMood) {
						$.removeClassName(obj.el , 'current');
					}
				},
				/**
				 * 点击某一个心情的时候触发的动作，去掉其他dom的current，添加当前节点的current，记住传给服务器的moodid和content_id，切换textarea里面的字
				 */
				'moodSelectChange' : function(spec) {
					var el = spec.el;
                    isSelectMood = spec.data.moodid;
					content_id = spec.data.content_id;
					var moodList = _this.DOM["moodList"];
					var length = moodList.length;
					for (var i = 0; i < length; i++) {
						$.removeClassName(moodList[i], "current");
					}
					$.addClassName(el, "current");
					var writeText = $.trim(_this.DOM["textEl"][0].value); 
					if(lastMoodText == writeText || writeText == "") {
						_this.DOM["textEl"][0].value = spec.data.content;
						lastMoodText = spec.data.content;
						try {
							editor.API.focus();	
						} catch(e) {}
					}
				},
				/**
				 * 点击提交的时候调用
				 */
				'postFeed' :  function(spec) {
					_this.DOM_eventFun.submitFeed();
				},
				/**
				 * 进行提交之前的检查：
				 * 		（1）是否选择心情，没选择心情不能提交
				 * 		（2）是否输入字符，没输入字符不能提交
				 * 检查通过后，将提交按钮置一个中间状态，然后提交数据到服务器
				 * 		text : 文本内容
				 * 		moodid : 心情id
				 * 		content_id：心情内容id
				 * 成功之后抛出自定义事件，调用success事件
				 * 失败之后使用tipAlert报告错误信息
				 */
				'submitFeed' : function(obj) {
					obj.evt && $.preventDefault(obj.evt);
					try {
						_this.DOM["textEl"][0].blur();
					}catch(e){}
					if (!isSelectMood) {
						showTipAlert($L('#L{请选择心情}'));
						return;
					}
					var feedContent = $.trim(editor.API.getWords() || '');
					if (!$.trim(feedContent)) {
						$.common.extra.shine(_this.DOM["textEl"][0]);
						return;
					}
					if(submitting) {
						return;						
					}
					submitting = 1;
					var param = {};
					param.text = feedContent;
                    param.moodid = isSelectMood;
					param.content_id = content_id;
					//改按钮为提交中
					changeBtn("loading");
					/*告诉外部bubble不要开启body click冒泡*/
					stopClose();
					addTrans = $.common.trans.mood.getTrans('publish', {
						'onComplete' : function(ret , data) {
							var bigObj =  {
								onSuccess : function(json) {
									submitting = 0;
									//改按钮为发布心情
									changeBtn("normal");
									$.custEvent.fire(that, "success", json);
									/*告诉外部bubble开启body click冒泡*/
									startClose();
								},
								onError : _this.DOM_eventFun.postBubbleError,
								requestAjax : addTrans,
								param : data,
								onRelease : function() {
									submitting = 0;
									changeBtn("normal");
									/*告诉外部bubble开启body click冒泡*/
									startClose();
								}
							};
							//加入验证码检查机制，参见$.common.dialog.validateCode
							validateTool.validateIntercept(ret , data ,bigObj);							
						},
						'onFail' : _this.DOM_eventFun.postBubbleError
					});
					addTrans.request(param);
				},
				/**
				 * 发心情出错后使用tipAlert显示错误信息
				 */
				'postBubbleError' : function(json) {
					submitting = 0;
					//改按钮为发布心情
					changeBtn("normal");
					$.custEvent.fire(that, "error", json);
					//身份验证
					if(json.code == '100003'){
						json['ok'] = function(){startClose()};
						json['cancel'] = function(){startClose()};
						$.common.layer.ioError(json.code,json);
						return;
					}
					showTipAlert((json && json.msg) || $L("#L{发布失败}"));
					/*告诉外部开启body click冒泡*/
					startClose();
				},
				/**
				 * 加载setInterval进行文字字数检测
				 */
				startCountWord : function() {
					countTimer = setInterval(_this.DOM_eventFun.startCountImpl , 200);
				},
				/**
				 * 如果字数不对，就进行截字，并重新赋值给textarea
				 */
				startCountImpl : function() {
					var num = editor.API.count();
					if(num > 130) {
						var content = editor.API.getWords();
						if($.bLength(content) > 260){
							_this.DOM["textEl"][0].value = $.leftB(content, 260);
						}						
					}
				},
				/**
				 * 停止setInterval字数检测
				 */
				stopCountWord : function() {
					clearInterval(countTimer);
				},
				/**
				 * 切换心情信息（"龙蛋信息"和"天气信息"）
				 */
				changeMoodInfo : function(obj) {
					obj.evt && $.preventDefault(obj.evt);
					if(!isTweening) {
						isTweening = 1;
						var el = obj.el;
						var infoNodes = _this.DOM["changeInfo"] , index = 0;
						for(var i = 0 , len = infoNodes.length ; i < len ; i++) {
							if(infoNodes[i] == el) {
								index = i;
								$.addClassName(infoNodes[i] , 'current');
							} else {
								$.removeClassName(infoNodes[i] , 'current');							
							}						
						}
						$.core.ani.tween(_this.DOM["moodInfoSlider"][0] , {
							duration : 300,
							end : function() {
								isTweening = 0;
							}
						}).play({'marginLeft':-324 * index}).destroy();	
					}
				},
				/**
				 * 换一换，用来更换心情图标
				 */
				changeMoodGroup : function(obj) {
					obj.evt && $.preventDefault(obj.evt);
					var nodesArr = _this.DOM["moodGroup"];
					moodGroupIndex ++;
					if(moodGroupIndex == nodesArr.length) {
						moodGroupIndex = 0;						
					}
					for(var i = 0 , len = nodesArr.length ; i < len ; i++) {
						if(moodGroupIndex == i) {
							$.setStyle(nodesArr[i] , "display" , '');							
						} else {
							$.setStyle(nodesArr[i] , "display" , 'none');
						}
					}
					//当前切换到显示状态的心情分组点击第一个
					moodGroupClickIndex(moodGroupIndex);
				}
			}
		};
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
		};
		//-------------------------------------------

		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
		};
		//-------------------------------------------------

		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {
		};
		//-------------------------------------------
		//---组件的初始化方法定义区-------------------------
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function() {
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
			//输入框获取焦点
			setTimeout(function() {
				try {
					editor.API.focus();
				} catch(e){}
			} , 100);
		};
		//-------------------------------------------

		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			if (!node) {
				throw 'node 没有定义';
			}
		};
		/**
		 * 使用tipAlert显示msg
		 */
		var showTipAlert = function(msg) {
			var el = _this.DOM.postFeed[0];
			if(el) {
				var tipAlert = $.ui.tipAlert({
					showCallback: function() {
						setTimeout(function() {
							tipAlert && tipAlert.anihide();
						}, 600);
					},
					hideCallback: function() {
						tipAlert && tipAlert.destroy();
						tipAlert = undefined;
					},
					msg: msg,
					type: "error"
				});
				tipAlert.setLayerXY(el);
				tipAlert.aniShow();
			}		
		};
		//-------------------------------------------

		//---Dom的获取方法定义区---------------------------
		/**
		 * 进行nodes的build操作，并对moodid和content_id进行赋值
		 */
		var parseDOM = function() {
			_this.DOM = $.builder(node).list;
			if(_this.DOM.moodList && _this.DOM.moodList.length) {
				var jsonO = $.queryToJson(_this.DOM.moodList[0].getAttribute("action-data"));
				isSelectMood = jsonO.moodid;
				content_id =  jsonO.content_id;
				/**
				 * cache mood content 
				 **/
				lastMoodText = jsonO.content;
			}
			/*
			var smileyBtn = $.insertHTML(_this.DOM.textEl[0] , "<a href='javascript:void(0)' node-type='smileyBtn'>表情</a>" , "beforebegin");
			_this.DOM.smileyBtn = [smileyBtn];
			*/
		};
		//-------------------------------------------
		//---模块的初始化方法定义区-------------------------
		/**
		 * 进行代理事件绑定
		 * 实例化发布器
		 */
		var initPlugins = function() {
			DEvent = $.delegatedEvent(node);
			DEvent.add('moodSelect', 'click', _this.DOM_eventFun.moodSelectChange);
			DEvent.add('moodSelect' , 'mouseover' , _this.DOM_eventFun.itemMouseover);
			DEvent.add('moodSelect' , 'mouseout' , _this.DOM_eventFun.itemMouseout);
			DEvent.add('postFeed', 'click', _this.DOM_eventFun.submitFeed);
			DEvent.add('changeInfo' , 'click' , _this.DOM_eventFun.changeMoodInfo);
			DEvent.add('changeMoodGroup' , 'click' , _this.DOM_eventFun.changeMoodGroup);
			$.custEvent.define(that, ["success","error","faceShow","faceHide"]);
			editor = $.common.editor.base(node, option);
			if(_this.DOM["smileyBtn"] && _this.DOM["smileyBtn"].length) {
				//添加表情插件
				var face = $.common.editor.widget.face();
				editor.widget(face , 'smileyBtn');
				$.custEvent.add(face, 'show', function() {
					//告诉外层气泡停止bodyClick
					$.custEvent.fire(that , "faceShow" , {});	
				});
				$.custEvent.add(face, 'hide', function() {
					//告诉外层气泡开启bodyClick
					$.custEvent.fire(that , "faceHide" , {});
				});
				_this.DOM.textEl[0].setAttribute("range" , lastMoodText.length + "&0");									
			}
		};
		//-------------------------------------------

		//---DOM事件绑定方法定义区-------------------------
		/**
		 * 进行focus的setInterval，blur的clearInterval检测字符数
		 * 使用hotKey绑定输入ctrl+enter的时候进行提交
		 */
		var bindDOM = function() {
			 $.hotKey.add(_this.DOM["textEl"][0], "ctrl+enter", _this.DOM_eventFun.submitFeed);
			 //focus的时候开始截字
			 $.addEvent(_this.DOM["textEl"][0] , "focus" , _this.DOM_eventFun.startCountWord);
			 //blur的时候停止截字
			 $.addEvent(_this.DOM["textEl"][0] , "blur" , _this.DOM_eventFun.stopCountWord);
			 $.addEvent(_this.DOM["textEl"][0] , "blur" , _this.DOM_eventFun.insertDefault);
		};
		//-------------------------------------------

		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {

		};
		//-------------------------------------------

		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {
		};
		//-------------------------------------------

		//---组件公开方法的定义区---------------------------
		/**
		 * 组件的销毁方法，供外部调用
		 * @method destroy
		 */
		var destroy = function() {
			DEvent.destroy();
			DEvent = null;
			$.custEvent.undefine(that);
			$.hotKey.remove(_this.DOM["textEl"][0], "ctrl+enter", _this.DOM_eventFun.submitFeed);
			validateTool && validateTool.destroy && validateTool.destroy();
			$.removeEvent(_this.DOM["textEl"][0] , "focus" , _this.DOM_eventFun.startCountWord);
			 //blur的时候停止截字
		    $.removeEvent(_this.DOM["textEl"][0] , "blur" , _this.DOM_eventFun.stopCountWord);
		    $.removeEvent(_this.DOM["textEl"][0] , "blur" , _this.DOM_eventFun.insertDefault);
		};
		var reset = function() {
			//将输入框置入焦点到最后
			setTimeout(function() {
				try {
					editor.API.focus();	
				} catch(e){}
			} , 100);
			/*
			//先看是不是龙蛋，不是龙蛋的时候走默认，是龙蛋走龙蛋
			if(_this.DOM.moodGroup &&  _this.DOM.moodGroup.length) {
				moodGroupClickIndex(moodGroupIndex);
			} else if(_this.DOM.moodList && _this.DOM.moodList.length) {
				var jsonO = $.queryToJson(_this.DOM.moodList[0].getAttribute("action-data"));
				var el = _this.DOM.moodList[0];
				_this.DOM_eventFun.moodSelectChange({
					el : el , 
					data : jsonO
				});
			}
			*/
		};
		//-------------------------------------------

		//---执行初始化---------------------------------
		init();
		//-------------------------------------------

		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		/**
		 * 添加获取dom节点的方法，供外部调用
		 */
		that.getDom = function() {
			return _this.DOM;		
		};
		that.reset = reset;
		//-------------------------------------------

		return that;
	};
});
