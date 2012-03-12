/**
 * 版本提示
 * @author guoqing5@staff.sina.com.cn
 */

$Import('common.trans.versionTip');
$Import('common.layer.guide');
$Import('kit.dom.parseDOM');
$Import('ui.alert');

STK.register('comp.content.userGuider', function($) {

    var STATUS = 1;
    //+++ 常量定义区 ++++++++++++++++++
    //-------------------------------------------
    return function(node) {
        var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {}, dEvt,
                lastScrollTime, delay, getTrans = $.common.trans.versionTip.getTrans, block = false, bIn, lock = false, SHOWDELAY = 300, trans;
        var guide = $.common.layer.guide();
        var delayTimer = null;
        var num = 0;
        var stime = null;
        var arrValue = ['num_tip','review_tip','message_tip','letter_tip','interest_tip','at_tip'];
		var willSendSuda = 0;
        //+++ 变量定义区 ++++++++++++++++++
//
        var _this = {
            DOM:{},//节点容器
            objs:{},//组件容器
            Utils : {
                /**
                 *  根据type值设置指向顶部图盘的覆层的位置
                 * @param {number} type 类型
                 * @param {Element} arrow 对应的箭头对象
                 * @param {number} topX 滚动条高度,比较固定顾直接根据位置定位。没法通过算法分析。
                 */
                setPositionByTop : function(type, arrow, topX) {
                    var target, dom, nodeSize, domSize;
                    var _domT = "account";
                    switch (type) {
                        case 1:
                            target = $CONFIG['isnarrow'] == '1' ? $.E("pl_content_personInfo") : $.E('pl_leftNav_common');
                            dom = $CONFIG['isnarrow'] == '1' ? $.sizzle(">div img", target)[0] : $.sizzle(">div img", target)[0];

                            break;
                        case 2:
                            target = $.E("pl_content_homeFeed");
                            var feedDom = $.builder(target).list;
                            if (feedDom['feed_list_repeat'])//有feed的情况
                            {
                                try{
                                dom = $.sizzle("[action-type='feed_list_forward']", $.sizzle("[action-type='feed_list_item']", target)[0])[0].parentNode;
                                }catch(e)
                                {
                                    return;
                                }
                            }
                            break;
                        case 3:
                            target = $.E("pl_content_top");
                            dom = $.kit.dom.parseDOM($.builder(target).list)[("notice")];
                            break;
                        case 4 :
                            target = $CONFIG['isnarrow'] == '1' ? $.E("pl_nav_outlookBar") : $.E("pl_leftNav_common");
                            dom = $.kit.dom.parseDOM($.builder(target).list)[("message")];
                            break;
                        case 5:
                            target = $.E('pl_content_homeInterest');
                             dom  =$.sizzle("[node-type=changeBtn]",target)[0];
                            //没有感兴趣的人触发。
                            if (!dom || $.trim(dom.innerHTML) == "" || dom.style.display == "none") {
                                STATUS++;
                                _this.Utils.showNext();
                                _this.Utils.setPosition(STATUS);
                                return;
                            }
                            break;
                        case 6:
                            target = $.E("pl_content_publisherTop");
                            dom = $.sizzle("[node-type=smileyBtn]",target)[0];
                            break;
                    }
                    node.style.display = "none";
                    node.style.left = "400px";
                    node.style.top = "400px";

                    node.style.width = "100px";
                    node.style.height = "100px";
                    nodeSize = $.core.dom.getSize(node);
                    domSize = $.core.dom.getSize(dom);
                    var pos = guide.getLayerPosition(dom, node, "bottom", arrow);
                    if (type == 1) {
                        pos.top = pos.top + 50;
                    }
                    else if (type == 2) {
                        pos.top = pos.top  + 4;
                    }
                    else if (type == 3) {

                        pos.top = pos.top - ($.core.util.browser.IE6 ?  0 : topX)  + 4;
                        pos.left = pos.left - 15;
                         //pos.arrow.left =  pos.arrow.left + 20;

                    }
                    else if (type == 4) {
                        pos.left = pos.left - 60;
                    }
                    else if (type == 5) {
                         pos.left = pos.left - 120;
                    }
                    else if (type == 6) {
                        pos.left = pos.left + 24 ;
                         pos.top = pos.top - 22 ;
                    }
                    guide.setPosition({layer:node, arrow:arrow}, pos);
                    // if(type!="4")
                    // {
                    node.style.position = "absolute";
                    //_this.DOM.ulist[type-1].parentNode.style.position =  "absolute";
                    // }
                    if (type == 3 || type == 2 || type == 6) {
                        _this.DOM.ulist[STATUS - 1].parentNode.style.width = "285px";

                    }

                    node.style.display = "";
            	    node.style.zIndex = "999";
                    if (type == 2 && !stime) {
                        stime = window.setInterval(function() {
                            var scrollPos = $.scrollPos();
                            var topX = scrollPos.top;
                            var currArrow = _this.DOM.arrow[type - 1];
                            _this.Utils.setPositionByTop(type, currArrow, topX);

                        }, 300);
                    }
                    return pos;

                },
                /**
                 *  设置浮层的位置
                 * @param {number} type 类型
                 * @param {boolean} calculate 是否忽略滚动动画。
                 */
                setPosition : function(type, calculate) {
                    if (lock) return;
                    var scrollPos = $.scrollPos();
                    var topX = scrollPos.top;
                    var pos;
                    var currArrow = _this.DOM.arrow[type - 1];
                    type = type || 1;
                    if (type == 2) {
                        var target = $.E("pl_content_homeFeed");
                        var feedDom = $.builder(target).list;
                        if (!feedDom['feed_list_repeat']) {
                            if (STATUS == 2) {

                                 STATUS++;
                                _this.Utils.showNext();
                                _this.Utils.setPosition(STATUS);
                            }
                            return;
                        }
                        var dom = null;
                       try{ dom  =($.sizzle("[action-type='feed_list_forward']", $.sizzle("[action-type='feed_list_item']", target)[0])[0]).parentNode;
                       }catch(e){

                       }
                        if(!dom) return;

                            _this.Utils.setPositionByTop(type, currArrow, topX);

                            /*$.scrollTo(dom, {
                                top:100,
                                onMoveStop : callback
                            });*/
                    }
                   /* if (type == 5 && $CONFIG['isnarrow'] == '1') {
                        var callback = function() {
                            _this.Utils.setPositionByTop(type, currArrow, topX);
                        };
                        if (!calculate) {
                            $.scrollTo($.E('pl_content_homeInterest'), {
                                top:100,
                                onMoveStop : callback
                            });
                        }
                    }
                    else if (type == 6 && $CONFIG['isnarrow'] == '1') {

                        var callback = function() {
                            _this.Utils.setPositionByTop(type, currArrow, topX);
                        };
                        $.scrollTo($.E("pl_content_top"), {top:10,onMoveStop : callback});

                    }*/
                    else
                    {
                         _this.Utils.setPositionByTop(type, currArrow, topX);
                    }
                },
                /**
                 * 显示下一个浮层
                 */
                showNext : function() {
                       try {
                        if (STATUS == 7) return;
                         /*  for(var i=0;i<_this.DOM.arrow.length;i++)
                           {
                               _this.DOM.ulist[i].style.display = "none";
                           }*/
                        _this.DOM.ulist[STATUS - 2].parentNode.style.display = "none";
                          _this.DOM.ulist[STATUS - 2].parentNode.removeChild( _this.DOM.ulist[STATUS - 2]);
                        /*_this.DOM.ulist[STATUS - 1].style.display = "";*/
                        _this.DOM.ulist[STATUS - 1].parentNode.style.display = "";
                         if (STATUS == 3) {
                            //$.scrollTo($.E("pl_content_top"), {top:0});
                            stime && window.clearInterval(stime);
                        }
                        sudaFunc();
                    } catch(e) {
                        $.log("err:", STATUS, "|||", e.message);
                    }

                },

                /**
                 * 显示浮层
                 */
                showTip : function() {
                },
                /**
                 * 隐藏浮层
                 */
                hideTip : function() {
                    node.style.display = "none";
                    !_this.hided && _this.Utils.showNext();

                }
            },
            DOM_eventFun: {//DOM事件行为容器

                /**
                 * 保存状态 ，“我知道了”点击事件函数
                 * @param obj
                 */
                iKnow : function(obj) {
		    if (lock) return;
                    lock = true;
                    _this.hided = true;
                     if (STATUS == 2) {
                            stime && window.clearInterval(stime);
                        }
                      _this.Utils.hideTip();
                    getTrans("userGuider", {
                        onSuccess: function(json) {

                            lock = false;
                            STATUS++;
                            _this.Utils.showNext();
                            _this.Utils.setPosition(STATUS);
                        },
                        onFail: function(json) {
                            //$.ui.alert($L('#L{' + (json.msg || " 接口错误") + '}'));
                            $.log($L('#L{' + (json.msg || " 接口错误") + '}'));
                            lock = false;
                        },
                        onError: function(json) {
                            lock = false;
                           $.log($L('#L{' + (json.msg || " 接口错误") + '}'));
                            //$.ui.alert($L('#L{' + (json.msg || " 接口错误") + '}'));

                        }
                    }).request(obj.data);
                    $.preventDefault(obj.evt);
                    return false;
                },
                reLayout : function() {
                    // if(STATUS != 4 ) return;
                    if (_this.hided) return;
                    if (lastScrollTime != null) {
                        if (new Date().getTime() - lastScrollTime < 500) {
                            clearTimeout(delay);
                            delay = null;
                        }
                    }
                    lastScrollTime = new Date().getTime();
                    delay = setTimeout(function() {
                        _this.Utils.setPosition(STATUS, STATUS == 3);
                    }, 100);
                }
            }
            //属性方法区

        };
        //----------------------------------------------


        //+++ 参数的验证方法定义区 ++++++++++++++++++
        argsCheck = function() {
            if (!node) {
                throw new Error('node没有定义');
            }
        };
        //-------------------------------------------


        //+++ Dom的获取方法定义区 ++++++++++++++++++
        parseDOM = function() {
            //内部dom节点
            _this.DOM = $.kit.dom.parseDOM($.builder(node).list);
            $.log(_this.DOM.uList);
            if (!_this.DOM.ulist) return false;
            for (var i = 0; i < _this.DOM.ulist.length; i++) {
                var item = _this.DOM.ulist[i];
                if (item.parentNode.style.display != "none") {
                    STATUS = i + 1;
                    break;
                }

                //将上面一段注释，下面一行取消注释可进行调试
//				item.parentNode.style.display = i == 0 ? "" : "none";
            }
            if (!_this.DOM.ulist) return;
            _this.Utils.setPosition(STATUS);

            dEvt = $.delegatedEvent(node);
            return true;
        };
        //-------------------------------------------


        //+++ 模块的初始化方法定义区 ++++++++++++++++++
        initPlugins = function() {

        };
        //-------------------------------------------


        //+++ DOM事件绑定方法定义区 ++++++++++++++++++
        bindDOM = function() {
            //$.addEvent(window, "scroll", _this.DOM_eventFun.reLayout);
            //$.addEvent(window, "resize", _this.DOM_eventFun.reLayout);
            dEvt.add("iKnow", "click", _this.DOM_eventFun.iKnow);
        };
        //-------------------------------------------


        //+++ 自定义事件绑定方法定义区 ++++++++++++++++++
        bindCustEvt = function() {

        };
        //-------------------------------------------


        //+++ 广播事件绑定方法定义区 ++++++++++++++++++
        bindListener = function() {

        };
        //-------------------------------------------


        //+++ 组件销毁方法的定义区 ++++++++++++++++++
        destroy = function() {
            dEvt.remove("lKnow", "click");
            //$.removeEvent(window, "scroll", _this.DOM_eventFun.reLayout);
            //$.removeEvent(window, "resize", _this.DOM_eventFun.reLayout);
            stime && window.clearInterval(stime);
            delayTimer && window.clearTimeout(delayTimer);
            if (_this) {
                $.foreach(_this.objs, function(o) {
                    if (o.destroy) {
                        o.destroy();
                    }
                });
                _this = null;
            }
        };
        //-------------------------------------------
        var sudaFunc = function() {
	    if (delayTimer) {
                window.clearTimeout(delayTimer);
            }
            if (!window.SUDA || !window.SUDA.uaTrack) {
                num = num + 1;
                if (num > 30) return;
                delayTimer = window.setTimeout(function(){sudaFunc()},300);
            }
            else {
                window.SUDA.uaTrack && window.SUDA.uaTrack('tblog_newuser_tip_v4', arrValue[STATUS - 1]);
            }
        };
        //+++ 组件的初始化方法定义区 ++++++++++++++++++
        init = function() {


            argsCheck();
            willSendSuda = parseDOM();
            if (!willSendSuda)return;
            initPlugins();
            bindDOM();
            bindCustEvt();
            bindListener();
        };
        //-------------------------------------------
        //+++ 执行初始化 +++++++++++++++++
       $.Ready(function() {
            try {
                init();
                willSendSuda && sudaFunc();
            }
            catch(e) {

            }
        });

        //-------------------------------------------


        //+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
        that.destroy = destroy;
        that.show = _this.Utils.setPosition;

        //-------------------------------------------


        return that;
    };
});
