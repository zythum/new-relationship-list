/**
 * Fire a node's event
 * @id STK.core.evt.fireEvent
 * @alias STK.core.evt.fireEvent
 * @param {Node} el
 * @param {String} sEvent
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.evt.fireEvent($.E('id'),'click');
 */
STK.register('core.evt.fireEvent', function($){
	return function(el, sEvent){
		_el = $.E(el);
		if ($.IE) {
			_el.fireEvent('on' + sEvent);
		}
		else {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent(sEvent, true, true);
			_el.dispatchEvent(evt);
		}
	};
});
