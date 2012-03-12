/**
 * get html's name value
 * @id STK.core.util.htmlToJson
 * @alias STK.core.util.htmlToJson
 * @param {Element} mainBox
 * @param {Array} tagNameList
 * @param {Boolean} isClear
 * @return {JSON} _retObj
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.htmlToJson($E('login')) === {'username':'robin','password':'123qwe'};
 */

$Import('core.util.nameValue');
STK.register('core.util.htmlToJson', function($){
	return function(mainBox, tagNameList, isClear){
		var _retObj = {};
		tagNameList = tagNameList || ["INPUT", "TEXTAREA", "BUTTON", "SELECT"];
		if (!mainBox || !tagNameList) {
			return false;
		}
		var _opInput = $.core.util.nameValue;
		for (var i = 0, len = tagNameList.length; i < len; i++) {
			var _tags = mainBox.getElementsByTagName(tagNameList[i]);
			for (var j = 0, lenTag = _tags.length; j < lenTag; j++) {
				var _info = _opInput(_tags[j]);
				if (!_info || (isClear && (_info.value === '')) ) {
					continue;
				}
				if (_retObj[_info.name]) {
					if (_retObj[_info.name] instanceof Array) {
						_retObj[_info.name] = _retObj[_info.name].concat(_info.value);
					}
					else {
						_retObj[_info.name] = [_retObj[_info.name]].concat(_info.value);
					}
				}
				else {
					_retObj[_info.name] = _info.value;
				}
			}
		}
		return _retObj;
	};
});
