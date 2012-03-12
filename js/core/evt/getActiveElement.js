$Import('core.evt.getEvent');
STK.register('core.evt.getActiveElement', function($) {
    return function () {
	    try {
	        var evt = $.core.evt.getEvent();
	        return document.activeElement? document.activeElement: evt.explicitOriginalTarget;
	    }
	    catch (e) {
	        return document.body;
	    }
	};
});
