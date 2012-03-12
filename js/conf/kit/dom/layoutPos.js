STK.register('kit.dom.layoutPos', function($){
	return function(box, el, opts){
		if(!$.isNode(el)){
			throw 'kit.dom.layerOutElement need element as first parameter';
		}
		if (el === document.body) {
			return false;
		}
		if (!el.parentNode) {
			return false;
		}
		if (el.style.display === 'none') {
			return false;
		}
		var conf, shell, pos, size, posKey, shellPos, shellAttr;
		conf = $.parseParam({
			'pos' : 'left-bottom',
			'offsetX' : 0,
			'offsetY' : 0
		},opts);
		
		
		shell = el;
		if(!shell){
			return false;
		}
		while(shell !== document.body){
			shell = shell.parentNode;
			if(shell.style.display === 'none'){
				return false;
			}
			shellPos = $.getStyle(shell, 'position');
			shellAttr = shell.getAttribute('layout-shell');
			if(shellPos === 'absolute' || shellPos === 'fixed'){
				break;
			}	
			if(shellAttr === 'true' && shellPos === 'relative'){
				break;
			}
		}
		shell.appendChild(box);
		
		pos = $.position(el,{'parent' : shell});
		size = {
			'w' : el.offsetWidth,
			'h' : el.offsetHeight
		};
		
		
		
		posKey = conf['pos'].split('-');
		if(posKey[0] === 'left'){
			box.style.left = pos.l + conf.offsetX + 'px';
		}else if(posKey[0] === 'right'){
			box.style.left = pos.l + size.w + conf.offsetX + 'px';
		}else if(posKey[0] === 'center'){
			box.style.left = pos.l + size.w/2 + conf.offsetX + 'px';
		}
		if(posKey[1] === 'top'){
			box.style.top = pos.t + conf.offsetY + 'px';
		}else if(posKey[1] === 'bottom'){
			box.style.top = pos.t + size.h + conf.offsetY + 'px';
		}else if(posKey[1] === 'middle'){
			box.style.top = pos.t + size.h/2 + conf.offsetY  + 'px';
		}
		
		return true;
	};
});