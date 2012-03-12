$Import("core.obj.parseParam");
$Import("core.util.getUniqueKey");
$Import("core.util.templet");
$Import("core.util.hideContainer");

STK.register('core.io.getIframeTrans', function($){
	var TEMP = '<iframe id="#{id}" name="#{id}" height="0" width="0" frameborder="no"></iframe>';
	return function(spec){
		var box, conf, that;
		conf = $.core.obj.parseParam({
			'id' : 'STK_iframe_' + $.core.util.getUniqueKey()
		}, spec);
		that = {};
		
		box = $.C('DIV');
		box.innerHTML = $.core.util.templet(TEMP, conf);
		$.core.util.hideContainer.appendChild(box);
		
		that.getId = function(){
			return conf['id'];
		};
		
		that.destroy = function(){
			box.innerHTML = '';
			try{
				box.getElementsByTagName('iframe')[0].src = "about:blank";
			}catch(exp){
			
			}
			$.core.util.hideContainer.removeChild(box);
			box = null;
		};
		
		return that;
	};
});