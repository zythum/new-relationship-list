/**
 * node位置固定
 * @id  STK.kit.dom.fix
 * @param {Node} node 要进行位置固定的节点
 * @param {String} type 'c|lt|lb|rt|rb'//类型 c:中心,lt:左上,lb:左下,rt:右上,rb:右下
 * @param {Array} offset 
 * [//相对位置的边距 中心时相对左上
 * 	0,//和边框的横向距离 type == 'c'时无效
 * 	0//和边框的纵向距离 type == 'c'时无效
 * ]
 * @return {Object} fix
 * 
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * var a = STK.kit.dom.fix(STK.E("test"), "lb");
 * a.destroy();
 * 
 * @import STK.core.obj.parseParam
 * @import STK.core.dom.isNode
 * @import STK.core.util.browser
 * @import STK.core.util.winSize
 * @import STK.core.util.scrollPos
 * @import STK.core.arr.isArray
 * @import STK.core.evt.addEvent
 * @import STK.core.evt.removeEvent
 * @import STK.core.evt.custEvent
 * //3.51
 */

//$Import("core.obj.parseParam");
//$Import("core.dom.isNode");
//$Import("core.util.browser");
//$Import("core.util.winSize");
//$Import("core.util.scrollPos");
//$Import("core.arr.isArray");
//$Import("core.evt.addEvent");
//$Import("core.evt.removeEvent");
//$Import("core.evt.custEvent");
$Import("kit.dom.cssText");

STK.register("kit.dom.fix", function($) {
	//dom 扩展数据
	var _canFix = !($.core.util.browser.IE6 || (document.compatMode !== "CSS1Compat" && STK.IE)),
		_typeReg = /^(c)|(lt)|(lb)|(rt)|(rb)$/;
	
	function _visible(node) {
		return $.core.dom.getStyle(node, "display") != "none";
	}
	
	function _createOffset(offset) {
		offset = $.core.arr.isArray(offset) ? offset : [0, 0];
		for(var i = 0; i < 2; i++) {
			if(typeof offset[i] != "number") offset[i] = 0;
		}
		return offset;
	}
	
	//处理div位置
	function _draw(node, type, offset) {
		if(!_visible(node)) return;
		var _position = "fixed", _top, _left, _right, _bottom
			,_width = node.offsetWidth,_height = node.offsetHeight
			, _winSize = $.core.util.winSize(), _limitTop = 0, _limitLeft = 0
			,_cssText = $.kit.dom.cssText(node.style.cssText);
		if (!_canFix) {
			_position = 'absolute';
			var _scrlPos = $.core.util.scrollPos();
			_limitTop = _top = _scrlPos.top;
			_limitLeft = _left = _scrlPos.left;
			switch(type) {
				case 'lt'://左上
					_top += offset[1];
					_left += offset[0];
				break;
				case 'lb'://左下
					_top += _winSize.height - _height - offset[1];
					_left += offset[0];
				break;
				case 'rt'://右上
					_top += offset[1];
					_left += _winSize.width - _width - offset[0];
				break;
				case 'rb'://右下
					_top += _winSize.height - _height - offset[1];
					_left += _winSize.width - _width - offset[0];
				break;
				case 'c'://中心
				default:
					_top += (_winSize.height - _height) / 2 + offset[1];
					_left += (_winSize.width - _width) / 2 + offset[0];
			}
			_right = _bottom = "";
		} else {
			_top = _bottom = offset[1];
			_left = _right = offset[0];
			switch(type) {
				case 'lt'://左上
					_bottom = _right = "";
				break;
				case 'lb'://左下
					_top = _right = "";
				break;
				case 'rt'://右上
					_left = _bottom = "";
				break;
				case 'rb'://右下
					_top = _left = "";
				break;
				case 'c'://中心
				default:
					_top = (_winSize.height - _height) / 2 + offset[1];
					_left = (_winSize.width - _width) / 2 + offset[0];
					_bottom = _right = "";
			}
		}
		if(type == 'c') {
			if(_top < _limitTop) _top = _limitTop;
			if(_left < _limitLeft) _left = _limitLeft;
		}
		_cssText.push("position", _position)
			   .push("top", _top+"px")
			   .push("left", _left+"px")
			   .push("right", _right+"px")
			   .push("bottom", _bottom+"px");
		node.style.cssText = _cssText.getCss();
	}

	return function(node, type, offset) {
		var _type, _offset, _fixed = true, _ceKey;
		if($.core.dom.isNode(node) && _typeReg.test(type)) {
			var that = {
				/**
				 * 得到节点
				 * @method getNode
				 * @return {Node}
				 */
				getNode: function() {
					return node;
				},
				/**
				 * 检测位置固定的可用性
				 * @method isFixed
				 * @return {Boolean}
				 */
				isFixed: function() {
					return _fixed;
				},
				
				/**
				 * 设置位置固定的可用性
				 * @method setFixed
				 * @param {Boolean} fixed 位置固定的可用性
				 * @return {Object} this
				 */
				setFixed: function(fixed) {
					(_fixed = !!fixed) && _draw(node, _type, _offset);
					return this;
				},
				/**
				 * 设置对齐方式 
				 * @method setAlign
				 * @param {String} type
				 * @param {Array} offset 
				 * [
				 * 	0,//和边框的横向距离 type == 'c'时无效
				 * 	0//和边框的纵向距离 type == 'c'时无效
				 * ]
				 * @return  {Object} this
				 */
				setAlign: function(type, offset) {
					if(_typeReg.test(type)) {
						_type = type;
						_offset = _createOffset(offset);
						_fixed && _draw(node, _type, _offset);
					}
					return this;
				},
				/**
				 * 销毁
				 * @method destroy
				 * @return {void}
				 */
				destroy: function() {
					if (!_canFix) {
						_canFix && $.core.evt.removeEvent(window, "scroll", _evtFun);
					}
					$.core.evt.removeEvent(window, "resize", _evtFun);
					$.core.evt.custEvent.undefine(_ceKey);
				}
			};
			_ceKey = $.core.evt.custEvent.define(that, "beforeFix");
			that.setAlign(type, offset);
			function _evtFun(event) {
				event = event || window.event;
				/**
				 * 系统事件导致的重绘前事件
				 * @event beforeFix
				 * @param {String} type 事件类型  scroll/resize
				 */
				$.core.evt.custEvent.fire(_ceKey, "beforeFix", event.type);
				if(_fixed && (!_canFix || _type == "c")) {
					_draw(node, _type, _offset);
				}
			};
			if (!_canFix) {
				$.core.evt.addEvent(window, "scroll", _evtFun);
			}
			$.core.evt.addEvent(window, "resize", _evtFun);
			return that;
		}
	};
});
