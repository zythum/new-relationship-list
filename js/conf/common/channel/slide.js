/**
* 控件slide频道 
* @author wangliang3@staff.sina.com.cn
 */
$Import('common.listener');
STK.register('common.channel.slide', function($){
	var eventList = ['prev','next','view','loop'];
	return $.common.listener.define('common.channel.slide',eventList);
});
