$Import('common.bubble.image');
STK.register('common.editor.widget.image',function($){
	return function(pid){
		$.log(pid);
		var that = {};
		var editor, image, aim, lock, clock;
		var insert = function(evt,data){
			editor.API.insertText(data.value);
			image.getBub().hide();
		};

		var uploaded =  function(evt, opts) {
			$.log('upload');
			var words = editor.API.getWords();
			if (words.length == 0) {
				editor.API.insertText(opts.text);
			}
			editor.API.addExtraInfo(opts.pid);
			lock = true;

		
		};

		var deletePic = function(evt, opts){
			editor.API.delWords(opts.text);
			editor.API.addExtraInfo('');
			clearInterval(clock);
		};


		var show = function(pid){
			if(lock){
				return;
			}
			$.core.evt.preventDefault();
			// Modified by L.Ming 根据是否有pid，执行不同的初始化
			if(typeof pid == "string"){
				image = $.common.bubble.image(editor.nodeList[aim],{pid:pid});
				$.log('has pid');
				clock =	setInterval(function(){
					image.bubble.setLayout(editor.nodeList[aim],{'offsetX':-29, 'offsetY':5});
				},200);
			} else {
				image = $.common.bubble.image(editor.nodeList[aim]);
			}

			$.custEvent.add(image, 'uploaded',uploaded);
			$.log(2222);
			$.custEvent.add(image, 'insert', insert);
			$.custEvent.add(image, 'deletePIC',deletePic);
			$.custEvent.add(image, 'hide', function(){
				$.custEvent.remove(image, 'hide', arguments.callee);
				$.custEvent.remove(image, 'uploaded',uploaded);
				$.custEvent.remove(image, 'insert', insert);
				$.custEvent.remove(image, 'deletePIC',deletePic);
				$.custEvent.remove(image, 'changeType');
				lock = false;
			});
		};

		that.init = function(owner, key, opts){
			editor = owner;
			aim = key;
			$.addEvent(owner.nodeList[aim], 'click', show);
			if(opts && opts.pid){
				show(opts.pid);
			}
		};

		that.clear = function(){

		};

		that.show = function(){

		};

		that.hide = function(){
			if(image){
				image.getBub().hide();
			}
		};
		that.resetBubble = function(elm){
			if(image){
				image.bubble.setLayout(elm,{'offsetX':-29, 'offsetY':5});
			}
		};

		that.destroy = function(){
			editor = null;
		};
		return that;
	};
});
