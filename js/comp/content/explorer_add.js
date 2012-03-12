STK.register('comp.content.explorer_add', function($){
	return function(node,o_){
		var addItemCallBack = function(spec){
			var newItem = $.C('div');
			// div class="item" node-type="explorer-item" action-type="explorer-item"
			newItem.setAttribute('node-type','explorer-item');
			newItem.setAttribute('action-type','explorer-item');
			$.addClassName(newItem,'item');
			newItem.innerHTML = '<p>99</p><div class="explorerclose" action-type="explorer-item-close">☓</div>';
			spec.el.parentNode.insertBefore(newItem, spec.el);
			o_.load();
		}
		var bind = function(){
			var dEvent = $.delegatedEvent(node);
			dEvent.add('explorer-item-add','click',addItemCallBack);
		};

		o_.load();
		bind();
	}
});