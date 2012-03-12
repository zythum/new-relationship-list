/**
 * 调整分组顺序
 * @author yadong
 * @created 2011.04.25
 */
$Import('module.layer');
$Import('ui.dialog');
$Import('kit.extra.language');
$Import("common.trans.group");
$Import("ui.alert");
$Import('common.channel.feed');
$Import('ui.litePrompt');
STK.register('common.dialog.groupOrder', function($) {
	var that = {
		orderGroupLayer: {}
	};
	var NUM = 4;
	var orderup;
	var orderdown;
	var group_ul;
	var group_ul_lists;
	var orderId = [];
	var selected;
	var orderGroupDom, dialog, delegate;
	var next, prev, selectedLi;
	var ul_olists;
	var len;
	var trans = $.common.trans.group;
	var lang = $.kit.extra.language;
	var json;
	var template = '<div class="order_group" node-type="outer">' +
	'<p class="tit W_textb">' +
	lang('#L{首页分组预览}') +
	'</p>' +
	'<div class="tab_c W_textb preview">' +
	'<p node-type="inner"></p>' +
	'</div>' +
	'<p class="tit W_textb" node-type="mpop_ul_frititle">' +
	lang('#L{分组名}') +
	'</p>' +
	'<div class="orderby clearfix">' +
	'<!--顺序列表-->' +
	'<ul class="orderlist" node-type="groupbox">' +
	'<li class="current"><a href="" class="W_texta">' +
	lang('#L{更多}') +
	'</a></li>' +
	'</ul>' +
	'<!--/顺序列表-->' +
	'<div class="orderbtn">' +
	'<a href="javascript:void(0);" action-type="orderup" node-type="orderup" node class="W_btn_a W_btn_a_disable"><span><em class="ico_up"></em>' +
	lang('#L{上移}') +
	'</span></a>' +
	'<a href="javascript:void(0);" action-type="orderdown" node-type="orderdown" class="W_btn_a W_btn_a_disable"><span><em class="ico_down"></em>' +
	lang('#L{下移}') +
	'</span></a>' +
	'</div>' +
	'</div>' +
	'<div class="btn" node-type="mpop_p_btn"><a class="W_btn_b" href="javascript:void(0);" action-type="save"><span>' +lang('#L{确定}')+'</span></a><a class="W_btn_a" href="javascript:void(0);" action-type="cancel"><span>' +
	lang('#L{取消}') +
	'</span></a></div>' +
	'</div>';
	/**
	 * 获得第一个节点
	 * @param {Object} n
	 */
	var get_firstchild = function(n) {
		var x = n.firstChild;
		while (x && (x.nodeType != 1 || x.nodeName != "LI")) {
			x = x.nextSibling;
		}
		return x;
	};
	/**
	 * 获得最后一个节点
	 * @param {Object} n
	 */
	var get_lastchild = function(n) {
		var x = n.lastChild;
		while (x && (x.nodeType != 1 || x.nodeName != "LI")) {
			x = x.previousSibling;
		}
		return x;
	};
	var _fixEvent = function(event) {
		//from jquery
		event = event || window.event;
		if (!event.target) {
			event.target = event.srcElement || document;
		}
		if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
			event.which = event.charCode || event.keyCode;
		}
		if (!event.which && event.button !== undefined) {
			event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
		}

		if (event.pageX == null && event.clientX != null) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
		}
		return event;
	};
	//todo 改用Core.Dom.contains
	var _wantedTarget = function(tag, node) {
		while (tag) {
			if (tag.parentNode === node) {
				return tag;
			}
			tag = tag.parentNode;
		}
		return null;
	};
	var tmpdiv = document.createElement("div");
	tmpdiv.style.cssText = "cursor:move; height:3px; background-color:#36f;display:none;overflow:hidden";
	var Mouse = function() {
		this.initialize.apply(this, arguments);
	};
	Mouse.prototype = {
		//初始化
		initialize: function() {
			var _this = this;
			this._mouseStarted = false;
			var mouseDownFunc = function(event) {
				event = _fixEvent(event);
				_this.mouseDown(event); //传入经过fix的event
			};
			$.core.evt.addEvent(document, "mousedown", mouseDownFunc);
		},
		//鼠标按下
		mouseDown: function(event) {
			var _this = this;
			//不是想要的鼠标点击，取消
			this.cancel = !this.mouseCapture(event);
			if (this.cancel) {
				return false;
			}
			this.mouseStart(event);
			this.mouseMoveFunc = function(event) {
				_this.mouseDrag(event);
			};
			this.mouseUpFunc = function(event) {
				_this.mouseUp(event);
			};
			$.core.evt.addEvent(document, "mousemove", _this.mouseMoveFunc);
			$.core.evt.addEvent(document, "mouseup", _this.mouseUpFunc);

		},
		mouseDrag: function(event) {
			event = _fixEvent(event);
			if (this._mouseStarted) {
				this.mouseMove(event);
			}
			if (this.moveDistance(event)) {
				this._mouseStarted = true;
			}
		},
		//鼠标放开
		mouseUp: function(event) {
			if (this.cancel) {
				return false;
			}
			var _this = this;
			$.core.evt.removeEvent(document, "mousemove", _this.mouseMoveFunc);
			$.core.evt.removeEvent(document, "mouseup", _this.mouseUpFunc);
			this._mouseStarted = false;
			this.mouseStop(event);
		},
		// 对外接口
		mouseStart: function(event) {
			return true;
		},
		mouseMove: function(event) {
		},
		mouseStop: function(event) {
		},
		mouseCapture: function(event) {
			return true;
		},
		moveDistance: function(event) {
			return true;
		}
	};
	var parseDOM = function(temp) {
		orderGroupDom = $.module.layer(temp);
	};
	var bindDOMFuns = {
		"cancel": function(spec) {
			dialog.hide();
		},
		"save": function(spec) {
			orderId = [];
			for (var i = 0, len = json.length; i < len; i++) {
				orderId.push(json[i].gid);
			}
			trans.getTrans('order', {
				'onSuccess': function(ret, params) {
					dialog.hide();
					$.ui.litePrompt(lang('#L{操作成功}'),{'type':'succM','timeout':'500','hideCallback':function(){
						$.common.channel.feed.fire('refresh');
					}});
				},
				'onError': function(ret, params) {
					var msg = ret.msg || lang('#L{操作失败}' );
					$.ui.alert(msg);
				},
				'onFail': function(ret, params) {
					var msg = ret.msg ||lang('#L{操作失败}' );
					$.ui.alert(msg);
				}
			}).request({
				"gids": orderId.join(",")
			});
		},
		"up": function(spec) { //移动顺序
			if (!selected) {
				return;
			}
			selectedLi = selected.parentNode;
			prev = $.core.dom.prev(selectedLi, "");
			while (prev && prev.nodeName != "LI") {
				prev = $.core.dom.prev(prev, "");
			}
			if (!$.core.dom.hasClassName(spec.el, "W_btn_a_disable")) {
				moveNode(selectedLi, prev);
			}
			return false;
		},
		"down": function(spec) {
			if (!selected) {
				return;
			}
			selectedLi = selected.parentNode;
			next = $.core.dom.next(selectedLi, "");
			while (next && next.nodeName != "LI") {
				next = $.core.dom.next(next, "");
			}
			if (!$.core.dom.hasClassName(spec.el, "W_btn_a_disable")) {
				moveNode(selectedLi, next, true);
			}
			return false;
		}
	};
	/**
	 * 绑定事件
	 */
	var bindDOMS = function() {
		delegate = $.core.evt.delegatedEvent(orderGroupDom.getOuter());
		delegate.add('orderup', 'click', bindDOMFuns.up);
		delegate.add('orderdown', 'click', bindDOMFuns.down);
		delegate.add('save', 'click', bindDOMFuns.save);
		delegate.add('cancel', 'click', bindDOMFuns.cancel);
	};
	/**
	 * 进行页面拼装
	 * @param {Object} data
	 */
	var makeHtml = function(data) {
		var lis = "";
		var divs = "";
		for (var i = 0, len = data.length; i < len; i++) {
			lis += '<li _index=' + i + '><a  href="javascript:void(0)">' + data[i].gname + '</a></li>';
		}
        var tlength =  data.length >= NUM  ? NUM : data.length;
		for (var j = 0; j<tlength; j++) {
			data[j].gname = $.core.str.leftB(data[j].gname,8);
			divs += '<a style="text-decoration:none">' + data[j].gname + '</a><em class="W_vline">|</em>';
		}
		orderGroupDom.getDomList().groupbox[0].innerHTML = lis;
		orderGroupDom.getDomList().inner[0].innerHTML = '<a class="current W_texta" href="javascript:void(0);">'+lang('#L{全部}')+'</a><em class="W_vline">|</em>' + divs + '<a style="text-decoration:none">更多</a>';
	};
	/**
	 * 改变顺序
	 * @param {Object} o
	 * @param {Object} d
	 */
	var changeMouseOrder = function(o, d) {
		var lis = group_ul.getElementsByTagName("li");
		var orlis = ul_olists.getElementsByTagName("a");
		var oi = 0 | o.getAttribute("_index"), di;
		if (d) {
			di = d && 0 | d.getAttribute("_index");
		} else {
			di = -1; //插到首位置特殊处理
		}
		var joi = json[oi];
		if (oi < di) {
			json.splice(di + 1, 0, joi);
			json.splice(oi, 1);
		} else if (oi > di) {
			json.splice(oi, 1);
			json.splice(di + 1, 0, joi);
		} else {
			return;
		}

		for (var i = 0, len = lis.length; i < len; i++) {
			if (i < 4) {
				var temp = json[i].value2 || json[i].gname;
				orlis[i + 1].innerHTML = $.core.str.leftB(temp, 8);
			} else {
			}
			lis[i].setAttribute("_index", i);
			lis[i].getElementsByTagName("a")[0].style.cursor = "";

		}
	};
	/**
	 * 从接口读取数据
	 */
	var getData = function() {
		bindDOMS();
		trans.getTrans('list', {
			'onSuccess': function(ret, params) {
				json = ret.data;
				makeHtml(json);
				orderup = orderGroupDom.getDomList().orderup[0]; //取消
				orderdown = orderGroupDom.getDomList().orderdown[0];
				group_ul = orderGroupDom.getDomList().groupbox[0];//ul
				group_ul_lists = group_ul.getElementsByTagName("a");
				len = group_ul_lists.length;
				group_ul.id = "group_" + $.core.dom.uniqueID(group_ul);
				selected = $.core.dom.sizzle(".current", $.core.dom.sizzle("#" + group_ul.id));
				ul_olists = orderGroupDom.getInner();
				var mouseorder = new Mouse(), destag, thisTag, firstFlag, taga, tagli = null;
				var mpop_ul_frititle = orderGroupDom.getDomList().mpop_ul_frititle[0], mpop_p_btn = orderGroupDom.getDomList().mpop_p_btn[0];
				mouseorder.mouseCapture = function(event) {
					var _tag = _wantedTarget(event.target, group_ul);
					return event.which === 1 && _tag && (_tag.nodeName === "LI");
				};
				mouseorder.mouseStart = function(event) {
					this.pageY = event.pageY;
					thisTag = event.target;
					if(thisTag.nodeName == 'LI') {
						thisTag = thisTag.childNodes[0]
					}
					while (thisTag.nodeName != "A") {
						thisTag = thisTag.parentNode;
					}
					thisTag.className = "drag";
					thisTag.ondragstart = function() {
						return false;
					};
				};
				mouseorder.moveDistance = function(event) {
					return (Math.abs(event.pageY - this.pageY)) > 2; //只有竖向移动距离大于2PX，才执行mouseMove方法
				};
				mouseorder.mouseMove = function(event) {
					if (event.target === tmpdiv) { //鼠标移动到插入的tmpdiv（小蓝条）
						return;
					}
					tagli = _wantedTarget(event.target, group_ul); //当前鼠标所在的LI ，让事件冒泡到LI上方便统一处理
					if (tagli) {
						if (firstFlag || destag != tagli) { //上一次的鼠标停留位置和现在不同
							taga = tagli.getElementsByTagName("a")[0];
							if (taga.style.cursor == "") {
								taga.style.cursor = "move";
							}
							firstFlag = false;
							tmpdiv.style.display = "";
							destag = tagli; //目的LI
							$.core.dom.insertAfter(tmpdiv, destag);
						}

					} else { //鼠标移出UL;
						if (destag === get_firstchild(group_ul)) { //前一个目标节点是首节点
							firstFlag = true;
							group_ul.insertBefore(tmpdiv, destag);
						}
						if (parseInt($.core.dom.position(group_ul).t) > parseInt(getEventXY(event).y)) {
							group_ul.scrollTop -= 10;
						} else if (parseInt($.core.dom.position(group_ul).t + group_ul.offsetHeight) < parseInt(getEventXY(event).y)) {
							group_ul.scrollTop += 10;
						}
					}
				};
				function getEventXY(event) {
					return {
						"x": event.pageX ||
						(event.clientX +
							(document.documentElement.scrollLeft || document.body.scrollLeft)),
						"y": event.pageY ||
						(event.clientY +
							(document.documentElement.scrollTop || document.body.scrollTop))
					};
				}

				mouseorder.mouseStop = function(event) {
					tmpdiv.style.display = "none";
					if (destag) { //有拖动
						//拖动时已经有选中的
						if (selected && selected.parentNode) {
							selected.parentNode.className = "";
						}
						//                thisTag.className = "current";
						selectedLi = thisTag.parentNode;
						selectedLi.className = "current";
						selected = thisTag;
						if (firstFlag) {
							group_ul.insertBefore(thisTag.parentNode, get_firstchild(group_ul));
							changeMouseOrder(thisTag.parentNode);

						} else {
							$.core.dom.insertAfter(thisTag.parentNode, destag);
							changeMouseOrder(thisTag.parentNode, destag);

						}
						destag = null;
					} else { //只点击
						if (thisTag == selected) { //点击已经选中的
							selected = null;
							thisTag.parentNode.className = "";
							thisTag.className = "";
						} else { //点击未选中的
							selected&&selected.parentNode && (selected.parentNode.className = "");
							selectedLi = thisTag.parentNode;
							selectedLi.className = "current";
							selected = thisTag;
						}
					}

					if (selected === null) {
						$.core.dom.addClassName(orderdown, "W_btn_a_disable");
						$.core.dom.addClassName(orderup, "W_btn_a_disable");
					} else if (selected == group_ul_lists[0]) {
						$.core.dom.addClassName(orderup, "W_btn_a_disable");
						$.core.dom.removeClassName(orderdown, "W_btn_a_disable");
					} else if (selected == group_ul_lists[len - 1]) {
						$.core.dom.removeClassName(orderup, "W_btn_a_disable");
						$.core.dom.addClassName(orderdown, "W_btn_a_disable");
					} else {
						$.core.dom.removeClassName(orderup, "W_btn_a_disable");
						$.core.dom.removeClassName(orderdown, "W_btn_a_disable");
					}
				};
			},
			'onError': function(ret, params) {
			},
			'onFail': function(ret, params) {
			}
		}).request();
	};
	/**
	 * 移动节点
	 * @param direction	   方向
	 * @param selectedNode
	 * @param toAppendNode
	 */
	//todo css 和 js 解耦
	var moveNode = function(selectedNode, toAppendNode, direction) {
		//direction判断方向
		if (direction) { //向后加
			$.core.dom.insertAfter(selectedNode, toAppendNode);
		} else { //向前加
			group_ul.insertBefore(selectedNode, toAppendNode);
		}
		if (selectedNode === get_firstchild(group_ul)) { //移到第一个节点
			$.core.dom.addClassName(orderup, "W_btn_a_disable");
			$.core.dom.removeClassName(orderdown, "W_btn_a_disable");
		} else if (selectedNode === get_lastchild(group_ul)) { //移到最后一个节点
			$.core.dom.addClassName(orderdown, "W_btn_a_disable");
			$.core.dom.removeClassName(orderup, "W_btn_a_disable");
		} else {
			$.core.dom.removeClassName(orderdown, "W_btn_a_disable");
			$.core.dom.removeClassName(orderup, "W_btn_a_disable");
		}
		moveOverFunc(selectedNode, toAppendNode);
	};
	var moveOverFunc = function(o, d) {
		o.getElementsByTagName("a")[0].focus();
		var oi = o.getAttribute("_index");
		var di = d.getAttribute("_index");
		var gname,gnameb;;
		oi = window.parseInt(oi);
		di = window.parseInt(di);
		o.setAttribute("_index", di);
		d.setAttribute("_index", oi);

		if (di < 4 && oi > 3) {
			gname =  json[oi].value2 || json[oi].gname;
			ul_olists.getElementsByTagName("a")[di + 1].innerHTML = $.core.str.leftB(gname,8);
		} else if (oi < 4 && di > 3) {
			gname = json[di].value2 || json[di].gname
			ul_olists.getElementsByTagName("a")[oi + 1].innerHTML = $.core.str.leftB(gname,8);
		} else if (di < 4 && oi < 4) {
			gname =  json[di].value2 || json[di].gname;
			gnameb =  json[oi].value2 || json[oi].gname;
			ul_olists.getElementsByTagName("a")[oi + 1].innerHTML = $.core.str.leftB(gname,8);
			ul_olists.getElementsByTagName("a")[di + 1].innerHTML = $.core.str.leftB(gnameb,8);
		}
		var tmp = json[di];
		json[di] = json[oi];
		json[oi] = tmp;
	};
	var orderGroupLayer = {
		"init": function(temp) {
			parseDOM(temp);
		},
		"show": function(spec) {
			var defaults = {
				title: lang('#L{调整分组顺序}')
			};
			var opts = $.core.obj.parseParam(defaults, spec);
			this.init(template);
			dialog = $.ui.dialog();
			dialog.setTitle(opts.title);
			dialog.appendChild(orderGroupDom.getOuter());
			delegate = $.core.evt.delegatedEvent(orderGroupDom.getOuter());
			dialog.show();
			dialog.setMiddle();
			getData();
		},
		"hidden": function() {
			dialog.hide();
		}
	};
	that.orderGroupLayer = orderGroupLayer;
	return that.orderGroupLayer;
});
