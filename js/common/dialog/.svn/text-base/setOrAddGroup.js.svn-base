/**
 * 添加分组
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.dialog');
$Import('ui.litePrompt');
$Import('kit.dom.parseDOM');
$Import('common.dialog.publish');
$Import('common.trans.group');
$Import('common.trans.relation');
$Import('kit.extra.language');
$Import('common.group.addGroupPanel');
$Import('common.group.groupListPanel');
STK.register("common.dialog.setOrAddGroup", function($){
	var template = 
		'<div node-type="outer" class="layer_setup_followlists follow_success">'+
			'<div class="tab tab_bottom W_texta">'+
				'<a node-type="newTabBtn" class="current W_texta" href="javascript:;">#L{创建新分组}</a>'+
				'<em class="W_vline">|</em>'+
				'<a node-type="oldTabBtn" href="javascript:;">#L{已有分组}</a>'+
			'</div>'+
			'<div node-type="newTabPanel">'+
				'<div node-type="newTabInner"></div>'+
				'<div class="lsfl_option_import" style="margin-left:55px;">'+
					'<label for="newTabPanleChecked">'+
						'<input node-type="isold_new" type="checkbox" value="1" class="W_checkbox" checked="checked" id="newTabPanleChecked">#L{同时导入原有分组说明}'+
					'</label>'+
				'</div>'+
			'</div>'+
			'<div node-type="oldTabPanel" style="display:none;">'+
				'<div node-type="oldTabInner"></div>'+
				'<div class="lsfl_option_import">'+
					'<label for="oldTabPanleChecked">'+
						'<input node-type="isold_old" type="checkbox" value="1" class="W_checkbox" checked="checked" id="oldTabPanleChecked">#L{同时导入原有分组说明}'+
					'</label>'+
				'</div>'+
			'</div>'+
			'<div class="btn">'+
				'<a node-type="submit" href="javascript:;" class="W_btn_b"><span>#L{保存}</span></a>'+
				'<a node-type="cancel" href="javascript:;" class="W_btn_a"><span>#L{取消}</span></a>'+
			'</div>'+
		'</div>';
	var $L = $.kit.extra.language;
	
	return function(data){
		var that	= {},
			dialog	= $.ui.dialog({'isHold': true}),
			build	= $.core.dom.builder($L(template)),
			nodes	= $.kit.dom.parseDOM(build.list),
			newTab, oldTab, curTab = {}, user, publish;
		dialog.setTitle($L('#L{关注成功}'));
		dialog.appendChild(nodes['outer']);
		
		var ioFunc = {
			'onSuccess': function(rs, parm){
				hide();
				var tips = $.ui.litePrompt($L('#L{设置成功}'), {
					'type':'succM',
					'timeout':1000
				});
				if (!parm.gid) {
					var list = rs.data
					for (var i in list) {
						if (list[i]["belong"] === 1) {
							parm.gid = list[i].gid;
							break;
						}
					}
				}
				var callback = function(){
                        var publishDialog = $.common.dialog.publish();
                        var publishDialogShow = function(){
							var names = [];
							if(parm.users && parm.users.slice){
								names = parm.users.slice(0,2);
								for(var i=names.length;i--;){
									names[i] = names[i].screen_name;
								}
							}else{
								parm.users = [];
							}
							var info =  names.length ?'#L{包括@#{member\\} 等#{num\\}个成员，}' : '';
                            publishDialog.show({
                                'title': $L('#L{把#{nickName\\}推荐给朋友}', {
                                    'nickName': parm.name
                                }),
                                'content': $L(('#L{我@#{nickName\\} 创建了“#{newGroupName\\}”分组，}'+ info +'#L{欢迎关注或推荐！}' + "http://" + location.hostname + "/" + $CONFIG['oid'] + "/publicgroupsimple?gid=" + parm.gid), {
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
				if (publish && curTab.key === 'new' && parm.mode !== "private") {
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
			},
			'onError': function(rs, parm){
				rs && rs.msg && $.ui.alert(rs.msg);
			}
		};
		
		var addGroup = $.common.trans.group.getTrans('add', {
			'onSuccess': ioFunc['onSuccess'],
			'onError': ioFunc['onError'],
			'onFail': ioFunc['onError']
		});
		
		var setGroup = $.common.trans.group.getTrans('update', {
			'onSuccess': ioFunc['onSuccess'],
			'onError': ioFunc['onError'],
			'onFail': ioFunc['onError']
		});
		
		var setTab = function(aTab){
			var isNew = aTab === 'new';
			nodes['newTabBtn'].className = isNew ? 'current W_texta' : '';
			nodes['oldTabBtn'].className = isNew ? '' : 'current W_texta';
			nodes['newTabPanel'].style.display = isNew ? '' : 'none';
			nodes['oldTabPanel'].style.display = isNew ? 'none' : '';
			curTab.key = aTab;
			curTab.tab = isNew ? newTab : oldTab;
		};
		
		var initPanel = function(type, data){
			user = data['user'];
			newTab = $.common.group.addGroupPanel({'mode':'public'});
			oldTab = $.common.group.groupListPanel(data['group']);
			nodes['newTabInner'].innerHTML = '';
			nodes['oldTabInner'].innerHTML = '';
			nodes['newTabInner'].appendChild(newTab.getOuter());
			nodes['oldTabInner'].appendChild(oldTab.getOuter());
			setTab(type);
			publish = data['publish'];
		};
		
		var parseData = function(type, aData){
			if(type === 'new'){
				aData['isold'] = nodes['isold_new'].checked ? 1 : 0;
				var arr = [];
				$.foreach(user, function(item, idx){
					arr.push(aData['isold'] ? {
						'uid': item['data'].uid,
						'desc': item['data'].desc
					} : item['data'].uid);
				});
				aData['user'] = $.jsonToStr(arr);
				return aData;
			} else {
				var rs = {
					'type': 'm',
					'isold': nodes['isold_old'].checked ? 1 : 0
				}, gArr = [], uArr = [];
				
				$.foreach(aData, function(item, idx){
					gArr.push(item.gid);
				});
				
				$.foreach(user, function(item, idx){
					uArr.push(rs['isold'] ? {
						'uid': item['data'].uid,
						'desc': item['data'].desc
					} : item['data'].uid);
				});
				rs['gid'] = $.jsonToStr(gArr);
				rs['user'] = $.jsonToStr(uArr);
				return rs;
			}
		};
		
		var bindDOMFunc = {
			'submit': function(spec){
				var data = curTab['tab'].getData();
				if(!data){ return; }
				var ajax = curTab['key'] === 'new' ? addGroup : setGroup;
				data = parseData(curTab['key'], data);
				ajax.request(data);
			},
			
			'cancel': function(spec){
				hide();
			},
			
			'newTab': function(spec){
				setTab('new');
			},
			
			'oldTab': function(spec){
				setTab('old');
			}
		};
		
		$.addEvent(nodes['submit'], 'click', bindDOMFunc['submit']);
		$.addEvent(nodes['cancel'], 'click', bindDOMFunc['cancel']);
		$.addEvent(nodes['newTabBtn'], 'click', bindDOMFunc['newTab']);
		$.addEvent(nodes['oldTabBtn'], 'click', bindDOMFunc['oldTab']);
		
		var show = function(type, data){
			initPanel(type, data);
			dialog.show().setMiddle();
            if (type == 'new') {
                $.common.trans.group.request('info', {
                    'onSuccess': function(rs, parm){
                        newTab.setData(rs.data);
                    },
                    'onError': function(rs, parm){
                    }
                }, data['info']);
                
            }
		};
		
		var hide = function(){
			dialog.hide();
			newTab.destroy && newTab.destroy();
			oldTab.destroy && oldTab.destroy();
		};
		
		that.show = show;
		that.hide = hide;
		
		return that;
	};
});
