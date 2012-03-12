/**
 * @author wangliang3
 */

$Import('module.editor');
$Import('common.editor.plugin.count');
$Import('common.editor.plugin.at');
//第三方组件下拉选单
$Import('common.editor.service.morePlugin');
//组件控制中心
$Import('common.editor.service.center');

STK.register('common.editor.service.base',function($){
	var service = $.common.editor.service,
		plugin = $.common.editor.plugin;
	
	return function(node,opts){
		var it = {},center,moreDropDown,devt,editor,at;
		//
		opts = $.kit.extra.merge({
			limitNum:140
		},opts)
		
		//
		var act = {
			more: function(pars){
				$.preventDefault();
				//更多按钮应用下拉选单
				!moreDropDown&&(moreDropDown=service.morePlugin(editor));
				moreDropDown.show(pars);
			}
		};
		var mouseover = {
			more: function(e){
				var el = $.fixEvent(e).target;
				if($.contains(editor.nodeList['more'],el)){
					return ;
				}
				act.more({el:editor.nodeList['more']});
			}
		};
		var mouseout = {
			more: function(e){
				moreDropDown&&moreDropDown.hide();
			}
		};
		
		var handler = {
			init: function(){
				//
				handler.build();
				//
				handler.bind();
			},
			build: function(){
				editor = $.module.editor(node,opts);
				at = plugin.at(editor,opts);
				if(typeof opts.count == 'undefined' || opts.count == 'enable'){
					var countP = plugin.count(editor,conf);
				}
				//启动at editor核心组件
				at.init();
				editor.init();
				//启动发布器组件扩展
				center = service.center(editor);
			},
			bind: function(){
				devt = $.delegatedEvent(editor.nodeList['widget']);
				for(var k in act){
					devt.add(k,'click',act[k]);					
				}
				//
				editor.nodeList['more']&&$.addEvent(editor.nodeList['more'],'mousemove',mouseover.more);
			},
			destroy: function(){
				editor.destroy();
				at.destroy();
				center.destroy();
				moreDropDown.destroy();
			},
			closeWidget: function(){
				center.close();
			}
		};
		//启动函数
		handler.init();
		//外抛行数
		it.editor = editor;
		it.destroy = handler.destroy;
		it.closeWidget = handler.closeWidget;
		return it;
	}
});