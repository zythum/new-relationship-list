/**
 *懒加载
 * @return {Object} 实例
 * @author xionggq | guoqing5@staff.sina.com.cn
 * @create at 2011-12-07
 */
$Import('kit.extra.require');
STK.register('common.depand.mood', function($){
	var rm = $.kit.extra.require;
	rm.register('asyn_publish', ['common.bubble.moodFeedPublish'], {'activeLoad': true});
	rm.register('asyn_share', ['common.dialog.moodComment'], {'activeLoad': true});
	rm.register('asyn_smallPublish', ['common.dialog.moodSmallPublish'], {'activeLoad': true});
	rm.register('asyn_detail', ['common.dialog.moodList'], {'activeLoad': true});
	return rm;
});