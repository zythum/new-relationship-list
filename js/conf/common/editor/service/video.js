/**
 * yuheng | yuheng@staff.sina.com.cn
 * 
 */
$Import('common.depand.editor');
$Import('common.trans.editor');
STK.register('common.editor.service.video',function($){
	return function(editor,pars){
		pars = $.parseParam({
			tiger: '',
			el: ''
		},pars);
		
		var that = {};
		var video, aim, curPos;
		var require = $.common.depand.editor;
		var locked = false;
		var insert = function(evt,data){
			//editor.API.insertText(data.value);
			var text = data.value;
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
		
		var upload = function(evt, spec){
			var pos,query,url;
			var words = editor.API.getWords();
			var pid = editor.API.getExtra();
			var opts = {
				pid : pid,
				publish : words
			};
			
			$.core.evt.preventDefault();
			
			query = $.core.json.jsonToQuery(opts,true);
			url = spec.url + (query?('?'+query):'');
			pos = $.core.dom.position(spec.el);
			window.open(url, "", "height=459,width=660,location=no,left=" + pos.l + ",top=" + pos.t);
		};
		
		var asynShow = require.bind('asyn_video', function(){
			locked = false;			
			video = $.common.bubble.video(pars['tiger']||pars['el']||editor.nodeList[aim]);
			$.custEvent.add(video, 'insert', insert);
			$.custEvent.add(video, 'upload', upload);
			//关闭浮层
			$.custEvent.add(editor, 'close',that.hide);
			$.custEvent.add(video, 'hide', function(){
				$.custEvent.remove(video, 'hide', arguments.callee);
				$.custEvent.remove(video, 'insert', insert);
				$.custEvent.remove(video, 'upload', upload);
				$.custEvent.remove(editor, 'close' , that.hide);
			});
			curPos = editor.API.getCurPos();
		}, {'onTimeout': function(){locked = false;}});
		
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

		that.show = show;

		that.hide = function(){
			if(video){
				video.getBub().hide();
			}
		};

		that.destroy = function(){
			editor = null;
		};
		return that;
	};
});
