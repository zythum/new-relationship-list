$Import('common.bubble.face');

STK.register('common.editor.widget.face',function($){
	return function(spec){
		var that = {};
		var editor, face, aim, conf;
		conf = $.parseParam({
			't' : 0,
			'l' : -15
		}, spec);
		var insert = function(evt,data){
			editor.API.insertText(data.value);
			face.getBub().hide();
		};
		var show = function(){
			$.core.evt.preventDefault();
			face = $.common.bubble.face(editor.nodeList[aim], conf);
			$.custEvent.add(face, 'insert', insert);
			$.custEvent.fire(that , 'show' , face);
			$.custEvent.add(face, 'hide', function(){
				/**
				 * 移除外层show
				 */
				$.custEvent.remove(face, 'hide', arguments.callee);
				$.custEvent.remove(face, 'insert', insert);
				/**
				 * 触发外层hide
				 */				
				$.custEvent.fire(that , 'hide' ,face);
			});
		};
		
		that.init = function(owner, key, opts){
			editor = owner;
			aim = key;
			$.addEvent(owner.nodeList[aim], 'click', show);
			$.custEvent.define(that , "show");
			$.custEvent.define(that , "hide");
		};
		
		that.clear = function(){
			
		};
		
		that.show = function(){
			
		};
		
		that.hide = function(){
			
		};
		
		that.destroy = function(){
			editor = null;
			$.custEvent.undefine(that);
		};
		return that;
	};
});
