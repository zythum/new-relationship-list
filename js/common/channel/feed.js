/**
* 定义小黄签信道的事件 
* @author Robin Young | yonglin@staff.sina.com.cn
* @modify yadong | yadong2@staff.sina.com.cn
* 增加了刷新的频道
* 
* @modify runshi | runshi@staff.sina.com.cn 2011121
* 增加Tag更新频道
*/
$Import('common.listener');
STK.register('common.channel.feed', function($){
	var eventList = [
		'forward',
		'publish',
		'comment',
		'delete',
		'refresh',
		'reply',
		'feedTagUpdate'
	];
	return $.common.listener.define('common.channel.feed', eventList);
	
});