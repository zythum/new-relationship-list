/**
 * Fix the difference of event in each browser
 * @id STK.core.evt.fixEvent
 * @alias STK.core.evt.fixEvent
 * @param {Event} e
 * @return {Event} e
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var ev = STK.core.evt.fixEvent(window.event);
 */
$Import("core.evt.getEvent");
STK.register('core.evt.fixEvent', function($){
	return function(e){
		e = e || $.core.evt.getEvent();
		if (!e.target) {
			e.target = e.srcElement;
			e.pageX = e.x;
			e.pageY = e.y;
		}
		if (typeof e.layerX == 'undefined') 
			e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') 
			e.layerY = e.offsetY;
		return e;
	};
});
