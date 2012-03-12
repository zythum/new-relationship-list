/**
 * decode HTML
 * @id STK.core.str.decodeHTML
 * @alias STK.core.str.decodeHTML
 * @param {String} str
 * @return {String} str
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.decodeHTML('&amp;&lt;&gt;&quot;$nbsp;') === '&<>" ';
 */
STK.register('core.str.decodeHTML', function($){
	return function(str){
		// var div = document.createElement('div');
		// 		div.innerHTML = str;
		// 		return div.innerText == undefined ? div.textContent : div.innerText;
		//	modify by Robin Young | yonglin@staff.sina.com.cn
		if(typeof str !== 'string'){
			throw 'decodeHTML need a string as parameter';
		}
		return str.replace(/&quot;/g,'"').
			replace(/&lt;/g,'<').
			replace(/&gt;/g,'>').
			replace(/&#39/g,'\'').
			replace(/&nbsp;/g,'\u00A0').
			replace(/&#32/g,'\u0020').
			replace(/&amp;/g,'\&');
	};
});
