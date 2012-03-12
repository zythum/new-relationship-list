/**
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.module.component');
$Import('kit.extra.htmlFilter');
STK.register('widget.component.fail', function($){
	return function(oEntity, oConf){
		
		var it = $.widget.module.component();
		
		var custemEventList = [
			 'fail'
			,'part_destroy'
			,'part_flush'];
			
		var cId;
		
		it.accept = {
			'fail' : function(event, info, json)
			{
				//兼容新旧数据格式
				var html='';
				if(typeof json.data == 'string'){
					html = json.data;
				}else if(typeof json.data == 'object'){
					html = json.data.html||'';
				}
				//fire to widget.parse
				$.custEvent.fire(cId, 'part_destroy', it.entity);
				//filter xss
				it.entity.dom.innerHTML = $.kit.extra.htmlFilter(html);
				//fire to widget.parse
				$.custEvent.fire(cId, 'part_flush', it.entity);
			}
		};
		it.handler = {
			'filter' : function(event, info){
				if($.contains(info.dom, it.entity.dom) || $.contains(it.entity.dom, info.dom)){
					it.accept[event.type] && it.accept[event.type].apply(null, arguments);
				}
			}
		};
		/**
		 * 变量初始化
		 */
		it.initParam = function(){
			it.entity = oEntity;
			//初始化自定议事件
			cId = $.custEvent.define(it.entity.top, custemEventList);
		};
		/**
		 * 变量销毁
		 */
		it.destroyParam = function(){
			it.entity = null;
		};
		/**
		 * 事件初始化
		 */
		it.initEvent = function(){
			$.custEvent.add(cId, 'fail', it.handler.filter);
		};
		/**
		 * 事件销毁
		 */
		it.destroyEvent = function(){
			$.custEvent.remove(cId, 'fail', it.handler.filter);
		};
		return it;
	}
});
