/**
 * 临时的异步加载处理方式，模拟了一遍原有sendMessage(现：sendMessageMain.js)的接口实现
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('common.depand.asynSendMsg');
STK.register('common.dialog.sendMessage', function($) {
	var require = $.common.depand.asynSendMsg;
	return function(spec){
		var that = {}, sendMsg;
		
		var _show = require.bind('asyn_sendMsg', function(){
			sendMsg = $.common.dialog.sendMessageMain(spec);
			sendMsg.show();
		});
		
		that.show = function(){
			$.preventDefault();
			_show();
		};
		
		that.hide = function(){
			sendMsg && sendMsg.hide();
		};
		
		that.destroy = function(){
			sendMsg && sendMsg.destroy();
		};
		return that;
	};
});
