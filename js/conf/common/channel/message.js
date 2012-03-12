/**
* 定义私信信道的事件 
* @author WK | wukan@staff.sina.com.cn
*/
$Import('common.listener');
STK.register('common.channel.message', function($){
	var eventList = [
		'create',
		'delete'
	];
	return $.common.listener.define('common.channel.message', eventList);
	
});

