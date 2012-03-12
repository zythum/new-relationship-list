/**
 * author Robin Young | yonglin@staff.sina.com.cn
 * 还未完善
 */
$Import('kit.dom.textSelection');
STK.register('kit.dom.smartInput', function($){
	return function(input, spec){
		var conf, that, lengthLimit, getValue,selection; //generally;
		var startLazyInput , stopLazyInput, onLazyInput, lazyInputTimer, lazyInputStats = 'stop', lazyInputCache; //lazyInput;
		var onEnter, onCtrlEnter; //about enter;
		
		conf = $.parseParam({
			'notice' : '',
			'noticeClass' : null,
			'noticeStyle' : null,
			'maxLength' : null,
			'needLazyInput' : false,
			'LazyInputDelay' : 200
		}, spec);
		that = $.cascadeNode(input);
		selection = $.kit.dom.textSelection(input);
		$.custEvent.define(that, 'enter');
		$.custEvent.define(that, 'ctrlEnter');
		$.custEvent.define(that, 'lazyInput');
		
		lengthLimit = function(){
			if(conf['maxLength'] && $.bLength(input.value) > conf['maxLength']){
				input.value = $.leftB(input.value, conf['maxLength']);
			}
		};
		
		focusNotice = function(){
			if(input.value === conf['notice']){
				input.value = '';
				if(conf['noticeClass'] != null){
					$.removeClassName(input, conf['noticeClass']);
				}
			}
		};
		
		blurNotice = function(){
			if(input.value === ''){
				input.value = conf['notice'];
				if(conf['noticeClass'] != null){
					$.addClassName(input, conf['noticeClass']);
				}
			}
		};
		
		getValue = function(){
			lengthLimit();
			if(input.value === conf['notice']){
				return '';
			}
			return input.value;
		};
		
		onEnter = function(e){
			if(e.keyCode === 13){
				$.custEvent.fire(that,'enter',getValue());
			}
		};
		
		onCtrlEnter = function(e){
			if((e.keyCode === 13 || e.keyCode === 10) && e.ctrlKey){
				$.custEvent.fire(that,'ctrlEnter',getValue());
			}
		};
		
		//lazyInput
		startLazyInput = function(){
			if(lazyInputStats === 'stop'){
				lazyInputTimer = setInterval(onLazyInput, conf['LazyInputDelay']);
				lazyInputStats = 'sleep';
			}
		};
		
		stopLazyInput = function(){
			clearInterval(lazyInputTimer);
			lazyInputStats = 'stop';
		};
		
		onLazyInput = function(){//相当绕的逻辑，希望大家能看懂
			if(lazyInputCache === input.value){
				if(lazyInputStats === 'weakup'){
					$.custEvent.fire(that, 'lazyInput', input.value);
					lazyInputStats = 'sleep';
				}else if(lazyInputStats === 'waiting'){
					lazyInputStats = 'weakup';
				}
			}else{
				lazyInputStats = 'waiting';
			}
			lazyInputCache = input.value;
		};
		if(conf['needLazyInput']){
			$.addEvent(input, 'focus', startLazyInput);
			$.addEvent(input, 'blur', stopLazyInput);
		}
		//end lazyInput
		
		$.addEvent(input, 'focus', focusNotice);
		$.addEvent(input, 'blur', blurNotice);
		$.addEvent(input, 'keyup', lengthLimit);
		$.addEvent(input, 'keypress', onEnter);
		$.addEvent(input, 'keypress', onCtrlEnter);
		
		that.getValue = getValue;
		
		that.setValue = function(str){
			input.value = str;
			lengthLimit();
			return that;
		};
		that.setNotice = function(str){
			conf.notice = str;
			return that;
		};
		that.setNoticeClass = function(str){
			conf.noticeClass = str;
			return that;
		};
		that.setNoticeStyle = function(str){
			conf.noticeStyle = str;
			return that;
		};
		that.setMaxLength = function(num){
			conf.maxLength = num;
			return that;
		};
		that.restart = function(){
			blurNotice();
		};
		
		that.startLazyInput = startLazyInput;
		that.stopLazyInput = stopLazyInput;
		that.setCursor = selection.setCursor;
		that.getCursor = selection.getCursor;
		that.insertCursor = selection.insertCursor;
		that.insertText = selection.insertText;
		that.destroy = function(){
			if(conf['needLazyInput']){
				$.removeEvent(input, 'focus', focusNotice);
				$.removeEvent(input, 'blur', blurNotice);
			}
			stopLazyInput();
			$.removeEvent(input, 'focus', focusNotice);
			$.removeEvent(input, 'blur', blurNotice);
			$.removeEvent(input, 'keyup',lengthLimit);
			$.removeEvent(input, 'keypress',onEnter);
			$.removeEvent(input, 'keypress',onCtrlEnter);
			$.custEvent.undefine(that, 'enter');
			$.custEvent.undefine(that, 'ctrlEnter');
			$.custEvent.undefine(that, 'lazyInput');
			selection.destroy();
			that = null;
		};
		return that;
	};
});