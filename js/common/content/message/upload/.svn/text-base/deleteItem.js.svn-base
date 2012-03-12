/**
 * common.content.message.upload.deleteItem
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
 */
STK.register('common.content.message.upload.deleteItem', function($){
	return function(target,type,data){
		/*target必须是li下的dom*/
		//$.log('remove dom from ',target,type,data);

		var li;
		li = target;
		if(target.tagName != 'LI'){
			var a = $.kit.dom.parents(target,{
				expr:'li'
			});
			var li = a[0];
		}
		var source = li.parentNode;
		$.removeNode(li);
		if(source.tagName == 'UL'){
			if($.sizzle('li',source).length == 0){
				source.style.display='none';
			}
			//去掉fid
			if(type == 'delete'){
				var fid = data.fid;
				//$.log(source);
				var oldFid = source.getAttribute('fid');
				var newFid = oldFid.replace(fid+',','');
				source.setAttribute('fid',newFid);
			}
		}

	}	
});
