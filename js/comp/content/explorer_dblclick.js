STK.register('comp.content.explorer_dblclick', function($){
	return function(node,o_){
		var dblclickCallBack = function(spec){
			var myItem = spec.el;
			o_.selectedList = [];
			o_.paint();
			alert(myItem.innerHTML);
		}

		var bind = function(){
			var dEvent = $.delegatedEvent(node);
			dEvent.add('explorer-item','dblclick',dblclickCallBack);	
		};

		o_.load();
		bind();

	}
});