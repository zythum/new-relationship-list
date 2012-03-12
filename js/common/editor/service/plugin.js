/**
 * wangliang3
 * 
 */
$Import('common.depand.editor');
$Import('common.trans.editor');
$Import('ui.litePrompt');

STK.register('common.editor.service.plugin',function($){
	var require = $.common.depand.editor,
		L = $.kit.extra.language,
		io = $.common.trans.editor;
	
	return function(editor,conf){
		conf = $.parseParam({
			tiger: '',
			el: '',
			widget: ''
		},conf);
		
		var it={},devt,box;
		
		//
		var locked = false;
		var handler={
			init: function(){
				devt = $.delegatedEvent(conf['widget']||editor.nodeList['widget']);
				devt.add('plugin','click',handler.show);
			},
			show: function(pars){
				$.preventDefault();
				if(locked) return;
				locked = true;
				handler.asynShow(pars);
			},
			asynShow: require.bind('asyn_sandbox', function(pars){
				locked = false;
				if(!box){
					box = $.common.bubble.sandbox({
						insert: handler.insert
					});				
				}
				var _show = function(){
					box.layers[id].layer.setLayout(conf['tiger']||pars['el'], {
						'offsetX': -20,
						'offsetY': 5
					});
					setTimeout(function(){
						box.layers[id].layer.show();	
					},0);
				};
				var id = pars.data.type;
				//验证箱子是不是已经存在
				if(!box.layers[id]){
					io.request('interactive',{
						onSuccess: function(data){
							var _data = $.kit.extra.merge({
								html:data.data.html,
								id: id
							},pars.data);
							box.add(_data);
							_show();
						},
						onError: function(){}
					},pars.data);
				}else{
					_show();
				}
			}, {'onTimeout': function(){locked = false;}}),
			insert: function(pars,data){
				editor.API.insertText(data.text);
				//
				$.ui.litePrompt(data.tip, {'type':'succM','timeout':'1000'});
			}
		};
		//启动
		handler.init();
		//外抛函数
		it.delegatedEvent = devt;
		it.show = handler.show;
		it.destory=function(){
			devt.destory();
			box.destory();
		};
		return it;
	}
});