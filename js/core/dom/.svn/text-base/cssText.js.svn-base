/**
 * 样式缓存及合并
 * @id STK.core.dom.cssText
 * @param {String} oldCss 旧的cssText
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * var a = STK.kit.dom.cssText(STK.E("test").style.cssText);
 * a.push("width", "3px").push("height", "4px");
 * STK.E("test").style.cssText = a.getCss();
 */

STK.register("core.dom.cssText", function($) {
	
	return function(oldCss) {
		oldCss = (oldCss || "").replace(/(^[^\:]*?;)|(;[^\:]*?$)/g, "").split(";");
		var cssObj = {}, cssI;
		for(var i = 0; i < oldCss.length; i++) {
			cssI = oldCss[i].split(":");
			cssObj[cssI[0].toLowerCase()] = cssI[1];
		}
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
					cssObj[property.toLowerCase()] = value;
					return that;
				},
				/**
				 * 从样式缓存列表删除样式
				 * @method remove
				 * @param {String} property 属性名
				 * @return {Object} this
				 */
				remove: function(property) {
					property = property.toLowerCase();
					cssObj[property] && delete cssObj[property];
					return that;
				},
				/**
				 * 得到·
				 * @method getCss
				 * @param {String} property 属性名
				 * @param {String} value 属性值
				 * @return {Object} this
				 */
				getCss: function() {
					var newCss = [];
					for(var i in cssObj) {
						newCss.push(i + ":" + cssObj[i]);
					}
					return newCss.join(";");
				}
			};
		return that;
	};
});