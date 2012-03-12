/**
 * widget flash
 */
$Import('widget.module.component');

STK.register('widget.component.flash', function($){
	return function(oEntity, oConf){
		var it = $.widget.module.component();
		var sup = $.core.obj.sup(it, ['init','destroy']);
		
		var cfg, src;
			
		it.initParam = function() {
			it.entity = oEntity;
			src = it.entity.param.src;
			cfg = $.parseParam({
				 'id' : 'swf_' + it.entity.uniqueID
				,'width' : '100%'
				,'height' : '100%' 
				}, it.entity.param);
			cfg.paras = $.parseParam({
				 'wmode' : 'opaque'
				,'quality' : 'high'
				,'bgcolor': '#ffffff'
				,'allowfullscreen' : false
				}, it.entity.param);
			//禁止第三方角本
			cfg.paras.allowscriptaccess = 'never';
			cfg.flashvars = it.entity.data;
			cfg.attrs = {'style' : 'visibility:visible'};
		};
		it.init = function() {
			sup.init();
			$.core.util.swf.create(it.entity.dom, src, cfg);
		};
		it.destroy = function() {
			it.entity.dom.innerHTML = '';
			sup.destroy();
		};
		
		return it;
	}
});
	// <embed id="STK_1320 828150206114" height="356" allowscriptaccess="always" style="visibility: visible;" pluginspage="http://get.adobe.com/cn/flashplayer/" flashvars="playMovie=true&amp;auto=1&amp;adss=0" width="440" allowfullscreen="true" quality="hight" src="http://you.video.sina.com.cn/api/sinawebApi/outplay.php/PB2ySSE+CTHK+l1lHz2stssM5aINt8vjiG+xv1qhIBEZDFjhZoPdK51SjyvJRpYWnmpJTJ03cf0jyH50Nvskh21xBggMwhCtWKhWJbjqiuyzBAwc+0tAsGuRHN1m67RY2DVDEhiUmq4F7UzeqDOXPG3zsVp0AZeHDx8ymw0rrsZGsgyVxfdV+g3V37/KEsEvqHpdaTnMsL4v.swf" type="application/x-shockwave-flash" wmode="transparent">