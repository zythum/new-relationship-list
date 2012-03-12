/**
 * 获取滚动条的上下位置
 * @id STK.core.util.scrollPos
 * @alias STK.core.util.scrollPos
 * @param {Document} oDocument 可以指定文档，比如Ifm.docuemnt
 * @return {Object} {top:x,left:x}
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var scrollPos = STK.core.util.scrollPos();
 * alert(scrollPos.top);// 距顶位置
 */
STK.register('core.util.scrollPos', function($){
	return function(oDocument) {
		oDocument = oDocument || document;
		var dd = oDocument.documentElement;
		var db = oDocument.body;
		return {
			top: Math.max(window.pageYOffset || 0, dd.scrollTop, db.scrollTop),
			left: Math.max(window.pageXOffset || 0, dd.scrollLeft, db.scrollLeft)
		};
	};
});