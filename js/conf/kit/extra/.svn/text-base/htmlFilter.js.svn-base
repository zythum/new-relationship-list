/**
 * html XSS 过滤
 * @author liusong@staff.sina.com.cn
 */
STK.register('kit.extra.htmlFilter', function($){
	
	var  attrReg    = /([a-z\d-]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^\s]+)))?/ig
		,isOn       = /^on([a-z\d-]*)$/i
		,entiReg    = /&#(x?)([a-z\d]*);?/ig
		,killValMap = /(javascript|vbscript|expression|applet)/i
		,killTagMap = /^(audio|video|html|object|embed|applet|param|body|head|form|script|iframe|expression|applet|meta|xml|blink|style|frame|frameset|ilayer|layer|bgsound|title|base)$/i;
	
	var parseAttribute = function(sAttr){
		return sAttr.replace(attrReg, function(sEnti, sKey, sValue){
			var unenti = sEnti.replace(entiReg, function(){
				var  s = arguments[1]
					,n = arguments[2];
				return String.fromCharCode(s? parseInt(n, 16): n);
			}).replace(/(\s|%20)/g, '');
			return (killValMap.test(unenti) || isOn.test(sKey))? '': sEnti
		});
	};

	var parse = function(aInfo){
		var  sHtml = aInfo[0]
			,sEnd  = aInfo[1]
			,sTag  = aInfo[2]
			,sAttr = aInfo[3];
		if( killTagMap.test(sTag)){return ''}
		if(!sTag || !sAttr){return sHtml}
		if( sEnd){return ['</',sTag,'>'].join('')}
		return ['<', sTag, ' ', parseAttribute(sAttr), '>'].join('')
	};
	
	return function(sHtml){
		var snap = $.core.str.parseHTML(sHtml);
		snap = $.foreach(snap, parse);
		return snap.join('')
	};
});
