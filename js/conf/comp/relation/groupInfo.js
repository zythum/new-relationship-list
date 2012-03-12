/**
 * 公开分组
 * ChenJian | chenjian2@staff.sina.com.cn
 */
$Import('ui.alert');
$Import('ui.confirm');
$Import('ui.tipConfirm');
$Import('common.trans.group');
$Import('common.dialog.publish');
$Import('common.dialog.addGroup');
$Import('common.dialog.groupPersonnel');
$Import('kit.extra.language');
STK.register('comp.relation.groupInfo', function($){
	return function(node){
		var that	= {},
			nodes, groupDialog;
			dEvent	= $.delegatedEvent(node);
		var $L = $.kit.extra.language;
		var	followTips = $.ui.tipConfirm();
		var publish = $.common.dialog.publish();
		var groupPersonnel = $.common.dialog.groupPersonnel();
			groupDialog = $.common.dialog.addGroup();
		var delegatedEvent = {
			follow:function(spec){
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
			quit:function(spec){
				var data	= spec.data || {},
					gname	=  $L('#L{该分组}');//data.gname ||
				followTips.setInfo($L('#L{确定退出#{gname\\}？退出后将不再关注你。}',{gname:gname}));
				followTips.setLayerXY(spec.el);
				followTips.aniShow();
				followTips.okCallback = function() {
					$.common.trans.relation.request('removeFans', {
						'onSuccess': function(rs, parm){
//							var addBtn = $.sizzle('a[item-func="follow"]',spec.el)[0];
//							if(addBtn){
//								addBtn.panentNode.innerHTML = getAddImg;
//							}
						},
						'onError': function(rs, parm){
							$.ui.alert(rs.msg)
						}
					}, $.module.getDiss({uid:$CONFIG['oid'],oid:$CONFIG['uid']}, spec.el));
				};
			},
			modify: function(spec){
				var data = spec.data || {};
				data['owner_id'] = $CONFIG['uid'];
				$.common.trans.group.request('info', {
					'onSuccess': function(rs, parm){
						rs.data.publish = true;
						rs.data.OK = function(){
							window.location.reload();
						};
						groupDialog.show(rs.data);
					},
					'onError': function(rs, parm){
						$.ui.alert(rs.msg);
					}
				}, data);
			},
			recommend:function(spec) {
				var data	= spec.data || {},
					gname	= $.encodeHTML(data.gname) || $L('#L{该分组}');
				publish.show({
					'title':$L('#L{把#{nickName\\}推荐给朋友}', {'nickName':gname}),
					'content' : $L(('#L{快来看看 @#{nickName\\} 的公开分组}' + ' ' + window.location.href), {'nickName':$CONFIG['onick']})

				});
				spec.evt && $.preventDefault(spec.evt);		
			}
		};
		
		var bindDOM = function() {
			dEvent.add('follow' , 'click' , delegatedEvent['follow']);
			dEvent.add('modify' , 'click' , delegatedEvent['modify']);
			dEvent.add('quit' , 'click' , delegatedEvent['quit']);
			dEvent.add('recommend' , 'click' , delegatedEvent['recommend']);
		};
		
		var initPlugins = function(){
		};
		
		var init = function(){
			argsCheck();
			parseDOM();
			bindDOM();
			initPlugins();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.relation.groupInfo]:node is not a Node!";
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		
		var destroy = function(){
			groupDialog && groupDialog.destroy();
			nodes = null;
		};
		
		init();
		
		that.destroy = destroy;
		
		return that;
		
	};
});
