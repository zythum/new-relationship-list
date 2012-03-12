/**
 * @author peijian@staff.sina.com.cn
 */
$Import('widget.module.component');

STK.register('widget.component.timer', function($){
		
    return function(oEntity, oConf){
        var it = $.widget.module.component();
        var sup = $.core.obj.sup(it, ['init', 'destroy']);
        //pars
		
		var custemEventList = [
			 'submit',
			 'preview'
			 ];
		
		it.handle = function(){
			if(!it.entity.param){
				return;
			}
			var ent = it.entity.param;
			if(!ent["action"]){
				return;
			}
			if(ent["action"] == 'submit'){
				if(ent["setinterval"]){
					setInterval(function(){
						$.custEvent.fire(it.cId, 'submit', it.entity);
					}, parseInt(ent["setinterval"])*1000);
				}else{
					setTimeout(function(){
						$.custEvent.fire(it.cId, 'submit', it.entity);
					}, parseInt(ent["settimeout"])*1000);
				}
				
			}
			
			if(ent["action"] == 'preview'){
				if(ent["setinterval"]){
					setInterval(function(){
						$.custEvent.fire(it.cId, 'preview', [{
							"type": 'expand',
							"param": it.param
						}]);
					}, parseInt(ent["setinterval"])*1000);
				}else{
					setTimeout(function(){
						$.custEvent.fire(it.cId, 'preview', [{
							"type": 'expand',
							"param": it.param
						}]);
					}, parseInt(ent["settimeout"])*1000);
				}
			}
		};
        
        //
        it.initParam = function(){
			it.entity = oEntity;
			it.param = oEntity.param;
			it.cId = $.custEvent.define(it.entity.top, custemEventList);
			it.handle();
			
        };
        it.initEvent = function(){
        };
        
        it.destroyParam = function(){
           
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
