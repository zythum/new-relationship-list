/**
 * common.content.message.upload
 * @id STK.common.content.message.upload
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
*/
$Import('common.content.message.upload.delegateEvt');

STK.register('common.content.message.upload.start', function($){
	var $L = $.kit.extra.language;
	//var lock = false;
	return function(swfId,fileName,token){
		var fullName = fileName;
		var fileName = ($.core.str.bLength(fileName)>20)?$.core.str.leftB(fileName,20)+'...':fileName;	
		$.log('[common.content.message.upload.start]: swf',$.sizzle('[swfid='+swfId+']'), token);
		var UPLOADINGTPL ='<li node-type="li_'+token+'"><p class="W_loading"><span>'+fileName+'&nbsp;&nbsp;上传中... <a href="javascript:void(0);" token="'+token+'" node-type="cancelUpload" action-type="cancelUpload" action-data="swfId='+swfId+'">取消上传</a></span></p></li>';
		var uploadList = $.sizzle('[swfid='+swfId+']')[0];
		uploadList.style.display='block';
		uploadList.innerHTML+=UPLOADINGTPL;
		//todo bindDelegate
		/*if(lock == false){
			$.log('lock ==',lock);
			//$.common.content.message.upload.delegateEvt(uploadList);
			lock == true;
			}*/
	}
});
