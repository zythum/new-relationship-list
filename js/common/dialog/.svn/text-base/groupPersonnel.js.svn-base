/**
 * 添加分组
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.alert');
$Import('ui.dialog');
$Import('ui.litePrompt');
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('common.trans.relation');
$Import('common.relation.followPrototype');
$Import('common.dialog.setOrAddGroup');
STK.register("common.dialog.groupPersonnel", function($){
	var imgSrc = $CONFIG['imgPath']+'style/images/common/transparent.gif';
	var showAllUrl = '/#{oid}/publicgroupsimple?gid=#{gid}&mem=1';
	var $L = $.kit.extra.language;
	var template = 
		'<div node-type="panel" class="layer_multiple_follow">'+
			'<div node-type="userListBox" class="lmf_menber_wrp">'+
			'</div>'+
			'<div class="btn_add_member clearfix">'+
				'<div class="right">'+
					'<a node-type="showAll" href="/">#L{查看全部}»</a>'+
				'</div>'+
				'<div class="left">'+
					'<input disabled type="checkbox" node-type="selectAll" action-type="selectAll" class="W_checkbox">'+
				'</div>'+
				'<div class="left"><a action-type="fSelected" node-type="fSelectedBtn" href="javascript:;" class="W_btn_b_disable"><span>#L{关注已选用户}</span></a></div>'+
			'</div>'+
			'<div style="display:none;" class="lmf_statusbar" node-type="statusBarBox">'+
 				'<div class="status_bar" style="overfolow:hidden;">'+
					'<div style="width:0px;" class="bar" node-type="statusBar"></div>'+
					'<div class="text">正在批量关注中......</div>'+
				'</div>'+
			'</div>'+
		'</div>';
	var defTemp = $L('<div class="W_loading"><span>#L{加载中，请稍候}...</span></div>');
	var errTemp = $L('<div class="lsfl_zero_tips"><span class="icon_warn"></span>#L{当前分组还未添加任何成员}</div>');
	
	var userListM = function(data){
		if(!(this instanceof userListM)){
			return new userListM(data);
		}
		this.data = data || {};
		this.length = 0;
	};
	
	userListM.prototype = {
		'add': function(d){
			var uid = d['uid'];
			if(this.data[uid]){ return this.data[uid]; }
			this.length += 1;
			this.data[uid] = {
				'data': d
			};
			return this.data[uid];
		},
		
		'remove': function(uid){
			var item = this.data[uid];
			if (!item) { return; }
			this.length -= 1;
			delete this.data[uid];
		},
		
		'removeAll': function(){
			for(var i in this.data){
				this.remove(i);
			}
		},
		
		'getData': function(){
			var gs = [], item;
			for(var i in this.data){
				gs.push(this.data[i]);
			}
			return gs;
		}
	};
	
	return function(){
		var that	= {},
			dialog	= $.ui.dialog({'isHold': true}),
			build	= $.core.dom.builder($L(template)),
			nodes	= $.kit.dom.parseDOM(build.list),
			dEvent	= $.delegatedEvent(nodes['panel']),
			follow	= $.common.relation.followPrototype,
			gid, gname, uM, setOrAddGroup, nxtTimer;
		dialog.setTitle($L('#L{分组成员}'));
		dialog.appendChild(nodes['panel']);
		
		var removeAllHandle = function(){
			statusBar.hide();
			uM.removeAll();
		};
		
		$.custEvent.add(dialog, 'hide', removeAllHandle);
		
		var setFAllChk = function(){
			var chkL = $.sizzle('.lsfl_menber_list li.current', nodes['userListBox']).length,
				liL = $.sizzle('.lsfl_menber_list li[class!=added]', nodes['userListBox']).length,
				checked = liL && chkL && liL === chkL;
			nodes['selectAll'].checked = checked;
			nodes['selectAll'].disabled = liL ? false : true;
		};
		
		var setUserList = function(html){
			nodes['userListBox'].innerHTML = $.trim(html) || errTemp;
			setFAllChk();
			setFollwBtn();
		};
		
		var ioFuncs = {
			'getUserSuccess': function(rs, parm){
				stopLoading();
				var data = rs.data || {},
					html = data.html || '';
				setUserList(html);
			},
			
			'submitSuccess': function(rs, parm){
				var data = rs.data,
					type = data.belong ? 'old' : 'new';
				setOrAddGroup = setOrAddGroup || $.common.dialog.setOrAddGroup();
				setOrAddGroup.show(type, {
					'user': uM.getData(),
					'group':{
						'multi': true,
						'data': data.gids
					},
					'info':{
						'gid':gid,
						'owner_id': $CONFIG['oid']
					},
					'publish':true
				});
				hide();
			},
			
			'onError': function(rs, parm){
				rs && rs.msg && $.ui.alert(rs.msg);
			}
		};
		
		var getUser = $.common.trans.relation.getTrans('groupUserList', {
			'onSuccess': ioFuncs['getUserSuccess'],
			'onError': ioFuncs['onError'],
			'onFail': ioFuncs['onError']
		});
		
		var submit = $.common.trans.relation.getTrans('groupSubmit', {
			'onSuccess': ioFuncs['submitSuccess'],
			'onError': ioFuncs['onError'],
			'onFail': ioFuncs['onError']
		});
		
		var statusBar = {
			'ani': $.core.ani.tween(nodes['statusBar'], {
				'end': function(){
					$.setStyle(nodes['statusBar'], 'width', '400px');
				},
				'duration': 300,
				'animationType': 'linear'
			}),
			
			'show': function(){
				nodes['statusBarBox'].style.display = '';
				this.ani.play({'width': 460},{
					'staticStyle' : 'overflow:hidden;'
				});
			},
			
			'hide': function(){
				this.ani.stop();
				nodes['statusBarBox'].style.display = 'none';
				$.setStyle(nodes['statusBar'], 'width', '0px');
			},
			
			'finish': function(){
				this.ani.stop();
				nodes['statusBar'].style.width = '100%';
			}
		};
		
		var loading = function(){
			nodes['userListBox'].innerHTML = defTemp;
		};
		
		var stopLoading = function(){
		};
		
		var showError = function(){
			nodes['userListBox'].innerHTML = errTemp;
		};
		
		var setFollwBtn = function(type){
			var currentEl = $.sizzle('li.current', nodes['userListBox']);
			nodes['fSelectedBtn'].className = currentEl.length ? 'W_btn_b' : 'W_btn_b_disable';
			nodes['fSelectedBtn'].disabled = currentEl.length ? false : true;
			nodes['fSelectedBtn'].innerHTML = $L(type === 'follow' ? '<span>#L{关注成功}</span>' : '<span>#L{关注已选用户}</span>');
		};
		
		var bindDOMFunc = {
			'selected': function(spec){
				var cls = $.trim(spec.el.className || '');
				if(cls === 'added'){ return; }
				spec.el.className = cls ? '' : 'current';
				setFAllChk();
				setFollwBtn();
			},
			
			'selectAll': function(spec){
				var items	= $.sizzle('li[action-type=selected]', nodes['userListBox']),
					checked	= spec.el.checked,
					cls	= checked ? 'current' : '',
					len = items.length, data;
				for (var i = 0; i < len; i++) {
					if (items[i].className !== 'added') {
						items[i].className = cls;
					}
				}
				setFollwBtn();
			},
			
			'fSelected': function(spec){
				if (spec.el.disabled) { return; }
				statusBar.show();
				var items	= $.sizzle('li[action-type=selected]', nodes['userListBox']),
					len		= items.length,
					sItems	= [],
					uids	= [], data;
				$.foreach(items, function(item, idx){
					if(item.className === 'current'){
						data = item.getAttribute('action-data');
						data = $.queryToJson(data) || {};
						data.desc = item.getAttribute('desc') || "";
						uids.push(data.uid);
						uM.add(data);
						sItems.push(item);
					}
				});
				follow.follow({
					'uid': uids.join(','),
					'onSuccessCb': function(){
						submit.request({
							'gname': gname
						});
						$.foreach(sItems, function(item, idx){
							item.className = 'added';
						});
						statusBar.finish();
						setFAllChk();
						setFollwBtn('follow');
					}
				});
			}
		};
		dEvent.add('selected', 'click', bindDOMFunc['selected']);
		dEvent.add('selectAll', 'click', bindDOMFunc['selectAll']);
		dEvent.add('fSelected', 'click', bindDOMFunc['fSelected']);
		
		var show = function(spec){
			loading();
			dialog.show().setMiddle();
			setFAllChk();
			setFollwBtn();
			spec = $.parseParam({
				'gid': '',
				'gname': '',
				'owner_id': $CONFIG['oid']
			}, spec || {});
			gid = spec.gid;
			gname = spec.gname;
			nodes['showAll'].href = $.core.util.templet(showAllUrl, {
				'oid': $CONFIG['oid'],
				'gid': gid
			});
			uM = userListM({}, nodes['gnameList']);
			getUser.request({'gid': gid, 'owner_id':spec.owner_id});
		};
		
		var hide = function(){
			dialog.hide();
		};
		
		var destroy = function(){
			$.custEvent.remove(dialog, 'hide', removeAllHandle);
			dEvent.destroy();
			dEvent = null;
			nodes = null;
		};
		
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;
		
		return that;
	};
});
