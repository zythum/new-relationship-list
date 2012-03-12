$Import('common.bubble.topic');

STK.register('common.editor.widget.topic',function($){
	return function(){
		var that = {};
		var editor, topic, aim, isAdded=false;
		var tUtil = $.kit.extra.textareaUtils;
		var DEFAULT = {text:'#在这里输入你想要说的话题#'};

		var insertNewTopic = function(evt,data){//推荐的话题也需要检查是否已经插入，所以此方法在二期准备去掉 todo
			editor.API.insertText(data.value);
			//$.log('insertNewTopic');
			that.hide();
		};
		var insertBlankTopic = function(evt,data){
			
			var text = data.value;
			var textEl = editor.nodeList.textEl;
			var textVal = textEl.value;
			//$.log(text,textVal);
			var textLen = text.length-2;
			if(textVal.indexOf(text) != -1){
				var index = textVal.indexOf(text);
				$.kit.extra.textareaUtils.setCursor(textEl,index+1,textLen);
			}else{
				//$.core.evt.custEvent.fire(editor,'input',text);
				editor.API.insertText(text);
				var end = $.kit.extra.textareaUtils.getCursorPos(textEl);
				$.kit.extra.textareaUtils.setCursor(textEl,end-(textLen+1),textLen);
			}
			//$.log('insertBlankTopic');
			that.hide();
		};
		var blank_topic = function(evt,data){
			//$.log('blank_topic start');
			var a=$.kit.extra.textareaUtils.getSelectedText(editor.nodeList.textEl);
			
			var l = a.length*1;
			//$.log('l='+l,'data=',data.value,'a=',a);
			if(l==0 || DEFAULT.text.indexOf(a) > -1){
				//$.log('0');
				insertBlankTopic(evt,data);
			}else{
				//$.log('replace');
				var newa = '#'+a+'#';
				tUtil.replaceText(editor.nodeList.textEl,newa);
				that.hide();
			}
			//$.log('blank_topic');
		};
		var addEvt = function(){
			//$.log('editor.widget addEvt',isAdded);
			//if(STK.core.util.browser.IE6){
				//isAdded = true;
			//}
			$.custEvent.add(topic, 'insert', insertBlankTopic);
			//$.log('bind blank_topic');
			$.custEvent.add(topic, 'blank_topic', blank_topic);
			/*$.custEvent.add(topic, 'hide', function(){
				$.log('remove');
				$.custEvent.remove(topic, 'blank_topic');
				$.custEvent.fire(that, 'blank_topic', {'value': 'aaaa'});
				$.custEvent.remove(topic, 'hide', arguments.callee);
				$.custEvent.remove(topic, 'insert');

			});*/
		};
		var show = function(){
			$.core.evt.preventDefault();
			topic = $.common.bubble.topic(editor.nodeList[aim]);
			if(!isAdded){

				addEvt();
			}
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
			//topic.getBub().hide();
			$.custEvent.fire(topic,'hide');
			//$.custEvent.remove(topic);
			//$.log('widget hide ',topic);
		};

		that.destroy = function(){
			editor = null;
		};
		return that;
	};
});
