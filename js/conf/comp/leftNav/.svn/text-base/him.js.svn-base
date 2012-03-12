/**
 * leftNavHim 他的微博页左侧导航
 * 
 * @id STK.comp.leftNav.him
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */

$Import('kit.extra.language');
$Import('common.channel.relation');
$Import('common.trans.relation');
$Import('common.content.block');
$Import('kit.extra.merge');
$Import('ui.confirm');
$Import('ui.alert');
STK.register("comp.leftNav.him", function($) {
	
	//---常量定义区---------------------------------- 
	var $L = $.kit.extra.language;
	var $T = $.templet;
	var followChannel = $.common.channel.relation;
	
	var nickName = $CONFIG['onick'];
	var uid = $CONFIG['oid'];
	
	var relation = 'single';
	var dEvt, nodes = {};
	
	var ADD_TO_BLOCK_TIPS = $L('#L{你和他将自动解除关注关系，并且他不能再关注你<br/>他不能再给你发评论、私信、@通知}');
	var ADD_TO_BLOCK_TF = $L('#L{确认将}') + '#{nickName}' + $L('#L{加入到我的黑名单中么？}');
	//-------------------------------------------

	var doPost = function(type, spec) {
		spec = $.kit.extra.merge({
			'onSuccess':function(ret) {
				followChannel.fire(type, {
					'uid':uid,
					'relation':ret.data.relation
				});
			},
			'onError':function(ret) {
				$.ui.alert(ret.msg);
			}
		}, spec);

		var trans = $.common.trans.relation.getTrans(type, spec);
		trans.request({'uid':spec.uid, 'f':1});
		
	};
	
	return function(node, opts) {		
		var that = {};
		//---变量定义区----------------------------------

		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			addToBlock : function(){
				//加入黑名单
				$.common.content.block();
				/*$.ui.confirm( $T( ADD_TO_BLOCK_TF, {nickName:nickName} ), {
					
					'textSmall' : ADD_TO_BLOCK_TIPS,
					'icon'  : 'error',
					'OK'    : function() {
						//发请求
						doPost('block', {
							'uid': $CONFIG['oid'],
							'onSuccess' : function(ret) {
								//成功后触发
								followChannel.fire('block', {
									'uid': $CONFIG['oid'],
									'relation': ret.data.relation
								});
							}
						});
					}
				});*/
			},
			cleanCurrent : function(){
				if(nodes.items.length > 0){
					for(var index in nodes.items){
						$.removeClassName( nodes.items[index].parentNode, "current" );
					}
				}
			},
			setCurrent : function(target){
				bindDOMFuns.cleanCurrent();
				$.addClassName( target.el.parentNode, "current" );
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			
		};
		//----------------------------------------------
		
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
		var argsCheck = function() {};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			nodes.items = $.sizzle('a[action-type=leftNavItem]');
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add("block", "click", bindDOMFuns.addToBlock);
			dEvt.add("leftNavItem", "click", bindDOMFuns.setCurrent);
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
		 */
		var destroy = function() {
			
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		node && init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		//-------------------------------------------
		
		return that;
	};
});