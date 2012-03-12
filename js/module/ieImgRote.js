/**
 * @author wangliang3
 */
$Import('module.imgResize');
STK.register('module.ieImgRote', function($){

	var pos = {
		0: 0,
		90: 1,
		180: 2,
		270: 3
	};
	
	return function(img, angle, maxw){
		maxw = maxw||440;
		//
		var _angle = img.getAttribute('pos');
		_angle = !_angle ? angle : ((_angle*1 + angle) % 360);
		_angle<0&&(_angle =(360+_angle));
		img.setAttribute('pos', _angle);
		
		var pNode = img.parentNode;
		if(!img.dw){
			img.dw = img.width;
			img.dh = img.height;
			img.cs = img.style.cssText;
			img.pcs = pNode.style.cssText;
		}
		
		var _sin = Math.sin(Math.PI * _angle / 180);
		var _cos = Math.cos(Math.PI * _angle / 180);
		
		if(pos[_angle]==0||pos[_angle]==2){
			//0、180位置
			img.style.cssText = img.cs;
			pNode.style.cssText = img.pcs;
			img.width = img.dw;
			img.height = img.dh;
		}else{
			$.module.imgResize(img, maxw, img.dw);
			$.setStyle(pNode, 'height', img.width);
			$.setStyle(pNode, 'position', 'relative');
			$.setStyle(img, 'position', 'absolute');
			$.setStyle(img, 'left', Math.abs((maxw-img.height)/2));
			$.setStyle(img, 'top', 0);
		}
		img.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + _cos + ",M12=" + (-_sin) + ",M21=" + _sin + ",M22=" + _cos + ",SizingMethod='auto expand')";
	}
});
