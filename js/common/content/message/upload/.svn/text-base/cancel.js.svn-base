/**
* common.content.message.upload.cancel
* @id STK.
* @author WK | wukan@staff.sina.com.cn
* @example
* 
*/
$Import('common.content.message.upload.deleteItem');
$Import('kit.extra.runFlashMethod');
$Import('common.channel.flashUpImg');

STK.register('common.content.message.upload.cancel', function($){
	return function(swfId,token){
		$.log('cancelUpload',swfId,token);
		var target = $.sizzle('li[node-type="li_'+token+'"]')[0];
		$.common.content.message.upload.deleteItem(target,'cancel');
        $.common.channel.flashUpImg.fire("cannelUpload");
		var flashObj = $.common.content.message.upload.getFlash(swfId);
		//$.log('flashObj',flashObj);
		$.kit.extra.runFlashMethod(flashObj , 'cancelUpload' , function() {
				try{
                    flashObj.cancelUpload(token);
                }catch(e){}
		});
	}
});
