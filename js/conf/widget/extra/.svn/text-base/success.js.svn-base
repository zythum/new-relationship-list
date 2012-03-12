/**
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.component.success');
$Import('kit.dom.parents');
STK.register('widget.extra.success', function($){
	return function(oEntity, oConf){
		var it = $.widget.component.success(oEntity, oConf);
		var supAccept = $.core.obj.sup(it.accept, ['success']);
		it.accept.success = function(){
			var result ;
			if(oEntity.dom.parentNode.getAttribute('node-type') == 'feed_list_media_voteDiv') {
				result = [oEntity.dom.parentNode];				
			} else {
				result = $.kit.dom.parents(oEntity.dom , {
					expr : "[node-type='feed_list_media_voteDiv']"				
				});								
			}
			supAccept.success.apply(null, arguments);
			if(result.length) {
				//40是一个速度值
				$.scrollTo(result[0], {
					step: 1,
					top: 40
				});					
			}
		};
		return it;
	}
});
