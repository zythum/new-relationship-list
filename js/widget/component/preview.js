/**
 * @author wangliang3@staff.sina.com.cn
 */
$Import('widget.module.component');
$Import('common.extra.imageURL');

STK.register('widget.component.preview', function($){
	var imgUrl = $.common.extra.imageURL;
	
    return function(oEntity, oConf){
        var it = $.widget.module.component();
        var sup = $.core.obj.sup(it, ['init', 'destroy']);
        //pars
        var dom,param;
        //input/textarea action 
        var handler = {
			/*
			 * @param data{Json} 数据传递
			 * @param data.type{String} 响应控件类型
			 * @param data.data{Json} 交互数据
			 * @param data.param{Json} 控件配置参数
			 */
			render: function(source,data){
				if(param['map']!=data.param['map']){
					return ;
				}
				switch(data.type){
					case 'img':
						handler.img(data); 
						break;
					case 'html':
						handler.html(data); 
						break;
					case 'expand':
						handler.expand(data);
						break;
				}
			},
			img: function(data){
				var pids = data.data,
					param = data.param||{};
				dom.innerHTML = '';

				for (var i = 0, len = pids.length; i < len; i++) {
					var img = $.C('img');
					img.src = imgUrl(pids[i]);
					dom.appendChild(img);
					//
					if(i==0&&param.once&&param.once==1){
						break;
					}
				}
			},
			html: function(data){
				dom.innerHTML = $.kit.extra.htmlFilter(data.data);
			},
			expand: function(data){
				var param=data.param;
				
				var states = {
					expand: '',
					fold: 'none'
				}; 
				if(param['fixed']){
					//默认设定控件固定行为，默认为展开，仅强制关闭行为
					dom.style.display=states[param['fixed']||'expand'];
					return;
				}
				dom.style.display=dom.style.display=='none'?'':'none';
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
			$.custEvent.add(oEntity.top,'preview', handler.render);
        };
        
        it.destroyParam = function(){
            dom = null;
            it.entity = null;
        };
        it.destroyEvent = function(){
      	};
        
        it.destroy = function(){
            $.custEvent.remove(oEntity.top,'preview', handler.render);
			sup.destroy();
        };
        
        it.init = function(){
            sup.init();
        };
        
        return it;
    }
});
