/**
* common.content.message.upload.delegateEvt
* @id STK.common.content.message.upload
* @author WK | wukan@staff.sina.com.cn
* @example
* 
*/
$Import('common.content.message.upload.getFlash');
$Import('kit.dom.parents');
$Import('kit.extra.runFlashMethod');
$Import('common.channel.flashUpImg');

STK.register('common.content.message.upload.delegateEvt', function($){
	var $L = $.kit.extra.language;


	return function(node){

		var node = node;
		var that={};
		var cancelUpload = function(ret){
			$.log('cancelUpload',ret);
			var target = ret.el;
			var data = ret.data;
			var token = target.getAttribute('token');
			var swfId = data.swfId;
			//deleteItem(target,'cancel',data);
			$.common.content.message.upload.deleteItem(target,'cancel',data);
			var flashObj = $.common.content.message.upload.getFlash(swfId);
			//$.log('flashObj',flashObj);
			$.kit.extra.runFlashMethod(flashObj , 'cancelUpload' , function() {
				try{
                    flashObj.cancelUpload(token);
                }catch(e){}
			});
            $.common.channel.flashUpImg.fire("cannelUpload");

			return false;
			//return;
			//$.log('call flash cancel Upload token = ',token);
			//target.parentNode.parentNode.parentNode.removeNode();

		}

		var deleteFile = function(ret){
			//$.log('delete',ret);
			var target = ret.el;
			var data = ret.data;

			var swfId = data.swfId;
			$.log(swfId);
			//deleteItem(target,'delete',data);
			$.common.content.message.upload.deleteItem(target,'delete',data);
			if(data.size){

				//todo request
				var flashObj = $.common.content.message.upload.getFlash(swfId);
				//$.log('flashObj',flashObj);
				$.kit.extra.runFlashMethod(flashObj , 'afterDelete' , function() {
					flashObj.afterDelete(data.size);								
				});
				
			}
			return false;
			return;

		}

		var reset = function(){
			//$.log('reset node =',node);
			var nodes = $.kit.dom.parseDOM($.core.dom.builder(node.parentNode).list);
			//$.log(nodes);
			nodes.uploadList.setAttribute('fid','');
			nodes.uploadList.innerHTML = '';
			nodes.uploadList.style.display='none';
		}
		var delegate = $.core.evt.delegatedEvent(node);
		delegate.add('cancelUpload', 'click', cancelUpload);
		delegate.add('deleteFile', 'click', deleteFile);

		that.reset = reset;
		return that;
	}
});

