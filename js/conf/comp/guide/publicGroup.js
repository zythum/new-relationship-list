/**
 * 新手引导页
 * @id $.common.guide.guide
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author yadong | yadong2@staff.sina.com.cn
 * @example
 * demo待完善
 */
$Import('kit.dom.parseDOM');
$Import('common.trans.guide');
$Import('ui.alert');
STK.register('comp.guide.publicGroup', function($) {

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	var defaultWinWidth=950;
	var version=$CONFIG["version"];
	return function(node) {
		var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {},pageSize= {},winSize= {};
		var offsetLeft,offsetRight,offsetTop,offsetBottom;
		//add by zhaobo 201108101042 REQ-7893
		var v4Btn, v3Btn, lock;
		var stepper=0;
		var trans=$.common.trans.guide;
		//add by lianyi 20110914 12:59 MINIBLOGBUG-25143
		var resizeTimer;
		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM: {},//节点容器
			objs: {},//组件容器
			DOM_eventFun: {//DOM事件行为容器

			}
			//属性方法区

		};
		var posArr=[{
			//升级成功
			"l":287,
			"t":146,
			"w":95,
			"h":25,
			"bg":"http://img.t.sinajs.cn/t4/style/images/guide/guide_bg_followlist_1.png",
			"point": {
				"l":250,
				"t":150,
				"src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_followlist_1-1.png",
				"ie6src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_followlist_1-1.png"
			},
			"backCoords":"0,0,0,0",
			"coords":"189,144,292,193"
		},{
			//搜索
			"l":633,
			"t":115,
			"w":80,
			"h":24,
			"bg":"http://img.t.sinajs.cn/t4/style/images/guide/guide_bg_followlist_1.png",
			"point": {
				"l":585,
				"t":120,
				"src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_followlist_1-2.png",
				"ie6src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_followlist_1-2.png"
			},
			"backCoords":"0,0,0,0",
			"coords":"215,160,318,209"
		},
		{
			//私信支持图片和文件
			"l":0,
			"t":0,
			"w":0,
			"h":0,
			"bg":"http://img.t.sinajs.cn/t4/style/images/guide/guide_bg_followlist_1.png",
			"point": {
				"l":178,
				"t":142,
				"src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_followlist_2-1.png",
				"ie6src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_followlist_2-1.png"
			},
			"backCoords":"0,273,51,324",
			"coords":"552,274,603,324"
		},{
			//微博精选
			"l":0,
			"t":0,
			"w":0,
			"h":0,
			"bg":"http://img.t.sinajs.cn/t4/style/images/guide/guide_bg_1.png",
			"point": {
				"l":178,
				"t":142,
				"src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_pop_4.png",
				"ie6src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_pop_4.gif"
			},
			"backCoords":"0,273,51,324",
			"coords":"552,274,603,324"	
		},
		{
			//选择版本
			"l":900,
			"t":0,
			"w":55,
			"h":34,
			"bg":"http://img.t.sinajs.cn/t4/style/images/guide/guide_bg_1.png",
			"point": {
				"l":178,
				"t":46,
				"src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_pop_5.png",
				"ie6src":"http://img.t.sinajs.cn/t4/style/images/guide/guide_pop_5.gif"
			},
			"backCoords":"0,368,51,420",
			"coords":"0,0,0,0"

		}];
		//----------------------------------------------

		//+++ 参数的验证方法定义区 ++++++++++++++++++
		argsCheck = function() {
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		//-------------------------------------------

		//+++ Dom的获取方法定义区 ++++++++++++++++++
		parseDOM = function() {
			//内部dom节点
			var backStepBtn = $.C("area");
			backStepBtn.href = "javascript:void(0);";
			backStepBtn.shape = "rect";
			backStepBtn.coords = '0,0,0,0';
			backStepBtn.setAttribute('node-type','backStep');
			$.sizzle('[node-type=goStep]', node)[0].parentNode.appendChild(backStepBtn);

			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if(!1) {
				throw new Error('必需的节点 不存在');
			}

		};
		//-------------------------------------------

		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		initPlugins = function() {
			setTimeout( function() {
				_this.DOM["loadingPic"].style.display="none";
				_this.DOM["pointPic"].style.display="block";
				_this.DOM["mask_tb"].style.display="block";
				_this.DOM["td_m_1"].className = 'no_trans';
				setHighLight(stepper);
			},500);
		};
		function ignoreNegative(num) {
			return num < 0 ? 0 : num; 
		}
		function setHighLight(num) {
			resizeWindow();
			var offWidth;
			if(winSize.width-defaultWinWidth > 0) {
				offsetLeft = Math.ceil((winSize.width-defaultWinWidth)/2+posArr[num].l);
				offWidth = posArr[num].w;
				offsetRight= winSize.width-(offsetLeft+posArr[num].w);
			} else {
				offsetLeft= posArr[num].l;
				offWidth = defaultWinWidth - offsetLeft;
				if(offWidth > posArr[num].w) {
					offWidth = posArr[num].w; 					
				}
				offsetRight = defaultWinWidth - (offsetLeft + offWidth);  
			}
			offsetBottom=pageSize.height-posArr[num].t-posArr[num].h;
			offsetTop=posArr[num].t;
			
			try {
				if($.core.util.browser.IE) {
					$.core.dom.setStyles([_this.DOM["td_l_0"],_this.DOM["td_l_1"],_this.DOM["td_l_2"]],"width",ignoreNegative(offsetLeft-1)+"px");
					$.core.dom.setStyles([_this.DOM["td_r_0"],_this.DOM["td_r_1"],_this.DOM["td_r_2"]],"width",ignoreNegative(offsetRight+1)+"px");
					$.core.dom.setStyles([_this.DOM["td_l_0"],_this.DOM["td_m_0"],_this.DOM["td_r_0"]],"height",ignoreNegative(offsetTop)+"px");
					$.core.dom.setStyles([_this.DOM["td_m_0"],_this.DOM["td_m_1"],_this.DOM["td_m_2"]],"width",ignoreNegative(offWidth)+"px");
					$.core.dom.setStyles([_this.DOM["td_l_1"],_this.DOM["td_m_1"],_this.DOM["td_r_1"]],"height",posArr[num].h+"px");
					$.core.dom.setStyles([_this.DOM["td_l_2"],_this.DOM["td_m_2"],_this.DOM["td_r_2"]],"height",ignoreNegative(offsetBottom)+"px");
				} else {
					$.core.dom.setStyles([_this.DOM["td_l_0"],_this.DOM["td_l_1"],_this.DOM["td_l_2"]],"width",ignoreNegative(offsetLeft)+"px");
					$.core.dom.setStyles([_this.DOM["td_r_0"],_this.DOM["td_r_1"],_this.DOM["td_r_2"]],"width",ignoreNegative(offsetRight)+"px");
					$.core.dom.setStyles([_this.DOM["td_l_0"],_this.DOM["td_m_0"],_this.DOM["td_r_0"]],"height",ignoreNegative(offsetTop)+"px");
					$.core.dom.setStyles([_this.DOM["td_m_0"],_this.DOM["td_m_1"],_this.DOM["td_m_2"]],"width",ignoreNegative(offWidth)+"px");
					$.core.dom.setStyles([_this.DOM["td_l_1"],_this.DOM["td_m_1"],_this.DOM["td_r_1"]],"height",posArr[num].h+"px");
					$.core.dom.setStyles([_this.DOM["td_l_2"],_this.DOM["td_m_2"],_this.DOM["td_r_2"]],"height",ignoreNegative(offsetBottom)+"px");
				}

				_this.DOM ["pointPic"].src="";
				_this.DOM ["bgImg"].src=posArr[num].bg+"?version="+version;
				var computeWidth =  winSize.width > defaultWinWidth ? winSize.width - defaultWinWidth : 0;
				$.core.dom.setStyle(_this.DOM["pointPic"],"left",(posArr[num].point.l+ computeWidth / 2) + "px");
				$.core.dom.setStyle(_this.DOM["pointPic"],"top",posArr[num].point.t+"px");
				if(!$.core.util.browser.IE6) {
					_this.DOM["pointPic"].src=posArr[num].point.src+"?version="+version;
					_this.DOM ["bgImg"].src=posArr[num].bg+"?version="+version;
					_this.DOM ["pointPic"].style.visibility='hidden';
					setTimeout(function() {
						_this.DOM ["pointPic"].style.visibility='visible';
					},50);
				} else {
					_this.DOM["pointPic"].src=posArr[num].point.ie6src+"?version="+version;
				}
				_this.DOM["goStep"].coords=posArr[num].coords;
				_this.DOM["backStep"].coords=posArr[num].backCoords;
			} catch(ex) {

			}

		}
		function shwoStep() {
			if(stepper>=posArr.length) {
				lock = true;
				return;
			}
			if(stepper == posArr.length - 1){
				if (!v4Btn) {
					//var coords = ["246,366,263,384", "45,370,62,388"];
					//modify by zhaobo 201108101042 REQ-9049
					//var coords = "240,260,378,450";
					var coords = "370,338,521,371";
					var newVersion = true;
					v4Btn = $.C("area");
					v4Btn.href = "javascript:void(0);";
					v4Btn.shape = "rect";
					v4Btn.coords = coords;
					$.addEvent(v4Btn, "click", function() {
						if(lock) return false;
						newVersion = !newVersion;

						/*var src = !$.core.util.browser.IE6 ? posArr[stepper].point.src : posArr[stepper].point.ie6src;
						src = !newVersion ? src.replace(".png", "_1.png").replace(".gif", "_1.gif") : src;*/

						lock = true;
						trans.getTrans("version", {
							"onSuccess": function(data) {
								lock = false;
							},
							"onError": function(data) {
								lock = false;
								if(data.code === 'A00006'){

									/*v4Btn.coords = coords[newVersion ? 0 : 1];
									_this.DOM["pointPic"].src = src + "?version=" + version;*/
									trans.getTrans("mark", {
										"onSuccess": function(req,param) {
											window.location.href="/"+$CONFIG['domain']+"?afterupgrade=1";
										},
										"onError": function() {}
									}).request();
								}else if (data.msg){
									newVersion = !newVersion;
									$.ui.alert(data.msg);
								}
							}
						}).request({
							version : "4"
						});
					});
				}
				if (!v3Btn) {
					var coords = "90,337,241,372";
					var newVersion = true;
					v3Btn = $.C("area");
					v3Btn.href = "javascript:void(0);";
					v3Btn.shape = "rect";
					v3Btn.coords = coords;
					$.addEvent(v3Btn, "click", function() {
						if(lock) return false;
						newVersion = !newVersion;

						/*var src = !$.core.util.browser.IE6 ? posArr[stepper].point.src : posArr[stepper].point.ie6src;
						src = !newVersion ? src.replace(".png", "_1.png").replace(".gif", "_1.gif") : src;*/

						lock = true;
						trans.getTrans("version", {
							"onSuccess": function(data) {
								lock = false;
							},
							"onError": function(data) {
								lock = false;
								if (data.code === 'A00006') {

									trans.getTrans("mark", {
										"onSuccess": function(req, param) {
											window.location.href="/"+$CONFIG['domain']+"?afterupgrade=1";
										},
										"onError": function() {

										}
									}).request();
								} else if (data.msg) {
									newVersion = !newVersion;
									$.ui.alert(data.msg);
								}
							}
						}).request({version : "3.6"});
					});
				}
				_this.DOM["goStep"].parentNode.appendChild(v3Btn);
				_this.DOM["goStep"].parentNode.appendChild(v4Btn);
			}else{
				if(v4Btn) {
					$.removeNode(v3Btn);
				}
				if(v3Btn) {
					$.removeNode(v4Btn);
				}
			}
			setHighLight(stepper);
		}
		//-------------------------------------------

		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		bindDOM = function() {
			$.addEvent(window,"resize", function() {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					setHighLight(stepper);
				} , 200);
				return false;
			});
			$.addEvent(_this.DOM["goStep"],"click", function() {
				if(lock) return;
				_this.DOM["loadingPic"].style.display="block";
				stepper+=1;
				shwoStep();
				$.core.evt.preventDefault();
			});
			$.addEvent(_this.DOM["backStep"],"click", function() {
				if(lock) return;
				_this.DOM["loadingPic"].style.display="block";
				stepper-=1;
				shwoStep();
				$.core.evt.preventDefault();
			});
			$.addEvent(_this.DOM["pointPic"],"load", function() {
				_this.DOM["loadingPic"].style.display="none";
			});
			$.addEvent(_this.DOM["bgImg"],"load", function() {
				resizeWindow();
			});
		};
		//-------------------------------------------

		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		bindCustEvt = function() {

		};
		//-------------------------------------------

		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		bindListener = function() {

		};
		//-------------------------------------------

		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		destroy = function() {

		};
		//-------------------------------------------

		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		init = function() {
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------
		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------

		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;

		//-------------------------------------------
		function resizeWindow() {
			pageSize=$.core.util.pageSize().page;
			winSize=$.core.util.pageSize().win;
			$.core.dom.setStyle(_this.DOM["mask_tb"],"height",pageSize.height+"px");
			_this.DOM["loadingPic"].style.left=(winSize.width-_this.DOM["loadingPic"].offsetWidth)/2+"px";
			_this.DOM["loadingPic"].style.top=(winSize.height-_this.DOM["loadingPic"].offsetHeight)/2+"px";
			if(winSize.width > defaultWinWidth) {
				_this.DOM["mask_tb"].style.width = '100%';				
			} else {
				_this.DOM["mask_tb"].style.width = defaultWinWidth + 'px';				
			}
		}

		return that;
	};
});