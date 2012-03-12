/**
 * common.content.message.upload.getExt
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
 */
STK.register('common.content.message.upload.getExt', function($){
	var supportExtArray = {
		'csv':'csv',
		'doc':'word',
		'docx':'word',
		'xls':'excel',
		'xlsx':'excel',
		'ppt':'ppt',
		'pptx':'ppt',
		'pdf':'pdf',
		'rar':'rar',
		'zip':'rar',
		'txt':'txt',
		'mp3':'music',
		'avi':'video',
		'flv':'video',
		'mkv':'video',
		'mp4':'video',
		'mpeg':'video',
		'mpg2':'video',
		'rmvb':'video'
	};
	return function(str) {
		var ext = $.trim(str.match(/[^\.]+$/)[0]).toLowerCase();
		//$.log('ext length=',ext.length,'getExt =',ext);
		if(typeof supportExtArray[ext] != 'undefined'){
			//$.log('match');
			return supportExtArray[ext];
		}else{
			return 'default';
		}
	};
});
