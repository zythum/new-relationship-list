$Import('module.bubble');
$Import('core.util.getUniqueKey');

STK.register('ui.bubble', function($){
	var TEMP =['<div class="W_layer" node-type="outer">'
					,'<div class="bg">'
						,'<table cellspacing="0" cellpadding="0" border="0">'
							,'<tbody><tr><td><div class="content" node-type="layoutContent">'
								,'<a class="W_close" href="javascript:void(0);" node-type="close" title="关闭"></a>' 
								,'<div node-type="inner"></div>'
							,'</div></td></tr></tbody>'
						,'</table>'
						,'<div class="arrow arrow_t" node-type="arrow"></div>'
					,'</div>'
				,'</div>'].join('');
	
	var cache = [];
	return function(spec){
		var conf = $.parseParam({
			'template': TEMP,
			'isHold': false
		},spec);
		//
		var handler = {
			get: function(){
				if(conf['isHold']){
					return $.module.bubble(conf['template'],conf);
				}else{
					return handler.checkBob();
				}
			},
			checkBob: function(){
				var bub;
				for(var i=0,len=cache.length;i<len;i++){
					if(!cache[i]['used']){
						bub = cache[i]['bub'];						
						continue;
					}
				}
				if(!bub){
					bub= handler.create();					
				}
				return bub;
			},
			refresh: function(el,st){
				for(var i=0,len=cache.length;i<len;i++){
					if(el === cache[i]['bub']){
						cache[i]['used'] = st;
						return ;
					}
				}
			},
			cevt: function(el){
				$.custEvent.add(el, 'hide', function(){
					handler.refresh(el,false);
					el.clearContent();					
				});
				$.custEvent.add(el, 'show', function(){
					handler.refresh(el,true);
				});
			},
			create: function(){
				var bub = $.module.bubble(conf['template'],conf);
				//cache dom
				cache.push({'bub' : bub, 'used' : true});
				handler.cevt(bub);
				return bub;
			}
		};
		return handler.get();
	};
});
