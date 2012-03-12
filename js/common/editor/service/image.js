$Import('common.bubble.image');
STK.register('common.editor.service.image',function($){
//	return function(pid){
	return function(editor,pars){
		pars = $.parseParam({
			tiger: '',
			el: ''
		},pars);
		
		var that = {};
		var image, aim, lock, clock, ispreview=false;
		var insert = function(evt,data){
			editor.API.insertText(data.value);
			image.getBub().hide();
		};

		var uploaded =  function(evt, opts) {
			ispreview = true;
			var words = editor.API.getWords();
			if (words.length == 0) {
				editor.API.insertText(opts.text);
			}
			editor.API.addExtraInfo(opts.pid);
			lock = true;
		};

		var deletePic = function(evt, opts){
			ispreview = false;
			editor.API.delWords(opts.text);
			editor.API.addExtraInfo('');
			clearInterval(clock);
			lock = false;
		};

		var show = function(pid){
			if(lock){
				return;
			}
			$.core.evt.preventDefault();
			// Modified by L.Ming 根据是否有pid，执行不同的初始化
			var el = pars['tiger']||pars['el']||editor.nodeList[aim],
				pid = pid||pars['pid'];
			
			if(typeof pid == "string"){
				image = $.common.bubble.image(el,{pid:pid});
				clock =	setInterval(function(){
					image.bubble.setLayout(el,{'offsetX':-29, 'offsetY':5});
				},200);
			} else {
				image = $.common.bubble.image(el);
			}

			$.custEvent.add(image, 'uploaded',uploaded);
			$.custEvent.add(image, 'insert', insert);
			$.custEvent.add(image, 'deletePIC',deletePic);
			//关闭浮层
			$.custEvent.add(editor, 'close',that.hide);
			$.custEvent.add(image, 'hide', function(){
				$.custEvent.remove(image, 'hide', arguments.callee);
				$.custEvent.remove(image, 'uploaded',uploaded);
				$.custEvent.remove(image, 'insert', insert);
				$.custEvent.remove(image, 'deletePIC',deletePic);
				$.custEvent.remove(image, 'changeType');
				$.custEvent.remove(editor, 'close',that.hide);
				ispreview = false;
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

		that.show = show;
		
		that.hide = function(devt,pars){
			if(pars&&pars['type']&&pars['type']=='publish'){
				image&&image.getBub().hide();
				return ;
			}
			if(!ispreview){
				image&&image.getBub().hide();
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
