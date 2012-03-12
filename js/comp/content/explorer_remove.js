STK.register('comp.content.explorer_remove', function($){
	return function(node,o_){		

		var removeItemCallBack = function(spec){
			var myItem = spec.el.parentNode;
			myItem.style.opacity = '0';
			setTimeout(function(){
				myItem.parentNode.removeChild(myItem);
				o_.load();
			},300);
		};

		var bind = function(){
			var dEvent = $.delegatedEvent(node);
			dEvent.add('explorer-item-close','click',removeItemCallBack);
		};

		o_.load();
		bind();

	}
});