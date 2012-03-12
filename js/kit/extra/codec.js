STK.register("kit.extra.codec" , function($) {
	var encodeDecode = {
		encode : function(str) {
			var tNode = document.createTextNode(str);
			var div = $.C('div');
			div.appendChild(tNode);
			var result = div.innerHTML;
			div = tNode = null;
			return result;
		},
		decode : function(str) {
			var div = document.createElement('div');
	 		div.innerHTML = str;
			var result = div.innerText == undefined ? div.textContent : div.innerText;
			div = null;
	 		return result;
		}			
	};
	return encodeDecode;
});
