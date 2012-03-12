/**
 * 微博单条页--相关微博用户
 * @id comp.relation.relatedPersonsNav
 * @created 2011.04.22
 * @author yadong | yadong2@staff.sina.com.cn
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 */
$Import('common.relation.followPrototype');
$Import('common.channel.relation');
$Import('kit.extra.language');
STK.register("comp.relation.relatedPersonsNav", function($){
    return function(node, opts){
        //---变量定义区---------------------------------
        var that = {};
        var fPrototype = $.common.relation.followPrototype;
        var delegatedEvent = $.core.evt.delegatedEvent(node);
        var fChannel = $.common.channel.relation;
		var lang = $.kit.extra.language;
	    var followBtn;
        //-------------------------------------------
        var bindDOMFuns = {
            'follow': function(spec){
	            followBtn = spec.el;
                fPrototype.follow(spec.data);
            }
        };
        //---自定义事件绑定的回调函数定义区--------------------
        var bindCustEvtFuns = {};
        //----------------------------------------------
        
        //---广播事件绑定的回调函数定义区---------------------
        var bindListenerFuns = {
            'followListener': function(spec){
//                spec.el.innerHTML = lang('#L{已关注}');
	            followBtn.innerHTML = lang('#L{已关注}');
            }
        };
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
            delegatedEvent.add('followBtn', 'click', bindDOMFuns.follow);
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
            fChannel.register('follow', bindListenerFuns.followListener);
        };
        //-------------------------------------------
        
        //---组件公开方法的定义区---------------------------
        /**
         * 组件销毁方法
         * @method destroy
         */
        var destroy = function(){
            delegatedEvent.remove('follow', 'click');
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
