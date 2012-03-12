/**
 * @author Maze
 */
$Import('common.trans.helpService');
$Import('ui.alert');
$Import('kit.extra.language');

STK.register('comp.help.unlockValidate', function($) {
	var _lang = $.kit.extra.language,
		_alert = $.ui.alert,
		_io = $.common.trans.helpService;
	
	return function(node){
		var it = {},devt,ctl_cb,ctl_btn,ispost=false;
		it.init = function(){
			devt = $.delegatedEvent(node);
			devt.add('sub_checked','click',it.checked);
			devt.add('sub_validate','click',it.submit);
			//get dom
			ctl_cb = $.sizzle('[action-type=sub_checked]',node)[0];
			ctl_btn = $.sizzle('[action-type=sub_validate]',node)[0];
		};
		it.checked = function(pars){
			if(ctl_cb.checked){
				ctl_btn.className = 'W_btn_b';
			}else{
				ctl_btn.className = 'W_btn_a';
			}
		};
		it.submit = function(pars){
			$.preventDefault();
			if (!ctl_cb.checked) {
				return;
			}
			
			if(ispost){
				_alert(_lang('#L{正在验证信息，如果还没有发送验证码，请发送验证码。}'));
				return;
			}
			ispost = true;			
			
			ctl_cb.disabled = true;
			
			var call = function(){
				_io.request('checkmessage',{
					onSuccess: function(pars){
//						window.location.reload();
						window.location.href = pars.data.url;
					},
					onError: function(){
						setTimeout(call,5000);
					}
				});
			};
			//开始轮询
			call();
		};
		it.destroy = function(){
			devt.destroy();
		};
		//启动
		it.init();
		
		return it;
	}
});