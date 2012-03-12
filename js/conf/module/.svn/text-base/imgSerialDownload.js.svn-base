/**
 * @author peijian@staff.sina.com.cn
 */
STK.register('module.imgSerialDownload', function($){
	var queue = [], invalidate = 0, clock, img;
	
	var destroy = function(){
		invalidate = 0;
		queue.shift();
		img && (img = img.onload = img.onerror = null);
		clearTimeout(clock);
		doNext();
	};
	
	var loader = function(){
		var url, curr = queue[0];
		if( $.isNode(curr) && (url = curr.getAttribute('src'))){
			invalidate = 1;
			img = new Image();
			img.onload  = img.onerror = destroy;
			img.setAttribute('src', url.replace(/\/thumbnail\//,"/bmiddle/"));
			clock = setTimeout(destroy, 10000);
			return
		}
		destroy();
	};
	
	var doNext = function(){
		!invalidate && queue.length && loader();
	};
	
	return function(img){
		img = $.isArray(img)? img: [img];
		Array.prototype.push.apply(queue, img);
		doNext();
	}
});
