/**
 * @author wangliang3@staff.sina.com.cn
 * 扩展交互成功后 fire custEvent data组件
 */
$Import('widget.component.success');
$Import('kit.dom.parents');
STK.register('widget.component.bridge', function($){
	return function(oEntity, oConf){
		var it = $.widget.component.success(oEntity, oConf);
		var supAccept = $.core.obj.sup(it.accept, ['success']);
		it.accept.success = function(event, info, json){
			/*
			 * 针对发布器回写使用
			 * 没有text属性时不触发回写行为
			 */
			if(json.data.state=='publish'){
				$.custEvent.fire(oEntity.top,'bridge',json.data);
			}
//			supAccept.success.apply(null, arguments);
		};
		return it;
	}
});
