/**
 *
 * @id $.common.content.messageSearchList
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
 var eleMessageListBox = $.E('id');
 _this.objs.messageList = $.common.content.messageSearchList(eleMessageListBox);
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

STK.register('common.content.messageSearchList', function($) {

    //+++ 常量定义区 ++++++++++++++++++
    var $L = $.kit.extra.language;
    //-------------------------------------------
    var confirmTop =0;
    return function(node, opts) {
        opts = opts || {};
        var that = {};
        var updateMsgNum = function(num) {
            if (_this.DOM["msg_num"]) {
                _this.DOM["msg_num"].innerHTML = num;
            }
        };
        //+++ 变量定义区 ++++++++++++++++++
        var _this = {
            DOM:{},//节点容器
            objs:{},//组件容器
            //属性方法区
            DOM_eventFun: {
                clickReplyMessageButton: function (o) {

                    //$.log('common.content.messageSearchList DOM_eventFun clickReplyMessageButton');
                    _this.replyMessage({
                        el: o.el,
                        data: o.data
                    });
                    $.preventDefault();
                },
                clickDelMessageButton: function (o) {
                    //$.log('common.content.messageSearchList DOM_eventFun clickDelMessageButton：弹出删除确认层。');
                    _this.delMessage({
                        el: o.el,
                        data: o.data
                    });
                    $.preventDefault();
                },
                clickDelMessageListButton: function (o) {
                    //$.log('common.content.messagesearchList DOM_eventFun clickDelMessageListButton');
                    _this.DOM_eventFun.delMessageList({
                        el: o.el,
                        data: o.data
                    });
                    $.preventDefault();
                },
                clickMessageCheckboxButton: function (o) {
                    //$.log('common.content.messageList DOM_eventFun clickMessageCheckboxButton');
                    _this.DOM_eventFun.delMessageListCheck({
                        el: o.el,
                        data: o.data
                    });
                    $.preventDefault();
                },
                clickCannelDelMessageButton: function (o) {
                    //$.log('common.content.messageList DOM_eventFun clickCannelDelMessageButton');
                    _this.DOM_eventFun.cannelDelMessageList({
                        el: o.el,
                        data: o.data
                    });

                    $.preventDefault();
                },
                hideMessgeList :function() {
                    var arr = [];
                    var msgArr = _this.DOM['messageUnit'];
                    if ($.core.arr.isArray(msgArr)) {
                        arr = arr.concat(msgArr);
                    } else {
                        arr.push(msgArr);
                    }
                    $.foreach(arr, function(o) {

                        if ($.core.dom.prev(o)) {
                            $.setStyle($.core.dom.prev(o), "display", "none");
                        }
                    });
                },
                showHandleConfirm: function () {
                    if (_this.DOM["delMessageList"]) {
                        // _this.DOM["delMessageList"].style.display = "none";
                        $.setStyle(_this.DOM['delMessageList'], "visibility", "hidden");
                    }
                    if (_this.DOM['msg_confirm']) {
                        _this.DOM['msg_confirm'].style.display = "";
                        _this.DOM_eventFun.reLayout();
                    }
                },
                hiddenHandleConfirm: function () {
                    if (_this.DOM['msg_confirm']) {
                        _this.DOM['msg_confirm'].style.display = "none";
                    }
                    if (_this.DOM["delMessageList"]) {
                        //_this.DOM["delMessageList"].style.display = "";
                        $.setStyle(_this.DOM['delMessageList'], "visibility", "visible");
                    }
                },
                delMessageListCheck : function(opts) {
                    var data = $.htmlToJson(node);
                } ,
                cannelDelMessageList : function(opts) {
                    _this.DOM_eventFun.hiddenHandleConfirm();
                    _this.DOM_eventFun.hideMessgeList();
                } ,
                enterDelMessageList : function(opts) {
                    //$.log('$.common.content.messageDetail clickHandleOk ');
                    var aDom = $.kit.dom.parseDOM($.builder(node).list),
                            pageNumber = node.getAttribute('pageNumber') ? node.getAttribute('pageNumber').match(/\d+/) : 1;

                    if (aDom['msgCheckBox'] && aDom['msgCheckBox'].nodeType === 1) {
                        aDom['msgCheckBox'] = [aDom['msgCheckBox']];
                    }
                    var fnAfterDelMsgSuccess = function (o) {
                       window.location.reload();
                       /* //$.log('fnAfterDelMsgSuccess');
                        var hasCheckBoxIsFalse;
                        $.foreach(aDom['msgCheckBox'], function(o) {
                            if (!o.checked) {
                                hasCheckBoxIsFalse = true;
                            }
                        });

                        if (!hasCheckBoxIsFalse && pageNumber > 1) {
                            pageNumber--;
                        }
                        var oSearch = $.queryToJson(location.search.slice(1));
                        oSearch.page = pageNumber;
                        $.ui.litePrompt($L('#L{私信删除成功。}'), {'type':'succM','timeout':'2000'});
                        location.search = $.jsonToQuery(oSearch);
                        window.*/

                    };
                    var data = $.htmlToJson(node);
                    if (!data['msgList[]']) {
                        $.ui.alert($L('#L{请选择要删除的私信。}'));
                        return $.preventDefault();
                    }

                    $.preventDefault();
                    _this.DOM_eventFun.hiddenHandleConfirm();
                    _this.DOM_eventFun.hideMessgeList();
                    $.common.trans.message.getTrans('delete', {
                        'onSuccess': function (o) {
                            //$.log('delete onSuccess');
                            fnAfterDelMsgSuccess(o);
                        },
                        'onError': function (data) {
                            $.common.layer.ioError(data.code, data);
                        },
                        'onFail': function (data) {
                           	data.msg = data.msg||$L('#L{私信删除失败。}');
							$.common.layer.ioError(data.code, data);
                        }
                    }).request(data);

                } ,
                delMessageList : function (opts) {

                    var msgID = "1",msgInput;
                    _this.DOM_eventFun.showHandleConfirm();
                    var arr = [];
                    var msgArr = _this.DOM['messageUnit'];
                    if ($.core.arr.isArray(msgArr)) {
                        arr = arr.concat(msgArr);
                    } else {
                        arr.push(msgArr);
                    }
                    $.foreach(arr, function(o) {
                        //_this.DOM['numberTip'].innerHTML = $L('#L{请选择一条您要删除的私信：}');
                        msgID = o.getAttribute("msgId");
                        //$.log($.sizzle('[node-type="msgCheckBox"]', o));
                        msgInput = $.sizzle('[node-type="msgCheckBox"]', o)[0];
                        if (!msgInput) {

                            $.insertHTML(
                                    o,
                                    '<div class="private_check"><input type="checkbox" node-type="msgCheckBox"  name="msgList[]" id="msgCheckboxInput_' + msgID + '" value="' + msgID + '" name="msgList[]"   class="W_checkbox"></div> ',
                                    'BeforeBegin');
                        }
                        else {

                            msgInput.checked = false;
                            $.setStyle($.core.dom.prev(o), "display", "");
                        }
                    });
                },
                clickEneterDelMessageButton: function (o) {

                    //$.log('common.content.messageList DOM_eventFun clickEneterDelMessageButton');
                    _this.DOM_eventFun.enterDelMessageList({
                        el: o.el,
                        data: o.data
                    });

                    $.preventDefault();
                },
                clickForwardMessageButton: function (o) {

                    //$.log('common.content.messageSearchList DOM_eventFun clickForwardMessageButton');
                    _this.forwardMessage({
                        el: o.el,
                        data: o.data
                    });

                    $.preventDefault();
                },
                reLayout : function() {
                    var node = _this.DOM['msg_confirm'];
                    if ($.getStyle(node, "display") == "none") return;


                        var scrollPos = $.scrollPos();
                        var topX = scrollPos.top;
                        var pos = $.core.dom.position(_this.DOM['msg_operation']);
                         var top = topX > pos.t ? topX : pos.t;
                       /* if ($.core.util.browser.IE6) { // 如果不支持 fixed 定位，就每次都给 top 属性赋值，特别针对 IE6
                             $.setStyle(node, "position", "absolute");
                            $.setStyle(node, "top", top);
                        } else {*/
                              if(!$.core.util.browser.IE6 )
                             {
                              if( parseInt(topX) >(confirmTop-33))
                              {
                                  $.setStyle(node, "top", 33+"px");
                                  if($.getStyle(node,"position") =="fixed") return;
                                  $.setStyle(node, "position", "fixed");
                              }
                              else
                              {
                                  $.setStyle(node, "top", confirmTop +"px");
                                  if($.getStyle(node,"position") =="absolute") return;
                                  $.setStyle(node, "position", "absolute");
                                //$.setStyle(node, "top", pos.t-topX +"px");
                              }
                            }

                },
                pageReLayout : function () {
                    resetConfirmPosition();
                    _this.DOM_eventFun.reLayout();
                }
            },

            delMessage : function (opts) {
                /**
                 opts = {
                 el:                触发删除私信操作的源
                 data:            删除私信操作所需的参数
                 }
                 **/
                //var_dump(opts.data);
                var own = arguments.callee;
                own.el = opts.el;
                own.data = opts.data;
                var ioEvent = {
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
                                     $.ui.alert(json.msg);
                                  },
                                  'onError' : function(json)
                                  {
                                        $.ui.alert(json.msg);
                                  }
                             }).request({'bubbletype':'6'});
                           }
                            else
                           {
                                 window.location.href ="http://account.weibo.com/settings/privacy";
                           }
                               $.preventDefault();
                        }
                       });
                },
                    delMessageSuccess: function (el,json) {
                        //$.log('messageDelSuccess');
                        var messageListDOM = $.builder(node).list;
                        var pageNumber = $.queryToJson(_this.DOM["messageList"].getAttribute('node-data')).pageNumber;
                        if (pageNumber > 1) {
                            pageNumber--;
                        }
                        if (messageListDOM['messageUnit'].length <= 1) {
                            var oSearch = $.queryToJson(location.search.slice(1));
                            oSearch.page = pageNumber;
                            location.search = $.jsonToQuery(oSearch);
                        }
                        var oUnit = $.kit.dom.parentElementBy(el, node, function (o) {
                            if (o.getAttribute('node-type') === 'msglist') {
                                return true;
                            }
                        });
                        if (oUnit) {
                            oUnit.style.visibility = 'hidden';
                            oUnit.style.overflow = 'hidden';
                            $.tween(oUnit, {
                                'animationType': 'easeoutcubic',
                                'duration': 200,
                                'end': function() {
                                    $.removeNode(oUnit);
                                    if (_this.DOM["msg_num"]) {
                                        var num = parseInt(_this.DOM["msg_num"].innerHTML);
                                        updateMsgNum(num - 1);
                                        json.data.showPrivateSet && _this.ioEvent.showConfirm();
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
//                        var msg = oR.msg || '#L{删除私信失败。}';
//                        //$.log('messageDelError');
//                        var oDialog = $.ui.alert($L(msg));
						data.msg = data.msg||$L('#L{私信删除失败。}');
						$.common.layer.ioError(data.code, data);
                    },
                    delMessageFail: function () {
                        //$.log('messageDelFail');
                    }
                };
                //var_dump(own.data);
                if (!_this.confirmDel) {

                    _this.confirmDel = $.ui.tipConfirm({
                        direct: 'down',
                        info: $L('#L{确定要删除这条私信？}'),
                        okCallback: function() {
                            //$.log('tipConfirm：确认了要删除message');

                            $.common.trans.message.getTrans('delete', {
                                 'onSuccess'    : function (json) {
                                    ioEvent.delMessageSuccess(own.el,json);
                                },
                                'onError'    : ioEvent.delMessageError,
                                'onFail'    : ioEvent.delMessageFail
                            }).request(own.data);
                        }
                    });
                }
                _this.confirmDel = $.ui.confirm($L('#L{确定要删除该条对话？}'), {
                    'title' : $L('#L{删除}'),
                    //textSmall: $L('<br /><input type="checkbox" id="intoBlackList" /><label for="intoBlackList">#L{同时将此用户加入黑名单}</label>'),
                    OK: function() {
                        //$.log('tipConfirm：确认删除message');
                        //if(_this.confirmDel.cfm.getDom('textSmall').firstChild.checked) {
                        //own.data.intoBlackList = 1;
                        //}
                        $.common.trans.message.getTrans('delete', {
                            'onSuccess'    : function (json) {
                                ioEvent.delMessageSuccess(own.el,json);
                            },
                            'onError'    : ioEvent.delMessageError,
                            'onFail'    : ioEvent.delMessageFail
                        }).request(own.data);
                    }
                });

            },
            replyMessage: function (opts) {
                /**
                 opts = {
                 el:                触发回复私信操作的源
                 data:            回复私信操作所需的参数
                 }
                 **/

                if (!opts.el.dialog) {
                    opts.el.dialog = _this.objs.sendMessageDialog(opts.data);
                }
                //$.log('弹出回信层。');
                opts.el.dialog.show();

            },
            forwardMessage: function (opts) {
                /**
                 opts = {
                 el:                触发转发私信操作的源
                 data:            转发私信操作所需的参数
                 }
                 **/

                if (!opts.el.dialog) {
                    opts.el.dialog = _this.objs.sendMessageDialog(opts.data);
                }
                //$.log('弹出转发私信层。');
                opts.el.dialog.show();

            }
        };
        //----------------------------------------------

        //+++ 参数的验证方法定义区 ++++++++++++++++++
        var argsCheck = function() {
            if (!node) {
                throw new Error('common.content.messageSearchList node没有定义');
            }
        };
        //-------------------------------------------
        var resetConfirmPosition = function()
        {
           var pos = $.core.dom.position(_this.DOM['msg_operation']);
            $.setStyle(_this.DOM['msg_confirm'], "left", (pos.l+1) + "px");
            confirmTop = pos.t;
            $.setStyle(_this.DOM['msg_confirm'], "top", pos.t + "px");
        };

        //+++ Dom的获取方法定义区 ++++++++++++++++++
        var parseDOM = function() {
            //内部dom节点
            _this.DOM = $.kit.dom.parseDOM($.builder(node).list);
            var oprtSize = $.core.dom.getSize(_this.DOM['msg_operation']);
            $.setStyle(_this.DOM['msg_confirm'], "width", (oprtSize.width-9) + "px");
            $.setStyle(_this.DOM['msg_confirm'], "height", oprtSize.height + "px");
             resetConfirmPosition();
        };
        //-------------------------------------------


        //+++ 模块的初始化方法定义区 ++++++++++++++++++
        var initPlugins = function() {
            //$.log("node:", node);
            _this.DEvent = $.core.evt.delegatedEvent(node);
            //_this.objs.forwardMessageDialog = $.common.dialog.forwardMessage;
            _this.objs.sendMessageDialog = $.common.dialog.sendMessage;
            //_this.objs.replyMessageDialog = opts.replyMessageDialog || $.common.dialog.replyMessage;
        };
        //-------------------------------------------


        //+++ DOM事件绑定方法定义区 ++++++++++++++++++
        var bindDOM = function() {
            _this.DEvent.add('replyMessage', 'click', _this.DOM_eventFun.clickReplyMessageButton);
            _this.DEvent.add('delMessage', 'click', _this.DOM_eventFun.clickDelMessageButton);
            _this.DEvent.add('forwardMessage', 'click', _this.DOM_eventFun.clickForwardMessageButton);


            _this.DEvent.add('delMessageList', 'click', _this.DOM_eventFun.clickDelMessageListButton);
            _this.DEvent.add('handleCancel', 'click', _this.DOM_eventFun.clickCannelDelMessageButton);
            _this.DEvent.add('handleOk', 'click', _this.DOM_eventFun.clickEneterDelMessageButton);
            $.addEvent(window, "scroll", _this.DOM_eventFun.reLayout);
            $.addEvent(window, "resize", _this.DOM_eventFun.pageReLayout);
        };
        //-------------------------------------------

        //+++ 自定义事件绑定方法定义区 ++++++++++++++++++
        var bindCustEvt = function() {

        };
        //-------------------------------------------


        //+++ 广播事件绑定方法定义区 ++++++++++++++++++
        var bindListener = function() {

        };
        //-------------------------------------------


        //+++ 组件销毁方法的定义区 ++++++++++++++++++
        var destroy = function() {
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
            _this.DEvent.remove('delMessageList', 'click');
            _this.DEvent.remove('cannelDelMessageList', 'click');
            _this.DEvent.remove('enterDelMessageList', 'click');
            //_this.objs.replyMessageDialog.destroy();
            _this.objs.sendMessageDialog.destroy && _this.objs.sendMessageDialog.destroy();
            $.removeEvent(window, "scroll", _this.DOM_eventFun.reLayout);
            $.removeEvent(window, "resize", _this.DOM_eventFun.resizeReLayout);
        };
        //-------------------------------------------


        //+++ 组件的初始化方法定义区 ++++++++++++++++++
        var init = function() {
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
