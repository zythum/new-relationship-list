/**
 * STK.common.content.message
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
*/
$Import('common.content.message.upload.getExt');
$Import('common.channel.flashUpImg');

STK.register('common.content.message.upload.complete', function($){
	return function(swfId,token,fileName,ext){
		var extJson,extQuery,uploadTemp;
		var extName = $.common.content.message.upload.getExt(fileName);
		//$.log('extName = ',extName);
		var fullName = fileName;
		var fileName = ($.core.str.bLength(fileName)>20)?$.core.str.leftB(fileName,20)+'...':fileName;
		//$.log('swfid='+swfId+' complete',fileName, ext, token);
		//$.log('[common.content.message.upload.complete]:swfid='+swfId+'complete',fileName, token,STK.core.json.strToJson(ext),'ext=',ext);
		if(typeof ext == 'object'){
			extJson = ext;
			extQuery = STK.core.json.jsonToQuery(extJson);
		}else if(typeof ext == 'string'){
			extQuery = ext;
			extJson = STK.core.json.strToJson(ext);
		}
		if(ext.thumbnail){
			uploadTemp = '<img src="'+ext.thumbnail+'" class="img" alt="图片" title="'+fullName+'">'+fileName+'<span class="func"><a class="W_linkb del" href="javascript:void(0)" node-type="deleteFile" action-type="deleteFile" action-data="swfId='+swfId+'&'+extQuery+'">删除</a></span>';
		}else{
			uploadTemp = '<i><img src="'+$CONFIG['imgPath']+'style/images/accessory/'+extName+'.png" class="doc" alt="附件文件" title="'+fullName+'"></i>'+fileName+'<span class="func"><a class="W_linkb del" href="javascript:void(0)" node-type="deleteFile" action-type="deleteFile" action-data="swfId='+swfId+'&'+extQuery+'">删除</a></span>';
		}

		var liItem = $.sizzle('li[node-type="li_'+token+'"]')[0];
		liItem.innerHTML = uploadTemp;
		var oldFid = liItem.parentNode.getAttribute('fid') || '';
		liItem.parentNode.setAttribute('fid',oldFid+extJson.fid+',');
        $.common.channel.flashUpImg.fire('completeUpload');
	}
});
