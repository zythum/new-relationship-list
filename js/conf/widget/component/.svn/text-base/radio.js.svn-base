/**
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.module.component');
STK.register('widget.component.radio', function($){
	return function(oEntity, oConf){
		
		var it = $.widget.module.component();
		
		var sup = $.core.obj.sup(it, ['init','destroy']);
		
		var bCustEventList = ['disabled', 'enabled'];
		
		var custEventList = ['radio_change'];
		
		var cId, bId, dom, name, value, checked, enabledClass, unSelectClass, selectClass;
		
		
		it.handler = {
			'invalidate': function(b){
				dom.name = b?null: name;
				dom[b? 'removeAttribute': 'setAttribute']('name', name);
			}
			,'click' : function()
			{
				if(dom.getAttribute('disabled')){
					return false;
				}
				it.handler.select();
				return false;
			}
			,'select' : function()
			{
				it.handler.invalidate(0);
				dom.checked = checked = 'checked';
				dom.className = selectClass;
				$.custEvent.fire(cId, 'radio_change', it.entity)
			}
			,'unselect': function()
			{
				it.handler.invalidate(1);
				dom.checked = checked = null;
				dom.className = unSelectClass;
			}
			,'filter': function(event, info){
				if($.contains(info.dom, it.entity.dom)){
					it.accept[event.type] && it.accept[event.type].apply(null, arguments);
				}
			}
		};
		
		it.accept = {
			'enabled': function()
			{
				enabledClass && (dom.className = enabledClass);
			}
			,'disabled': function()
			{
				disabledClass && (dom.className = disabledClass);
			}
			,'radio_change': function(event, info, party){
				if(party!==dom){
					it.handler.unselect();
				}
			}
		};
		
		it.initParam = function(){
			it.entity = oEntity;
			dom = it.entity.dom;
			bId = $.custEvent.define(dom, bCustEventList);
			cId = $.custEvent.define(it.entity.top, custEventList);
			name = (dom.name || dom.getAttribute('name'));
			value = (dom.value||dom.getAttribute('value'));
			checked = !!dom.getAttribute('checked');
			enabledClass = unSelectClass = it.entity.param['class']||'';
			selectClass = it.entity.param['selectClass']||'';
			disabledClass = it.entity.param['disabledClass']||'';
		};
		
		it.destroyParam = function(){
			dom = null;
			it.entity = null;
		};
		
		it.initEvent = function(){
			$.custEvent.add(bId, 'enabled', it.accept.enabled);
			$.custEvent.add(bId, 'disabled', it.accept.disabled);
			$.custEvent.add(cId, 'radio_change', it.handler.filter);
			dom.onclick = it.handler.click
		};
		
		it.destroyEvent = function(){
			$.custEvent.remove(bId, 'enabled', it.accept.enabled);
			$.custEvent.remove(bId, 'disabled', it.accept.disabled);
			$.custEvent.remove(cId, 'radio_change', it.handler.filter);
			dom.onclick = null
		};
		
		it.destroy = function(){
			sup.destroy();
		};
		
		it.init = function(){
			sup.init();
			dom.value = value;
			it.handler[checked? 'select': 'unselect']();
		};
		
		return it;
	}
});
