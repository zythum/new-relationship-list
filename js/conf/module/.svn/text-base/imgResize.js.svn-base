/**
 * @author wangliang3@staff.sina.com.cn
 * @desc 图片大小等比缩放
 */
/*common poplayer*/
STK.register('module.imgResize', function($){
	return function(img,mw,mh){			
		var w = img.width,
			h = img.height;
		var per = w/h;
		//
		mw = mw||w;
		mh = mh||h;
		
		if(w>mw&&h>mh){      
			var pw = mw/w,
				ph = mh/h;
			if(pw>ph){
				h = mh;
				w = h*per;
			}else{
				w = mw;
				h = w/per;
			}
		}else if(w>mw){
			w = mw;
			h = w/per;
		}else if(h>mh){
			h = mh;
			w = h*per;
		}else{
			return {w:w,h:h};
		}
		img.width=w;
		img.height=h;
		return {
			w: w,
			h: h
		}
	};
});
