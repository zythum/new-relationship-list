/**
 * @author wangliang3@staff.sina.com.cn
 */
STK.register('module.imgDownload', function($){
	var it = {},
		max=50,//缓存图片张数,一句单页最多feed条数，其他操作溢出部分清除
		cash=[];
	
	var clear = function(){
		var nums = cash.length;
		if(nums>max){
			for(var i=max/2;i>=0;i--){
				cash.pop();
			}
		}
	};
	
	it.parallel = function(el){
		var _img;
		_img = $.C('img');
		cash.push(_img);
		_img.setAttribute('src', el.getAttribute('src').replace(/\/thumbnail\//, '/bmiddle/'));
		clear();
	};
	it.destory = function(){
		cash = [];
	};
	return it;
});