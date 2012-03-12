/**
 * common.editor.widget.module.writeTextEl
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
 */
STK.register('common.editor.widget.module.writeTextEl', function($){
	return function(nodes,editor,text){
		var textEl = nodes.textEl;
		var textVal = textEl.value;
		var textLen = text.length-2;
		$.core.evt.custEvent.fire(editor,'input',text);
		var end = $.kit.extra.textareaUtils.getCursorPos(textEl);
		$.kit.extra.textareaUtils.setCursor(textEl,end);
	}
});
