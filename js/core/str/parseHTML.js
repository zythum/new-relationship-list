/**
 * parse HTML
 * @id STK.core.str.parseHTML
 * @alias STK.core.str.parseHTML
 * @param {String} str
 * @return {Array} ret
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.parseHTML('<div></div>') === [["<div>", "", "div", ""], ["</div>", "/", "div", ""]];
 */
STK.register('core.str.parseHTML', function($){
	return function(htmlStr){
		var tags = /[^<>]+|<(\/?)([A-Za-z0-9]+)([^<>]*)>/g;
		var a, i;
		var ret = [];
		while ((a = tags.exec(htmlStr))) {
			var n = [];
			for (i = 0; i < a.length; i += 1) {
				n.push(a[i]);
			}
			ret.push(n);
		}
		return ret;
	};
});
