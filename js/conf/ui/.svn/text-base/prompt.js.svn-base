$Import('kit.extra.language');
$Import('kit.extra.reuse');
$Import('kit.dom.smartInput');
$Import('module.layer');
$Import('ui.dialog');

/**
 * author Robin Young | yonglin@staff.sina.com.cn
 * 
 */

STK.register('ui.prompt', function($){
	var TEMP = '' + 
		'<div class="layer_prompt" node-type="outer">' +
			'<p class="son_title" node-type="inner"></p>' +
			'<dl class="clearfix">' +
				'<dt node-type="label"></dt>' +
				'<dd>' +
					'<input type="text" class="W_input W_input_default" value="" node-type="input" />' +
					'<p class="W_error" node-type="errorBox">' +
						'<span class="icon_del"></span><span node-type="errorTxt"></span>' +
					'</p>' +
				'</dd>' +
			'</dl>' +
			'<div class="btn">' +
				'<a class="W_btn_b" href="javascript:void(0);" node-type="OK"></a>' + //<span>保存</span>
				'<a class="W_btn_a" href="javascript:void(0);" node-type="cancel"></a>' + //<span>取消</span>
			'</div>' +
		'</div>';
	// '<div class="layer_point layer_setup_framea" node-type="outer">' +
	// 		'<p class="mailtip" node-type="inner"></p>' +
	// 		'<p class="mail">' +
	// 			'<label for="mail" node-type="label"></label>' +
	// 			'<input type="text" class="W_input" value="" node-type="input" />' +
	// 		'</p>' +
	// 		'<div class="M_notice_del" node-type="errorBox">' +
	// 			'<span class="icon_del"></span>' +
	// 			'<span class="txt" node-type="errorTxt"></span>' +
	// 		'</div>' +
	// 		'<div class="btn">' +
	// 			'<a class="W_btn_b" href="javascript:void(0);" node-type="OK"></a>' + //<span>保存</span>
	// 			'<a class="W_btn_a" href="javascript:void(0);" node-type="cancel"></a>' + //<span>取消</span>
	// 		'</div>' +
	// 	'</div>';
	
	var lang = $.kit.extra.language;
	
	var cache = null;
	
	var rend = function(pmt,args){
		pmt.getDom('inner').innerHTML = args['info'];
		pmt.getDom('label').innerHTML = args['label'];
		pmt.getDom('OK').innerHTML = '<span>' + args['OKText'] + '</span>';
		pmt.getDom('cancel').innerHTML = '<span>' + args['cancelText'] + '</span>';
		pmt.getDom('errorBox').style.visibility = 'hidden';
		pmt.getDom('errorTxt').innerHTML = '';
		pmt.input.setValue(args['value']);
		pmt.input.setNotice(args['notice']);
		pmt.input.restart();
	};
	
	var getPrompt = function(args){
		var that, pmt, dia, check, OKFn, showError;
		
		if(!cache){
			cache = $.kit.extra.reuse(function(){
				var pmt = $.module.layer(lang(TEMP));
				pmt.input = $.kit.dom.smartInput(pmt.getDom('input'));
				return pmt;
			});
		}
		
		pmt = cache.getOne();
		
		dia = $.ui.dialog();
		dia.appendChild(pmt.getOuter());
		dia.setTitle(args['title']);
		
		rend(pmt, args);
		
		check = function(){
			var res = args['check'](pmt.getDom('input').value);
			if(!res['status']){
				showError(res['msg']);
			}else{
				hideError();
			}
			return res['status'];
		};
		OKFn = function(){
			if(check()){
				args['OK'](pmt.getDom('input').value);
			}
		};
		showError = function(msg){
			pmt.getDom('errorBox').style.visibility = 'visible';
			pmt.getDom('errorTxt').innerHTML = msg;
		};
		hideError = function(){
			pmt.getDom('errorBox').style.visibility = 'hidden';
		};
		
		$.custEvent.add(pmt.input, 'enter', OKFn);
		$.addEvent(pmt.getDom('OK'), 'click', OKFn);
		$.addEvent(pmt.getDom('cancel'), 'click', dia.hide);
		$.addEvent(pmt.getDom('input'), 'blur', check);
		$.custEvent.add(dia, 'hide', function(){
			$.custEvent.remove(dia, 'hide', arguments.callee);
			$.custEvent.remove(pmt.input, 'enter', OKFn);
			$.removeEvent(pmt.getDom('OK'), 'click', OKFn);
			$.removeEvent(pmt.getDom('cancel'), 'click', dia.hide);
			$.removeEvent(pmt.getDom('input'), 'blur', check);
			cache.setUnused(pmt);
			args['cancel']();
			pmt = null;
			dia = null;
		});
		
		that = {};
		that['pmt'] = pmt;
		that['dia'] = dia;
		that['hide'] = dia.hide;
		that['showError'] = showError;
		that['hideError'] = hideError;
		
		return that;
	};
	return function(args){
		var conf, pmt;
		conf = $.parseParam({
			'title' : lang('#L{提示}'),
			'notice' : '',
			'value' : '',
			'info' : '',
			'label' : '',
			'OK' : $.funcEmpty,
			'cancel' : $.funcEmpty,
			'check' : function(){return {'status':true};},
			'OKText' : lang('#L{确定}'),
			'cancelText' : lang('#L{取消}')
		},args);
		pmt = getPrompt(conf);
		pmt.dia.show().setMiddle();
		return pmt;
	};
	
});