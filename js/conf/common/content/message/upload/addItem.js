/**
 * common.content.message.upload
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
*/
STK.register('common.content.message.upload.addItem', function($){
	var $L = $.kit.extra.language;
	return function(uploadList,fileName,ext){
		var swfId = uploadList.getAttribute('swfId')||'';
		//$.log('[common.content.message.upload.addItem] :addItem',uploadList,fileName,ext);
		var itemTemp;
		var extName = $.common.content.message.upload.getExt(fileName);
		var fullName = fileName;
		var fileName = ($.core.str.bLength(fileName)>20)?$.core.str.leftB(fileName,20)+'...':fileName;
		if(ext.thumbnail && ext.thumbnail.length != 0){
			itemTemp = '<img src="'+ext.thumbnail+'" class="img" alt="图片" title="'+fullName+'">'+fileName+'<span class="func"><a class="W_linkb del" href="javascript:void(0)" node-type="deleteFile" action-type="deleteFile" action-data="swfId='+swfId+'&'+STK.core.json.jsonToQuery(ext)+'">删除</a></span>';
		}else{
			itemTemp = '<i><img src="'+$CONFIG['imgPath']+'style/images/accessory/'+extName+'.png" class="doc" alt="附件文件" title="'+fullName+'"></i>'+fileName+'<span class="func"><a class="W_linkb del" href="javascript:void(0)" node-type="deleteFile" action-type="deleteFile" action-data="swfId='+swfId+'&'+STK.core.json.jsonToQuery(ext)+'">删除</a></span>';
		}
		var UPLOADINGTPL ='<li>'+itemTemp+'</li>';
		uploadList.style.display='block';
		uploadList.innerHTML+=UPLOADINGTPL;
		var oldFid = uploadList.getAttribute('fid') || '';
		uploadList.setAttribute('fid',oldFid+ext.fid+',');
		//		var oldFid = liItem.parentNode.getAttribute('fid') || '';
		//		liItem.parentNode.setAttribute('fid',oldFid+ext.fid+',');
	}
});
