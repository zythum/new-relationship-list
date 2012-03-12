/**
 * @author wangliang3@staff.sina.com.cn
 */
$Import('widget.module.component');
$Import('common.extra.imageURL');

STK.register('widget.component.expand', function($){
	
    return function(oEntity, oConf){
        var it = $.widget.module.component();
        var sup = $.core.obj.sup(it, ['init', 'destroy']);
        //pars
        var dom,param;
        //input/textarea action 
		var states = {
			expand: 'fold',
			fold: 'expand'
		};
		
        var handler = {
			click: function(e){
				//
				var el = $.fixEvent(e).target;
				if(el.tagName.toLowerCase()=='a'){
					$.preventDefault(e);
				}
				//
				handler.refresh();
				$.custEvent.fire(oEntity.top,'preview',[{
					type: 'expand',
					param: param
				}]);
				//只执行一次的情况下进行销毁
				if(param['once']==1){
//					dom.innerHTML = '';
					dom.style.display = 'none';
				}
			},
			refresh: function(){
				/*
				 * 外部设定样式
				 * @param {string} css_expand 按钮展开样式，非必选参数
				 * @param {string} css_fold 按钮收起样式，非必选参数
				 */
				$.removeClassName(dom,param['css_'+param['state']]);
				param['state'] = states[param['state']];
				//
				states[param['state']]&&$.addClassName(dom,param['css_'+param['state']]);
			}
		};
        
        //
        it.initParam = function(){
            it.entity = oEntity;
            dom = oEntity.dom;
			param = oEntity.param;
        };
        it.initEvent = function(){
			$.custEvent.define(oEntity.top,'preview');
			$.addEvent(dom,'click',handler.click)
        };
        
        it.destroyParam = function(){
            dom = null;
            it.entity = null;
        };
        it.destroyEvent = function(){
			$.custEvent.remove(oEntity.top,'preview', handler.render);
      	};
        
        it.destroy = function(){
            it.destroyParam();
			it.destroyEvent();
			sup.destroy();
        };
        
        it.init = function(){
            sup.init();
        };
        
        return it;
    }
});
