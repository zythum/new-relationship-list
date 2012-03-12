$Import('kit.extra.language');
$Import('ui.dialog');
$Import('module.layer');

/**
 * author Robin Young | yonglin@staff.sina.com.cn
 */

STK.register('ui.confirm',function($){
	
	var TEMP = ''+
	'<div node-type="outer" class="layer_point">' +
		'<dl class="point clearfix">' +
			'<dt><span class="" node-type="icon"></span></dt>' +
			'<dd node-type="inner">'+
				'<p class="W_texta" node-type="textLarge"></p>'+
				'<p class="W_textb" node-type="textComplex"></p>'+
				'<p class="W_textb" node-type="textSmall"></p>'+
			'</dd>' +
		'</dl>' +
		'<div class="btn">'+
			'<a href="javascript:void(0)" class="W_btn_b" node-type="OK"></a>'+
			'<a href="javascript:void(0)" class="W_btn_a" node-type="cancel"></a>'+
		'</div>'+
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
	
	return function(info,spec){
		var conf, that, cfm, dia, status, nodeObj;
		conf = $.parseParam({
			'title' : lang('#L{提示}'),
			'icon' : 'question',
			'textLarge' : info,
			'textComplex' : '',
			'textSmall' : '',
			'OK' : $.funcEmpty,
			'OKText' : lang('#L{确定}'),
			'cancel' : $.funcEmpty,
			'cancelText' : lang('#L{取消}')
		},spec);
		conf['icon'] = ICON[conf['icon']];
		
		that = {};
		
		if(!cache){
			cache = $.kit.extra.reuse(function(){
				var cfm = $.module.layer(TEMP);
				return cfm;
			});
		}
		cfm = cache.getOne();
		dia = $.ui.dialog();
		dia.setContent(cfm.getOuter());
		cfm.getDom('icon').className = conf['icon'];
		cfm.getDom('textLarge').innerHTML = conf['textLarge'];
		cfm.getDom('textComplex').innerHTML = conf['textComplex'];
		cfm.getDom('textSmall').innerHTML = conf['textSmall'];
		cfm.getDom('OK').innerHTML = '<span>' + conf['OKText'] + '</span>';
		cfm.getDom('cancel').innerHTML = '<span>' + conf['cancelText'] + '</span>';
		dia.setTitle(conf['title']);
		var okFunc = function(){
			status = true;
			nodeObj = $.htmlToJson(cfm.getDom('textComplex'));
			dia.hide();
		};
		$.addEvent(cfm.getDom('OK'),'click',okFunc);
		$.addEvent(cfm.getDom('cancel'),'click',dia.hide);
		
		$.custEvent.add(dia,'hide',function(){
			$.custEvent.remove(dia,'hide',arguments.callee);
			$.removeEvent(cfm.getDom('OK'),'click',okFunc);
			$.removeEvent(cfm.getDom('cancel'),'click',dia.hide);
			cache.setUnused(cfm);
			if(status){
				conf['OK'](nodeObj);
			}else{
				conf['cancel'](nodeObj);
			}
		});
		dia.show().setMiddle();
		that.cfm = cfm;
		that.dia = dia;
		return that;
	};
});