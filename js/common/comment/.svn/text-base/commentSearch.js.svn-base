/**
 * 评论搜索
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
STK.register('common.comment.commentSearch', function($){
	return function(spec){
		var input		= spec.input,
			searchBtn	= spec.searchBtn,
			msg			= input.getAttribute('defval'),
			$L			= $.kit.extra.language,
			trim		= $.core.str.trim,
			searchCb	= spec.searchCb,
			that		= {};
			
		var bindDomFuns = {
			getValue		: function(){
				var inputVal = trim(input.value);
				return (inputVal === msg) ? '' : inputVal;
			},
			inputOnFocus	: function(){
				if (trim(input.value) === msg) {
					input.value = '';
					input.style.color = '#666';
				}
			},
			inputOnBlur		: function(){
				if(trim(input.value) === ''){
					input.value = msg;
					input.style.color = '#E0E0E0';
				}
			},
			searchClick		: function(){
				$.preventDefault();
				var val = bindDomFuns.getValue();
				if (val && typeof searchCb === 'function') {
					searchCb(val);
				}
			}
		};
		
		var bindDom = function(){
			$.addEvent(input, 'focus', bindDomFuns.inputOnFocus);
			$.addEvent(input, 'blur', bindDomFuns.inputOnBlur);
			$.addEvent(searchBtn, 'click', bindDomFuns.searchClick);
			$.core.evt.hotKey.add(input, ['enter'], bindDomFuns.searchClick);
		};
		
		var init = function(){
			bindDom();
		};
		
		var destroy = function(){
			$.removeEvent(input, 'focus', bindDomFuns.inputOnFocus);
			$.removeEvent(input, 'blur', bindDomFuns.inputOnBlur);
			$.removeEvent(searchBtn, 'click', bindDomFuns.searchClick);
			bindDomFuns = null;
		};
		init();
		
		that.destroy = destroy;
		return that;
	}
});
