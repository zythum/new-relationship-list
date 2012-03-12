/**
 * author wk | wukan@staff.sina.com.cn
 */

$Import('kit.extra.language');
$Import('module.layer');

STK.register('ui.litePrompt',function($){

	var lang = $.kit.extra.language;
	var $easyT = $.core.util.easyTemplate;

	return function(msg, spec){
		var conf, that, layer, tm,box;
		var spec = $.parseParam({
			//direct:"up",
			//showCallback:$.core.func.empty,
			hideCallback:$.core.func.empty,
			type: "succM",//del/succ/error/warn
			msg: "",//信息
			'timeout':''
		}, spec);
		var template = spec.template ||
		'<#et temp data>'+
'<div class="W_layer" node-type="outer">'+
	'<div class="bg">'+
		'<table cellspacing="0" cellpadding="0" border="0">' +
		'<tbody><tr><td>' +
		'<div class="content layer_mini_info_big" node-type="inner">'+
		'<p class="clearfix"><span class="icon_${data.type}"></span>${data.msg}&nbsp; &nbsp; &nbsp;</p>'+
		'</div>' +
		'</td></tr></tbody>' +
		'</table></div></div></#et>';
		var finalTemplate = $easyT(template, {
			type: spec.type,
			msg: msg
		}).toString();
	
		that = {};
		layer = $.module.layer(finalTemplate);
		box = layer.getOuter();
		$.custEvent.add(layer, 'hide', function(){
			//多个弹层同时存在时遮罩不消失
			$.module.mask.back();
			spec.hideCallback && spec.hideCallback();
			$.custEvent.remove(layer,'hide',arguments.callee);
			clearTimeout(tm);
		});
		$.custEvent.add(layer, 'show', function(){
			document.body.appendChild(box);
			$.module.mask.showUnderNode(box);
			$.module.mask.getNode().style.zIndex = 10002;
		});
		layer.show();

		if(spec['timeout']){
			tm = setTimeout(layer.hide,spec['timeout']);
		}

		var win = $.core.util.winSize();
		var dia = layer.getSize(true);
		box.style.top = $.core.util.scrollPos()['top'] + (win.height - dia.h)/2 + 'px';
		box.style.left = (win.width - dia.w)/2 + 'px';
		box.style.zIndex = 10002;

		that.layer = layer;
		return that;
	};
});


