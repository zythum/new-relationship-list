$Import('common.bubble.face');

STK.register('common.editor.service.face',function($){
	return function(editor,pars){
		var that = {};
		var face, aim;
		pars = $.parseParam({
			t: 0,
			l: -15,
			tiger: '',
			el: ''
		}, pars);
		var insert = function(evt,data){
			editor.API.insertText(data.value);
			face.getBub().hide();
		};
		var show = function(){
			$.core.evt.preventDefault();
			face = $.common.bubble.face(pars['tiger']||pars['el']||editor.nodeList[aim], pars);
			$.custEvent.add(face, 'insert', insert);
			//关闭浮层
			$.custEvent.add(editor, 'close',that.hide);
			$.custEvent.add(face, 'hide', function(){
				$.custEvent.remove(face, 'hide', arguments.callee);
				$.custEvent.remove(face, 'insert', insert);
				$.custEvent.remove(editor, 'close',that.hide);
			});
			
		};
		
		that.init = function(owner, key, opts){
			editor = owner;
			aim = key;
			$.addEvent(owner.nodeList[aim], 'click', show);
		};
		
		that.show = show;
		
		that.hide = function(){
			if(face){
				face.getBub().hide();
			}
		};
		
		that.destroy = function(){
			editor = null;
		};
		return that;
	};
});
