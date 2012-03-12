$Import('kit.extra.language');
$Import('kit.extra.reuse');
$Import('module.layer');
$Import('ui.dialog');

/**
 * author Robin Young | yonglin@staff.sina.com.cn
 */

STK.register('ui.alert',function($){
	
	var TEMP = '' +
	'<div node-type="outer" class="layer_point">' +
		'<dl class="point clearfix">' +
			'<dt><span class="" node-type="icon"></span></dt>' +
			'<dd node-type="inner">'+
				'<p class="W_texta" node-type="textLarge"></p>'+
				'<p class="W_textb" node-type="textSmall"></p>'+
			'</dd>' +
		'</dl>' +
		'<div class="btn">'+
			'<a href="javascript:void(0)" class="W_btn_b" node-type="OK"></a>'+
		'</div>' +
	'</div>';
	
	var ICON = {
		'success' : 'icon_succM',
		'error' : 'icon_errorM',
		'warn' : 'icon_warnM',
		'delete' : 'icon_delM',
		'question' : 'icon_questionM'
	};
	
	var lang = $.kit.extra.language;
	
	var cache = null;
	
	var rend = function(alt, args){
		alt.getDom('icon').className = args['icon'];
		alt.getDom('textLarge').innerHTML = args['textLarge'];
		alt.getDom('textSmall').innerHTML = args['textSmall'];
		alt.getDom('OK').innerHTML = '<span>' + args['OKText'] + '</span>';
	};
	
	return function(info, spec){
		var conf, that, alt, dia, tm;;
		conf = $.parseParam({
			'title' : lang('#L{提示}'),
			'icon' : 'warn',
			'textLarge' : info,
			'textSmall' : '',
			'OK' : $.funcEmpty,
			'OKText' : lang('#L{确定}'),
			'timeout' : 0
		}, spec);
		conf['icon'] = ICON[conf['icon']];
		that = {};
		
		if(!cache){
			cache = $.kit.extra.reuse(function(){
				var alt = $.module.layer(lang(TEMP));
				return alt;
			});
		}
		alt = cache.getOne();
		dia = $.ui.dialog();
		dia.setContent(alt.getOuter());
		dia.setTitle(conf['title']);
		
		rend(alt, conf);
		
		var closeFun = function(e) {
			$.preventDefault(e);
			dia.hide();
		};
		
		$.addEvent(alt.getDom('OK'), 'click', closeFun);
		
		
		
		$.custEvent.add(dia, 'hide', function(){
			$.custEvent.remove(dia,'hide',arguments.callee);
			$.removeEvent(alt.getDom('OK'),'click',closeFun);
			cache.setUnused(alt);
			clearTimeout(tm);
			conf['OK']();
		});
		
		if(conf['timeout']){
			tm = setTimeout(dia.hide,conf['timeout']);
		}
		
		dia.show().setMiddle();
		that.alt = alt;
		that.dia = dia;
		return that;
	};
});
