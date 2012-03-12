/**
 * @author wangliang3
 */
STK.register("common.feed.feedList.plugins.imgAdvLoading", function($) {
	/**
	 * 用来标记window.onload已经成功
	 */
	var winLoaded ;
	
	return function(base, opts){
		if (!base) {
			$.log(" imgAdvLoading : need object of the baseFeedList Class");
			return;
		}
		
		var it = {}
			,queue = []
			,invalidate
			,cache = {}
			,clock
			,img;
	
		var destroy = function(){
			invalidate = null;
			queue.shift();
			img && (img = img.onload = img.onerror = null);
			clearTimeout(clock);
			doNext();
		};
		
		var loader = function(){
			var url = queue[0];
			if( !cache[url] && (cache[url] = 1)){
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
		
		var addQueue = function(arr){
			arr = $.isArray(arr)? arr: [arr];
			Array.prototype.push.apply(queue, arr);
			doNext();
		};
		
		$.custEvent.add(base, 'updateFeed', function(event, type, html){
			if(!html){return}
			var list = html.match(/<[^<]*feed_list_media_img[^>]>*/g);
			if( list){
				list = $.foreach(list, function(str){
					var src = str.match(/src\s*=\s*(?:'|")*([^'"]*)/);
					if(src && (src = src[1])){
						return src;
					}
				});
				/*
				 * 加载新feed的时候下载新图
				 */
				addQueue(list);
			}
		});
		
		var list = $.foreach($.sizzle('img[action-type=feed_list_media_img]', base.getNode()), function(node){
			return node.getAttribute('src')
		});
		
		/**
		 * loadTimer 是timer使用的句柄
		 */
		var loadTimer;
		
		/**
		 * 添加到window.onload或window.onload以后再去预加载大图片，要不抢占了页面加载时间
		 */
		var startIt = function() {
			if(winLoaded) {
				realStartFun();
			} else {
				$.addEvent(window , "load" , function() {
					if(!winLoaded) {
						clearTimeout(loadTimer);
						winLoaded = 1;
						realStartFun();	
					}
				});
				loadTimer = setTimeout(function() {
					winLoaded = 1;
					realStartFun();
				} , 5000); 				
			}
		};
		/**
		 * 真正下载的函数
		 */
		var realStartFun = function() {
			list && list.length && addQueue(list);
		}
		
		startIt();
		
		it.destroy = function(){
			cache = {};
			queue = [];
			destroy();
		};
	
		return it;
	}
});
