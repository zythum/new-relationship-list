$Import('common.depand.editor');

STK.register('common.editor.service.vote',function($){
	return function(editor,pars){
		pars = $.parseParam({
			tiger: '',
			el: ''
		},pars);
		
		var that = {};
		var vote,aim;
		
		var insert = function(evt, data){
			editor.API.insertText(data);
			that.hide();
		};
		var require = $.common.depand.editor;
		
		var locked = false;
		var show = require.bind('asyn_vote', function(el, spec){
			locked = false;
			vote = $.common.bubble.vote(el, spec);
			bind();
		}, {'onTimeout': function(){locked = false;}});
		
		var bind = function(){
			$.custEvent.define(vote, 'insert');
			$.custEvent.add(vote, 'insert', insert);
			//关闭浮层
			$.custEvent.add(editor, 'close',that.hide);
			$.custEvent.add(vote.layer, 'hide', function(){
				$.custEvent.remove(vote, 'insert', insert);
				$.custEvent.remove(editor, 'close', that.hide);
			});
		};
		
		var init = function(){
			$.core.evt.preventDefault();
			if(locked){ return; }
			locked = true;
			show(pars['tiger']||pars['el']||editor.nodeList[aim], {
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

		that.show = init;

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
