/**
 * Remove event for a node
 * @id STK.core.evt.removeEvent
 * @alias STK.core.evt.removeEvent
 * @param {Node} el
 * @param {Function} func
 * @param {String} evType
 * @param {Boolean} useCapture
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var hock= function(e){console.log(e);}
 * STK.core.evt.removeEvent($.E('id'), hock, 'click');
 */
STK.register('core.evt.removeEvent', function($) {
    return function(el, evType, func, useCapture) {
        var _el = $.E(el);
        if (_el == null) {
            return false;
        }
        if (typeof func != "function") {
            return false;
        }
        if (_el.removeEventListener) {
            _el.removeEventListener(evType, func, useCapture);
        } else if (_el.detachEvent) {
            _el.detachEvent("on" + evType, func);
        } else {
            _el['on' + evType] = null;
        }
        return true;
    };
});