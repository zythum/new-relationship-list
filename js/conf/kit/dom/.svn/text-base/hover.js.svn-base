STK.register('kit.dom.hover',function($){
	/*
	 * spec = {
			act : 
			delay : 
			extra :
			iscover : 
			onmouseover : 
			onmouseout : 
		}
	 */
	return function(spec){
		var delay = spec.delay || 100;
		var isover = spec.isover || false;
		var act = spec.act;
		var ext = spec.extra || [];
		var timer = null;
		var showAct = function(e) {
			if(isover) {
				spec['onmouseover'].apply(act,[e]);
			}
		};
		var hiddAct = function(e) {
			if(!isover) {
				spec['onmouseout'].apply(act,[e]);
			}
		};
		var hoverAct = function(e) {
			isover = true;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function(){showAct(e);},delay);
		};
		var msoutAct = function(e) {
			isover = false;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function(){hiddAct(e);},delay);
		};
		$.core.evt.addEvent(act, 'mouseover', hoverAct);
		$.core.evt.addEvent(act, 'mouseout', msoutAct);
		for(var i = 0, len = ext.length; i < len; i += 1) {
			$.core.evt.addEvent(ext[i], 'mouseover', hoverAct);
			$.core.evt.addEvent(ext[i], 'mouseout', msoutAct);
		};
		var that = {};
		that.destroy = function() {
			$.core.evt.removeEvent(act, 'mouseover', hoverAct);
			$.core.evt.removeEvent(act, 'mouseout', msoutAct);
			for(var i = 0, len = ext.length; i < len; i += 1) {
				$.core.evt.removeEvent(ext[i], 'mouseover', hoverAct);
				$.core.evt.removeEvent(ext[i], 'mouseout', msoutAct);
			};
		};
		return that;
	};
});