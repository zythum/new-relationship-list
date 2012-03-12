/**
 * 快捷键操作对象
 * 说明：可打印字符键：除了Esc、F1-12、Tab、 CapsLock、Shift、Ctrl、{开始键}、{菜单键}
 * 		、Alt、Backspace、PrintScreen、ScrollLock、Pause、Insert、 Home、PageUp、
 * 		Delete、End、PageDown、NumLock和方向键（Left、Up、Right、Down）外的所有键;
 * 		键值范围: 13回车 32 - 126
 * 连续键、控制组合键、单键在keydown事件的互斥触发：优先级(连续键>控制组合键>单键)
 * 当当前键盘操作结果为 (可触发连续键或可做为触发连续键的必要条件) 时屏蔽掉 (能够触发的控制组合键和单键);
 * 其他类推.
 * 
 * @id STK.core.evt.hotKey
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @version 1.0
 * @import STK.core.evt.addEvent
 * @import STK.core.evt.removeEvent
 * @import STK.core.dom.isNode
 * @import STK.core.str.trim
 * @import STK.core.arr.isArray
 * @import STK.core.dom.uniqueID
 */

$Import('core.evt.addEvent');
$Import('core.evt.removeEvent');
$Import('core.dom.isNode');
$Import('core.str.trim');
$Import('core.arr.isArray');
$Import('core.func.getType');
$Import('core.dom.uniqueID');

