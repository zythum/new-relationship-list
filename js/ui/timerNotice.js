$Import('kit.extra.language');
$Import('module.layer');
$Import('ui.dialog');

/**
 * author Robin Young | yonglin@staff.sina.com.cn
 * qbaty | yuheng@staff.sina.com.cn
 */

STK.register('ui.timerNotice',function($){
	
	var TEMP = '' +
	'<div node-type="outer" class="layer_point">' +
		'<dl class="point clearfix">' +
			'<dt><span class="" node-type="icon"></span></dt>' +
			'<dd node-type="inner">'+
				'<p class="W_texta" node-type="textLarge"></p>'+
				'<p class="W_textb" node-type="textSmall"></p>'+
			'</dd>' +
		'</dl>' +
	'</div>';
	
	var ICON = {
		'success' : 'icon_succM',
		'error' : 'icon_errorM',
		'warn' : 'icon_warnM',
		'delete' : 'icon_delM',
		'question' : 'icon_questionM'
	};
	
	var lang = $.kit.extra.language;
	
	var cache = [];
	
	var creatAlert = function(){
		var alt = $.module.layer(lang(TEMP));
		cache.push({
			'alt' : alt,
			'used' : true
		});
		return alt;
	};
	
	var setUsed = function(alt){
		for(var i = 0, len = cache.length; i < len; i += 1){
			if(alt === cache[i]['dia']){
				cache[i]['used'] = true;
				return ;
			}
		}
	};
	
	var setUnused = function(alt){
		for(var i = 0, len = cache.length; i < len; i += 1){
			if(alt === cache[i]['dia']){
				cache[i]['used'] = false;
				return ;
			}
		}
	};
	
	var getAlert = function(args){
		var conf, that, alt, dia;
		that = {};
		
		for(var i = 0, len = cache.length; i < len; i += 1){
			if(!cache[i]['used']){
				cache[i]['used'] = true;
				alt = cache[i]['dia'];
				break;
			}
		};
		alt = alt || creatAlert();
		dia = $.ui.dialog();
		dia.appendChild(alt.getOuter());
		alt.getDom('icon').className = args['icon'];
		alt.getDom('textLarge').innerHTML = args['textLarge'];
		alt.getDom('textSmall').innerHTML = args['textSmall'];
		dia.setTitle(args['title']);
		$.custEvent.add(dia,'hide',function(){
			args['OK']();
			$.custEvent.remove(dia,'hide',arguments.callee);
			$.custEvent.remove(dia,'show',delayHide);
			setUnused(alt);
		});

		var delayHide = function(){
			setTimeout(dia.hide,args.timer);
		};

		$.custEvent.add(dia,'show',delayHide);

		that['alt'] = alt;
		that['dia'] = dia;
		
		return that;
	};
	
	return function(info, spec){
		spec = spec || {};
		var conf, alt, lock;
		conf = $.parseParam({
			'title' : lang('#L{提示}'),
			'icon' : 'warn',
			'textLarge' : info,
			'textSmall' : '',
			'OK' : function(){},
			'timer' : 3000
		}, spec);
		conf['icon'] = ICON[conf['icon']];
		alt = getAlert(conf);
		alt.dia.show().setMiddle();

		return alt;
	};
	
});