/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
STK.register('kit.dom.substitute', function($){
	var args = {
		'style'	 : 'border:solid #333 1px;background-color:#fff',
		'step' : 6,
		'type' : '',
		'className' : '',
		'onEnd' : $.funcEmpty
	};
	
	var cache = [];
	
	var getSubstitute = function(args){
		var substitute;
		for(var i = 0, len = cache.length; i < len; i += 1){
			if(cache[i].used !== true){
				substitute = cache[i];
				break;
			}
		}
		if(!substitute){
			substitute = $.C('DIV');
			cache.push(substitute);
		}
		substitute.className = args.className;
		setUsed(substitute);
		return substitute;
	};
	
	var setUsed = function(dom){
		document.body.appendChild(substitute);
		dom.used = true;
	};
	
	var setUnUsed = function(dom){
		document.body.removeChild(substitute);
		dom.used = false;
	};
	
	return function(orbit, spec){
		if(!$.isArray(orbit)){
			throw '[kit.dom.substitute need array as first parameter]';
		}
		var conf;
		conf = $.parseParam(args, spec);
		
		var substitute = getSubstitute({'className' : conf.className});
		$.timedChunk(orbit, {
			'process' : function(item){
				substitute.style.cssText = item;
			},
			'callback' : function(){
				setUnUsed(substitute);
				conf = null;
				substitute = null;
				conf.onEnd();
			},
			'execTime' : -1
		});
		
	};
});