/**
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.module.component');
STK.register('widget.component.buttonGroup', function($){

	return function(oEntity, oConf){
		
		var it = $.widget.module.component();
		
		var sup = $.core.obj.sup(it, ['init']);
		
		var custemEventList = [
			 'invalidate_data'
			,'validate_data'
			,'radio_change'];
		
		var cId, dEvt, max, min, buttonList, radio;
		
		it.handler = {
			'toNum' : function(n){
				n = n - 0;
				return (n+'')=='NaN'? 0: n
			}
			,'invalidate': function(unselect, validate){
				var btn = unselect.shift()
				if(btn){
					if(!radio || 
						(btn.getAttribute('component') && btn.getAttribute('component')!=='widget.component.radio') || 
						(btn.getAttribute('type') && btn.getAttribute('type') !== "radio")
					){
						btn[validate? 'removeAttribute': 'setAttribute']('disabled', 'disalbed');
						$.custEvent.fire(btn, (validate? 'enabled': 'disabled'));
					}
					it.handler.invalidate.apply(null, arguments);
				}
			}
			,'check' : function(){
				var button
					,evt = 'validate_data'
					,val = 1
					,unselect = []
					,len = buttonList.length;
				for(var i=0; i<len; i++){
					button = buttonList[i];
					if(!button.checked){
						unselect.push(button);
					}
				}
				len = len - unselect.length;
				if(min && (len<min)){
					evt = 'invalidate_data'
				}
				if(max && (len>max)){
					evt = 'invalidate_data';
					val = 0
				}
				if(max && (len==max)){
					val = 0;
				}
				it.handler[evt]();
				it.handler.invalidate(unselect, val);
			}
			,'click': function(e){
				(e.el.getAttribute('type') == 'radio') && (radio = 1)
				it.handler.check();
			}
			//通知监听者，当前选项组中的选项符合最大最小判定
			,'validate_data' : function()
			{
				$.custEvent.fire(cId, 'validate_data', it.entity)
			}
			//通知监听者，当前选项组中的选项不符合最大最小判定
			,'invalidate_data' : function()
			{
				$.custEvent.fire(cId, 'invalidate_data', it.entity)
			}
			,'filter': function(event, info){
				if($.contains(it.entity.dom, info.dom)){
					it.accept[event.type] && it.accept[event.type].apply(null, arguments);
				}
			}
		};
		
		it.accept = {
			'radio_change' : function(event, info)
			{
				radio = 1;
				$.custEvent.fire(cId, 'radio_change', [it.entity, info.dom])
			}
		}
		
		it.initParam = function(){
			it.entity = oEntity;
			cId = $.custEvent.define(it.entity.top, custemEventList);
			dEvt = $.delegatedEvent(it.entity.dom);
			buttonList = $.sizzle('[type=radio],[type=checkbox],[component=widget.component.checkbox],[component=widget.component.radio]', it.entity.dom);
			min = it.handler.toNum(it.entity.param['min']);
			max = it.handler.toNum(it.entity.param['max']);
		};
		
		it.destroyParam = function(){
			it.entity = null;
			buttonList = null;
			radio = null;
			dEvt = null;
		};
		
		it.initEvent = function(){
			$.custEvent.add(cId, 'radio_change', it.handler.filter);
			dEvt.add('buttonGroupItem', 'click', it.handler['click']);
		};
		
		it.destroyEvent = function(){
			$.custEvent.remove(cId, 'radio_change', it.handler.filter);
			dEvt.remove('buttonGroupItem', 'click', it.handler['click']);
		};
		
		it.init = function(){
			sup.init();
			for(var i=0, len=buttonList.length; i<len; i++){
				buttonList[i].setAttribute('action-type', 'buttonGroupItem');
			}
		}
		return it;
	}
});
