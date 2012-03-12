/**
 * feed中快捷键功能
 * @id comp.content.feedHotKey
 * @author Pjan | peijian@staff.sina.com.cn
 * @history
 */
 
STK.register("common.feed.feedList.plugins.feedHotKey", function($){
	
	return function(base){
		var that = {};

		var moveDown = function(){
			var feedList = base.getNodeList();
			
			var i = 0;
			var scrollPos = STK.core.util.scrollPos,
				position = STK.core.dom.position,
				feedPosition = 0;
				
			for(i=0; i<feedList.length; i++){
				feedPosition = position(feedList[i])["t"];
				var distance = feedPosition - scrollPos()["top"];
				if(distance > 42){
					break;
				}
			}
			STK.core.util.scrollTo(feedList[i], {"step":4, "top": 42});
		};
		
		var moveUp = function(){
			var feedList = base.getNodeList();
			
			var i = 0;
			var scrollPos = STK.core.util.scrollPos,
				position = STK.core.dom.position,
				feedPosition = 0;
				
			for(i=0; i<feedList.length; i++){
				feedPosition = position(feedList[i])["t"];
				var distance = feedPosition - scrollPos()["top"];
				if(distance >= 0){
					break;
				}
			}
			if(i == 0){
				STK.core.util.scrollTo(document.documentElement, {"step":4});
			}else{
				STK.core.util.scrollTo(feedList[i-1], {"step":4, "top": 42});
			}
		};
		
		//绑定键盘快捷键
		$.hotKey.add(document.documentElement , ['j'] , moveDown , {type : 'keydown' , 'disableInInput' : true});
		$.hotKey.add(document.documentElement , ['k'] , moveUp , {type : 'keydown' , 'disableInInput' : true});
		
		that.destroy = function() {
			// floatFix && floatFix.destroy();
			// node = dEvent = undefined;
		};
		return that;
	};
});