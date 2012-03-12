/**
 * Add event for a node
 * @id STK.core.evt.addEvent
 * @alias STK.core.evt.addEvent
 * @param {Node} sNode
 * @param {String} sEventType
 * @param {Function} oFunc
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 *         FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.evt.addEvent($.E('id'),'click',function(e){
 * 	console.log(e);
 * });
 */
STK.register('core.evt.addEvent', function($) {
    return function(sNode, sEventType, oFunc) {
        var oElement = $.E(sNode);
        if (oElement == null) {
            return false;
        }
        sEventType = sEventType || 'click';
        if ((typeof oFunc).toLowerCase() != "function") {
            return;
        }
        if (oElement.addEventListener) {
            oElement.addEventListener(sEventType, oFunc, false);
        } else if (oElement.attachEvent) {
            oElement.attachEvent('on' + sEventType, oFunc);
        } else {
            oElement['on' + sEventType] = oFunc;
        }
        return true;
    };
});
