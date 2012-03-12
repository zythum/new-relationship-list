/**
 * 点击 “你发表的所有私密微博会显示在这里，只有自己有权查看，赶快发一条试试吧！”
 * 弹出简版发布层（林水洋需求）
 * @author lianyi@staff.sina.com.cn
 */

$Import('common.feed.feedList.utils');
$Import('common.dialog.publish');

STK.register('common.feed.feedList.plugins.publishTo', function($){
	var utils = $.common.feed.feedList.utils;
	
	return function(base) {
		if (!base) {
			$.log("publishTo : need object of the baseFeedList Class");
			return;
		}
		/**
		 * 简版发布器句柄，可以添加自定义事件和destroy时调用
		 */		
		var simplePublish , pubSuccess = 0;
		/*
		var hideCustFun = function() {
			if(pubSuccess) {
				window.location.reload();					
			}
		};
			
		var publishSuccFun = function() {
			pubSuccess = 1;
		};
		*/	
		base.getDEvent().add("feed_list_publishTo", "click", function(obj) {
			simplePublish = $.common.dialog.publish();
			simplePublish.show();
			/*
			$.custEvent.add(simplePublish, 'publish', publishSuccFun);
			$.custEvent.add(simplePublish, 'hide', hideCustFun);
			*/				
			return utils.preventDefault(obj.evt);
		});
		
		var that = {
			destroy: function() {
				simplePublish && simplePublish.destroy && simplePublish.destroy();
				/*
				simplePublish && $.custEvent.remove(simplePublish, 'hide', hideCustFun);
				simplePublish && $.custEvent.remove(simplePublish, 'publish', publishSuccFun);
				*/
			}
		};
		
		return that;
	};
});