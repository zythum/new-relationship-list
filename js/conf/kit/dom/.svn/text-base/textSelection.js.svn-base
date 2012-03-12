/**
 * author Robin Young | yonglin@staff.sina.com.cn
 * 
 */

STK.register('kit.dom.textSelection', function($){
	return function(input, spec){
		var that, conf;
		that = {};
		conf = $.parseParam({},spec);
		
		var selectText = function(area){
			return $.core.dom.selectText(input,area);
		};
		
		var blurOption = function(){
			input['__areaQuery'] = $.jsonToQuery($.core.dom.textSelectArea(input));
		};
		
		var focusOption = function(){
			input['__areaQuery'] = false;
		};
		
		$.addEvent(input,'beforedeactivate',blurOption);//for IE6
		$.addEvent(input,'active',focusOption);
		
		var selectionArea = function(){
			var ret = null;
			try{
				ret = $.core.dom.textSelectArea(input);
			}catch(exp){
				ret = $.queryToJson(input['__areaQuery']);
			}
			if(ret.start === 0 && ret.len === 0 && input['__areaQuery']){
				ret = $.queryToJson(input['__areaQuery']);
			}
			ret.start = parseInt(ret.start, 10);
			ret.len = parseInt(ret.len, 10);
			return ret;
		};

		var insertText = function(str, area){
			var value = input.value;
			var start = area.start;
			var len = area.len || 0;
			var insertBeforeStr = value.slice(0, start);
			var insertAfterStr = value.slice(start + len, value.length);
			input.value = insertBeforeStr + str + insertAfterStr;
			value = null;
			insertBeforeStr = null;
			insertAfterStr = null;
			var start = null;
			var len = null;
		};
		
		that.setCursor = function(area){
			selectText(area);
		};
		
		that.getCursor = function(){
			return selectionArea();
		};
		
		that.insertCursor = function(str){
			var area = selectionArea();
			insertText(str,area);
			area.len = str.length;
			selectText(area);
		};
		
		that.TempletCursor = function(temp){
			var area, str, insertStr;
			area = selectionArea();
			if(area.len > 0){
				str = input.value.substr(area.start, area.len);
			}else{
				str = '';
			}
			insertStr = $.templet(temp, {'origin' : str});
			insertText(insertStr, area);
			area.start = area.start + temp.indexOf('#{origin');
			area.len = insertStr.length - temp.replace(/#\{[origin].+?\}/,'').length;
			selectText(area);
		};
		
		that.insertText = insertText;
		
		that.destroy = function(){
			$.removeEvent(input,'beforedeactivate',blurOption);
			$.removeEvent(input,'active',focusOption);
			input = null;
		};
		return that;
	};
});