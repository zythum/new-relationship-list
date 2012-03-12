/**
 * 相册
 * @author zhaobo@staff.sina.com.cn
 */

$Import('common.trans.album');
$Import('kit.extra.language');

STK.register('comp.content.album', function($) {
	var lang = $.kit.extra.language;
	var msg = {
		'like' : lang('#L{喜欢}$like$')
	};

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------

	return function(node) {
		var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {}, dEvt, getTrans = $.common.trans.album.getTrans, block = false, bIn, likeLock = false, SHOWDELAY = 300, trans, cache = {};


		//+++ 变量定义区 ++++++++++++++++++
//
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			Utils : {
				/**
				 * 获取弹层应在的位置。
				 * @param el  li节点
				 */
				getLayerPosition : function(el) {
					var pos = $.core.dom.position(el);
					var size = $.core.dom.getSize(el);
					var contentPos = $.core.dom.position(_this.DOM.albumContent);
					return {
						l : pos.l - contentPos.l + size.width / 2 - 10,
						t : pos.t + size.height + 10
					};
				},
				/**
				 *  获取弹层数据
				 * @param obj
				 */
				getData : function(obj) {
					if (obj.data && obj.data.pid && cache[obj.data.pid]) {
						_this.Utils.showDetail(obj.el, cache[obj.data.pid]);
						return;
					}
					trans = getTrans("getDetail", {
						onSuccess: function(json) {
							block = false;
							if (!bIn) return;
							cache[obj.data.pid] = json.data.html;
							_this.Utils.showDetail(obj.el, json.data.html);
							trans = null;
						},
						onFail: function(json) {
							block = false;
							trans = null;
							json && json.msg && $.ui.alert(json.msg);
						},
						onError: function(json) {
							block = false;
							trans = null;
							json && json.msg && $.ui.alert(json.msg);
						}
					});
					trans.request(obj.data);
				},
				/**
				 * 显示弹层
				 * @param {Element} el 目标元素，鼠标指向的li节点
				 * @param {String} html 弹层所需内容字符串
				 */
				showDetail : function(el, html) {
					_this.DOM.albumContent.style.display = "";
					_this.item = el;
					_this.DOM.albumDetail.innerHTML = html;
					var pos = _this.Utils.getLayerPosition(el.parentNode);
					_this.DOM.albumContent.style.top = "92px";
					//add by zhaobo 20110816 弹层微调
					_this.DOM.albumContent.style.marginLeft = "-4px";
					_this.DOM.arrow.style.left = pos.l + "px";
				},
				/**
				 * 关闭弹层
				 */
				hideDetail : function() {
					_this.item = null;
					_this.DOM.albumContent.style.display = "none";
				},
				/**
				 * 停止显示
				 */
				stopShow: function() {
					block = false;
					if (trans) {
						trans.abort();
						trans = null;
					}
					_this.showTimer && clearTimeout(_this.showTimer);
				},
				/**
				 * 停止隐藏
				 */
				stopHide: function() {
					_this.hideTimer && clearTimeout(_this.hideTimer);
				},
				/**
				 * 发布微博
				 */
				publish : function(data) {
					var param = {};
					param.pic_id = data.picid;
					param.text = lang('#L{喜欢} @' + $CONFIG['onick'] + ' #L{的照片}“' + data.albumName + '” ' + data.photoUrl);
					param['style_type'] = 0;
					getTrans("publish", {
						onSuccess: function(ret, params) {
//							触发publish事件，feed插件假写。
//							$.common.channel.feed.fire('publish', [ret['data']['html'], params]);
							$.ui.alert(lang("#L{成功分享到微博}！"), {'icon':'success', timeout : 1000});
							block = false;
						},
						onFail: function(json) {
							block = false;
							json && json.msg && $.ui.alert(json.msg);
						},
						onError: function(json) {
							block = false;
							json && json.msg && $.ui.alert(json.msg);
						}
					}).request(param);
				}
			},
			DOM_eventFun: {//DOM事件行为容器
				/**
				 * 相册缩略图mouseover事件函数。
				 * @param obj
				 */
				msOver : function(obj) {
					bIn = true;
					if (obj.el === _this.item) return;
					if (block) return;
					block = true;
					_this.showTimer = setTimeout(function() {
						_this.Utils.getData(obj);
					}, SHOWDELAY);

				},
				/**
				 * 相册缩略图mouseout事件函数。
				 * @param obj
				 */
				msOut : function(obj) {
					bIn = false;
					_this.Utils.stopShow();
					_this.hideTimer = setTimeout(function() {
						if (bIn) return;
						_this.Utils.hideDetail();
					}, SHOWDELAY);
				},
				/**
				 * 弹层鼠标mouseover事件函数
				 */
				msContentOver : function() {
					bIn = true;
				},
				/**
				 * 弹层鼠标mouseout事件函数
				 */
				msContentOut : function() {
					bIn = false;
					_this.Utils.stopShow();
					_this.hideTimer = setTimeout(function() {
						if (bIn) return;
						_this.Utils.hideDetail();
					}, 10);

				},
				/**
				 * 喜欢事件函数
				 * @param obj
				 */
				likeIt : function(obj) {
					if (likeLock) return;
					likeLock = true;

					getTrans("like", {
						onSuccess: function(json) {
							var count = parseInt(json.data.like_count);
							if (count > 0)obj.el.innerHTML = msg["like"].replace("$like$", "(" + count + ")");
							likeLock = false;
							$.ui.confirm(lang("#L{已喜欢，是否推荐到我的微博}？"), {
								icon : "question",
								OK : function() {
									var data = {};
									data.picid = obj.data.picid;
									data.photoUrl = json.data.photo_link;
									data.albumName = json.data.album_name;
									data.picid = json.data.pid;
									_this.Utils.publish(data);
								}
							});
						},
						onFail: function(json) {
							likeLock = false;
							json && json.msg && $.ui.alert(json.msg);
						},
						onError: function(json) {
							likeLock = false;
							json && json.msg && $.ui.alert(json.msg);
						}
					}).request(obj.data);
					$.preventDefault(obj.evt);
					return false;
				}
			}
			//属性方法区

		};
		//----------------------------------------------


		//+++ 参数的验证方法定义区 ++++++++++++++++++
		argsCheck = function() {
			if (!node) {
				throw new Error('node没有定义');
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		parseDOM = function() {
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if (!1) {
				throw new Error('必需的节点 不存在');
			}
			dEvt = $.delegatedEvent(node);

		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		initPlugins = function() {

		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		bindDOM = function() {
			dEvt.add("showDetail", "mouseover", _this.DOM_eventFun.msOver);
			dEvt.add("showDetail", "mouseout", _this.DOM_eventFun.msOut);
			dEvt.add("albumContent", "mouseover", _this.DOM_eventFun.msContentOver);
			dEvt.add("albumContent", "mouseout", _this.DOM_eventFun.msContentOut);
			dEvt.add("likeIt", "click", _this.DOM_eventFun.likeIt);
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
			dEvt.remove("detail", "mouseover");
			dEvt.remove("detail", "mouseout");
			dEvt.remove("albumContent", "mouseover");
			dEvt.remove("albumContent", "mouseout");
			dEvt.remove("likeIt", "click");
			cache = null;
			if (_this) {
				$.foreach(_this.objs, function(o) {
					if (o.destroy) {
						o.destroy();
					}
				});
				_this = null;
			}
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


		return that;
	};
});