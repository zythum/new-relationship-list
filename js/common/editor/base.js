$Import('module.editor');
//$Import('common.editor.pluginM');
$Import('common.editor.plugin.count');
$Import('common.editor.plugin.at');
//$Import('common.editor.plugin.topic');

STK.register('common.editor.base',function($){

	var defaultOpt={
		limitNum:140
	};


	function checker(){
	
	};
	return function(dom,opts){
		var that = {};
		var conf, editor, nodeList, widgetList;
		
		conf = $.kit.extra.merge(defaultOpt,opts)
		editor = $.module.editor(dom,conf);
		nodeList = editor.nodeList;
		widgetList = [];
		if(typeof opts.count == 'undefined' || opts.count == 'enable'){
			var countP = $.common.editor.plugin.count(editor,conf);
		}

		/*setTimeout(function(){
			var at = $.common.editor.plugin.at(editor,conf);
			at.init();
		},100);//延迟保证浮层发布器展示完成*/
		var at = $.common.editor.plugin.at(editor,conf);
		at.init();
		//var topic  = $.common.editor.plugin.topic(editor,conf);
		//topic.init();


		editor.init();
		editor.widget = function(widget, aim, opt){
			//$.log(widget);
			widgetList.push(widget);
			widget.init(editor, aim, opt);
			return editor;
		};

		editor.closeWidget = function(){
			if(widgetList && widgetList.length != 0){
				for(var i=0,l=widgetList.length;i<l;i++){
					widgetList[i].hide();
				}	
			}
		};
		
		return editor;
	};
});

