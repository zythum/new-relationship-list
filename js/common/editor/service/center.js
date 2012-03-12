/**
 * @author wangliang3
 */
$Import('common.editor.service.face');
$Import('common.editor.service.image');
$Import('common.editor.service.video');
$Import('common.editor.service.music');
$Import('common.editor.service.topic');
$Import('common.editor.service.vote');
//第三方组件沙箱
$Import('common.editor.service.plugin');

STK.register('common.editor.service.center',function($){
	var service = $.common.editor.service;
	
	return function(editor,conf){
		conf = $.parseParam({
			widget: editor.nodeList['widget'],
			tiger: '',
			devent: ''
		},conf);
		
		var it={},devt,plugin;
		
		//兼容固定及旧的托管组件
		var fixed = {
			list: ['face', 'image', 'video', 'music', 'topic', 'vote'],
			entity: {},
			widgetList : {},
			func: function(key){
				return function(pars){
					if(!fixed.widgetList[key]) {
						fixed.widgetList[key] = service[key](editor,handler.actPars(pars)); 						
					}
					fixed.widgetList[key].show();
				}
			}
		};
		
		var handler = {
			init: function(){
				handler.bind();
			},
			actPars: function(pars){
				conf['tiger']&&(pars['tiger']=conf['tiger']);
				return pars;
			},
			bind: function(){
				//关闭浮层
				$.custEvent.define(editor, 'close');
				//
				devt = conf['devent']?conf['devent']:$.delegatedEvent(conf['widget']);
				//固定组件
				for(var i=0,len=fixed.list.length;i<len;i++){
					var k = fixed.list[i];
					fixed.entity[k] = fixed.func(k);
					devt.add(k,'click',fixed.entity[k]);
				}
				//第三方沙箱组件
				plugin = service.plugin(editor,conf);
				
			},
			close: function(){
				$.custEvent.fire(editor,'close',{type:'publish'});
			},
			destroy: function(){
				for (var i = 0, len = fixed.list.length; i < len; i++) {
					var k = fixed.list[i];
					devt.remove(k,'click',fixed.entity[k]);
				}
				//
				plugin.destroy();
			}
			
		};
		//
		handler.init();
		//
		it.close = handler.close;
		it.destroy = handler.destroy;
		
		return it;
	}
});
