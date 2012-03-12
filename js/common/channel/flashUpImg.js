/**
* 定义flash图片上传频道 
* @author wangliang3@staff.sina.com.cn
*/
$Import('common.listener');
STK.register('common.channel.flashUpImg', function($){
	var eventList = [
		'initFun',
		'changeFlashHeightFun',
		'uploadCompleteFun',
		'closePhotoEditorFun',
         'cannelUpload',
         'completeUpload'
	];
	return $.common.listener.define('common.channel.flashUpImg', eventList);
	
});

