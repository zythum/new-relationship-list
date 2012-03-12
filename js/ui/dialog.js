$Import('kit.extra.language');
$Import('kit.extra.reuse');
$Import('module.dialog');
$Import('module.mask');
$Import('kit.dom.drag');

/**
 * author Robin Young | yonglin@staff.sina.com.cn
 */

STK.register('ui.dialog',function($){
	var TEMP = '' +
	'<div class="W_layer" node-type="outer" style="display:none;position:absolute;z-index:10001">' +
		'<div class="bg">' +
			'<table border="0" cellspacing="0" cellpadding="0">' +
					'<tr><td>' +
						'<div class="content" node-type="layoutContent">' +
							'<div class="title" node-type="title"><span node-type="title_content"></span></div>' +
							'<a href="javascript:void(0);" class="W_close" title="#L{关闭}" node-type="close"></a>' +
							'<div node-type="inner"></div>' +
						'</div>' +
					'</td></tr>' +
			'</table>' +
		'</div>' +
	'</div>';
	
	var lang = $.kit.extra.language;
	
	var cache = null,conf;
	
	var createDialog = function(){
		var dia = $.module.dialog(lang(conf['template']));
		$.custEvent.add(dia, 'show', function(){
			$.module.mask.showUnderNode(dia.getOuter());
		});
		$.custEvent.add(dia, 'hide', function(){
			$.module.mask.back();
			dia.setMiddle();
		});
		$.kit.dom.drag(dia.getDom('title'),{
			'actObj' : dia,
			'moveDom' : dia.getOuter()
		});
		dia.destroy = function(){
			clearDialog(dia);
			try{
				dia.hide(true);
			}catch(exp){
			
			}
		};
		return dia;
	};
	
	var clearDialog = function(dia){
		dia.setTitle('').clearContent();
		cache.setUnused(dia);
	};
	
	return function(spec){
		conf = $.parseParam({
			'template': TEMP,
			'isHold' : false
		},spec);
		var isHold = conf['isHold'];
		conf = $.core.obj.cut(conf,['isHold']);
		if(!cache){
			cache = $.kit.extra.reuse(createDialog);
		}
		var that = cache.getOne();
		if(!isHold){
			$.custEvent.add(that, 'hide', function(){
				$.custEvent.remove(that,'hide',arguments.callee);
				clearDialog(that);
			});
		}
		return that;
	};
});