/**
 * 收藏最多的微博
 * @id pl.content.favoritesTopNav
 * @create 2011.04.18
 * @author yadong | yadong2@staff.sina.com.cn
 */
$Import('common.trans.favorite');
STK.register("comp.content.favoritesTopNav", function($){
    return function(node, opts){
        //--变量定义区---------------------------------
        var that = {};
        var favoriteTrans = $.common.trans.favorite;
        var delegatedEvent = $.core.evt.delegatedEvent(node);
        var bindDOMFuns = {
            "change": function(){
                favoriteTrans.getTrans("change", {
                    onComplete: function(ret, params){
                        node.innerHTML = ret.data.html;
                    },
                    onFail: function(){
                    },
                    onError: function(data){
                    }
                }).request();
            }
        };
        //-------------------------------------------
        
        //---自定义事件绑定的回调函数定义区--------------------
        var bindCustEvtFuns = {};
        //----------------------------------------------
        
        //---广播事件绑定的回调函数定义区---------------------
        var bindListenerFuns = {};
        //-------------------------------------------
        
        //---组件的初始化方法定义区-------------------------
        /**
         * 初始化方法
         * @method init
         * @private
         */
        var init = function(){
            argsCheck();
            parseDOM();
            initPlugins();
            bindDOM();
            bindCustEvt();
            bindListener();
        };
        //-------------------------------------------
        
        //---参数的验证方法定义区---------------------------
        /**
         * 参数的验证方法
         * @method init
         * @private
         */
        var argsCheck = function(){
        };
        //-------------------------------------------
        
        //---Dom的获取方法定义区---------------------------
        /**
         * Dom的获取方法
         * @method parseDOM
         * @private
         */
        var parseDOM = function(){
        };
        //-------------------------------------------
        
        //---模块的初始化方法定义区-------------------------
        /**
         * 模块的初始化方法
         * @method initPlugins
         * @private
         */
        var initPlugins = function(){
        };
        //-------------------------------------------
        
        //---DOM事件绑定方法定义区-------------------------
        /**
         * DOM事件绑定方法
         * @method bindDOM
         * @private
         */
        var bindDOM = function(){
            delegatedEvent.add('change', 'click', bindDOMFuns.change);
        };
        //-------------------------------------------
        
        //---自定义事件绑定方法定义区------------------------
        /**
         * 自定义事件绑定方法
         * @method bindCustEvt
         * @private
         */
        var bindCustEvt = function(){
        };
        //-------------------------------------------
        
        //---广播事件绑定方法定义区------------------------
        var bindListener = function(){
        };
        //-------------------------------------------
        
        //---组件公开方法的定义区---------------------------
        /**
         * 组件销毁方法
         * @method destroy
         */
        var destroy = function(){
            delegatedEvent.remove('change', 'click');
        };
        //-------------------------------------------
        
        //---执行初始化---------------------------------
        init();
        //-------------------------------------------
        
        //---组件公开属性或方法的赋值区----------------------
        that.destroy = destroy;
        //-------------------------------------------
        
        return that;
    };
});
