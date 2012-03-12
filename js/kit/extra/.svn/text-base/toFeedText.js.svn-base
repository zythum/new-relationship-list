STK.register('kit.extra.toFeedText', function($){
	return function(html){
		if(typeof html !== 'string'){
			throw '[kit.extra.toFeedText]:need string as first parameter';
		}
		var list = $.core.str.parseHTML(html);
		var buffer = [];
		for(var i = 0, len = list.length; i < len; i += 1){
			if(!list[i][2]){
				buffer.push(list[i][0]);
			}else if(list[i][2].toLowerCase() === 'img'){
				var alt = list[i][3].match(/(?:alt\s*=\s*["|']?([^"|'|\s]+)["|']?)/);
				if(alt){
					buffer.push(alt[1]);//获取alt属性
				}
				
			}
		}
		return buffer.join('');
	};
});