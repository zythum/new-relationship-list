/**
 * get input/textarea selection
 * @id STK.core.dom.getSelectText
 * @alias STK.core.dom.getSelectText
 * @param {Element} input
 * @return {Object} {'start':[Number],'len':[Number]}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var area STK.core.dom.getSelectText($.E('input'));
 * //{'start':1,'len':3}
 */
STK.register('core.dom.textSelectArea', function($){
	return function(input){
		var ret = {
			'start' : 0,
			'len' : 0
		};
		if(typeof input.selectionStart === 'number'){
			ret.start = input.selectionStart;
			ret.len = input.selectionEnd - input.selectionStart;
		}else if(typeof document.selection !== undefined){
			var workRange = document.selection.createRange();
			//去他妈的IE6，傻逼浏览器，行为一直能死啊！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
			if(input.tagName === 'INPUT'){
				var surveyRange = input.createTextRange();
			}else if(input.tagName === 'TEXTAREA'){
				var surveyRange = workRange.duplicate();
				surveyRange.moveToElementText(input);
			}
			//end fuck IE6
			surveyRange.setEndPoint('EndToStart', workRange);
			ret.start = surveyRange.text.length;
			ret.len = workRange.text.length;
			workRange = null;
			surveyRange = null;
		}
		return ret;
	};
});