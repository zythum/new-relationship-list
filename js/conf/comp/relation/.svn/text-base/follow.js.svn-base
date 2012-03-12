/**
 * 关注页主逻辑
 * ChengJian | chengjian2@staff.sina.com.cn
 */
$Import('ui.confirm');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.trans.group');
$Import('common.group.groupListPanel');
$Import('common.relation.userList');
$Import('common.relation.userSearch');
$Import('common.dialog.addGroup');
$Import('common.dialog.relationGroupAdd');
$Import('common.relation.friendSelector');
STK.register('comp.relation.follow', function($){
	var url = '/' + $CONFIG['uid'] + '/follow?gid=';
	return function(node){
		var that	= {},nodes,userSearch,friendSelector,setGroupTrans,userList;
		var dEvent = $.core.evt.delegatedEvent(node);
		var $L = $.kit.extra.language;
		var liTemp = $.core.util.easyTemplate(
			'<#et listItem gList>'+
				'<#list gList as item>'+
					'<li class="notetxt">'+
						'<a href="'+url+'${item.gid}">${item.gname}</a>'+
					'</li>'+
				'</#list>'+
			'</#et>');
			
		var createList = function(list){
			return liTemp(list).toString();
		};
		
		var moreGroup = {
			'hideTimer': '',
			'show': function(){
				moreGroup.stopHide();
				if(!$.trim(nodes['mGroupInner'].innerHTML || '')){ return; }
				nodes['mGroupOuter'].style.display = '';
			},
			'hide': function(){
				moreGroup.hideTimer = setTimeout(function(){
					nodes['mGroupOuter'].style.display = 'none';
				}, 100);
			},
			'stopHide': function(){
				moreGroup.hideTimer && clearTimeout(moreGroup.hideTimer);
			},
			'setPos': function(pos){
				nodes['mGroupOuter'].style.left = pos.l + 'px';
				nodes['mGroupOuter'].style.top = pos.t + 'px';
			},
			'setCon': function(html){
				nodes['mGroupInner'].innerHTML = html;
			}
		};
		
		var delegatedEvent = {
			addContact:function(){
				var uids = friendSelector.getUids();
				if(uids){
					setGroupTrans.request({'touids':uids,'gid':$CONFIG['cgid'] || ''});
				}
			},
			addGroup:function(){
				$.common.dialog.addGroup().show({
					OK: function(data){
						window.location.href = "/" + $CONFIG['uid'] + "/follow?gid=" + data.gid;
					},
					publish: true
				});
			},
			modifyGroup:function(opts){
				var el = opts.el;				
				var group = {
					gid: el.getAttribute("gid"),
					gname: el.getAttribute("gname"),
					owner_id: $CONFIG['oid']
				};
				if(!group.gid){return;}
				$.common.trans.group.request('info', {
					'onSuccess': function(rs, parm){
						rs.data.OK = function(){
							window.location.reload();
						};
						rs.data.publish = true;
						$.common.dialog.addGroup().show(rs.data);
					},
					'onError': function(rs, parm){
						$.ui.alert(rs.msg)
					}
				},group);
				
//				setTimeout(function(){
//					var input = dialog.pmt.getDom('input');
//					input.select && input.select();
//				},0);
				
			},
			delGroup:function(opts){
				var el = opts.el;				
				var group = {
					gid: el.getAttribute("gid"),
					gname: el.getAttribute("gname")
				};
				if(!group.gid){return;}
				$.ui.confirm( $L('#L{确定要删除" #{groupName\\} "分组吗？}<br/>#L{此分组下的人不会被取消关注。}',{groupName:group.gname}),{
					'OK': function(){
						delGroupTrans.request({gid:group.gid});
					}
				});
			},
			showMoreGroup: function(spec){
				var pos = $.position(spec.el);
				moreGroup.setPos({
					'l': pos.l,
					't': pos.t + spec.el.offsetHeight
				});
				moreGroup.show();
			},
			hideMoreGroup: function(spec){
				moreGroup.hide();
			}
		};
		
		var ioFuns = {
			'errorCd': function(spec, parm){
				$.ui.alert(spec && spec.msg || $L('#L{保存失败！}'));
			},
			'setGroupSuccess': function(spec, parm){
				window.location.reload();
			},
			'delGroupSuccess': function(spec, parm){
				window.location.href = "/" + $CONFIG['uid'] + "/follow";
			}
		};
		
		var bindTrans = function() {
			setGroupTrans = $.common.trans.group.getTrans('batchSet', {
				'onSuccess': ioFuns['setGroupSuccess'],
				'onError': ioFuns['errorCd'],
				'onFail' : ioFuns['errorCd']
			});
			delGroupTrans = $.common.trans.group.getTrans('del', {
				'onSuccess': ioFuns['delGroupSuccess'],
				'onError': ioFuns['errorCd'],
				'onFail' : ioFuns['errorCd']
			});
		};
		
		var bindDOM = function() {
			$.addEvent(nodes['mGroupOuter'], 'mouseout', moreGroup.hide);
			$.addEvent(nodes['mGroupOuter'], 'mouseover', moreGroup.show);
			dEvent.add('addContact' , 'click' , delegatedEvent['addContact']);
			dEvent.add('addGroup' , 'click' , delegatedEvent['addGroup']);
			dEvent.add('modifyGroup' , 'click' , delegatedEvent['modifyGroup']);
			dEvent.add('delGroup' , 'click' , delegatedEvent['delGroup']);
			dEvent.add('moreGroup' , 'mouseover' , delegatedEvent['showMoreGroup']);
			dEvent.add('moreGroup' , 'mouseout' , delegatedEvent['hideMoreGroup']);
		};
		
		var initPlugins = function(){
			if (nodes['search']) {
				userSearch = $.common.relation.userSearch(nodes['search'], {
					type: 0,
					callback: function(key, node){
						if (typeof key !== 'string') {
							key = key.screen_name;
						}
						key = encodeURIComponent(key || "");
						if (node) {
							window.location.href = node.href + '?search=' + key;
						}
						else {
							window.location.href = "/" + $CONFIG['uid'] + "/follow?search=" + key;
						}
						
					}
				});
			}
			if (nodes['friendSelect']) {
				friendSelector = $.common.relation.friendSelector(nodes['friendSelect']);
			}
			if(nodes['userListBox']){
				userList = $.common.relation.userList(nodes);
				$.custEvent.add(userList, "empty", function() {
					window.location.reload();
				});	
			}
			
			if(location.hash.indexOf('edit') !== -1){
				var modifyBtn = $.sizzle('a[action-type="modifyGroup"]')[0];
				if(modifyBtn){
					delegatedEvent['modifyGroup']({
						el: modifyBtn
					});
					location.hash = '';
				}
				
			}
		};
		
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindTrans();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.relation.follow]:node is not a Node!";
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		
		var destroy = function(){
			dEvent.destroy();
			friendSelector && friendSelector.destroy();
			userList && userList.destroy();
			userSearch && userSearch.destroy();
			nodes = null;
		};
		
		init();
		
		that.destroy = destroy;
		
		return that;

	};
});