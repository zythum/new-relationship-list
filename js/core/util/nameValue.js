/**
 * Get name value
 * @id STK.core.util.nameValue
 * @alias STK.core.util.nameValue
 * @param {Element} node
 * @param {Boolean} isClear
 * @return {Object} _value
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.nameValue($.E('input')) === {'test':'test'};
 */

$Import('core.str.trim');
STK.register('core.util.nameValue', function($){
	return function(node){
		var _name = node.getAttribute("name");
		var _type = node.getAttribute("type");
		var _el = node.tagName;
		var _value = {
			"name": _name,
			"value": ""
		};
		var _setVl = function(vl){
			if(vl === false){
				_value = false;
			}else if (!_value["value"]) {
				_value["value"] = $.core.str.trim((vl || ""));
			} else {
				_value["value"] = [$.core.str.trim((vl || ""))].concat(_value["value"]);
			}
		};
		if (!node.disabled && _name) {
			switch (_el) {
				case "INPUT":
					if (_type == "radio" || _type == "checkbox") {
						if (node.checked) {
							_setVl(node.value);
						}
						else {
							_setVl(false);
						}
					} else if (_type == "reset" || _type == "submit" || _type == "image") {
						_setVl(false);
					} else {
						_setVl(node.value);
					}
					break;
				case "SELECT":
					if (node.multiple) {
						var _ops = node.options;
						for (var i = 0, len = _ops.length; i < len; i++) {
							if (_ops[i].selected) {
								_setVl(_ops[i].value);
							}
						}
					} else {
						_setVl(node.value);
					}
					break;
				case "TEXTAREA":
					_setVl(node.value || node.getAttribute("value") || false);
					break;
				case "BUTTON":
				default:
					_setVl(node.value || node.getAttribute("value") || node.innerHTML || false);
			}
		} else{
			return false;
		}
		return _value;
	};
});
