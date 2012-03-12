/**
 * @author wangliang3
 */
$Import('kit.extra.language');
$Import('ui.alert');
$Import('ui.confirm');

STK.register('common.layer.ioError', function($){
	var lang = $.kit.extra.language;
	
	return function(code,json){
		var it={
			/*
			 * 默认错误处理提示层
			 * alert 弹层
			 */
			100001: function(){
				$.ui.alert(json.msg);
			},
			/*
			 * 未登录操作
			 * 已被部分交互占用，在这里预留
			 */
//			100002: function(){
//			},
			/*
			 * 返回状态码为100003
			 * confrim提示错误信息
			 * @param {String} OKText  弹层确认按钮的文案
			 * @param {String} cancelText  弹层取消按钮的文案
			 * @param {String} location  点击确认按钮后的跳转地址
			 * @param {String} title  碳层的title文案
			 */
			100003: function(){
				var pars = $.parseParam({
					location: '',
					icon : 'warn',
					title: lang('#L{提示}'),
					OKText: lang('#L{确认}'),
					cancelText: lang('#L{取消}'),
					suda: ''
				},json.data);
				//btn function
				pars['OK'] = function(){
					$.preventDefault();
					var sudaData = $.queryToJson(json.data.OKSuda||'');
					SUDA.uaTrack&&sudaData.key&&SUDA.uaTrack(sudaData.key,sudaData.value);
					//
					json['ok']&&json['ok']();
					//跳转页
					window.location.href = pars.location;
				};
				pars['cancel'] = function(){
					$.preventDefault();
					var sudaData = $.queryToJson(json.data.cancelSuda||'');
					SUDA.uaTrack&&sudaData.key&&SUDA.uaTrack(sudaData.key,sudaData.value);
					//
					json['cancel']&&json['cancel']();
				}
				//confrim
				$.ui.confirm(json.msg,pars);
			}
		};
		var fun = it[code]||it['100001'];
		return fun();
	}
});