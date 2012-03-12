/**
 * 用户列表
 */
$Import('ui.alert');
$Import('ui.confirm');
$Import('ui.tipConfirm');
$Import('module.getDiss');
$Import('common.trans.group');
$Import('kit.extra.language');
$Import('common.dialog.sendMessage');
$Import('common.dialog.addGroup');
$Import('common.dialog.groupPersonnel');
STK.register('common.relation.groupList', function($){
	var MAX_LENGTH = 13;
	return function(node){
		var that	= {},
			dEvent	= $.delegatedEvent(node),
			$L		= $.kit.extra.language,
			tipConfirm = $.ui.tipConfirm();
		var	groupDialog = $.common.dialog.addGroup();
		var groupPersonnel = $.common.dialog.groupPersonnel();
		var getBothImg = (function(){
			var imgEl = $.C('img');
			imgEl.src = $CONFIG['imgPath']+'style/images/common/transparent.gif';
			imgEl.title = $L('#L{已关注}');
			imgEl.className = 'icon_connect';
			return function(){
				return imgEl.cloneNode(true);
			};
		})();
		var getAddImg = '<a class="W_addbtn" href="#" item-func="follow"><img class="addicon" alt="" src="'+$CONFIG['imgPath']+'style/images/common/transparent.gif'+'">'+$L('#L{关注分组}')+'</a>';
		var getAddedImg = '<a class="W_addbtn_es" href=""><img class="addicon" alt="" src="'+$CONFIG['imgPath']+'style/images/common/transparent.gif">'+$L('#L{已关注}')+'</a>'
		var itemFuncs = {			
			'follow': function(spec, target){
				$.common.trans.group.request('followgroup', {
					'onSuccess': function(rs, parm){
						groupPersonnel.show(spec.data);
					},
					'onError': function(rs, parm){
						if(rs && rs.code === "100060"){
		                    rs.msg &&
		                    $.ui.confirm(rs.msg, {
								icon:'warn',
		                        OKText: $L("#L{立刻绑定}"),
		                        OK: function(){
		                        	window.location.href = "http://account.weibo.com/settings/mobile";
									return $.preventDefault();
		                        }
		                    });
						}else{
							rs && rs.msg && $.ui.alert(rs.msg);
						}
					}
				},spec.data);
			},
			'edit': function(spec, target){
				var data	= spec.data || {};
				$.common.trans.group.request('info', {
					'onSuccess': function(rs, parm){
						rs.data.publish = true;
						groupDialog.show(rs.data);
					},
					'onError': function(rs, parm){
						$.ui.alert(rs.msg)
					}
				},data);
			},
			'remove': function(spec, target){
				var data	= spec.data || {},
					gname	= data.gname || $L('#L{该分组}');
				tipConfirm.setInfo($L('#L{确定删除}')+ gname + '?');
				tipConfirm.setLayerXY(target);
				tipConfirm.aniShow();
				tipConfirm.okCallback = function() {
					$.common.trans.group.request('del', {
						'onSuccess': function(rs, parm){
							spec.el.parentNode.removeChild(spec.el);
						},
						'onError': function(rs, parm){
							$.ui.alert(rs.msg)
						}
					}, data);
				};
			},
			
			'quit': function(spec, target){
				var data	= spec.data || {},
					gname	= $L('#L{该分组}');//data.gname || 
				tipConfirm.setInfo($L('#L{确定退出#{gname\\}？退出后将不再关注你。}',{gname:gname}));
				tipConfirm.setLayerXY(target);
				tipConfirm.aniShow();
				tipConfirm.okCallback = function() {
					$.common.trans.relation.request('removeFans', {
						'onSuccess': function(rs, parm){
							var addBtn = $.sizzle('a[item-func="follow"]',spec.el)[0];
							if(addBtn){
								addBtn.panentNode.innerHTML = getAddImg;
							}
						},
						'onError': function(rs, parm){
							$.ui.alert(rs.msg)
						}
					}, $.module.getDiss({uid:$CONFIG['oid'],oid:$CONFIG['uid']}, target));
				};
			}
		};
		var itemClick = function(spec){
			var el	= spec.el,
				evt = $.fixEvent(spec.evt),
				tgt	= evt.target;
			while(tgt && (tgt !== spec.el)){
				var att	= tgt.getAttribute('item-func'),
					fun	= itemFuncs[att];
				if (typeof fun === 'function') {
					var data = tgt.getAttribute('item-data');
					spec = $.core.json.merge(spec, $.queryToJson(data || ''));
					fun(spec, tgt);
				}
				tgt = tgt.parentNode;
			}
		};
		var bindTrans = function() {
			
		};
		var bindDOM = function(){
			dEvent.add('itemClick', 'click', itemClick);
		};
		
		var init = function(){
			bindTrans();
			bindDOM();
		};
		
		init();
		
		var destroy = function(){
			dEvent.destroy();
			itemFuncs = null;
			dEvent = null;
			node = null;
		};
		
		that.destroy = destroy;
		
		return that;
	};
});