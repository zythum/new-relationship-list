/**
 * 多语言引擎
 * @id STK.core.util.language
 * @alias STK.core.util.language
 * @param {String} template
 * @param {Object} data
 * @return {String} ret
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.language('#L{beijing}欢迎你',{'beijing':'北京'}) === '北京欢迎你';
 */

STK.register('core.util.language', function($){
	return function(template, data){
		return template.replace(/#L\{((.*?)(?:[^\\]))\}/ig, function(){
			var key = arguments[1];
			var ret;
			if (data && data[key] !== undefined) {
				ret = data[key];
			}else{
				ret = key;
			}
			return ret;
		});
	};
});