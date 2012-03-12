/**
 * Check if in Array
 * @id STK.core.arr.inArray
 * @alias STK.core.arr.inArray
 * @param {String | Number} oElement 需要查找的对象
 * @param {Array} aSource 源数组
 * @return {Boolean} 是否在数组中
 * @author WK | wukan@staff.sina.com.cn Copy from jQuery
 *         FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var a = 2,b=[3,2,1]
 * alert(STK.core.arr.inArray(a,b));// true
 */
$Import('core.arr.indexOf');
STK.register('core.arr.inArray', function($){
	return function(oElement, aSource){
		return $.core.arr.indexOf(oElement, aSource) > -1;
	};
});
