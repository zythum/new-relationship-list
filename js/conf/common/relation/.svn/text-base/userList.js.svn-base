/**
 * 用户列表
 */
$Import('ui.alert');
$Import('ui.tipConfirm');
$Import('ui.litePrompt');
$Import('module.getDiss');
$Import('kit.extra.language');
$Import('common.dialog.setRemark');
$Import('common.trans.relation');
$Import('common.trans.group');
$Import('common.dialog.setGroup');
$Import('common.dialog.sendMessage');
$Import('common.relation.groupSelector');
$Import('common.relation.followPrototype');
STK.register('common.relation.userList', function($){
	var MAX_LENGTH = 13;
	return function(nodes){
		var that	= {},
			dEvent	= $.delegatedEvent(nodes['userListBox']),
			ioFollow= $.common.relation.followPrototype,
			gDialog	= $.common.dialog.setGroup(),
			$L		= $.kit.extra.language,
			ukey	= $.getUniqueKey(),
			gSelector = $.common.relation.groupSelector($CONFIG['group'] || []),
			followTips = $.ui.tipConfirm({'info': $L('#L{确认取消关注吗？}')}),
			defDesc = $L('#L{添加分组说明}'),
			wkDesc = $L('#L{例如：我校校花}'),
			removeFansTips = $.ui.tipConfirm({
				'template': 
					$L('<table border="0" cellpadding="0" cellspacing="0">' +
						'<tbody><tr><td>' +
						'<div class="content layer_mini_info">' +
						'<p class="clearfix" node-type="info"><span node-type="icon" class="icon_ask"></span></p>' +
						'<p class="noicon W_textb"><input type="checkbox" id="userList_'+ukey+'" class="ckbox"><label for="userList_'+ukey+'">#L{同时将此用户加入黑名单}</label></p>'+
						'<p class="btn"><a node-type="ok" class="W_btn_b" href="javascript:void(0)"><span>#L{确定}</span></a><a class="W_btn_a" node-type="cancel" href="javascript:void(0)"><span>#L{取消}</span></a></p>' +
						'</div>' +
						'</td></tr></tbody>' +
					'</table>')
			}),
			ellipsis = '<em class="CH">…</em><em class="W_moredown_txt"></em>',
			moredown = '<em class="W_moredown_txt"></em>',
			loading = 
				$L('<div class="W_bubtips clearfix">'+
					'<div class="W_bgcolor_arrow"><em class="W_arrline_mini">◆</em><span>◆</span></div>'+
					'<div node-type="dataContent" class="W_bgcolor W_linecolor"><div class="W_loading"><span>#L{正在加载，请稍候...}</span></div></div>'+
				'</div>'),
			liTemp = '<li><a title="{name}" href="{url}">{name}</a></li>';
			
		var imgSrc = $CONFIG['imgPath']+'style/images/common/transparent.gif';
		
		$.custEvent.define(that, 'empty');
		$.custEvent.define(that, 'removeOne');
		$.custEvent.define(that, 'doRemove'); //成功后
		var removeEL = function(el){
			$.removeNode(el);
			nodes['userListBox'].children.length || $.custEvent.fire(that, 'empty');
			$.custEvent.fire(that, 'doRemove');
		};
		
		var getRelDom = function(rs){
			var both = $.C('img');
			both.src = imgSrc;
			both.title = $L('#L{已相互关注}');
			both.className = 'icon_connect';
			
			var follow = $.C('a');
			follow.href = 'javascript:;';
			follow.className = 'W_addbtn_es';
			follow.innerHTML = $L('<img src="' + imgSrc + '" class="addicon">#L{已关注}');

			getRelDom = function(rs){
				var rel = rs.relation || {};
				var isBoth = rel.following && rel.follow_me,
					el	= isBoth ? both : follow;
				return el.cloneNode(true);
			};
			return getRelDom(rs);
		};
		
		var ioFuncs = {
			'onError': function(rs, parm){
				rs && rs.msg && $.ui.alert(re.msg);
			}
		};
		
		var encodeHTML = function(str){
			var tNode = document.createTextNode(str);
			var div = $.C('div');
			div.appendChild(tNode);
			var result = div.innerHTML;
			div = tNode = null;
			return result;
		};
		
		var replaceInput = function(tar, spec){
			var str = $.trim(tar.innerHTML),
				val = str === defDesc ? wkDesc : str,
				input = $.C('input');
			input.type = 'text';
			input.value = $.decodeHTML(val);
			$.addEvent(input, 'blur', spec['blur']);
			$.addEvent(input, 'keyup', spec['keyup']);
			$.replaceNode(input, tar);
			input.select();
		};
		
		var itemFuncs = {
			'setRemark': function(spec, target){
				var def = $L('#L{设置备注}');
				var remark = $.core.str.decodeHTML(target.innerHTML);
				(remark === def) && (remark = '');
				$.common.dialog.setRemark({
					'uid'		: spec.data.uid,
					'remark'	: remark,
					'callback'	: function (data){
						var str = $.trim(data||'') || def;
						target.innerHTML = encodeHTML(str);
					}
				});
			},

			'showGroup': function(spec, target){
				var pos = $.position(target),
					data = spec.data || {};
				gSelector.setTouid(data.uid);
				gSelector.setPosition({
					'l': pos.l + 1,
					't': pos.t + target.offsetHeight
				});
				gSelector.setSelector(data.gid && data.gid.split(','),data.desc && data.desc.split(','));
				gSelector.show({
					'target': target,
					'setGroupCb': function(rs, parm){
						if ($CONFIG['cgid'] !== 'friend' && $CONFIG['cgid'] !== 'allFollow') {
							if ((parm['action'] === 'delete' && parm['gid'] === $CONFIG['cgid']) ||
							(parm['action'] === 'add' && !$CONFIG['cgid'])) {
								removeEL(spec.el);
								gSelector.hide();
								return;
							}
						}
						var gItems = gSelector.getSelector(),
							gid = [],
							str = [];
						for (var i = 0, len = gItems.length; i < len; i++) {
							str.push(gItems[i].gname);
							gid.push(gItems[i].gid);
						}
						str = str.join(',') || $L('#L{未分组}');
						target.setAttribute('title', str);
						str = $.bLength(str) > MAX_LENGTH
							? $.leftB(str, MAX_LENGTH) + ellipsis
							: str + moredown;
						target.innerHTML = ['<span>', str, '</span>'].join('');
						target.setAttribute('item-data', 'gid=' + gid.join(','));
					},
					'addGroupCb': function(rs, parm){
						var str = liTemp
							.replace(/\{url\}/i, window.location.pathname+'?gid='+rs.gid)
							.replace(/\{name\}/ig, rs.gname);
						nodes['mGroupInner'].innerHTML += str;
					}
				});
			},
			
			'addFollow': function(spec, target){
				var conf = $.parseParam({
					'uid': '',
					'fnick': '',
					'f': 1,
					'onSuccessCb': function(rs){
						$.replaceNode(getRelDom(rs), target);
						gDialog.show({
							'uid': rs.uid,
							'fnick': rs.fnick,
							'groupList': rs.group,
							'hasRemark': true
						});
					}
				}, spec.data || {});
				ioFollow.follow($.module.getDiss(conf, target));
			},
			
			'unFollow': function(spec, target){
				var data	= spec.data || {},
					fnick	= data.fnick || $L('#L{该用户}');
				followTips.setInfo($L('#L{确定不再关注}')+ fnick + '?');
				followTips.setTipWH();
				followTips.setLayerXY(target);
				followTips.aniShow();
				followTips.okCallback = function() {
					var conf = $.parseParam({
						'uid': '',
						'fnick': '',
						'onSuccessCb': function(rs){
							removeEL(spec.el);
						}
					}, data);
					ioFollow.unFollow($.module.getDiss(conf, target));
				};
			},
			
			'removeFans': function(spec, target){
				var data	= spec.data || {},
					fnick	= data.fnick || $L('#L{该用户}'),
					checkbox = $.E('userList_' + ukey);
				checkbox.checked = false;
				removeFansTips.setInfo($L('#L{确认要移除}')+ fnick + '?');
				removeFansTips.setTipWH();
				removeFansTips.setLayerXY(target);
				removeFansTips.aniShow();
				removeFansTips.okCallback = function() {
					var conf = $.parseParam({
						'uid': '',
						'fnick': '',
						'isblock': checkbox.checked ? 1 : 0,
						'onSuccessCb': function(rs){
							removeEL(spec.el);
							nodes['userList'].children.length || window.location.reload();
						}
					}, data);
					ioFollow.removeFans($.module.getDiss(conf, target));
				};
			},
			
			'sendMsg': function(spec, target){
				var data = spec.data;
				var sendMsg = $.common.dialog.sendMessage({
					'uid' : data.uid,
					'userName' : data.fnick || ""
				});
				sendMsg.show();
			},
			
			'moreData': function(spec, target){
				var dBox	= $.sizzle('div.detail', spec.el)[0];
					isOpend	= dBox.style.display !== 'none';
				if (!isOpend && !$.trim(dBox.innerHTML)) {
					dBox.innerHTML = loading;
					var onError = function(rs, parm){
						rs && rs.msg && $.ui.alert(rs.msg);
					};
					$.common.trans.relation.request('moreData', {
						'onSuccess': function(rs, parm){
							dBox.innerHTML = rs.data && rs.data.html;
						},
						'onError': onError,
						'onFail': onError
					}, {
						'fuid': spec.data.uid
					});
				}
				target.className = isOpend ? 'W_moredown' : 'W_moreup';
				dBox.style.display = isOpend ? 'none' : '';
				if(window.SUDA){
					var value;
					if($CONFIG['pageid'] == 'myfollow'){
						value= isOpend ? "attention_fold" : "attention_unfold";
					}else if($CONFIG['pageid'] == 'myfans'){
						value= isOpend ? "fans_fold" : "fans_unfold";
					}
					if(value){
						window.SUDA.uaTrack("tblog_relationship_click",value);
					}
				}
			},
			
			'reportspam': function(spec, target){
//				var url = spec.url;
//				window.open(url, 'newwindow', 'height=700, width=550, toolbar =yes, menubar=no, scrollbars=no, resizable=yes, location=no, status=no');
			},
			
			'update_group_desc': function(spec, target){
				var gid = spec.data.gid,
					uid = spec.data.uid,
					oldVal = target.innerHTML;
				replaceInput(target, {
					'blur': function(e){
						e = $.fixEvent(e);
						var el = e.target,
							val = $.trim(el.value);
						if(val !== oldVal && val !== defDesc && val !== wkDesc){
							var error = function(rs, parm){
								target.innerHTML = oldVal;
								$.replaceNode(target, el);
								rs && rs.msg && $.ui.alert(rs.msg);
							};
							$.common.trans.group.request('editdesc', {
								'onSuccess': function(rs, parm){
									target.innerHTML = val ? encodeHTML(val) : defDesc;
									$.replaceNode(target, el);
								},
								'onError': error,
								'onFail': error
							}, {
								'gid': gid,
								'uid': uid,
								'desc': encodeURIComponent(val)
							});
							return;
						}
						target.innerHTML = oldVal;
						$.replaceNode(target, el);
					},
					'keyup': function(e){
						var el = $.fixEvent(e).target,
							val = $.trim(el.value);
						if($.bLength(val) > 16){
							el.value = $.leftB(val, 16);
						}
					}
				});
			},
			
			'removeQuietFollow':function(spec,target){
				var cbk=function(rs){
					if(rs.code=='100000'){
						removeEL(spec.el);
						nodes['userList'].children.length || window.location.reload();
					}
				}
				$.custEvent.fire(that, 'removeOne',{'spec':spec,'callbk':cbk});
			}
		};
		
		var followAll = function(spec){
			var items = $.sizzle('li[action-type="itmeClick"]', nodes['userList']),
				fuids = [];
			for(var i = items.length; i--;){
				var item = items[i],
					att = item.getAttribute('action-data') || '',
					rs = att.match(/uid=(\w*)/i),
					uid = RegExp.$1;
				isNaN(uid) || fuids.push(uid);
			}
			followTips.setInfo($L('#L{确认要关注他们吗？}'));
			followTips.setTipWH();
			followTips.setLayerXY(spec.el);
			followTips.aniShow();
			followTips.okCallback = function() {
				var conf = $.parseParam({
					'uid': fuids.join(','),
					'onSuccessCb': function(rs){
						var tips = $.ui.litePrompt($L('#L{已关注成功}'), {
							'type':'succM',
							'timeout':1000
						});
						window.location.reload();
					}
				});
				ioFollow.follow($.module.getDiss(conf, spec.el));
			};
		};
		
		var itmeClick = function(spec){
			var el	= spec.el,
				evt = $.fixEvent(spec.evt),
				tgt	= evt.target;
			while(tgt && tgt.nodeType === 1 && tgt !== spec.el){
				var att	= tgt.getAttribute('item-func'),
					fun	= itemFuncs[att];
				if (typeof fun === 'function') {
					var data = tgt.getAttribute('item-data');
					spec.data = $.core.json.merge(spec.data || {}, $.queryToJson(data || ''));
					fun(spec, tgt);
				}
				tgt = tgt.parentNode;
			}
		};

		var bindDOM = function(){
			dEvent.add('itmeClick', 'click', itmeClick);
			dEvent.add('followAll', 'click', followAll);
		};
		
		var init = function(){
			bindDOM();
		};
		
		init();
		
		var destroy = function(){
			dEvent.destroy();
			itemFuncs = null;
			dEvent = null;
			nodes = null;
		};
		
		that.destroy = destroy;
		
		return that;
	};
});