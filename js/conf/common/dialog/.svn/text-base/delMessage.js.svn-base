/**
 * 
 * @id $.common.dialog.replyMessage
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
	data = {
		uid: 567,//可选
		userName: '收信人昵称'//可选
	};
	if(!_this.replyMessageDialog) {
		_this.replyMessageDialog = $.common.dialog.replyMessage(data);
	}
	_this.replyMessageDialog.show();
 */
$Import('kit.extra.language');
$Import('ui.dialog');
$Import('ui.alert');
$Import('common.trans.message');

//$LANG = {
	//'这是一个回复私信的弹层。': 'This is a dialog for reply message.'
//};

STK.register('common.dialog.replyMessage', function($) {
	//+++ 常量定义区 ++++++++++++++++++
	$L = $.kit.extra.language;
	//-------------------------------------------
	
	return function(data) {
		var that = {};


		//+++ 变量定义区 ++++++++++++++++++

		//var $L = function (s) {
			//var rS = s.replace(/#L\{([^\}]+)*?\}/ig, function (w) {
				//var sT;
				//if(w && langPack[arguments[1]]) {
					//sT = langPack[arguments[1]];
				//}
				//return '#L{'+sT+'}';
			//});
			//rS = $.kit.extra.language(rS);

			//return rS;
		//};


		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			//属性方法区
			isShowed: false,
			DOM_eventFun: {
				submitReplyMessage: function (o) {
					_this.forwardTrans.request($.htmlToJson(_this.dialogDom));

					$.preventDefault(); 
				}
			},
			ioEvent: {
				forwardSuccess: function () {
					$.log('messageForwardSuccess');
				},
				forwardError: function (ret) {
					$.ui.alert(ret.msg);
					$.log('messageForwardError');
				},
				forwardFail: function () {
					$.log('messageForwardFail');
				}
			},
			show: function () {

				var own = arguments.callee;
				if(_this.isShowed !== true) {
					own.toDispatchDefaultAct = true;
					$.custEvent.fire(that, 'showBefore');
					if(own.toDispatchDefaultAct) {
						//默认行为
						$.log('common.dialog.replyMessage => actShow()');
						_this.actShow();
					}
					$.custEvent.fire(that, 'show');
				}
			},
			hide: function () {

				var own = arguments.callee;
				if(_this.isShowed === true) {
					own.toDispatchDefaultAct = true;
					$.custEvent.fire(that, 'hideBefore');
					if(own.toDispatchDefaultAct) {
						//默认行为
						$.log('common.dialog.replyMessage => actHide()');
						_this.actHide();
					}
					$.custEvent.fire(that, 'hide');
				}

			},
			actShow: function () {

				_this.objs.dialog = $.ui.dialog();
				_this.objs.dialog.setTitle($L('#L{发私信}'));
				_this.objs.dialog.appendChild(_this.dialogDom);
				_this.objs.dialog.show();
				_this.objs.dialog.setMiddle();

			},
			actHide: function () {

				_this.objs.dialog.hide();

			},
			getDialogHTMLOfReplyMessage: function (data) {

				var idInput,
					idInputName = 'uid';
				if(data.uid) {
					if(!data.userName) {
						throw new Error('未得到收信人昵称。');
					}
					idInput = data.userName+'<input type="hidden" name="'+idInputName+'" value="'+data.uid+'" />';
				}else{
					idInput = '<input type="text" name="'+idInputName+'" />';
				}
				var replyMessageHTML = 
					'<div>#L{这是一个回复私信的弹层。}</div>'+
					'<form method="post" action="" enctype="multipart/form-data" action-type="replyMessageForm">'+
						'<div>#L{私信id}:'+idInput+'</div>'+
						'<div><textarea name="text" rows="12" cols="66"></textarea></div>'+
						'<input type="submit" value="发送" />'+
					'</form>'
				;
				//STK.core.util.templet('#{city||default:天津}欢迎你',{'city':'北京'}) === '北京欢迎你'; 
				return replyMessageHTML;

			}
		};
		//----------------------------------------------



		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------


		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			//if(!node) {
				//throw new Error('common.dialog.replyMessage node没有定义');
			//}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			//_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			if(!1) {
				throw new Error('common.dialog.replyMessage 必需的节点不完整');
			}

			
		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){

			_this.dialogDom = $.C('div');
			_this.DEvent = $.core.evt.delegatedEvent(_this.dialogDom);
			_this.dialogDom.innerHTML = $L(_this.getDialogHTMLOfReplyMessage(data));

			_this.forwardTrans = $.common.trans.message.getTrans('delete',{
				'onSuccess'	: _this.ioEvent.forwardSuccess,
				'onError'	: _this.ioEvent.forwardError,
				'onFail'	: _this.ioEvent.forwardFail
			});

		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){

			_this.DEvent.add('replyMessageForm', 'submit', _this.DOM_eventFun.submitReplyMessage);

		};
		//-------------------------------------------


		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		var bindCustEvt = function(){

			$.custEvent.define(that, 'showBefore');
			$.custEvent.define(that, 'show');
			$.custEvent.define(that, 'hideBefore');
			$.custEvent.define(that, 'hide');


		};
		//-------------------------------------------


		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		var bindListener = function(){
			
		};
		//-------------------------------------------


		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
			if(_this.objs.dialog){
				_this.objs.dialog.hide();
			}
			_this.DOM.dialog = null;
		};
		//-------------------------------------------


		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------


		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		that.show = function () {
			_this.show.apply(_this, arguments);
		};
		that.hide = function () {
			_this.hide();
		};
		//-------------------------------------------


		return that;
	};
	
});
