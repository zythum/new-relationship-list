STK.register('kit.dom.insertText',function($){
	/**
	 * 选择TextArea中的某段文字仅对IE有效
	 * @param {HTMLElement} el		必选参数,TextArea对像
	 * @param {Object}      pos      必选参数，选择起始位置
	 * @param {Object}      len      必选参数，选择结束位置
	 */
	var setCursor = function(spec){//el,pos,len
		var range = el.createTextRange();
		range.collapse(true);
		range.moveStart('character',pos+1);
		range.moveEnd('character',len-2);
		range.select();
	};


	/**
	 * 插入@及话题
	 * @param {HTMLElement} el 必选参数,TextArea对像
	 * @param {Object}      value   必选参数，插入@及话题的默认文字
	 * @param {Function}    focus   可选参数，焦点处理
	 * @param {Boolean} allowRepeat  可选参数, 是否允许重复（默认不允许）
	 */

	var insertTextArea = function(spec){//el, value, focus,allowRepeat
		try{
			var elFocus = spec.focus || function(){el.focus()};
			var textIndex = el.value.indexOf(value);
			//如果已插入话题或@则选中已插入内容
			if(textIndex !== -1 && !allowRepeat){
				elFocus();
				if($IE){
					setCursor(el,textIndex,value.length);
				}else{
					el.setSelectionRange(textIndex+1,textIndex + value.length - 1);
				}
				return false;
			}
			//在用户未插入话题时,在用户光标位置或选取区插入默认文本
			if ($IE) {
				try {
					if (el.createTextRange && el.caretPos) {
						var caretPos = el.caretPos;
						if(caretPos.text.charAt(caretPos.text.length - 1) === ' '){
							caretPos.text = value + ' ';
						} else {
							caretPos.text = value;
						}
					} else {
						el.value += value;
					}
					elFocus();
					setCursor(el,el.value.indexOf(value),value.length);
				}catch(exp){
					
				}
			} else {
				if (el.setSelectionRange) {
					var rangeStart = el.selectionStart;
					var rangeEnd = el.selectionEnd;
					var tempStr1 = el.value.substring(0, rangeStart);
					var tempStr2 = el.value.substring(rangeEnd);
					el.value = tempStr1 + sValue + tempStr2;
					el.setSelectionRange(tempStr1.length + 1, tempStr1.length + value.length - 1);
				}
				else {
					el.value += value;
				}
				elFocus();
			}
		}catch(exp){
			el.value += value;
			elFocus();
		}
	};
	
	return function(spec){
		var that = {};
		var getPos = function(){
            if (spec['dom'].createTextRange) {
                spec['dom'].caretPos = document.selection.createRange().duplicate();
            }
        };
		$.core.evt.addEvent(spec['dom'], "keyup", getPos);
        $.core.evt.addEvent(spec['dom'], "focus", getPos);
        $.core.evt.addEvent(spec['dom'], "click", getPos);
        $.core.evt.addEvent(spec['dom'], "select", getPos);
		that.action = function(str,  isFocus,allowRepeat){
			insertTextArea(spec['dom'], str, isFocus, allowRepeat);
			return that;
		};
		return that;
	};
});