/**
 *
 * @id $.common.content.messageDetailList
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
 * demo待完善
 */
$Import('kit.dom.parentElementBy');
$Import('common.trans.message');
$Import('common.dialog.sendMessage');
$Import('kit.dom.parseDOM');
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('kit.extra.language');
$Import('kit.dom.parentElementBy');
$Import('ui.confirm');
$Import("kit.dom.lastChild");
$Import('common.layer.ioError');

STK.register('common.content.messageDetailList', function($) {

    //+++ 常量定义区 ++++++++++++++++++
    var $L = $.kit.extra.language;
    var next = $.core.dom.next,prev = $.core.dom.prev;
    var msgNumHtml = $L('#L{共[n]条私信对话}');
    var msgNum = 0;
    var confirmTop =0;
    //-------------------------------------------
    return function(node) {
        var that = {};

        //+++ 变量定义区 ++++++++++++++++++
        var _this = {
            DOM:{},//节点容器
            objs:{},//组件容器
            //属性方法区
            DOM_eventFun: {
                reLayout : function() {
                    var node = _this.DOM['msg_confirm'];
                    if ($.getStyle(node, "display") == "none") return;

                    var scrollPos = $.scrollPos();
                    var topX = scrollPos.top;

                    if (!$.core.util.browser.IE6) {
                        if (parseInt(topX) > (confirmTop - 33)) {
                            $.setStyle(node, "top", 33 + "px");
                            if ($.getStyle(node, "position") == "fixed") return;
                            $.setStyle(node, "position", "fixed");
                        }
                        else {
                            $.setStyle(node, "top", confirmTop + "px");
                            if ($.getStyle(node, "position") == "absolute") return;
                            $.setStyle(node, "position", "absolute");
                            //$.setStyle(node, "top", pos.t-topX +"px");
                        }
                    }

                },
                resizeReLayout : function () {
                   resetConfirmPosition();
                    _this.DOM_eventFun.reLayout();
                }
            },

            DEventFun: {
                clickDelMessageList: function (o) {

                    var oE = o.el;
                    //$.log('$.common.content.messageDetail clickDelMessageList ');
                    node.actionType = 'del';

                    //_this.DOM['numberTip'].innerHTML = $L('#L{请选择您要删除的私信：}');
                    _this.showHandleConfirm();
                    _this.showMessageCheckBox();

                    $.preventDefault();
                },
                clickForwardMessageList: function (o) {

                    var oE = o.el;
                    //$.log('$.common.content.messageDetail clickForwardMessageList ');
                    node.actionType = 'forward';
                    //_this.DOM['numberTip'].innerHTML = $L('#L{请选择一条您要转发的私信：}');
                    _this.showHandleConfirm();
                    _this.showMessageCheckBox();
                    //_this.DOM['handleOk'].style.display = 'none';

                    $.preventDefault();
                },
                clickDeleteMessage : function(o) {
                    _this.deleteMessage({
                        "el" : o.el,
                        "data" : o.data
                    });
                },
                clickForwardMessage : function(o) {
                    //$.log(o);
                    _this.forwardMessage({
                        el: o.el,
                        data: o.data
                    });
                    $.preventDefault();
                },
                clickReplyMessage : function(o) {
                    _this.replyMessage({
                        el: o.el,
                        data: o.data
                    });
                    $.preventDefault();
                },
                clickHandleOk: function (o) {

                    var oE = o.el;
                    //$.log('$.common.content.messageDetail clickHandleOk ');
                    var data = $.htmlToJson(node);
                    if (node.actionType === 'forward') {
                        if (!data['msgSel']) {
                            $.ui.alert($L('#L{请选择一条要转发的私信。}'));
                            return $.preventDefault();
                        }
                        _this.forwardMassageList($.E('msgRadioInput_' + data['msgSel']));
                    } else if (node.actionType === 'del') {
                        if (!data['msgList[]']) {
                            $.ui.alert($L('#L{请选择要删除的私信。}'));
                            return $.preventDefault();
                        } else {
                            _this.delMassageList(data);
                        }

                    } else {
                        return $.preventDefault();
                    }
                    //_this.DOM['numberTip'].innerHTML = _this.numberTipHtml;
                    _this.hiddenHandleConfirm();
                    _this.hiddenMessageInput();

                    $.preventDefault();
                },
                clickHandleCancel: function (o) {

                    var oE = o.el;
                    //$.log('$.common.content.messageDetail clickHandleCancel ');
                    //_this.DOM['numberTip'].innerHTML = _this.numberTipHtml;
                    _this.hiddenHandleConfirm();
                    _this.hiddenMessageInput();
                    node.actionType = '';

                    $.preventDefault();
                },
                clickMsgCheckBox: function (o) {
                    if (node.actionType === 'forward') {
                        _this.forwardMassageList(o.el);
                        $.preventDefault();
                    }
                }
            },
            forwardMessage : function(opts) {
                if (!opts.el.dialog) {
                    //$.log(opts.data);
                    opts.el.dialog = _this.objs.forwardMessageDialog(opts.data);
                }
                //$.log('弹出转发私信层。');
                opts.el.dialog.show();
            },
            replyMessage :function(opts) {
                $.custEvent.fire(that, "toEdit");
            },
            showHandleConfirm: function () {
                //$.log(_this.DOM, _this.DOM['msg_operation'], _this.DOM['msg_confirm']);
                if (_this.DOM['delMessageList']) {
                    $.setStyle(_this.DOM['delMessageList'], "visibility", "hidden");
                }
                if (_this.DOM['msg_confirm']) {
                    $.setStyle(_this.DOM['msg_confirm'], "display", "");
                    _this.DOM_eventFun.reLayout();
                }
            },
            hiddenHandleConfirm: function () {
                if (_this.DOM['delMessageList']) {
                    $.setStyle(_this.DOM['delMessageList'], "visibility", "visible");
                }
                if (_this.DOM['msg_confirm']) {
                    $.setStyle(_this.DOM['msg_confirm'], "display", "none");
                }
            },
            showMessageCheckBox: function () {
                var msgID, msgInput, hideInput, msgData;
                $.foreach(_this.DOM['messageBox'], function(o) {
                    msgID = o.id.match(/\d+/);
                    msgData = o.getAttribute('action-data');
                    $.addClassName(o.parentNode.parentNode.parentNode, 'operat_con');
                    var parentdom = $.core.dom.prev(o.parentNode);
                    if (!parentdom && $.sizzle("type=checkbox", parentdom).length == 0) {
                        $.insertHTML(
                                o,
                                '<div class="op_cbox"><input type="checkbox" node-type="msgCheckBox" action-type="msgCheckBox" id="msgCheckboxInput_' + msgID + '" value="' + msgID + '" name="msgList[]" class="W_checkbox"></div>',
                                'BeforeBegin');
                        o.innerHTML = '<label for="msgCheckboxInput_' + msgID + '">' + o.innerHTML + '</label>';
                        o.labelEle = o.firstChild;
                    }
                    var closeBtn = $.sizzle(".close", o.parentNode)[0];
                    var operatArea = $.sizzle(".operation", o.parentNode)[0];
                    closeBtn.style.display = "none";
                    operatArea.style.display = "none";
                    /*if(node.actionType === 'forward') {
                     msgInput = $.core.dom.prev(o.parentNode);
                     hideInput = $.core.dom.prev($.core.dom.prev(o.parentNode));
                     o.labelEle.setAttribute('for','msgRadioInput_'+msgID);
                     }else if(node.actionType === 'del') {
                     msgInput = $.core.dom.prev($.core.dom.prev(o.parentNode));
                     hideInput = $.core.dom.prev(o.parentNode);
                     o.labelEle.setAttribute('for','msgCheckboxInput_'+msgID);
                     }
                     msgInput.style.display = '';
                     hideInput.style.display = 'none';
                     msgInput.checked = false;
                     hideInput.checked = false;*/
                });
            },
            hiddenMessageInput: function () {
                $.foreach(_this.DOM['messageBox'], function(o) {
                    $.removeClassName(o.parentNode.parentNode.parentNode, 'operat_con');
                    $.core.dom.prev(o).style.display = 'none';
                    //$.core.dom.prev($.core.dom.prev(o.parentNode)).style.display = 'none';
                    var closeBtn = $.sizzle(".close", o.parentNode)[0];
                    var operatArea = $.sizzle(".operation", o.parentNode)[0];
                    closeBtn.style.display = "";
                    operatArea.style.display = "";
                });
            },
            deleteMessage : function(data) {
                //$.log('common.content.messageDetail delMassage');
                var own = data.el;
                _this.confirmDel = $.ui.confirm($L('#L{确定要删除该条对话？}'), {
                    'title' : $L('#L{删除}'),
                    //textSmall: $L('<br /><input type="checkbox" id="intoBlackList" /><label for="intoBlackList">#L{同时将此用户加入黑名单}</label>'),
                    OK: function() {
                        //$.log('tipConfirm：确认删除message');
                        $.common.trans.message.getTrans('delete', {
                            'onSuccess'    : function (json) {
                                    _this.delMessageSuccess(own,json);
                            },
                            'onError'    : _this.delMessageError,
                            'onFail'    : _this.delMessageFail
                        }).request(data.data);
                    }
                });
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
            delMessageSuccess :function(dom,json) {

                var pdom = $.kit.dom.parentElementBy(dom, node, function (o) {
                    if (o.getAttribute('node-type') == 'msgDetail') {
                        return true;
                    }
                });
                if (prev(pdom) || (next(pdom) && next(next(pdom)))) {
                    $.tween(pdom, {
                        'animationType': 'easeoutcubic',
                        'duration': 200,
                        'end': function() {


                           //解决最后一条有横线
                          var msgDom = $.kit.dom.parentElementBy(dom, node, function (o) {
                                if (o.getAttribute('node-type') == 'msgList') {
                                    return true;
                                }
                            });
                            var lastElements = $.sizzle("[node-type=msgDetail]", msgDom);
                            var length = lastElements.length;
                            if (length > 0 && lastElements[length - 1] == pdom) {
                                var prev = $.core.dom.prev(pdom);
                                if (prev && $.hasClassName(prev, "line")) {
                                    prev.parentNode.removeChild(prev);
                                }
                            }
                            var nextdom = next(pdom);
                            if (nextdom) {
                                nextdom.parentNode.removeChild(nextdom);
                            }
                            pdom.parentNode.removeChild(pdom);
                            parseDOM();
                            if (_this.DOM["msg_num"]) {
                                var num = parseInt(_this.DOM["msg_num"].innerHTML.match(/\d+/));
                                updateMsgNum(num - 1);
                            }
                             json.data.showPrivateSet && _this.showConfirm();
                        }
                    }).finish({
                                  height: 0,
                                  paddingTop: 0,
                                  paddingBottom: 0
                              });

                }
                else {
                    var msgDom = $.kit.dom.parentElementBy(dom, node, function (o) {
                        if (o.getAttribute('node-type') == 'msgList') {
                            return true;
                        }
                    });
                    $.tween(msgDom, {
                        'animationType': 'easeoutcubic',
                        'duration': 200,
                        'end': function() {

                          //解决最后一条上面有横线
                         var lastElements = $.sizzle("[node-type=msgList]", _this.DOM["messageList"]);
                            var length = lastElements.length;
                            if (length > 0 && lastElements[length - 1] == msgDom) {
                                var prev = $.core.dom.prev(msgDom);
                                if (prev && $.hasClassName(prev, "line1")) {
                                    prev.parentNode.removeChild(prev);
                                }
                            }
                            var nextdom = next(msgDom);
                           var prevdom = $.core.dom.prev(msgDom);
                            //判断下一个节点是不是一条线。
                            if (nextdom && $.hasClassName(nextdom, "line1")) {
                                //判断上一个节点是不是一条线。如果要假写打开即可。
                                if(prevdom && $.hasClassName(prevdom, "line1")){
                                nextdom.parentNode.removeChild(nextdom);
                                }
                            }

                            msgDom.parentNode.removeChild(msgDom);
                            parseDOM();
                            var size = $.sizzle("[node-type=msgList]", node).length;
                            if (size == 0) {
                                window.location.reload();
                                return;
                            }
                            if (_this.DOM["msg_num"]) {
                                var num = parseInt(_this.DOM["msg_num"].innerHTML.match(/\d+/));
                                updateMsgNum(num - 1);
                            }
                            json.data.showPrivateSet  && _this.showConfirm();
                        }
                    }).finish({
                                  height: 0,
                                  paddingTop: 0,
                                  paddingBottom: 0
                              });
                }
            },
            delMessageError : function(data) {
//                //$.log('messageDelError');
//                var msg = oR.msg || '#L{删除私信失败。}';
//                //$.log('messageDelError');
//                $.ui.alert($L(msg));
				
				data.msg = data.msg||$L('#L{删除私信失败。}');
				$.common.layer.ioError(data.code, data);
				
            },
            delMessageFail : function(oR) {
//                //$.log('messageDelFail');
//                var msg = oR.msg || '#L{删除私信失败。}';
//                //$.log('messageDelError');
//                $.ui.alert($L(msg));

				data.msg = data.msg||$L('#L{删除私信失败。}');
				$.common.layer.ioError(data.code, data);
            },
            getMessageList : function(isShowPrivate) {

                //$.log('fnAfterDelMsgSuccess');
                var hasCheckBoxIsFalse;
                var aDom = $.kit.dom.parseDOM($.builder(node).list),
                        pageNumber = _this.DOM["messageList"].getAttribute('pageNumber') ? _this.DOM["messageList"].getAttribute('pageNumber').match(/\d+/) : 1;
                var i = 1;
                if(!$.isArray(aDom['msgCheckBox']))
                {
                    var arrCheck  =  aDom['msgCheckBox'];
                     aDom['msgCheckBox'] =[];
                    aDom['msgCheckBox'].push(arrCheck);

                }
                $.foreach(aDom['msgCheckBox'], function(o) {
                    //$.log("foreach:", i++, this);
                    if (!o.checked) {
                        hasCheckBoxIsFalse = true;
                    }
                });


                if (!hasCheckBoxIsFalse && pageNumber > 1) {
                    pageNumber--;
                }
                var oSearch = $.queryToJson(location.search.slice(1));
                oSearch.page = pageNumber;
                $.common.trans.message.getTrans('getMsg', {
                    'onSuccess': function (o) {
                        //$.log('getMsg onSuccess');
                        if (o.data.html) {
                            isShowPrivate && _this.showConfirm();
                            _this.DOM["messageList"].innerHTML = o.data.html;
                            parseDOM();
                            updateMsgNum(o.data.count);
                        }
                        else {
                            var href = o.data.url || "/messages";
                            window.location.href = href;
                        }
                        //$.common.channel.message.fire('count', _this.DOM["msgDetail"].length);
                    },
                    'onError': function (data) {
						$.common.layer.ioError(data.code, data);
                    },
                    'onFail': function (data) {
						data.msg = data.msg||$L('#L{私信获取失败。}');
						$.common.layer.ioError(data.code, data);
                    }
                }).request(oSearch);
            },
            delMassageList: function (data) {
                //$.log('common.content.messageDetail delMassageList');

                var aDom = $.kit.dom.parseDOM($.builder(node).list),
                        pageNumber = node.getAttribute('pageNumber') ? node.getAttribute('pageNumber').match(/\d+/) : 1;

                if (aDom['msgCheckBox'] && aDom['msgCheckBox'].nodeType === 1) {
                    aDom['msgCheckBox'] = [aDom['msgCheckBox']];
                }

                $.common.trans.message.getTrans('delete', {
                    'onSuccess': function (json) {
                        //$.log('delete onSuccess');
                        //fnAfterDelMsgSuccess(o);
                        _this.getMessageList(json.data.showPrivateSet);

                        $.ui.litePrompt($L('#L{私信删除成功。}'), {'type':'succM','timeout':'500'});
                    },
					'onError': function (data) {
						$.common.layer.ioError(data.code, data);
                    },
                    'onFail': function (data) {
						data.msg = data.msg||$L('#L{私信删除失败。}');
						$.common.layer.ioError(data.code, data);
                    }
                }).request(data);
            },
            forwardMassageList: function (el) {
                //$.log('common.content.messageDetail forwardMassageList');
                var data = $.queryToJson(el.getAttribute('action-data'));
                data.title = '转发私信';
                //$.log($.jsonToStr(data));
                if (el) {
                    if (!el.dialog) {
                        el.dialog = _this.objs.forwardMessageDialog(data);
                    }
                    el.dialog.show();
                }


            },
            refreshListWithHTML: function (sHtml) {
                node.innerHTML = sHtml;
                parseDOM();
            }
        };

        //----------------------------------------------
        var updateMsgNum = function(num) {
            if (_this.DOM["msg_num"]) {
                _this.DOM["msg_num"].innerHTML = msgNumHtml.replace("[n]", num);
            }
        };
        var getIsSameDay = function(firstDay, secondDay) {     //没有时间传递就直接返回fasle。
            //$.log("what", firstDay, secondDay);
            if (!firstDay || !secondDay) {
                return false;
            }
            if (typeof firstDay == "string") {
                firstDay = parseInt(firstDay);
            }
            if (typeof secondDay == "string") {
                secondDay = parseInt(secondDay);
            }
            //$.log("isSame", firstDay, secondDay, Math.abs(firstDay - secondDay))
            //判断两个日期时间差大于半个小时
            if (Math.abs(firstDay - secondDay) < 3600 / 2) {
                var a = new Date(firstDay);
                var b = new Date(secondDay);
                return(a.getDay() == b.getDay());
            }
            return false;
        };

        var updateDelMsg = function(data) {
            // 接口返回tml，没有表明不是发给当前的人。
            if (data.html && _this.DOM["messageList"]) {
                //判断是批量删除模式
                if (node.actionType == 'del') {
                    _this.hiddenHandleConfirm();
                    _this.hiddenMessageInput();
                    node.actionType = '';
                }
                //得到当前节点的第一个节点。
                var fchild = $.kit.dom.firstChild(_this.DOM["messageList"]);
                //得到当前节点的第一条详情信息的节点。
                var firstDetail = ($.isArray(_this.DOM['msgDetail']) ? _this.DOM['msgDetail'][0] : _this.DOM['msgDetail']);
                if (fchild && firstDetail) {
                    //获取发送状态，1发送方发送，0接收方发送
                    var issend = firstDetail.getAttribute("is-send") || 0;
                    //发送时间戳。和接口中的时间比较
                    var sendTime = firstDetail.getAttribute("create-at") || 0;
                    //是否为半个小时内发送而且是同一个发送者的在同一个气泡内，否则在新建一个气泡
                    if (getIsSameDay(sendTime, data.time) && issend != "0") {
                        var firstMsgList = _this.DOM['msgList'][0];
                        var dlDom = $.sizzle('[node-type="msgDetail"]', firstMsgList);
                        //写保护
                        if (dlDom.length > 0) {
                            var ddDom = $.core.dom.builder(data.html);
                            //得到私信的内容
                            var pnode = ddDom.list["msgDetail"][0];
                            //插入横线
                            var html = '<div class="line clearfix"></div>';
                            var pdom = dlDom[0];
                            //获取信息节点后插入节点
                            $.insertBefore(pnode, pdom);
                            $.insertHTML(pdom, html, "beforebegin");
                        }
                    }
                    else {
                       // 大于半个小时出横线.先把这个注释掉
                       if(getIsSameDay(sendTime, data.time))
                        {
                        var lineHtml = '<div class="line1 clearfix"></div>';
                        $.insertHTML(_this.DOM["messageList"], lineHtml, "afterbegin");
                        }
                        $.insertHTML(_this.DOM["messageList"], data.html, "afterbegin");
                    }
                }
                else if (!fchild && !firstDetail) {
                    _this.DOM["messageList"].innerHTML =  data.html;
                }
                parseDOM();
                updateMsgNum(data.count);
            }


        };
        //+++ 参数的验证方法定义区 ++++++++++++++++++
        var argsCheck = function() {
            if (!node) {
                throw new Error('node没有定义');
            }
        };
        //-------------------------------------------
        var resetConfirmPosition = function() {
            var pos = $.core.dom.position(_this.DOM['msg_operation']);
            $.setStyle(_this.DOM['msg_confirm'], "left", pos.l + "px");
            confirmTop = pos.t;
            $.setStyle(_this.DOM['msg_confirm'], "top", pos.t + "px");
        };

        //+++ Dom的获取方法定义区 ++++++++++++++++++
        var parseDOM = function() {
            //内部dom节点
            _this.DOM = $.kit.dom.parseDOM($.builder(node).list);
            //msgNum = parseInt(node.getAttribute("num")) || 0;
            if (_this.DOM['messageBox'] && _this.DOM['messageBox'].nodeType === 1) {
                _this.DOM['messageBox'] = [_this.DOM['messageBox']];
            }

            if (!_this.DOM['nullTip']) {
                if (!_this.DOM['delMessageList']) {
                    throw new Error('必需的节点 delMessageList 不存在');
                }
                if (!_this.DOM['handleOk']) {
                    throw new Error('必需的节点 handleOk 不存在');
                }
                if (!_this.DOM['handleCancel']) {
                    throw new Error('必需的节点 handleCancel 不存在');
                }
            }
            var oprtSize = $.core.dom.getSize(_this.DOM['msg_operation']);
            $.setStyle(_this.DOM['msg_confirm'], "width", (oprtSize.width - 9) + "px");
            $.setStyle(_this.DOM['msg_confirm'], "height", oprtSize.height + "px");
            resetConfirmPosition();
        };
        //-------------------------------------------


        //+++ 模块的初始化方法定义区 ++++++++++++++++++
        var initPlugins = function() {
            _this.DEvent = $.core.evt.delegatedEvent(node);
            _this.objs.forwardMessageDialog = $.common.dialog.sendMessage;
            //_this.numberTipHtml = _this.DOM['numberTip'].innerHTML;
            $.custEvent.define(that, ["toEdit"]);
        };
        //-------------------------------------------


        //+++ DOM事件绑定方法定义区 ++++++++++++++++++
        var bindDOM = function() {
            _this.DEvent.add('delMessageList', 'click', _this.DEventFun.clickDelMessageList);
            _this.DEvent.add('forwardMessageList', 'click', _this.DEventFun.clickForwardMessageList);
            _this.DEvent.add('handleOk', 'click', _this.DEventFun.clickHandleOk);
            _this.DEvent.add('handleCancel', 'click', _this.DEventFun.clickHandleCancel);

            _this.DEvent.add('forwardMessage', 'click', _this.DEventFun.clickForwardMessage);
            _this.DEvent.add('replyMessage', 'click', _this.DEventFun.clickReplyMessage);
            _this.DEvent.add('delMessage', 'click', _this.DEventFun.clickDeleteMessage);
            $.addEvent(window, "scroll", _this.DOM_eventFun.reLayout);
            $.addEvent(window, "resize", _this.DOM_eventFun.resizeReLayout);
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
            $.custEvent.undefine(that);
            _this.DEvent.remove('delMessageList', 'click');
            _this.DEvent.remove('forwardMessageList', 'click');
            _this.DEvent.remove('handleOk', 'click');
            _this.DEvent.remove('handleCancel', 'click');

            _this.DEvent.remove('forwardMessage', 'click');
            _this.DEvent.remove('replyMessage', 'click');
            _this.DEvent.remove('delMessage', 'click');


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
        that.parseDOM = parseDOM;
        that.updateDelMsg = updateDelMsg;
        that.getMessageList = _this.getMessageList;
        that.refreshListWithHTML = function () {
            _this.refreshListWithHTML.apply(_this, arguments);
        };
        //-------------------------------------------


        return that;
    };

});
