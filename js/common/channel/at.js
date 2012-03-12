/**
* 定义at信道的事件 
* @author yadong | yadong2@staff.sina.com.cn
 */
$Import('common.listener');
STK.register('common.channel.at', function($){
	var eventList = ['open','close'];
	return $.common.listener.define('common.channel.at',eventList);
});
