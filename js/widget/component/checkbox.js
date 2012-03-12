/**
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.module.component');
STK.register('widget.component.checkbox', function($){
	return function(oEntity, oConf){
		
		var it = $.widget.module.component();
		
		var sup = $.core.obj.sup(it, ['init']);
		
		var custEventList = ['disabled', 'enabled'];
		
		var cId, dom, checked, name, value, unSelectClass, selectClass;
		
		
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
				if(checked){
					it.handler.unselect();
					return;
				}
				it.handler.select();
				return false;
			}
			,'select' : function()
			{
				it.handler.invalidate(0);
				dom.checked = checked = 'checked';
				dom.className = selectClass;
			}
			,'unselect': function()
			{
				it.handler.invalidate(1);
				dom.checked = checked = null;
				dom.className = unSelectClass;
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
		};
		
		it.initParam = function(){
			it.entity = oEntity;
			dom = it.entity.dom;
			cId = $.custEvent.define(dom, custEventList);
			name = (dom.name || dom.getAttribute('name'));
			value = (dom.value||dom.getAttribute('value'));
			checked = !!dom.getAttribute('checked');
			unSelectClass = it.entity.param['class'] || '';
			selectClass = it.entity.param['selectClass']||'';
			disabledClass = it.entity.param['disabledClass']||'';
		};
		
		it.destroyParam = function(){
			dom = null;
			it.entity = null;
		};
		
		it.initEvent = function(){
			$.custEvent.add(cId, 'enabled', it.accept.enabled);
			$.custEvent.add(cId, 'disabled', it.accept.disabled);
			dom.onclick = it.handler.click
		};
		
		it.destroyEvent = function(){
			$.custEvent.remove(cId, 'enabled', it.accept.enabled);
			$.custEvent.remove(cId, 'disabled', it.accept.disabled);
			dom.onclick = null
		};
		
		it.init = function(){
			sup.init();
			dom.value = value;
			it.handler[checked? 'select': 'unselect']();
		}
		
		return it;
	}
});
