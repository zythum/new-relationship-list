/**
 * Get byte length
 * @id STK.core.str.bLength
 * @alias STK.core.str.bLength
 * @param {String} str
 * @return {Number} n
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.bLength('aabbcc') === 6;
 */
STK.register('core.str.bLength', function($){
	return function(str){
		if (!str) {
			return 0;
		}
		var aMatch = str.match(/[^\x00-\xff]/g);
		return (str.length + (!aMatch ? 0 : aMatch.length));
	};
});
