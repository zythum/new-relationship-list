/**
 * trim
 * @id STK.core.str.trim
 * @alias STK.core.str.trim
 * @param {String} str
 * @return {String} str
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.str.trim(' stk ') === 'stk';
 */
STK.register('core.str.trim', function($){
	return function(str){
		if(typeof str !== 'string'){
			throw 'trim need a string as parameter';
		}
		var len = str.length;
		var s = 0;
		var reg = /(\u3000|\s|\t|\u00A0)/;
		
		while(s < len){
			if(!reg.test(str.charAt(s))){
				break;
			}
			s += 1;
		}
		while(len > s){
			if(!reg.test(str.charAt(len - 1))){
				break;
			}
			len -= 1;
		}
		return str.slice(s, len);
		// if(typeof str.trim === 'function'){
		// 	return str.trim();
		// }else{
			// return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, '');
		// }
		
	};
});
