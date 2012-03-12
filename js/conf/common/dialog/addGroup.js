/**
 * 添加分组
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.dialog');
$Import('ui.alert');
$Import('ui.confirm');
$Import('ui.litePrompt');
$Import('common.dialog.publish');
$Import('common.group.addGroupPanel');
$Import('kit.dom.parseDOM');
$Import('common.trans.group');
$Import('common.trans.relation');
$Import('kit.extra.language');
$Import('common.dialog.relationGroupAdd');
STK.register("common.dialog.addGroup", function($){
	var pubG = window.$CONFIG['is_internal_user_publicgroup'];
	return pubG ? function(spec){
		var $L = $.kit.extra.language;
		var template = '<div node-type="outer" class="layer_setup_followlists edit_list">' +
		'<div node-type="btnBox" class="btn">' +
		'<a node-type="submit" href="javascript:;" class="W_btn_b"><span>#L{保存}</span></a>' +
		'<a node-type="cancel" href="javascript:;" class="W_btn_a"><span>#L{取消}</span></a>' +
		'</div>' +
		'</div>';
		
		var that = {}, dialog = $.ui.dialog({
			'isHold': true
		}), build = $.core.dom.builder($L(template)), nodes = $.kit.dom.parseDOM(build.list), ajax, gid, successCb, publish, panel = $.common.group.addGroupPanel();
		$.core.dom.insertElement(nodes['outer'], panel.getOuter(), 'afterbegin');
		dialog.appendChild(nodes['outer']);
		
		var ioFunc = {
			'onSuccess': function(rs, parm){
				hide();
				var tips = $.ui.litePrompt($L('#L{设置成功}'), {
					'type': 'succM',
					'timeout': 1000
				});
				var callback = function(){
					var publishDialog = $.common.dialog.publish();
					var publishDialogShow = function(){
						var names = [];
						if (parm.users && $.isArray(parm.users)) {
							names = parm.users.slice(0, 2);
							for (var i = names.length; i--;) {
								names[i] = names[i].screen_name;
							}
						}
						else {
							parm.users = [];
						}
						var info = names.length ? '#L{包括@#{member\\} 等#{num\\}个成员，}' : '';
						publishDialog.show({
							'title': $L('#L{把#{nickName\\}推荐给朋友}', {
								'nickName': parm.name
							}),
							'content': $L(('#L{我@#{nickName\\} 创建了“#{newGroupName\\}”分组，}' + info + '#L{欢迎关注或推荐！}' + "http://" + location.hostname + "/" + $CONFIG['oid'] + "/publicgroupsimple?gid=" + parm.gid), {
								'nickName': $CONFIG['nick'],
								'newGroupName': parm.name,
								'member': names.join(' ,@'),
								'num': parm.users.length
							})
						
						});
					}
					setTimeout(publishDialogShow, 1000);
					$.custEvent.add(publishDialog, 'hide', function(){
						typeof successCb === 'function' && successCb($.core.json.merge(parm, rs.data));
					});
				}
				if (!parm.gid) {
					var list = rs.data
					for (var i in list) {
						if (list[i]["belong"] === 1) {
							parm.gid = list[i].gid;
							break;
						}
					}
				}
				if (publish && parm.mode !== "private") {
					$.common.trans.relation.request('groupUserList', {
						'onSuccess': function(rs){
							parm.users = rs.data;
							callback();
						},
						'onError': callback
					}, {
						'gid': parm.gid,
						'owner_id': $CONFIG['uid'],
						'type': 1
					});
				}
				else {
					typeof successCb === 'function' && successCb($.core.json.merge(parm, rs.data));
				}
			},
			'onError': function(rs, parm){
				if (rs && rs.code === "100060") {
					rs.msg &&
					$.ui.confirm(rs.msg, {
						icon: 'warn',
						OKText: $L("#L{立刻绑定}"),
						OK: function(){
							window.location.href = "http://account.weibo.com/settings/mobile";
							return $.preventDefault();
						}
					});
				}
				else {
					rs.msg && $.ui.alert(rs.msg);
				}
			}
		};
		
		var bindDOMFunc = {
			'submit': function(e){
				var rs = panel.getData();
				if (!rs) {
					return;
				}
				if (gid) {
					rs.gid = gid;
				}
				ajax.request(rs);
			},
			'cancel': function(e){
				hide();
			}
		};
		
		$.addEvent(nodes['submit'], 'click', bindDOMFunc['submit']);
		$.addEvent(nodes['cancel'], 'click', bindDOMFunc['cancel']);
		
		var show = function(data){
			data = data || {};
			gid = data.gid;
			successCb = data.OK;
			publish = data.publish;
			if (gid) {
				dialog.setTitle($L('#L{编辑分组信息}'));
				ajax = $.common.trans.group.getTrans('modify', {
					'onSuccess': ioFunc['onSuccess'],
					'onError': ioFunc['onError'],
					'onFail': ioFunc['onError']
				});
			}
			else {
				dialog.setTitle($L('#L{创建分组}'));
				ajax = $.common.trans.group.getTrans('add', {
					'onSuccess': ioFunc['onSuccess'],
					'onError': ioFunc['onError'],
					'onFail': ioFunc['onError']
				});
			}
			dialog.show().setMiddle();
			panel.setData(data);
		};
		var hide = function(){
			dialog.hide();
		};
		
		var destroy = function(){
			$.removeEvent(nodes['submit'], 'click', bindDOMFunc['submit']);
			$.removeEvent(nodes['cancel'], 'click', bindDOMFunc['cancel']);
			panel.destroy();
		};
		
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;
		return that;
		
	} : function(spec){
		var that = {}, gDialog;
		
		var show = function(data){
			gDialog = $.common.dialog.relationGroupAdd(data.OK, {
				'gid': data.gid,
				'gname': data.name
			});
		};
		
		var hide = function(){
			gDialog.hide();
		};
		
		var destroy = function(){
			
		};
		
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;
		return that;
	};
});
