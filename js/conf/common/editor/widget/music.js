/**
 * yuheng | yuheng@staff.sina.com.cn
 * 
 */
$Import('common.depand.editor');

STK.register('common.editor.widget.music',function($){
	return function(){
		var that = {};
		var require = $.common.depand.editor;
		var editor, music, aim, curPos;

		var insert = function(evt,data){
			//editor.API.insertText(data.value);
			var text = data.value + ' ';
			var textEl = editor.nodeList.textEl;
			var textVal = textEl.value;
			var textLen = text.length-2;
			if(textVal.indexOf(text) != -1){
				var index = textVal.indexOf(text);
				$.kit.extra.textareaUtils.setCursor(textEl,index+1,textLen);
			}else{
				editor.API.insertText(text,curPos);
			}

		};
		
		var locked = false;
		var asynShow = require.bind('asyn_music', function(){
			locked = false;
			music = $.common.bubble.music(editor.nodeList[aim]);
			$.custEvent.add(music, 'insert', insert);
			$.custEvent.add(music, 'hide', function(){
				$.custEvent.remove(music, 'hide', arguments.callee);
				$.custEvent.remove(music, 'insert', insert);
			});
			curPos = editor.API.getCurPos();
		},  {'onTimeout': function(){locked = false;}});
		
		var show = function(e){
			$.core.evt.preventDefault();
			if(locked){ return; }
			locked = true;
			asynShow(e);
		};
		
		that.init = function(owner, key, opts){
			editor = owner;
			aim = key;
			$.addEvent(owner.nodeList[aim], 'click', show);
		};

		that.clear = function(){

		};

		that.show = function(){

		};

		that.hide = function(){
			if(music){
				music.getBub().hide();
			}
		};

		that.destroy = function(){
			editor = null;
		};
		return that;
	};
});
