/**
 * 
 * @id $.common.content.report 举报
 * @param {Object} 事件对象
 * @return {Boolean}
 * @author zhaobo@staff.sina.com.cn
 * @example
 */


STK.register('common.content.report', function($){

	return function(obj){
		window.open("http://weibo.com/complaint/complaint.php?url="+$.kit.extra.parseURL().url);
		$.core.evt.preventDefault(obj.evt);
		return false;
	};
	
});
