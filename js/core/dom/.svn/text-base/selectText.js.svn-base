/**
 * set input/textarea selection
 * @id STK.core.dom.selectText
 * @alias STK.core.dom.selectText
 * @param {Element} input
 * @param {Object} {'start':[Number],'len':[Number]}
 * @return {void} 
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.selectText($.E('input'),{'start':1,'len':3});
 */
STK.register('core.dom.selectText', function(){
	return function(input,area){
		var start = area.start;
		var len = area.len || 0;
		input.focus();
		if(input.setSelectionRange){
			input.setSelectionRange(start,start + len);
		}else if(input.createTextRange){
			var range = input.createTextRange();
			range.collapse(1);
			range.moveStart('character', start);
			range.moveEnd('character', len);
			range.select();
		}
	};
});