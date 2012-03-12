$Import('common.depand.editor');

STK.register('common.editor.widget.vote',function($){
	return function(){
		var that = {};
		var editor, vote, aim, isbinded = false;
		var insert = function(evt, data){
			editor.API.insertText(data);
			that.hide();
		};
		var require = $.common.depand.editor;
		
		var locked = false;
		var show = require.bind('asyn_vote', function(el, spec){
			locked = false;
			vote = $.common.bubble.vote(el, spec);
			isbinded || bind();
		}, {'onTimeout': function(){locked = false;}});
		
		var bind = function(){
			$.custEvent.define(vote, 'insert');
			$.custEvent.add(vote, 'insert', insert);
			isbinded = true;
		};
		
		var init = function(){
			$.core.evt.preventDefault();
			if(locked){ return; }
			locked = true;
			show(editor.nodeList[aim], {
				'itemMin': 2,
				'defaultItem': 2
			});
		};
		
		that.init = function(owner, key, opts){
			editor = owner;
			aim = key;
			$.addEvent(editor.nodeList[aim], 'click', init);
		};

		that.clear = function(){

		};

		that.show = function(){
			
		};

		that.hide = function(){
			$.custEvent.fire(vote, 'hide');
		};

		that.destroy = function(){
			editor = null;
			$.custEvent.remove(vote, 'insert');
		};
		return that;
	};
});
