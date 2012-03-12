/**
 * preventDefault
 * @id STK.core.evt.preventDefault
 * @return {Event} e 
 * @author Finrila | wangzheng4@staff.sina.com.cn
 * @example
 * STK.core.evt.preventDefault();
 */
$Import('core.evt.getEvent');
STK.register('core.evt.preventDefault', function($){
	return function(e){
		var ev = e ? e : $.core.evt.getEvent();
		if ($.IE) {
			ev.returnValue = false;
		}
		else {
			ev.preventDefault();
		}
	};
});