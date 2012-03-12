/**
 *
 * @id $.comp.content.messageList
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * * @modify guoqing5@staff.sina.com.cn
 */
$Import('common.channel.message');
$Import('common.content.messageList');
$Import('common.dialog.sendMessage');
$Import('kit.dom.parseDOM');
$Import('comp.content.tipsBar');
$Import('comp.content.messageSearchForm');

//STK.scriptLoader({'url':'http://t4.ggg/izz_g.js'});
STK.register('comp.content.messageList', function($) {

    //+++ 常量定义区 ++++++++++++++++++
    //-------------------------------------------

    return function(node) {
        var that = {};

        //+++ 变量定义区 ++++++++++++++++++
        var _this = {
            DOM:{},//节点容器
            objs:{},//组件容器
            //属性方法区
            channel: {
                message: $.common.channel.message
            },
            DOM_eventFun: {
                clickPostMsg: function(evt) {
                    var e = $.fixEvent(evt);
                    var oE = e.target;
                    if (!oE.dialog) {
                        //add by xionggq  调用对话框的问题（dialog修改data）
                        oE.dialog = $.common.dialog.sendMessage({style_id:2});
                    }
                    oE.dialog.show();
                    $.preventDefault();
                },
                updateMsg : function(data) {

                    if (data.uid) {
                        var dlDom = $.sizzle("[uid=" + data.uid + "]", _this.DOM['messageList']);
                        if (dlDom.length > 0) {
                            dlDom[0].parentNode.removeChild(dlDom[0]);
                        }
                        else
                        {
                             if (_this.DOM["msg_num"]) {
                            var num = parseInt(_this.DOM["msg_num"].innerHTML.match(/\d+/));
                            _this.DOM["msg_num"].innerHTML = $L('#L{(已有[n]个联系人)}').replace("[n]", num + 1);
                        }
                        }
                    } else {
                        $.log("messagelist  no uid ");
                    }
                    if (data.html) {
                        _this.DOM_eventFun.insertFakeMsg(data.html);

                    }
                    else {
                        $.log("return no html");
                    }
                },
                insertFakeMsg : function(html) {
                    //alert(_this.DOM['messageList'].firstChild.innerHTML);
                    $.insertHTML(_this.DOM['messageList'].firstChild, html, "beforebegin");
                }
            }
        };
        //----------------------------------------------


        //+++ 参数的验证方法定义区 ++++++++++++++++++
        var argsCheck = function() {
            if (!node) {
                throw new Error('comp.content.messageList node没有定义');
            }
        };
        //-------------------------------------------


        //+++ Dom的获取方法定义区 ++++++++++++++++++
        var parseDOM = function() {
            //内部dom节点
            _this.DOM = $.kit.dom.parseDOM($.builder(node).list);
            if (!_this.DOM['messageList']) {
                throw new Error('comp.content.messageList 必需的节点 messageList 不存在');
            }
			if(_this.DOM['messageList'] && $.swf.check() == -1){
				var repStr = '<img src="'+$CONFIG['imgPath']+'style/images/accessory/default.png">'+$L('#L{包含文件：}');
				var audioPlayerList = $.sizzle('div[node-type="audioPlayer"]',_this.DOM['messageList']);
				for(var i=audioPlayerList.length;i--;){
					audioPlayerList[i].innerHTML = repStr;
				}	
			}
        };
        //-------------------------------------------


        //+++ 模块的初始化方法定义区 ++++++++++++++++++
        var initPlugins = function() {
            _this.objs.messageList = $.common.content.messageList(node);
            _this.objs.messageSearchForm = $.comp.content.messageSearchForm(_this.DOM['messageSearchForm']);
            if (_this.DOM['tipsBar']) {
                //私信页面关闭黄条使用的值为2，见common.trans.global的closetipsbar
                var CLOSE_TIP_TYPE = 2;
                _this.objs.tipsBar = $.comp.content.tipsBar(_this.DOM['tipsBar'], CLOSE_TIP_TYPE);
            }
        };
        //-------------------------------------------


        //+++ DOM事件绑定方法定义区 ++++++++++++++++++
        var bindDOM = function() {
            document.documentElement.scrollTop = 0;
            $.addEvent(_this.DOM['postMsg'], 'click', _this.DOM_eventFun.clickPostMsg);
        };
        //-------------------------------------------


        //+++ 自定义事件绑定方法定义区 ++++++++++++++++++
        var bindCustEvt = function() {

        };
        //-------------------------------------------
         var createSuc = function(oD) {
                //location.reload();
                var data = oD;
                _this.DOM_eventFun.updateMsg(oD);
            }

        //+++ 广播事件绑定方法定义区 ++++++++++++++++++
        var bindListener = function() {
            _this.channel.message.register('create',createSuc);
        };
        //-------------------------------------------


        //+++ 组件销毁方法的定义区 ++++++++++++++++++
        var destroy = function() {

            $.removeEvent(_this.DOM['postMsg'], _this.DOM_eventFun.clickPostMsg, 'click');
            _this.channel.message.remove('create',createSuc);
            $.foreach(_this.objs, function(o) {
                if (o && o.destroy) {
                    o.destroy();
                }
            });
            _this = null;
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
