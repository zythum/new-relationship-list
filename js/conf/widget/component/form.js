/**
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.trans.component');
$Import('widget.module.component');
STK.register('widget.component.form', function($){
	return function(oEntity, oConf){
		
		var it = $.widget.module.component();
		
		var custemEventList = [
			 'submit'
			,'success'
			,'fail'
			,'validate'
			,'invalidate'
			,'enabled'
			,'disabled'
			,'invalidate_data'
			,'validate_data'];
			
		var cId, trans;
		
		it.handler = {
			'success' : function(json)
			{
				it.handler.validate();
				$.custEvent.fire(cId, 'success', [it.entity, json])
			}
			,'fail' : function(json)
			{
				it.handler.validate();
				$.custEvent.fire(cId, 'fail', [it.entity, json])
			}
			,'validate': function()
			{
				$.custEvent.fire(cId, 'validate', it.entity);
			}
			,'invalidate': function()
			{
				$.custEvent.fire(cId, 'invalidate', it.entity);
			}
			,'filter': function(event, info){
				if($.contains(it.entity.dom, info.dom)){
					it.accept[event.type] && it.accept[event.type].apply(null, arguments);
				}
			}
		};
		it.accept = {
			'submit' : function(event, info)
			{
				var data = it.entity.data;
				if (info.data) {
					data = $.core.json.merge(data, info.data);
				}
				it.handler.invalidate();
				trans.request($.core.json.merge(data,$.htmlToJson(it.entity.dom, ["INPUT","TEXTAREA","BUTTON","SELECT","A","DIV","LI"])));
			}
			,'validate_data' : function(event, info){
				$.custEvent.fire(cId, 'enabled', it.entity)
			}
			,'invalidate_data' : function(event, info){
				$.custEvent.fire(cId, 'disabled', it.entity)
			}
		};
		/**
		 * 变量初始化
		 */
		it.initParam = function(){
			it.entity = oEntity;
			trans = $.widget.trans.component.getTrans(
				it.entity.param.appkey
				,{
					 'onSuccess': it.handler.success
					,'onError'  : it.handler.fail
					,'timeout'  : 5000
				}
			);
			//初始化自定议事件
			cId = $.custEvent.define(it.entity.top, custemEventList);
		};
		/**
		 * 变量销毁
		 */
		it.destroyParam = function(){
			trans = null;
			it.entity = null;
		};
		/**
		 * 事件初始化
		 */
		it.initEvent = function(){
			$.custEvent.add(cId, 'submit', it.handler.filter);
			$.custEvent.add(cId, 'invalidate_data', it.handler.filter);
			$.custEvent.add(cId, 'validate_data', it.handler.filter);
		};
		/**
		 * 事件销毁
		 */
		it.destroyEvent = function(){
			$.custEvent.remove(cId, 'submit', it.handler.filter);
			$.custEvent.remove(cId, 'invalidate_data', it.handler.filter);
			$.custEvent.remove(cId, 'validate_data', it.handler.filter);
		};
		return it;
	}
});
