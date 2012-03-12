$Import('common.listener');
STK.register('common.channel.relation', function($) {
	var eventList = ['follow','unFollow','removeFans','block','unBlock','addFriends','removeFriends','updateRemark'];
	return $.common.listener.define('common.channel.relation', eventList);
});
