/**
 * 全角字转半角字
 * @id STK.core.str.dbcToSbc
 * @alias STK.core.str.dbcToSbc
 * @param {String} str
 * @return {String} str
 * @author yuwei | yuwei@staff.sina.com.cn
 * @example
 * STK.core.str.dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ') === 'SAASDFSADF';
 */
STK.register('core.str.dbcToSbc',function($){
	return function(str){
		return str.replace(/[\uff01-\uff5e]/g,function(a){
			return String.fromCharCode(a.charCodeAt(0)-65248);
		}).replace(/\u3000/g," ");
	};
});