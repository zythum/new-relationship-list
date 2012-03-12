/**
 * @fileoverview
 *	旋转图片
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @param oImg {HTMLElement} 必选参数，要旋转的图片对象
 * @param sDirection {String} [left|right] 必选参数，旋转的方向，左或者右
 * @history
 *
 */
STK.register('kit.dom.rotateImage', function($){
	
	var _showRotate;
	if($.core.util.browser.IE){
		_showRotate = function (oImg, n){
			oImg.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ n +')';
			//HACK FOR MSIE 8
			switch(n){
				case 0:
				case 2:
					oImg.parentNode.style.height = oImg.height;
					break;
				case 1:
				case 3:
					oImg.parentNode.style.height = oImg.width;
					break;
			}
		};
	} else {
		_showRotate = function (oImg, n, sImgId){
			var _canvas = document.getElementById('canvas_'+ sImgId);
			if(_canvas == null){
				oImg.style.opacity = '0';
				oImg.style.position = 'absolute';
				_canvas = document.createElement('canvas');
				_canvas.setAttribute("id", 'canvas_' + sImgId);
				oImg.parentNode.appendChild(_canvas);
			}
			var canvasContext = _canvas.getContext('2d');
			switch(n) {
				case 0 :
					_canvas.setAttribute('width', oImg.width);
					_canvas.setAttribute('height', oImg.height);
					canvasContext.rotate(0 * Math.PI / 180);
					canvasContext.drawImage(oImg, 0, 0);
					break;
				case 1 :
					_canvas.setAttribute('width', oImg.height);
					_canvas.setAttribute('height', oImg.width);
					canvasContext.rotate(90 * Math.PI / 180);
					canvasContext.drawImage(oImg, 0, -oImg.height);
					break;
				case 2 :
					_canvas.setAttribute('width', oImg.width);
					_canvas.setAttribute('height', oImg.height);
					canvasContext.rotate(180 * Math.PI / 180);
					canvasContext.drawImage(oImg, -oImg.width, -oImg.height);
					break;
				case 3 :
					_canvas.setAttribute('width', oImg.height);
					_canvas.setAttribute('height', oImg.width);
					canvasContext.rotate(270 * Math.PI / 180);
					canvasContext.drawImage(oImg, -oImg.width, 0);
					break;
			}		
		};
	}
	
	function rotate(oImg, sDirection){
		if(oImg == null || sDirection == null){ return; }
		oImg = (typeof oImg == "string") ? document.getElementById(oImg) : oImg;
		var _dynamicId = oImg.getAttribute("dynamic-id");
		sDirection = sDirection.toLowerCase();
		
		// 取得当前的旋转角度
		var _nDegree = oImg.getAttribute('degree') * 1;
		_nDegree = (_nDegree > 3 || _nDegree < 0) ? 0 : (_nDegree || 0);
		
		// 根据方向，调整目标旋转角度
		var _control = {
			"right" : function (n){
				return (n == 3) ? 0 : n + 1;
			},
			"left" : function (n){
				return (n == 0) ? 3 : n - 1;
			}
		};
		_nDegree = _control[sDirection](_nDegree);
		oImg.setAttribute('degree', _nDegree);
		
		_showRotate(oImg, _nDegree, _dynamicId);
	}
	return rotate;
});