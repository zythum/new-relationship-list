/**
 * @author wangliang3
 */
$Import('common.trans.helpService');
$Import('ui.alert');
$Import('kit.extra.language');

STK.register('comp.help.unlockSubInfo', function($) {
	var _lang = $.kit.extra.language,
		_alert = $.ui.alert,
		_io = $.common.trans.helpService;
	
	var comm = {
		isEmpty: function(str){
            return /^\s*$/g.test(str.replace(/^\s+|\s+$/g, ''));
        },
		isNumber: function(str){
            return /^[+\-]?\d+(\.\d+)?$/.test(str)
        }
	};
	return function(node){
		
		if(!node){
			throw 'pl node is not found';
		}
		var it = {},devt,phone,subbtn,data,ispost=false;
		it.init = function(){
			devt = $.delegatedEvent(node);
			devt.add('sub_btn','click',it.submit);
			//
			phone = $.sizzle('[action-type=sub_phone]',node)[0];
			subbtn = $.sizzle('[action-type=sub_btn]',node)[0];
			if(!phone){
				throw 'phone text input is not found'
			}
			if(!subbtn){
				throw 'phone text input is not found'
			}
			data = $.queryToJson(subbtn.getAttribute('action-data') || '');
			$.addEvent(phone,'blur',it.blur);
			$.addEvent(phone,'focus',it.focus);
		};
		it.submit = function(pars){
			$.preventDefault();
			if(ispost){
				return false;
			}
			ispost = true;
			
			if(comm.isEmpty(phone.value)||phone.value==data.def){
				_alert(_lang('#L{请输入手机号码}'),{
					OK: function(){
						phone.value = '';
						phone.focus();
					}
				});
				ispost=false;
				return false;
			}
			if(!comm.isNumber(phone.value)){
				_alert(_lang('#L{请输入正确的手机号}'),{
					OK: function(){
						phone.focus();
					}
				});
				ispost=false;
				return false;
			}
			
			_io.request('mobile',{
				onSuccess: function(pars){
					window.location.href = pars.data.url;
				},
				onError: function(pars){
					_alert(pars.msg,{
						OK: function(){
							phone.focus();
						}
					});
					ispost=false;
				}
			},{
				phone: phone.value
			});
		};
		it.blur = function(){
			if(comm.isEmpty(phone.value)){
				phone.value = data.def
			}
		};
		it.focus = function(){
			if(phone.value==data.def){
				phone.value = '';
			}
		};
		it.destroy = function(){
			devt.destroy();
		};
		//启动
		it.init();
		
		return it;
	}
});