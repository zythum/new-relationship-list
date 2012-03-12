/**
 * stop event
 * @id STK.core.evt.stopEvent
 * @alias STK.core.evt.stopEvent
 * @return {Event} e
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.evt.stopEvent();
 */
$Import("core.evt.getEvent");
STK.register('core.evt.stopEvent', function($){
	return function(e){
		var ev = e ? e : $.core.evt.getEvent();
		if ($.IE) {
			ev.cancelBubble = true;
			ev.returnValue = false;
		}
		else {
			ev.preventDefault();
			ev.stopPropagation();
		}
		return false;
	};
});
