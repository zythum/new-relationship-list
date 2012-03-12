/*
 * 解决运行flash方法时，flash未能加载完，导致运行失败的问题，采用轮询的方法处理
 * var flashObj = $.E('test');
 * var fileNum = 5 , fileSize = 100; 
 * $.kit.extra.runFlashMethod(flashObj , 'setInitSize' , function() {
 * 		flashObj.setInitSize(fileNum , fileSize);
 * });
 */
STK.register('kit.extra.runFlashMethod', function($){
	return function(flashObj , methodName , callBack) {
		var timeoutTimer , runFinish , funTimer;
		var fun = function() {
			if(flashObj[methodName]) {
				runFinish = true;
				clearTimeout(timeoutTimer);
				try {flashObj.TotalFrames()}catch(e){flashObj.TotalFrames};
				callBack();
			} else {
				funTimer = setTimeout(fun , 100); 				
			}	
		};
		fun();
		timeoutTimer = setTimeout(function() {
			if(!runFinish) {
				clearTimeout(funTimer);
			}			
		} , 10000);
		return {
			destroy : function() {
				clearTimeout(timeoutTimer);
				clearTimeout(funTimer);				
			}			
		};
	};		
});