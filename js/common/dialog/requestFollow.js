/**
 * Created by .
 * User: qbaty || yuheng@staff.sina.com.cn
 * Date: 11-4-19
 */
$Import('ui.dialog');
$Import('ui.timerNotice');
$Import('common.trans.relation');
$Import('common.dialog.answerQuestion');
$Import('kit.extra.language');

STK.register('common.dialog.requestFollow',function($){

	var DIALOG_CONTENT = '<div class="layer_invite_question">' +
		'<dl class="clearfix">' +
			'<dt>#L{邀请发送给：}</dt>' +
			'<dd><a href="" node-type="name">#{user}</a></dd>' +
			'<dt><span class="W_spetxt">*</span>#L{附言：}</dt>' +
			'<dd class="additional"><textarea class="W_input" cols="" rows="" name="">#L{介绍一下自己吧}</textarea></dd>' +
		'</dl>' +
		'<div class="btn">' +
			'<a href="javascript:void(0)" class="W_btn_b" action-type="submit" ><span>#L{提交}</span></a>' +
			'<a href="javascript:void(0)" class="W_btn_a" action-type="cancel"><span>#L{路过}</span></a>' +
		'</div>' +
	'</div>';

	var $L = $.kit.extra.language;

	return function(opts){
		var dialog = $.ui.dialog();
		$.log(dialog);
		$.log('init');
		var delegate = $.core.evt.delegatedEvent(dialog.getInner());

		var trans = $.common.trans.relation.getTrans('requestFollow',{
			'onSuccess' : reqSucc,
			'onerror'    : reqError
		});

		function reqSucc(spec){
			if(spec && spec.data !== ''){
				dialog.hide();
				$.common.dialog.answerQuestion(spec.data);
			}else{
				$.ui.timerNotice($L('#L{发送成功！}'),{
					'icon' : 'success',
					'timeout' : 1500,
					'OK': function(){
						dialog.hide();
					}
				});
			}
		}

		function reqError(){
			
		}

		function applyReq(){

			trans.request({
			})
		}

		function cancelReq(){
			dialog.hide();
		}

		function distroy(){
			delegate.destroy();
		}

		dialog.setContent($.core.util.templet($L(DIALOG_CONTENT),{user:opts.data.name}));
		dialog.setTitle([$L('#L{邀请}'),opts.data.name,$L('#L{关注我}')].join(''));

		delegate.add('submit','click',applyReq);
		delegate.add('cancel','click',cancelReq);
		$.core.evt.custEvent.add(dialog,'hide',function(){
			distroy();
		});
		$.log(dialog);
		dialog.show().setMiddle();

		return dialog;
	};
});