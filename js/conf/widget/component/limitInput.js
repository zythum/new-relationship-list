/**
 * @author wangliang3@staff.sina.com.cn
 */
$Import('widget.module.component');

STK.register('widget.component.limitInput', function($){
		
    return function(oEntity, oConf){
        var it = $.widget.module.component();
        var sup = $.core.obj.sup(it, ['init', 'destroy']);
        //pars
        var dom,param;
        //input/textarea action 
        handler = {
			focus: function(el,opts){
				return setInterval(function(){
					handler.check(el,opts);
				},500);
			},
			check: function(el,opts){
				var value = el.value;
				var count = $.bLength(value);
				if (opts['max']&&count >= opts['max']) {
					el.value = $.leftB(value,opts['max']);
				}
			}
		};
        
        //
        it.initParam = function(){
            it.entity = oEntity;
            dom = oEntity.dom;
			param = oEntity.param;
        };
        it.initEvent = function(){
			(function(el,opts){
				var travel;
            	$.addEvent(el, 'focus', function(){
					travel = handler.focus(el,opts);
				});
				$.addEvent(el, 'blur', function(){
					travel&&clearInterval(travel);
				});
			})(dom,param);
        };
        
        it.destroyParam = function(){
            dom = null;
            it.entity = null;
        };
        it.destroyEvent = function(){
           
      	};
        
        it.destroy = function(){
            sup.destroy();
        };
        
        it.init = function(){
            sup.init();
        };
        
        return it;
    }
});
