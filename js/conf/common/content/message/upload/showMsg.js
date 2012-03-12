/**
 * commen.content.message.upload.showMsg
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
*/
$Import('ui.alert');

STK.register('common.content.message.upload.showMsg', function($){
	return function(msg){
		STK.ui.alert(msg);
	}
});
