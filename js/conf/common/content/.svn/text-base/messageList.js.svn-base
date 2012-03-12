/**
 * 
 * @id $.common.content.messageList
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
	var eleMessageListBox = $.E('id');
	_this.objs.messageList = $.common.content.messageList(eleMessageListBox);
	_this.objs.messageList.destroy();
 */
$Import('kit.extra.language');
$Import('ui.confirm');
$Import('common.dialog.forwardMessage');
$Import('common.dialog.sendMessage');
$Import('common.trans.message');
$Import('kit.dom.parentElementBy');
$Import('kit.dom.parseDOM');
$Import('ui.alert');
$Import('common.layer.ioError');

STK.register('common.content.messageList', function($){

	//+++ 常量定义区 ++++++++++++++++++
	var $L = $.kit.extra.language;
	//-------------------------------------------

	return function(node, opts){
		opts = opts || {};
		var that = {};

		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			//属性方法区
			DOM_eventFun: {
				clickReplyMessageButton: function (o) {

					//$.log('common.content.messageList DOM_eventFun clickReplyMessageButton');
					_this.replyMessage({
						el: o.el,
						data: o.data
					});

					$.preventDefault();
				},

				clickDelMessageButton: function (o) {

					//$.log('common.content.messageList DOM_eventFun clickDelMessageButton：弹出删除确认层。');
					_this.delMessage({
						el: o.el,
						data: o.data
					});

					$.preventDefault();
				},
                showConfirm : function()
                {
                    var confirm = $.ui.confirm($L("#L{如果你需要开放私信功能，}")+$L("#L{我们建议你将私信权限设置为“可信用户”，}")+$L("#L{可以有效防止恶意用户。}"),
                    {'textSmall':"<input type=\"checkbox\" id=\"noshow\"><label for=\"noshow\">"+$L("#L{以后不再提示}")+"</label>",
                        'icon' :'warn',
                        'OKText' :$L("#L{马上设置}"),
                        'OK': function() {
                           if(confirm.cfm.getDom('textSmall').firstChild.checked)
                           {
                                $.common.trans.message.getTrans('noConfirm',{
                                'onSuccess' : function()
                                   {
                                     window.location.href ="http://account.weibo.com/settings/privacy";
                                   },
                                  'onFail' : function(json)
                                  {
                                     $.ui.alert(json.msg ||$L("#L{接口错误}"));
                                  },
                                  'onError' : function(json)
                                  {
                                        $.ui.alert(json.msg || $L("#L{接口错误}"));
                                  }
                             }).request({'bubbletype':'6'});
                           }
                            else
                           {
                                    window.location.href = "http://account.weibo.com/settings/privacy"

                           }
                         $.preventDefault();
                        }
                       });
                },
				clickForwardMessageButton: function (o) {

					//$.log('common.content.messageList DOM_eventFun clickForwardMessageButton');
					_this.forwardMessage({
						el: o.el,
						data: o.data
					});

					$.preventDefault();
				},
				clickMoreMessageButton: function (o) {

					//$.log('common.content.messageList DOM_eventFun clickMoreMessageButton');
					_this.forwardMessage({
						el: o.el,
						data: o.data
					});

					$.preventDefault();
				}
			},
            delMessage: function (opts) {
				/**
				opts = {
					el:				触发删除私信操作的源
					data:			删除私信操作所需的参数
				}
				**/
				//var_dump(opts.data);
				var own = arguments.callee;
				own.el = opts.el;
				own.data = opts.data;
				var ioEvent= {
					delMessageSuccess: function (el,json) {
						//$.log('messageDelSuccess');
						var messageListDOM = $.builder(node).list;
						var pageNumber = $.queryToJson(_this.DOM["messageList"].getAttribute('node-data')).pageNumber;
                        if(pageNumber > 1) {
							pageNumber--;
						}
						if(messageListDOM['messageUnit'].length <= 1) {
							var oSearch = $.queryToJson(location.search.slice(1));
							oSearch.page = pageNumber;
							location.search = $.jsonToQuery(oSearch);
						}
						var oUnit = $.kit.dom.parentElementBy(el, node, function (o) {
							if(o.getAttribute('node-type') === 'messageUnit') {
								return true;
							}
						});
						if(oUnit) {
							oUnit.style.visibility = 'hidden';
							oUnit.style.overflow = 'hidden';
							$.tween(oUnit, {
									'animationType': 'easeoutcubic',
									'duration': 200,
									'end': function(){
										$.removeNode(oUnit);
                                        if(_this.DOM["msg_num"])
                                        {
                                            var num = parseInt(_this.DOM["msg_num"].innerHTML.match(/\d+/));
                                            _this.DOM["msg_num"].innerHTML =  $L('#L{(已有[n]个联系人)}').replace("[n]",num-1);
                                            var size = $.sizzle("[node-type=messageUnit]",node).length;

                                            if(size == 0)
                                            {
                                                window.location.reload();
                                                return;
                                            }
                                            json.data.showPrivateSet  && _this.DOM_eventFun.showConfirm();
                                        }
									}
								}).finish({
									height: 0,
									paddingTop: 0,
									paddingBottom: 0
							});
							//setTimeout(function() {$.removeNode(oUnit);},400);
						}
					},
					delMessageError: function (data) {
						//var msg = oR.msg || '#L{删除私信失败。}';
						//$.log('messageDelError');
						//var oDialog = $.ui.alert($L(msg));
						data.msg = data.msg || $L('#L{删除私信失败。}');
						$.common.layer.ioError(data.code, data);
					},
					delMessageFail: function (data) {
						//$.log('messageDelFail');
						data.msg = data.msg || $L('#L{删除私信失败。}');
						$.common.layer.ioError(data.code, data);
					}
				};
				//var_dump(own.data);
				//'title' : lang('#L{提示}'),
				//'icon' : 'question',
				//'textLarge' : info,
				//'textComplex' : '',
				//'textSmall' : '',
				//'OK' : $.funcEmpty,
				//'OKText' : lang('#L{确定}'),
				//'cancel' : $.funcEmpty,
				//'cancelText' : lang('#L{取消}')
				_this.confirmDel = $.ui.confirm($L('#L{确定要删除与} '+own.data.userName+' #L{之间的所有对话？}'), {
					'title' : $L('#L{删除全部}'),
					textSmall: $L('<br /><input type="checkbox" id="intoBlackList" /><label for="intoBlackList">#L{同时将此用户加入黑名单}</label>'),
					OK: function() {
						//$.log('tipConfirm：确认删除message');
						if(_this.confirmDel.cfm.getDom('textSmall').firstChild.nextSibling.checked) {
							own.data.intoBlackList = 1;
						}
						$.common.trans.message.getTrans('deleteUserMsg',{
							 'onSuccess'  : function (json) {

								    ioEvent.delMessageSuccess(own.el,json);
							},
							'onError'	: ioEvent.delMessageError,
							'onFail'	: ioEvent.delMessageFail
						}).request(own.data);
					}
				});

			},
			replyMessage: function (opts) {
				/**
				opts = {
					el:				触发回复私信操作的源
					data:			回复私信操作所需的参数
				}
				**/

				if(!opts.el.dialog) {
					var data = opts.data;
					data.style_id = 2;
					opts.el.dialog = _this.objs.sendMessageDialog(data);
				}
				//$.log('弹出回信层。');
				opts.el.dialog.show();

			},
			forwardMessage: function (opts) {
				/**
				opts = {
					el:				触发转发私信操作的源
					data:			转发私信操作所需的参数
				}
				**/

				if(!opts.el.dialog) {
					var data = opts.data;
					data.style_id = 2;
					opts.el.dialog = _this.objs.sendMessageDialog(data);
				}
				//$.log('弹出转发私信层。');
				opts.el.dialog.show();

			}
		};
		//----------------------------------------------


		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('common.content.messageList node没有定义');
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);

			if(!1) {
				throw new Error('common.content.messageList 必需的节点不完整');
			}

			
		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){
			_this.DEvent = $.core.evt.delegatedEvent(node);
			//_this.objs.forwardMessageDialog = $.common.dialog.forwardMessage;
			_this.objs.sendMessageDialog = $.common.dialog.sendMessage;
			//_this.objs.replyMessageDialog = opts.replyMessageDialog || $.common.dialog.replyMessage;
		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			_this.DEvent.add('replyMessage', 'click', _this.DOM_eventFun.clickReplyMessageButton);
			_this.DEvent.add('delMessage', 'click', _this.DOM_eventFun.clickDelMessageButton);
			_this.DEvent.add('forwardMessage', 'click', _this.DOM_eventFun.clickForwardMessageButton);
			_this.DEvent.add('moreMessage', 'click', _this.DOM_eventFun.clickMoreMessageButton);
		};
		//-------------------------------------------


		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		var bindCustEvt = function(){
			
		};
		//-------------------------------------------


		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		var bindListener = function(){
			
		};
		//-------------------------------------------


		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
			//$.foreach(_this.DOM['replyMessage'], function(o) {
				//if(o.dialog) {
					//o.dialog = null;
				//}
			//});
			//$.foreach(_this.DOM['forwardMessage'], function(o) {
				//if(o.dialog) {
					//o.dialog = null;
				//}
			//});
			_this.DEvent.remove('replyMessage', 'click');
			_this.DEvent.remove('delMessage', 'click');
			_this.DEvent.remove('forwardMessage', 'click');
			//_this.objs.replyMessageDialog.destroy();
			_this.objs.sendMessageDialog.destroy && _this.objs.sendMessageDialog.destroy();
		};
		//-------------------------------------------


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
		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------


		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		//-------------------------------------------


		return that;
	};
	
});
