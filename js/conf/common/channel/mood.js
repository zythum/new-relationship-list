/**
* 定义发心情更改状态的Listener 
* @author Lianyi | lianyi@staff.sina.com.cn
* 发布心情之后，这块需要把发布心情改成已发布，不仅右侧的bubble需要，而且在dialog里面发布的心情也需要进行这个操作
*/
$Import('common.listener');
STK.register('common.channel.mood', function($){
	//@event refresh
	//TV频道的打开事件
	//data
	/**
	 * (1)changeMoodState用来更改写心情按钮
	 * (2)bubbleClose用来开启和关闭body上的冒泡
	 */
	var eventList = ['changeMoodState' , "bubbleClose"];
	// , 'calendarMood'];
	return $.common.listener.define('common.channel.mood', eventList);
	
});