STK.register('core.evt.hotKey', function($) {
	
	var $uniqueID = $.core.dom.uniqueID;
	
	var F = {
		reg1: /^keypress|keydown|keyup$/
		//特殊键的对照
		,keyMap: { 27: 'esc', 9: 'tab', 32:'space', 13: 'enter', 8:'backspace', 145: 'scrollclock', 
            20: 'capslock', 144: 'numlock', 19:'pause', 45:'insert', 36:'home', 46:'delete',
            35:'end', 33: 'pageup', 34:'pagedown', 37:'left', 38:'up', 39:'right',40:'down', 
            112:'f1',113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 
            120:'f9', 121:'f10', 122:'f11', 123:'f12', 191: '/', 17:'ctrl', 16:'shift',
			109:'-',107:'=',219:'[',221:']',220:'\\',222:'\'',187:'=',188:',',189:'-',190:'.',191:'/',
			96: '0', 97:'1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7',
			104: '8', 105: '9', 106: '*', 110: '.', 111 : '/'}
		//事件组织结构
		,keyEvents: {}
	};
	
	//阻止默认行为
	F.preventDefault = function() {
		//for IE
		this.returnValue = false;
	};
	
	//中间事件处理函数
	F.handler = function(event) {
		event = event || window.event;
		if ( !event.target ) {
			event.target = event.srcElement || document;
		}
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}
		if(!event.preventDefault) event.preventDefault = F.preventDefault;
		
		var uid = $uniqueID(this), uidO, typeO;
		if(uid && (uidO = F.keyEvents[uid]) && (typeO = uidO[event.type])) {
			var _key;
			switch(event.type) {
				case 'keypress':
					if(event.ctrlKey || event.altKey) return;
					if(event.which == 13) _key = F.keyMap[13];
					if(event.which == 32) _key = F.keyMap[32];
					if(event.which >= 33 && event.which <= 126) _key = String.fromCharCode(event.which);
					break;
				case 'keyup':
				case 'keydown':
					//特殊情况下
					if (F.keyMap[event.which]) {
						_key = F.keyMap[event.which];
					}
					//数字和大写字母键情况下
					if(!_key) {
						if((event.which >= 48 && event.which <= 57)) {//数字
							_key = String.fromCharCode(event.which);
						} else if((event.which >= 65 && event.which <= 90)) {//大写字母 时关联到其小写
							_key = String.fromCharCode(event.which + 32);
						}
					}
					if(_key && event.type == "keydown") {//处理组合键和连续键
						uidO.linkedKey += uidO.linkedKey ? (">" + _key):_key;
						if (event.altKey) _key = "alt+" + _key;
						if (event.shiftKey) _key = "shift+" + _key;
						if (event.ctrlKey) _key = "ctrl+" + _key;
					}
					break;
			}
			var _isInput = /^select|textarea|input$/.test(event.target.nodeName.toLowerCase());
			//从dom事件快捷键列表中回调
			if (_key) {
				var _fns = [], _shield = false;
				if(uidO.linkedKey && uidO.linkKeyStr) {
					if (uidO.linkKeyStr.indexOf(" " + uidO.linkedKey) != -1) {
						if(uidO.linkKeyStr.indexOf(" " + uidO.linkedKey + " ") != -1) {
							_fns = _fns.concat(typeO[uidO.linkedKey]);
							uidO.linkedKey = "";
						}
						_shield = true;
					} else {
						uidO.linkedKey = "";
					}
				}
				if(!_shield) _fns = _fns.concat(typeO[_key]);
				for (var i = 0; i < _fns.length; i++) {
					if(_fns[i] && (!_fns[i].disableInInput || !_isInput))_fns[i].fn.apply(this, [event, _fns[i].key]);
				}
			}
		}
	};
	
	/**
	 * 检验并统一绑定和解绑的参数
	 */
	var checkArgs = function(node, keys, fn, opt) {
		var ret = {};
		//对节点和处理函数验证
		if (!$.core.dom.isNode(node) || $.core.func.getType(fn) !== "function") {
			return ret;
		}
		if(typeof keys !== "string" || !(keys = keys.replace(/\s*/g, ""))) {
			return ret;
		}
		
		if(!opt) opt = {};
		if(!opt.disableInInput) opt.disableInInput = false;
		if(!opt.type) opt.type = 'keypress';
		opt.type = opt.type.replace(/\s*/g, "");
		if(!F.reg1.test(opt.type) || (opt.disableInInput && /^select|textarea|input$/.test(node.nodeName.toLowerCase()))) {
			return ret;
		}
		//当为特殊键、组合键、连续键时把客户键转换成小写
		if(keys.length > 1 || opt.type != "keypress") keys = keys.toLowerCase();
		if(!/(^(\+|>)$)|(^([^\+>]+)$)/.test(keys)) {
			var newKeys = "";
			if(/((ctrl)|(shift)|(alt))\+(\+|([^\+]+))$/.test(keys)) { //2.组合键 将控制键排序 ctrl shift alt
				if(keys.indexOf("ctrl+") != -1) newKeys += "ctr+";
				if(keys.indexOf("shift+") != -1) newKeys += "shift+";
				if(keys.indexOf("alt+") != -1) newKeys += "alt+";
				newKeys += keys.match(/\+(([^\+]+)|(\+))$/)[1];
			} else if(!/(^>)|(>$)|>>/.test(keys) && keys.length > 2) { //3.连续键 
				ret.linkFlag = true;
			} else {
				return ret;
			}
			opt.type = "keydown";
		}//1.单个键
		ret.keys = keys;
		ret.fn = fn;
		ret.opt = opt;
		return ret;
	}
	
	var that = {
		/** 
		 * 添加快捷键
		 * @method add
		 * @public 
		 * @static
		 * @param {Node} node 节点
		 * @param {String/Array} keys 
		 * 		按键组合 如:ctrl+9或A
		 * 		单个键说明: 当opt.type为keypress时区分英文字母大小写，
		 * 				   区分上下键如+=是不同的键；并且只能处理可打印字符；
		 * 				  当opt.type为keydown或keyup时所有字符强制转换成小写;有上下关联的键只能使用下键.
		 * 		组合键说明:（ctrl、shift、alt 不区分组合顺序即：ctrl+shift+alt <=> shift+ctrl+alt）
		 * 		加单个键的组合，注：所有字符强制转换成小写,有上下关联的键只能使用下键.
		 * 		连续键说明: 键用>号隔开如a>ctrl；注: 所有字符强制转换成小写；有上下关联的键只能使用下键; 
		 * 		同一节点上:如果一个连续键左边的部分内容与另一个连续键相同，则该连续键将被屏蔽,即：同时绑定g>h和g>h>i 将只会触发g>h;
		 * 
		 * @param {Function} fn 
		 * 		事件处理函数
		 * 		事件处理函数回调说明：
		 * 	    fn = function(event,key) {
		 * 			event的说明
		 * 				which: 键值
		 * 				target: 事件源
		 * 				type: 事件类型
		 * 				preventDefault(): 阻止默认行为方法
		 * 			key的说明: 快捷键的组合(小写)
		 * 		}
		 * @param {Object} opt 
		 * 		选项 
		 * 		{
		 * 			disableInInput:false //Boolean true：当焦点为input textarea时事件无效 false：反之
		 * 			,type:'keypress'//设置单个键时的事件类型(keydown,keypress,keyup只选其一,默认为keypress);注：该值只在单个键的事件绑定时有效 
		 * 		}
		 * @return {undefined}
		 * @example 
		 * 	    var f1 = function(event, key) {
		 * 	    	console.log(event.type + " " + key);
		 * 	    	event.preventDefault();//阻止默认行为
		 * 	    };
		 * 	    STK.core.evt.hotKey.add(document.body, ["0","ctrl+9"], f1);
		 */
		add: function(node, keys, fn, opt) {
			//当为快捷键列表时 逐个元素进行处理
			if($.core.arr.isArray(keys)) {
				for(var i = 0; i < keys.length; i++) {
					that.add(node, keys[i], fn, opt);
				}
				return;
			}
			var newArg = checkArgs(node, keys, fn, opt);
			if(!newArg.keys) return;
			keys = newArg.keys;
			fn = newArg.fn;
			opt = newArg.opt;
			var linkFlag = newArg.linkFlag;
			
			var uid = $uniqueID(node);
			//生成结构
			if(!F.keyEvents[uid]) F.keyEvents[uid] = {linkKeyStr:"", linkedKey:""};
			//包装事件处理函数
			if(!F.keyEvents[uid].handler) {
				F.keyEvents[uid].handler = function() {
					F.handler.apply(node, arguments);
				};
			}
			if(linkFlag && F.keyEvents[uid].linkKeyStr.indexOf(" "+keys + " ") == -1) {
				F.keyEvents[uid].linkKeyStr += " "+keys + " ";
			}
			var _type = opt.type;
			if(!F.keyEvents[uid][_type]) {
				F.keyEvents[uid][_type] = {};
				$.core.evt.addEvent(node, _type, F.keyEvents[uid].handler);
			}
			if(!F.keyEvents[uid][_type][keys]) F.keyEvents[uid][_type][keys] = [];
			F.keyEvents[uid][_type][keys].push({fn:fn, disableInInput:opt.disableInInput, key: keys});
		}
		/** 
		 * 删除快捷键的绑定
		 * @method remove
		 * @public 
		 * @static
		 * @param {Node} node 
		 * @param {String/Array} keys 同add方法的该属性
		 * @param {Function} fn 同add方法的该属性
		 * @param {Object} opt 选项  同add方法的该属性
		 * @example 
		 * 		var f1 = function(event, key) {
		 *			console.log(event.type + " " + key);
		 *	    	event.preventDefault();//阻止转为行为
		 *		};
		 * 		STK.core.evt.hotKey.remove(document.body, ["0","ctrl+9"], f1);
		 * @return {void}
		 */
		,remove: function(node, keys, fn, opt) {
			//当为快捷键列表时 逐个元素进行处理
			if($.core.arr.isArray(keys)) {
				for(var i = 0; i < keys.length; i++) {
					that.remove(node, keys[i], fn, opt);
				}
				return;
			}
			var newArg = checkArgs(node, keys, fn, opt);
			if(!newArg.keys) return;
			keys = newArg.keys;
			fn = newArg.fn;
			opt = newArg.opt;
			linkFlag = newArg.linkFlag;
			
			var uid = $uniqueID(node), uidO, typeO, _fnList;
			var _type = opt.type;
			if(uid && (uidO = F.keyEvents[uid]) && (typeO = uidO[_type]) && uidO.handler && (_fnList = typeO[keys])) {
				for(var i = 0; i < _fnList.length;) {
					if(_fnList[i].fn === fn) {
						_fnList.splice(i, 1);
					} else {
						i++
					}
				}
				if(_fnList.length < 1) {
					delete typeO[keys];
				}
				var _flag = false;
				for(var a in typeO) {
					_flag = true;
					break;
				}
				if(!_flag) {
					$.core.evt.removeEvent(node, _type, uidO.handler);
					delete uidO[_type];
				}
				if (linkFlag && uidO.linkKeyStr) {
					uidO.linkKeyStr = uidO.linkKeyStr.replace(" "+keys + " ", "");
				}
			}
		}
	};
    return that; 
});
