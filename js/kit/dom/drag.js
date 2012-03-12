STK.register('kit.dom.drag',function($){
	
	return function(actDom,spec){
		var conf,that,beDragged,dragState,dragObj,perch,perchIn,perchAction;
		
		var init = function(){
			initParams();
			bindEvent();
		};
		
		var initParams = function(){
			conf = $.parseParam({
				'moveDom' : actDom,
				'perchStyle' : 'border:solid #999999 2px;',
				'dragtype' : 'perch',
				'actObj' : {},
				'pagePadding' : 5
			}, spec);
			beDragged = conf.moveDom;
			that = {};
			dragState = {};
			dragObj = $.drag(actDom, {
				'actObj' : conf.actObj
			});
			if(conf['dragtype'] === 'perch'){
				perch = $.C('div');
				perchIn = false;
				perchAction = false;
				beDragged = perch;
			}
			actDom.style.cursor = 'move';
		};
		
		var bindEvent = function(){
			$.custEvent.add(conf.actObj, 'dragStart', dragStart);
			$.custEvent.add(conf.actObj, 'dragEnd', dragEnd);
			$.custEvent.add(conf.actObj, 'draging', draging);
		};
		
		
		
		var dragStart = function(evt, op){
			document.body.style.cursor = 'move';
			var p = $.core.util.pageSize()['page'];
			dragState = $.core.dom.position(conf.moveDom);
			dragState.pageX		= op.pageX;
			dragState.pageY		= op.pageY;
			dragState.height	= conf.moveDom.offsetHeight;
			dragState.width		= conf.moveDom.offsetWidth;
			dragState.pageHeight= p['height'];
			dragState.pageWidth	= p['width'];
			if(conf['dragtype'] === 'perch'){
				var style = [];
				style.push(conf['perchStyle']);
				style.push('position:absolute');
				style.push('z-index:' + (conf.moveDom.style.zIndex + 10));
				style.push('width:' + conf.moveDom.offsetWidth + 'px');
				style.push('height:' + conf.moveDom.offsetHeight + 'px');
				style.push('left:' + dragState['l'] + 'px');
				style.push('top:' + dragState['t'] + 'px');
				perch.style.cssText = style.join(';');
				perchAction = true;
				setTimeout(function(){
					if(perchAction){
						document.body.appendChild(perch);
						perchIn = true;
					}
				},100);
			}
			if (actDom.setCapture !== undefined) {
				actDom.setCapture();
			}
		};
		
		var dragEnd = function(evt, op){
			document.body.style.cursor = 'auto';
			if (actDom.setCapture !== undefined) {
				actDom.releaseCapture();
			}
			if(conf['dragtype'] === 'perch'){
				perchAction = false;
				conf.moveDom.style.top = perch.style.top;
				conf.moveDom.style.left = perch.style.left;
				if(perchIn){
					document.body.removeChild(perch);
					perchIn = false;
				}
			}
		};
		
		var draging = function(evt, op){
			var y = dragState.t + (op.pageY - dragState.pageY);
			var x = dragState.l + (op.pageX - dragState.pageX);
			var yandh = y + dragState['height'];
			var xandw = x + dragState['width'];
			var pageh = dragState['pageHeight'] - conf['pagePadding'];
			var pagew = dragState['pageWidth'] - conf['pagePadding'];
			if(yandh < pageh && y > 0){
				beDragged.style.top = y + 'px';
			}else{
				if(y < 0){
					beDragged.style.top = '0px';
				}
				if(yandh >= pageh){
					beDragged.style.top = pageh - dragState['height'] + 'px';
				}
			}
			if(xandw < pagew && x > 0){
				beDragged.style.left = x + 'px';
			}else{
				if(x < 0){
					beDragged.style.left = '0px';
				}
				if(xandw >= pagew){
					beDragged.style.left = pagew - dragState['width'] + 'px';
				}
			}
		};
		
		init();
		that.destroy = function(){
			document.body.style.cursor = 'auto';
			if (typeof beDragged.setCapture === 'function') {
				beDragged.releaseCapture();
			}
			if(conf['dragtype'] === 'perch'){
				perchAction = false;
				if(perchIn){
					document.body.removeChild(perch);
					perchIn = false;
				}
			}
			$.custEvent.remove(conf.actObj, 'dragStart', dragStart);
			$.custEvent.remove(conf.actObj, 'dragEnd', dragEnd);
			$.custEvent.remove(conf.actObj, 'draging', draging);
			if(dragObj.destroy){
				dragObj.destroy();
			}
			conf = null;
			beDragged = null;
			dragState = null;
			dragObj = null;
			perch = null;
			perchIn = null;
			perchAction = null;
		};
		that.getActObj = function(){
			return conf.actObj;
		};
		return that;
	};
});