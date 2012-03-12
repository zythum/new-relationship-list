/**
 * 首页帮助页面的功能
 * @author guoqing5@staff.sina.com.cn
 */

STK.register('comp.content.help', function($) {

    //+++ 常量定义区 ++++++++++++++++++
    //-------------------------------------------

    return function(node) {
        var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {}, dEvt;
        var stab = null,scontent = null;

        //+++ 变量定义区 ++++++++++++++++++
//
        var _this = {
            DOM:{},//节点容器
            objs:{},//组件容器

            //属性方法区
            DOM_eventFun: {
                'msOver' : function(spec) {
                    var index = spec.data.index;
                    var dom = spec.el;
                    if (dom == stab) {
                        return;
                    }
                    stab && $.removeClassName(stab, "current");
                    stab = dom;
                    $.addClassName(stab, "current");
                    scontent && $.setStyle(scontent, "display", "none");
                    scontent = _this.DOM.conentList[index];
                    $.setStyle(scontent, "display", "");
            }
        }
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
        _this.DOM = $.builder(node).list;
        var cLength = _this.DOM.conentList ? _this.DOM.conentList.length : 0;
        var tLength = _this.DOM.tabList ? _this.DOM.tabList.length : 0;
        for (var i = 0; i < cLength; i++) {
            if ($.getStyle(_this.DOM.conentList[i], "display") != "none") {
                scontent = _this.DOM.conentList[i];
                break;
            }
        }
        for (var j = 0; j < tLength; j++) {
            if ($.hasClassName(_this.DOM.tabList[j], "current")) {
                stab = _this.DOM.tabList[j];
                break;
            }
        }
        dEvt = $.delegatedEvent(node);

    };
    //-------------------------------------------


    //+++ 模块的初始化方法定义区 ++++++++++++++++++
    initPlugins = function() {

    };
    //-------------------------------------------


    //+++ DOM事件绑定方法定义区 ++++++++++++++++++
    bindDOM = function() {
        dEvt.add("show", "mouseover", _this.DOM_eventFun.msOver);
        //dEvt.add("show", "mouseout", _this.DOM_eventFun.msOut);
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

        dEvt.remove("albumContent", "mouseover");
        //dEvt.remove("albumContent", "mouseout");

        if (_this) {
            $.foreach(_this.objs, function(o) {
                if (o.destroy) {
                    o.destroy();
                }
            });
            _this = null;
        }
        stab = null;
        scontent = null;
    };
    //-------------------------------------------

    //+++ 组件的初始化方法定义区 ++++++++++++++++++
    init = function() {
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
})
;
