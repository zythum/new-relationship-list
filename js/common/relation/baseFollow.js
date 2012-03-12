/**
 * 加关注按钮
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 *
 * @history
 * ZhouJiequn @2011.05.05	加关注上行参数fuid改名为uid
 */
$Import('common.channel.relation');
$Import('common.relation.followPrototype');
$Import('ui.tipConfirm');
$Import('kit.extra.language');
$Import('kit.extra.merge');
$Import('common.dialog.setGroup');
$Import('ui.confirm');

STK.register('common.relation.baseFollow', function($){
	var $CONFIG = window.$CONFIG || {};
	var transPIC = $CONFIG['imgPath'] + '/style/images/common/transparent.gif';
	return function(node){
		var that		= {},
			fChannel	= $.common.channel.relation,
			dEvent		= $.core.evt.delegatedEvent(node),
			fPrototype	= $.common.relation.followPrototype,
			merge		= $.kit.extra.merge,
			$L			= $.kit.extra.language,
			groupDialog = $.common.dialog.setGroup(),
			msg			= {
				'unFollowTips'	: $L('#L{确认取消关注吗？}'),
				'bothFollow'	: $L('#L{互相关注}'),
				'singleFollow'	: $L('#L{已关注}')
			},
			tipFollow	= $.ui.tipConfirm({info: msg['unFollowTips']}),
			template	= {
				'follow'	: 
					$L('<div class="W_addbtn_even">' +
						'<img src="' + transPIC + '" title="#L{加关注}"' +
							'class="icon_add {className}" alt=""/>{focDoc}<span class="W_vline">|</span>' +
						'<a class="W_linkb" action-type="{actionType}" action-data="uid={uid}&fnick={fnick}&f=1" href="javascript:void(0);"><em>#L{取消}</em></a>' +
					'</div>'),
				
				'unFollow'	:
					$L('<a action-type="follow" action-data="uid={uid}&fnick={fnick}&f=1" href="javascript:void(0);" class="W_btn_b">'+
						'<span>{followMe}<img class="icon_add addbtn_b" title="#L{加关注}" src="' + transPIC + '">#L{加关注}</span>'+
					'</a>'),
				
				'block'		:
					$L('<div class="W_addbtn_even">#L{已加入黑名单}'+
						'<span class="W_vline">|</span>'+
						'<a action-type="unBlock" action-data="uid={uid}&fnick={fnick}&f=1" href="javascript:void(0);" class="W_linkb"><em>#L{解除}</em></a>'+
					'</div>'),
					
				'loading'	: $L('<b class="loading"></b>#L{加关注}'),
				
				'followMe'	:
					$L('<img class="icon_add addbtn_g" title="#L{加关注}" src="' + transPIC + '">'+
						'<em class="vline"></em>')
			};
			
		/**
		 * 替换模版
		 * @param {String} templ
		 * @param {Object} valObj
		 */
		var replaceTemplate = function(templ, valObj){
			valObj = valObj || {};
			var t = templ;
			for (var i in valObj) {
				t = t.replace('{'+i+'}', valObj[i]);
			}
			return t;
		};
		
		/**
		 * 通过uid属性，找到对应加关注按钮
		 * @param {Object} uid
		 */
		var getBtnBox = function(uid){
			var currEl	= $.core.dom.sizzle('a[action-data*=uid='+uid+']', node)[0],
				btnBox;
			if(!currEl) { return; }
			do{
				var type = currEl.getAttribute('node-type');
				if(type === 'followBtnBox'){
					btnBox = currEl;
					break;
				}
				currEl = currEl.parentNode;
			} while(currEl && currEl.tagName.toLowerCase() !== 'body')
			return btnBox;
		};
		
		var changeTo = {
			'followed': function(spec){
				var el			= getBtnBox(spec.uid);
				if(!el){ return; }
				var clsName		= 'addbtn_d',
					focDoc		= msg['singleFollow'],
					actionType	= 'unFollow',
					relation	= spec.relation || {};
				if (relation.following && relation.follow_me) {//双向关注
					clsName		= 'addbtn_c';
					focDoc		= msg['bothFollow'];
					actionType	= 'unFollow';
				}
				var temp		= replaceTemplate(template['follow'], {
					'className'	: clsName,
					'focDoc'	: focDoc,
					'actionType': actionType,
					'uid'		: spec.uid,
					'fnick'		: spec.fnick
				});
				el.innerHTML = temp || '';
			},
			
			'unFollow': function(spec){
				var el		= getBtnBox(spec.uid);
				if(!el){ return; }
				var	relation= spec.relation || {};
					temp	= replaceTemplate(template['unFollow'], {
						'followMe'	: relation.follow_me ? template['followMe'] : '',
						'uid'		: spec.uid,
						'fnick'		: spec.fnick
					});
				el.innerHTML = temp;
			},
			
			'blocked': function(spec){
				var el		= getBtnBox(spec.uid);
				if(!el){ return; }
				var	temp	= replaceTemplate(template['block'], {
						'uid'		: spec.uid,
						'fnick'		: spec.fnick
					});
				el.innerHTML = temp;
			}
		};
		
		var bindListenerFuns = {
			'followListener'		: function(spec){
				changeTo.followed(spec);
			},
			
			'unFollowListener'	: function(spec){
				changeTo.unFollow(spec);
			},
			
			'blockListener'		: function(spec){
				changeTo.blocked(spec);
			},
			
			'unBlockListener'		: function(spec){
				changeTo.unFollow(spec);
			},
			
			'removeFansListener'	: function(spec){
				var relation	= spec.relation || {};
				if(relation.following){
					changeTo.followed(spec);
				} else {
					changeTo.unFollow(spec);
				}
			}
		};
		
		var bindDOMFuns	= {
			'follow': function(spec){
				var span = $.sizzle('span', spec.el)[0];
				span.innerHTML = template['loading'];
				var conf = $.module.getDiss($.kit.extra.merge({
					'onSuccessCb': function(spec){
						groupDialog.show({
							'uid': spec.uid,
							'fnick': spec.fnick,
							'groupList': spec.group,
							'hasRemark': true
						});
					}}, spec.data || {}), spec.el);
				fPrototype.follow(conf);
			},
			
			'unFollow': function(spec){
				var fnick = spec.data.fnick||$L('#L{该用户}');
				tipFollow.setInfo($L('#L{确定不再关注}')+ fnick + '?');
				tipFollow.setLayerXY(spec.el);
				tipFollow.aniShow();
				tipFollow.okCallback = function() {
					/**
					 * Diss
					 */
					fPrototype.unFollow($.module.getDiss(spec.data, spec.el));
				}
			},
			
			'unBlock': function(spec){
				$.ui.confirm($L('#L{确认将此用户从你的黑名单中解除吗？}'),{
					'OK'	: function(){
						fPrototype.unBlock(spec.data);
					}
				});
			}
		};
		
		var init = function(){
			bindListener();
			bindDom();
		};
		
		var bindListener = function(){
			fChannel.register('block', bindListenerFuns.blockListener);
			fChannel.register('follow', bindListenerFuns.followListener);
			fChannel.register('unBlock', bindListenerFuns.unBlockListener);
			fChannel.register('unFollow', bindListenerFuns.unFollowListener);
			fChannel.register('removeFans', bindListenerFuns.removeFansListener);
		};
		
		var bindDom = function(){
			dEvent.add('follow', 'click', bindDOMFuns.follow);
			dEvent.add('unBlock', 'click', bindDOMFuns.unBlock);
			dEvent.add('unFollow', 'click', bindDOMFuns.unFollow);
		};
		
		var argsCheck	= function(node){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.common.relation.baseFollow]:node is not a Node!";
			}
		};
		
		var destroy = function(){
			dEvent.destroy();
			groupDialog.destroy();
			fChannel.remove('block', bindListenerFuns.blockListener);
			fChannel.remove('follow', bindListenerFuns.followListener);
			fChannel.remove('unBlock', bindListenerFuns.unBlockListener);
			fChannel.remove('unFollow', bindListenerFuns.unFollowListener);
			fChannel.remove('removeFans', bindListenerFuns.removeFansListener);
			bindListenerFuns = null;
		};
		
		init();
		that.destroy = destroy;
		return that;
	}
});