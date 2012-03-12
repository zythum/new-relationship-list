/**
 * 样式缓存及合并
 * @id STK.kit.dom.cssText
 * @param {String} oldCss 旧的cssText
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * var a = STK.kit.dom.cssText(STK.E("test").style.cssText);
 * a.push("width", "3px").push("height", "4px");
 * STK.E("test").style.cssText = a.getCss();
 */

STK.register("kit.dom.cssText", function($) {
	
	var _getNewCss = function(oldCss, addCss) {
		// 去没必要的空白
		var _newCss = (oldCss + ";" + addCss)
			.replace(/(\s*(;)\s*)|(\s*(:)\s*)/g, "$2$4"), _m;
		//循环去除前后重复的前的那个 如 width:9px;height:0px;width:8px; -> height:0px;width:8px;
		while(_newCss && (_m = _newCss.match(/(^|;)([\w\-]+:)([^;]*);(.*;)?\2/i))) {
			_newCss = _newCss.replace(_m[1]+_m[2]+_m[3], "");
		}
		return _newCss;
	};
	
	return function(oldCss) {
		oldCss = oldCss || "";
		var _styleList = [],
			that = {
				/**
				 * 向样式缓存列表里添加样式
				 * @method push
				 * @param {String} property 属性名
				 * @param {String} value 属性值
				 * @return {Object} this
				 */
				push: function(property, value) {
					_styleList.push(property + ":" + value);
					return that;
				}
				/**
				 * 从样式缓存列表删除样式
				 * @method remove
				 * @param {String} property 属性名
				 * @return {Object} this
				 */
				,remove: function(property) {
					for(var i = 0; i < _styleList.length; i++) {
						if(_styleList[i].indexOf(property+":") == 0) {
							_styleList.splice(i, 1);
						}
					}
					return that;
				}
				/**
				 * 返回样式缓存列表
				 * @method getStyleList
				 * @return {Array} styleList
				 */
				,getStyleList: function() {
					return _styleList.slice();
				}
				/**
				 * 得到·
				 * @method getCss
				 * @param {String} property 属性名
				 * @param {String} value 属性值
				 * @return {Object} this
				 */
				,getCss: function() {
					return _getNewCss(oldCss, _styleList.join(";"));
				}
			};
		return that;
	};
});