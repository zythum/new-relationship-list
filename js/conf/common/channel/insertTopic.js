/**
* 其它地方使用插入话题
* @author xinglong1 | xinglong1@staff.sina.com.cn
*/
$Import('common.listener');
STK.register('common.channel.insertTopic', function($){
	var eventList = [
		'insert'
	];
	return $.common.listener.define('common.channel.insertTopic', eventList);
});