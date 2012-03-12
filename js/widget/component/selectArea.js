/**
 * @author wangliang3@staff.sina.com.cn
 */
$Import('kit.dom.getBy');
$Import('widget.module.component');
$Import('module.selectArea');

STK.register('widget.component.selectArea', function($){
	var getBy = $.kit.dom.getBy;
	
    return function(oEntity, oConf){
        var it = $.widget.module.component();
        var sup = $.core.obj.sup(it, ['init', 'destroy']);
        //pars
        var dom,param,selectarea;
        //input/textarea action 
        var handler = {
			init: function(){
				var items={};
				getBy(function(el){
					var att = el.getAttribute('component-param');
					if(att){
						att = $.queryToJson(att);
						items[att.type]=el;
					}
				},'select',dom);
				selectarea = $.module.selectArea(items,param);
			}
		};
        
        //
        it.initParam = function(){
            it.entity = oEntity;
            dom = oEntity.dom;
			param = oEntity.param;
			//
			handler.init();
        };       
        
        it.destroyParam = function(){
            dom = null;
			selectarea = null;
            it.entity = null;
        };
        it.destroy = function(){
			selectarea.destroy();
			sup.destroy();
        };
        
        it.init = function(){
            sup.init();
        };
        
        return it;
    }
});
