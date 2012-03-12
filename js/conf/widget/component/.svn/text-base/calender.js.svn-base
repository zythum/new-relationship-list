/**
 * @author wangliang3@staff.sina.com.cn
 * style:/t4/style/css/module/combination/A_index.css
 */
$Import('widget.module.component');
$Import('common.feed.groupAndSearch.include.calendar');

STK.register('widget.component.calender', function($){
	var  calendar = $.common.feed.groupAndSearch.include.calendar;
		
    return function(oEntity, oConf){
        var it = $.widget.module.component();
        var sup = $.core.obj.sup(it, ['init', 'destroy']);
        //pars
        var dom,param;
        //input/textarea action 
        var handler = {
			init: function(){
				dom.setAttribute('readonly',true);
				dom.value = param['default'];
			},
			build: function(){
				var data = dom.value;
				data = /^\d{4}(\-|\/|\s|\,)\d{1,2}\1\d{1,2}$/.test(data)?data:0;
				new calendar(data, {
					source: dom,
					start: param['start'],
					end: param['end']
				});
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
        it.initEvent = function(){
            $.addEvent(dom,'focus',handler.build);
            $.addEvent(dom,'click',handler.build);
        };
        
        it.destroyParam = function(){
            dom = null;
            it.entity = null;
        };
        it.destroyEvent = function(){
            $.removeEvent(dom,'focus',handler.build);
            $.removeEvent(dom,'click',handler.build);
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
