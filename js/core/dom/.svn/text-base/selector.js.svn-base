$Import('core.dom.sizzle');
$Import('core.dom.isNode');
$Import('core.dom.contains');
$Import('core.arr.isArray');
$Import('core.evt.addEvent');
$Import('core.dom.setStyle');

STK.register('core.dom.selector', function($) {
	var getDomList = function(selector, context, results, seed) {
		var res = [];
		if (typeof selector === 'string') {
			lis = $.core.dom.sizzle(selector,context,results,seed);
			for (var i = 0, len = lis.length; i < len; i += 1){
				res[i] = lis[i];
			}
		} else if ($.core.dom.isNode(selector)) {
			if (context) {
				if ($.core.dom.contains(context, selector)){
					res = [selector];
				}
			} else {
				res = [selector];
			}
			
		} else if ($.core.arr.isArray(selector)) {
			if (context) {
				for (var i = 0, len = selector.length; i < len; i += 1) {
					if ($.core.dom.contains(context, selector[i])) {
						res.push(selector[i]);
					}
				}
			} else {
				res = selector;
			}
		}
		return res;
	};
	return function(selector, context, results, seed){
		var that = getDomList.apply(window,arguments);
		that.on = function(etype,efun){
			for (var i = 0, len = that.length; i < len; i += 1) {
				$.core.evt.addEvent(that[i], etype, efun);
			}
			return that;
		};
		that.css = function(cssKey,cssValue){
			for (var i = 0, len = that.length; i < len; i += 1) {
				$.core.dom.setStyle(that[i], cssKey, cssValue);
			}
			return that;
		};
		that.show = function(){
			for (var i = 0, len = that.length; i < len; i += 1) {
				that[i].style.display = '';
			}
			return that;
		};
		that.hidd = function(){
			for (var i = 0, len = that.length; i < len; i += 1) {
				that[i].style.display = 'none';
			}
			return that;
		};
		that.hide = that.hidd;
		return that;
	};
	
});