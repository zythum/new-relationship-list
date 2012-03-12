/**
 * @id
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xionggq | guoqing5@staff.sina.com.cn
 * @create at 2011-12-05
 * @comment by lianyi@staff.sina.com.cn
 * 
 * 用于在首页右侧心情bubble模块显示我的心情和大家的心情
 * 我的心情使用的插件是common.mood.moodCalendar，显示的是日历形式
 * 大家的心情使用的插件是common.mood.moodPageSearch，显示的是列表的翻页
 */
$Import('common.mood.moodCalendar');
$Import('common.mood.moodPageSearch');
$Import('kit.extra.language');
$Import('ui.alert');
$Import('common.trans.mood');

STK.register('common.mood.moodFilter', function($) {
	//---常量定义区----------------------------------
    /**
     * 语言函数，用户繁体转换
     */
	var $L = $.kit.extra.language;
    //-------------------------------------------
    return function(node, opts) {
        /**
         * DEvent用于代理事件
         */
		var DEvent = null;
        /**
         * that是最终返回的对象
         */
		var that = {};
        //---变量定义区----------------------------------
        //----------------------------------------------
        var _this = {
            /**
             * DOM用于存放builder的nodes节点
             */
			DOM:{},//节点容器
            /**
             * objs用于存放已经写好的组件
             */
			objs:{},//组件容器
            /**
             * DOM_eventFun用于绑定的事件句柄
             */
			'DOM_eventFun' :{
				/**
				 * tab重置状态的时候移除掉current的样式
				 */
                'resetTab' : function() {
                    $.foreach(_this.DOM['moodTab'], function(item) {
                        $.removeClassName(item, "current");
                    });
                },
				/**
				 * 点击我的心情的时候进行的操作
				 */
                'myMoodFunc' : function(spec) {
                    _this.DOM_eventFun.resetTab();
                    $.addClassName(spec.el, "current");
                    _this.DOM["moodCalendar"][0].style.display = "";
                    _this.DOM["feedList"][0].style.display = "none";

                },
				/**
				 * 大家的心情点击具体页的时候的操作
				 */
                'getAllMoodByPage' :  function(num) {
                    var param = {};
                    param.page = num;
                    $.common.trans.mood.getTrans('myfilter', {
                        'onSuccess' : function(json) {
                            var html = json.data.html;
                            _this.DOM["feedList"][0].innerHTML = html;
                        },
                        'onError' : _this.DOM_eventFun.getAllModeError,
                        'onFail' : _this.DOM_eventFun.getAllModeError
                    }).request(param);
                },
				/**
				 * 查看大家的心情，第一次的时候通过加载common.mood.moodPageSearch来实例化分页组件
				 */
                'allMoodFunc' : function(spec) {
					_this.DOM_eventFun.resetTab();
                    $.addClassName(spec.el, "current");
                    _this.DOM["moodCalendar"][0].style.display = "none";
					_this.DOM["feedList"][0].style.display = "";
					if (!_this.objs.pageUtil) {
						_this.DOM["feedList"][0].style.height = "206px";
						var loadingHTML = $L('<div class="W_loading"><span>#L{正在加载，请稍候}...</span></div>');
						_this.DOM["feedList"][0].innerHTML = loadingHTML;
						_this.objs.pageUtil = $.common.mood.moodPageSearch({
							/**
							 * 告诉分页组件当前的调用者是"气泡"还是"弹层"，气泡需要管理body上的冒泡操作
							 */
							fromWhere : "bubble",
                            contentNode : _this.DOM['feedList'][0],
                            delegateNode: _this.DOM['feedList'][0],
                            trans : $.common.trans.mood,
                            transName : 'myfilter'
                        });
						$.custEvent.add(_this.objs.pageUtil, "setHeightFree", function() {
							_this.DOM["feedList"][0].style.height = "";							
						});
                    }
                }
            }
        };
        //---DOM事件绑定的回调函数定义区---------------------
        var bindDOMFuns = {
        };
        //-------------------------------------------

        //---自定义事件绑定的回调函数定义区--------------------
        var bindCustEvtFuns = {
        };
        //-------------------------------------------------

        //---广播事件绑定的回调函数定义区---------------------
        var bindListenerFuns = {
        };
        //-------------------------------------------
        //---组件的初始化方法定义区-------------------------
        /**
         * 初始化方法
         * @method init
         * @private
         */
        var init = function() {
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
        var argsCheck = function() {
            if (!node) {
                throw 'node 没有定义';
            }
        };
        //-------------------------------------------

        //---Dom的获取方法定义区---------------------------
        /**
         * Dom的获取方法
         * @method parseDOM
         * @private
         */
        var parseDOM = function() {
            _this.DOM = $.builder(node).list;
        };
        //-------------------------------------------

        //---模块的初始化方法定义区-------------------------
        /**
         * 模块的初始化方法
         * @method initPlugins
         * @private
         */
        var initPlugins = function() {
            /**
             * 代理了几个事件，有“我的心情”，“大家的心情”
             */
			DEvent = $.delegatedEvent(node);
            DEvent.add('allMood', 'click', _this.DOM_eventFun.allMoodFunc);
            DEvent.add('myMood', 'click', _this.DOM_eventFun.myMoodFunc);
            /**
             * 实例化日历插件
             */
			_this.objs.moodCalendar = $.common.mood.moodCalendar({
                nodeOuter: _this.DOM["moodCalendar"][0],
                custObj : opts.custObj
            });
           /* _this.objs.pageUtil = $.common.mood.moodPageSearch({
                contentNode : _this.DOM['feedList'][0],
                delegateNode: _this.DOM["inner"][0],
                trans : $.common.trans.mood,
                transName : 'myfilter'
            });*/
        };
        //-------------------------------------------

        //---DOM事件绑定方法定义区-------------------------
        /**
         * DOM事件绑定方法
         * @method bindDOM
         * @private
         */
        var bindDOM = function() {
        };
        //-------------------------------------------

        //---自定义事件绑定方法定义区------------------------
        /**
         * 自定义事件绑定方法
         * @method bindCustEvt
         * @private
         */
        var bindCustEvt = function() {
        };
        //-------------------------------------------

        //---广播事件绑定方法定义区------------------------
        var bindListener = function() {

        };
        //-------------------------------------------

        //---组件公开方法的定义区---------------------------
        /**
         * 组件销毁方法
         * @method destroy
         * 销毁日历控件，销毁分页控件
         */
        var destroy = function() {
            DEvent.destroy();
            _this.obj.moodCalendar && _this.obj.moodCalendar.destroy && _this.obj.moodCalendar.destroy();
            _this.obj.pageUtil && _this.obj.pageUtil.destroy && _this.obj.pageUtil.destroy();
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
