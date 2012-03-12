/**
 * @author wangliang3@staff.sina.com.cn
 */
$Import('kit.extra.language');
$Import('widget.module.component');
$Import('common.flash.multiFileUpload');

STK.register('widget.component.file', function($){
		
    return function(oEntity, oConf){
        var it = $.widget.module.component();
        var sup = $.core.obj.sup(it, ['init', 'destroy']);
        //pars
        var dom,param,file,id,tip;
        //input/textarea action 
        var handler = {
			init: function(){
				var conf = $.parseParam({
					id: 'swf_upbtn_'+$.getUniqueKey(),
					height: '',
					width: '',
					number: 1,
					size: 5242880,
					uploaded: handler.uploaded,
					error: handler.uperror
				},param);
				//创建flash占位dom
				var pdiv = $.C('div');				
				//创建flash替换dom
				var fdiv = $.C('div');
				fdiv.setAttribute('id',conf.id);
				//
				pdiv.appendChild(fdiv);
				dom.appendChild(pdiv);
				//设定容器样式
				dom.style.position = 'relative';
				pdiv.style.cssText = 'position:absolute;left:0;top:0;display:block;overflow:hidden;background-color:#000;filter:alpha(opacity=0);-moz-opacity:0;opacity:0;';
				param['width']&&(pdiv.style.width=param['width']+'px');
				param['height']&&(pdiv.style.height=param['height']+'px');
				//
				file = $.common.flash.multiFileUpload(conf);
			},
			uploaded: function(api,data){
				
				//
				var ids = [],data = data.data;
				for(var k in data){
					ids.push(data[k].pid);
				}
				dom.setAttribute('value',ids.join(','));				
				//
				$.custEvent.fire(oEntity.top,'preview',[{type:'img',data:ids,param:param}]);
				//
				tip = $.sizzle('i[node-type=tip]')[0];
				tip&&(tip.style.display = 'none');
			},
			uperror: function(api,data){
				//"fileSizeErr"
				tip = $.sizzle('i[node-type=tip]')[0];
				if(!tip){
					var tip = $.C('i');
					tip.className = 'W_spetxt';
					tip.setAttribute('node-type','tip');
					dom.appendChild(tip);
				}
				tip.innerHTML = $.kit.extra.language('#L{请选择不超过5M的图片}');
				tip.style.display = '';
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
        };
        
        it.destroyParam = function(){
            dom = null;
            it.entity = null;
        };
        it.destroyEvent = function(){
      	};
        
        it.destroy = function(){
            file.destroy();
			sup.destroy();
        };
        
        it.init = function(){
            sup.init();
        };
        
        return it;
    }
});
