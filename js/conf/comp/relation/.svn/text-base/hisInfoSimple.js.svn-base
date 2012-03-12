/**
 * 微博单条页--相关微博用户
 * @id comp.relation.hisInfoSimple
 * @created 2011.05.06
 * @author 赵波 | zhaobo@staff.sina.com.cn
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 */
$Import('common.relation.followPrototype');
$Import('common.channel.relation');
$Import('common.dialog.setGroup');
$Import('common.skin.skinManager');
$Import('kit.extra.language');
$Import('ui.tipFollow');

STK.register("comp.relation.hisInfoSimple", function($){
    return function(node, opts){
        //---变量定义区---------------------------------
        var that = {};
        var fPrototype = $.common.relation.followPrototype;
        var delegatedEvent = $.core.evt.delegatedEvent(node);
        var fChannel = $.common.channel.relation;
	    var groupDialog = $.common.dialog.setGroup();
		var lang = $.kit.extra.language;
	    var followBtn, skinManager;
        //-------------------------------------------
        var bindDOMFuns = {
            'follow': function(spec){
	            followBtn = spec.el;
	            var conf = $.kit.extra.merge({
					'onSuccessCb': function(spec){
						groupDialog.show({
							'uid': spec.uid,
							'fnick': spec.fnick,
							'groupList': spec.group,
							'hasRemark': true
						});
					}
				}, spec.data || {});
                fPrototype.follow(conf);
            },
	        'setSkin' : function(){
		        skinManager = skinManager || $.common.skin.skinManager();
				skinManager.show();
				return false;
	        }
        };
        //---自定义事件绑定的回调函数定义区--------------------
        var bindCustEvtFuns = {};
        //----------------------------------------------
        
        //---广播事件绑定的回调函数定义区---------------------
        var bindListenerFuns = {
			'followListener': function(spec){
				//$.log(spec);
	            //followBtn.className = "W_addbtn_es";
				//followBtn.innerHTML = '<img class="addicon" alt="" src="'+$CONFIG['imgPath'] + '/style/images/common/transparent.gif'+'"/>'+lang('#L{已关注}');

				//var sd='<div class="W_addbtn_even" title="已关注"><img src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif" class="icon_add addbtn_d">已关注<span class="W_vline">|</span><a class="W_linkb" href="javascript:void(0);" action-type="unfollow"><em>取消</em></a></div>';
				//var dd = '<div title="互相关注" class="W_addbtn_even"><img class="icon_add addbtn_c" src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif">互相关注<span class="W_vline">|</span><a action-type="unfollow2" href="javascript:void(0);" class="W_linkb"><em>取消</em></a></div>';
				if(spec.group) return;
					groupDialog.show({
							'uid': spec.uid,
							'fnick': $CONFIG['onick'],
							//'groupList': spec.group,
							'hasRemark': true
						});
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
			var uid = $CONFIG['oid'];
			var nickName = $CONFIG['onick'];
			var tipFollow = $.ui.tipFollow($.sizzle('div.handle_btn',node)[0], uid, nickName);			
        };
        //-------------------------------------------
        
        //---DOM事件绑定方法定义区-------------------------
        /**
         * DOM事件绑定方法
         * @method bindDOM
         * @private
         */
        var bindDOM = function(){
            //delegatedEvent.add('follow', 'click', bindDOMFuns.follow);
            delegatedEvent.add('set_skin', 'click', bindDOMFuns.setSkin);
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
            delegatedEvent.remove('set_skin', 'click');
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
