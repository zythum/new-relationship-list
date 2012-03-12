STK.register('comp.content.explorer_hotkey', function($){
	return function(node,o_){

		var selectAll = function(){
			o_.load();
			for(var i=0; i<o_.list.length;i++){
				o_.selectedList[i] = o_.list[i]['DOM'];
			}
			console.log('selectAll');
			o_.paint();
		};
		var bind = function(){
			var dEvent = $.delegatedEvent(node);
			$.hotKey.add(document.body,['ctrl+a'],selectAll);
		};

		o_.load();
		bind();

	}
});