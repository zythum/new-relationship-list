$import('common.extra.litSwitcher');

STK.register("comp.content.tips", function($) {
	
	return function(node){
		var that = $.common.extra.litSwitcher(node);
		
		return that;
	}
});