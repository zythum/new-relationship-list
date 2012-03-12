/**
 * 用户列表
 */
$Import('ui.alert');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.trans.group');
STK.register('common.relation.groupSelector', function($){
	var DELAY = 16;
	var $L = $.kit.extra.language;
	var imgSrc = $CONFIG['imgPath']+'style/images/common/transparent.gif';
	var pubG = window.$CONFIG['is_internal_user_publicgroup'];
	return function(list){
		var template = 
			'<div node-type="outer" style="position:absolute;display:none;overflow-x:hidden;" class="layer_menu_list">'+
				'<ul node-type="inner"></ul>'+
				'<ul node-type="addBar">'+
					'<li class="line"></li>'+
					'<li class="opt"><a href="javascript:;" action-type="addGroup">'+
						'<img width="11" height="11" title="#L{创建分组}" class="iconadd" src="'+imgSrc+'">#L{创建分组}</a>'+
					'</li>'+
				'</ul>'+
				'<div node-type="quickForm" style="display:none;" class="quick_form">'+
					'<p class="row">'+
						'<input style="color:#939393;" node-type="groupName" defVal="#L{新分组}" value="#L{新分组}" type="text" class="W_input">'+
					'</p>'+
					'<div node-type="errMsg" style="display:none;" class="W_error"></div>'+
					'<p class="row btns">'+
						'<a action-type="submit" class="W_btn_a" href="javascript:;"><span>#L{保存}</span></a>'+
						'<a action-type="cancel" class="W_btn_a" href="javascript:;"><span>#L{取消}</span></a>'+
					'</p>'+
				'</div>'+
			'</div>';
			
		var liTemp = $.core.util.easyTemplate(
			'<#et listItem gList>'+
				'<#list gList as item>'+
					'<li class="notetxt">'+
						'<label action-type="setGroup" for="${gList.ukey}_${item.gid}">'+
							'<#if (item.belong==1)>'+
								'<input action-type="select" checked id="${gList.ukey}_${item.gid}" value="${item.gid}" type="checkbox" class="W_checkbox" name="gid">${item.gname}'+
							'<#else>'+
								'<input action-type="select" id="${gList.ukey}_${item.gid}" value="${item.gid}" type="checkbox" class="W_checkbox" name="gid">${item.gname}'+
							'</#if>'+
						'</label>'+
						'<i title="'+ $L('#L{为此分组成员添加说明}') +'" action-type="descIcon" class="icon_edit_s" <#if (item.belong==1)><#else>style="display:none;"</#if>></i>'+
						'<p class="edit_followlist" style="display:none;"><a action-type="descText" href="javascript:;"></a></p>'+
					'</li>'+
				'</#list>'+
			'</#et>');
		var that	= {},
			build	= $.core.dom.builder($L(template)),
			nodes	= $.kit.dom.parseDOM(build.list),
			dEvent	= $.core.evt.delegatedEvent(nodes['outer']),
			curList	= list,
			defVal	= nodes['groupName'].getAttribute('defVal'),
			ukey	= $.getUniqueKey(), touid, setGroupCb, addGroupCb;
		nodes['addBar'].style.display = curList.length < 20 ? '' : 'none';
		var inputTemp = '<p class="edit_followlist" style="display:none;"><input action-type="descInput" class="W_input" type="text"></p>';
		var checkedList = {};
		var getElement = function(el, type, tagName){
			if(!el) return;
	        if (tagName) {
	            tagName = tagName.toUpperCase();
	        }
	        var node = el[type];
	        while (node) {
	            if (node.nodeType == 1 && (tagName ? node.nodeName == tagName : true)) {
	                break;
	            }
	            node = node[type];
	        }
	        return node;
	    };
		var errTips = {
			'check': function(val){
				if(!val || val === defVal){
					return $L('#L{请输入分组名称}');
				} else {
					for (var i = curList.length; i--;) {
						if(curList[i].gname === val){
							return $L('#L{此分组名已存在}');
						}
					}
				}
				return false;
			},
			'show': function(msg){
				nodes['errMsg'].innerHTML = msg;
				nodes['errMsg'].style.display = '';
			},
			'hide': function(){
				nodes['errMsg'].innerHTML = '';
				nodes['errMsg'].style.display = 'none';
			}
		};
		
		var addGroupBox = {
			'show': function(){
				errTips.hide();
				nodes['groupName'].value = defVal;
				nodes['addBar'].style.display = 'none';
				nodes['quickForm'].style.display = '';
				nodes['groupName'].focus();
			},
			
			'hide': function(){
				setTimeout(function(){
					nodes['addBar'].style.display = curList.length < 20 ? '' : 'none';
					nodes['quickForm'].style.display = 'none';
				}, DELAY);
			}
		};
		
		var ioFuncs = {
			'addGroupSuccess': function(rs, parm){
				var data = rs.data;
				for(var i in data){
					if(data[i].belong === 1){
						that.add(data[i]);
						setGroupTrans.request({
							'gid': data[i].gid,
							'fuid': touid,
							'action': 'add'
						});
						typeof addGroupCb === 'function' && addGroupCb(data[i], parm);
						break;
					}
				}
				addGroupBox.hide();
			},
			
			'setGroupSuccess': function(rs, parm){
				for (var i = curList.length; i--;) {
					if(curList[i].gid === parm.gid){
						curList[i].belong = parm.action === 'add' ? '1' : '0';
						break;
					}
				}
				typeof setGroupCb === 'function' && setGroupCb(rs, parm);
			},
			
			'errorCd': function(rs, parm){
				rs && rs.msg && $.ui.alert(rs.msg);
			}
		};
		
		var setGroupTrans = $.common.trans.group.getTrans('groupupdate', {
			'onSuccess': ioFuncs['setGroupSuccess'],
			'onError': ioFuncs['errorCd'],
			'onFail' : ioFuncs['errorCd']
		});
		
		var addGroupTrans = $.common.trans.group.getTrans('add', {
			'onSuccess': ioFuncs['addGroupSuccess'],
			'onError': ioFuncs['errorCd'],
			'onFail' : ioFuncs['errorCd']
		});
		
		var createHtml = function(list){
			list.ukey = ukey;
//			for(var i =list.length;i--;){
//				list[i].gname = encodeHTML(list[i].gname);
//			}
			return liTemp(list).toString();
		};
		var createInput = function(group){
			if (!group.input) {
				$.insertHTML(group.icon, inputTemp, 'afterend');
				group.input = $.sizzle('input[action-type="descInput"]', group.icon.parentNode)[0];
			}
		};
		var checkGroup = function(el){
			var parentNode = getElement(el,'parentNode','li');
			if(!parentNode) return;
			var checkNode = $.sizzle('input[action-type="select"]',parentNode)[0];
			if(!checkedList[checkNode.id]){
				checkedList[checkNode.id] = {};
				var group = checkedList[checkNode.id];
				group.gid = checkNode.value;
				group.icon = $.sizzle('>i[action-type="descIcon"]',parentNode)[0];
				group.input = $.sizzle('input[action-type="descInput"]',parentNode)[0];
				group.text = $.sizzle('a[action-type="descText"]',parentNode)[0];
			}
			return checkedList[checkNode.id];
		};
		
		var encodeHTML = function(str){
            var tNode = document.createTextNode(str);
            var div = $.C('div');
            div.appendChild(tNode);
            var result = div.innerHTML;
            div = tNode = null;
            return result;
        };
		lengthLimit = function(e){
			var input = $.fixEvent(e).target;
			if($.bLength(input.value) > 16){
				input.value = $.leftB(input.value, 16);
			}
		};
		
		onEnter = function(e){
			if(e.keyCode === 13){
				var input = $.fixEvent(e).target;
				$.fireEvent(input,'blur');
			}
		};
		
		var displayDesc = function(el, isOpen, aDesc){
			var desc;
			var group = checkGroup(el);
			createInput(group);
			if(!group) return;
			if(isOpen){
				group.input.parentNode.style.display = "";
				group.text.parentNode.style.display = "none";
				group.icon.style.display = "none";
				desc = aDesc || group.text.innerHTML;
				if(desc){
					group.input.value = $.decodeHTML(desc);
				}else{
					group.input.value = "";
				}
				group.input.select();
				$.addEvent(group.input,"blur",bindDOMFuns['descInputBlur']);
				$.addEvent(group.input, 'keyup', lengthLimit);
				$.addEvent(group.input, 'keypress', onEnter);
			}else{
				desc = $.trim(group.input.value);
				if(desc){
					var errorFunc = function(rs){
							rs && rs.msg && $.ui.alert(rs.msg);
							group.text.innerHTML = "";
							group.icon.style.display = pubG ? "" : "none";
							group.input.parentNode.style.display = "none";
							group.text.parentNode.style.display = "none";
					};
					$.common.trans.group.request('editdesc',{
						onSuccess:function(){
							group.text.innerHTML = encodeHTML(desc);
							group.input.parentNode.style.display = "none";
							group.text.parentNode.style.display = "";
							group.icon.style.display = pubG ? "" : "none";
						},
						'onError': errorFunc,
						'onFail' : errorFunc
					},{gid:group.gid,uid:touid,desc: encodeURIComponent(desc)})
				}else{
					group.text.innerHTML = "";
					group.icon.style.display = pubG ? "" : "none";
					group.input.parentNode.style.display = "none";
					group.text.parentNode.style.display = "none";
				}
				$.removeEvent(group.input,"blur",bindDOMFuns['descInputBlur']);
				$.removeEvent(group.input, 'keyup', lengthLimit);
				$.removeEvent(group.input, 'keypress', onEnter);
			}
			
		};
		
		var hideInfo = function(obj){
			obj.icon.style.display = "none"; 
			if (obj.input) {
				obj.input.parentNode.style.display = "none";
			}
			obj.text.parentNode.style.display = "none";
		};
		
		var displayIcon = function(el,isShow,desc){
			var group = checkGroup(el);
			if(!group) return;
			if(isShow){
				group.icon.style.display = pubG ? "" : "none";
				if(desc){
					group.text.parentNode.style.display = "";
					group.text.innerHTML = encodeHTML(desc);
				}else{
					group.text.innerHTML = "";
				}
			}else{
				hideInfo(group);
			}	
		};
		
		var showDescIcon = function(el,desc){
			var parent = getElement(el,'parentNode','li');
			descIconNode.style.display = "";
			
		};
		
		var bindDOMFuns = {
			'addGroup': function(spec){
				addGroupBox.show();
			},
			
			'setGroup': function(spec){
				var checkEl = $.sizzle('input.W_checkbox', spec.el)[0];
				setGroupTrans.request({
					'gid': checkEl.value,
					'fuid': touid,
					'action': checkEl.checked ? 'add' : 'delete'
				});
			},
			'descInputBlur': function(e){
				var el = $.fixEvent(e).target;
				displayDesc(el,false);				
			},
			'setDesc': function(spec){
				var group = checkGroup(spec.el);
				var _desc = function(rs, parm){
					var data = rs && rs.data || [];
					for(var i = data.length; i--;){
						if(data[i].uid === touid){
							displayDesc(spec.el, true, data[i]['group_description']);
							break;
						}
					}
				};
				$.common.trans.group.request('getGroupDesc', {
					'onSuccess': _desc,
					'onError': _desc,
					'onFail' : _desc
				},{
					'uid': touid,
					'gid': group.gid
				});
			},
			'submit': function(spec){
				var val	= $.trim(nodes['groupName'].value),
					msg	= errTips.check(val);
				if(msg){
					return errTips.show(msg);
				}
				addGroupTrans.request({
					'name': val
				});
			},
			'cancel': function(spec){
				addGroupBox.hide();
			},
			'select':function(spec){
				displayIcon(spec.el,spec.el.checked);
			},
			'focus': function(e){
				e = $.fixEvent(e);
				var el = e.target,
					val = $.trim(el.value);
				if(val === defVal){
					el.value = '';
				}
			},
			'blur': function(e){
				e = $.fixEvent(e);
				var el = e.target,
					val = $.trim(el.value);
				if(!val){
					el.value = defVal;
				}
			}
		};
		
		var bindDom = function(){
			dEvent.add('addGroup', 'click', bindDOMFuns['addGroup']);
			dEvent.add('setGroup', 'click', bindDOMFuns['setGroup']);
			dEvent.add('submit', 'click', bindDOMFuns['submit']);
			dEvent.add('cancel', 'click', bindDOMFuns['cancel']);
			
			dEvent.add('select', 'click', bindDOMFuns['select']);
			dEvent.add('descIcon', 'click', bindDOMFuns['setDesc']);
			dEvent.add('descText', 'click', bindDOMFuns['setDesc']);
			
			$.addEvent(nodes['groupName'], 'focus', bindDOMFuns['focus']);
			$.addEvent(nodes['groupName'], 'blur', bindDOMFuns['blur']);
		};
		
		var init = function(){
			document.body.appendChild(build.box);
			that.setContent(curList);
			bindDom();
		};
		var curBtn;
		var hideTimer, showTimer;
		var hitTest = function(e){
			if(!$.core.evt.hitTest(nodes['outer']) && !$.core.evt.hitTest(curBtn)){
				hideTimer = setTimeout(function(){
					that.hide();
				}, 100);
			}
		};
		
		that = {
			'open': false,
			'panel': nodes['outer'],
			'show': function(spec){
				hideTimer && clearTimeout(hideTimer);
				curBtn = (spec || {}).target;
				setGroupCb = (spec || {}).setGroupCb;
				addGroupCb = (spec || {}).addGroupCb;
				
				if (that.open) { return; }
				
				nodes['outer'].style.display = '';
				setTimeout(function(){
					$.addEvent(document.body, 'click', hitTest);
				}, DELAY);
				that.open = true;
			},
		
			'hide': function(){
				that.open = false;
				nodes['outer'].style.display = 'none';
				addGroupBox.hide();
				setTimeout(function(){
					$.removeEvent(document.body, 'click', hitTest);
				}, DELAY);
			},
		
			'add': function(obj){
				pubG || delete obj.belong;
				curList.push(obj);
				var data = [].concat(obj),
					temp = createHtml(data);
				$.insertHTML(nodes['inner'], temp, 'BeforeEnd');
			},
		
			'setTouid': function(id){
				touid = id;
			},
		
			'setContent': function(list){
				curList = list;
				var html = createHtml(list);
				nodes['inner'].innerHTML = html; 
			},
		
			'setPosition': function(pos){
				nodes['outer'].style.top = pos['t'] + 'px';
				nodes['outer'].style.left = pos['l'] + 'px';
			},
		
			'setSelector': function(gids,descs){
				var inputs = $.sizzle('input[name=gid]', nodes['inner']),
					gidStr = $.isArray(gids) ? gids.join(',') : '';
					descs = descs || [];
				for (var i = inputs.length; i--;) {
					inputs[i].checked = gidStr.indexOf(inputs[i].value) >= 0;
					displayIcon(inputs[i], inputs[i].checked, descs[i]);
				}
			},
			
			'getSelector': function(){
				var rs = [];
				var items = $.sizzle('input[checked]', nodes['inner']);
				for (var i = 0, len = curList.length; i < len; i++) {
					for (var j = items.length; j--;) {
						if(curList[i].gid === items[j].id.split('_')[1]){
							rs.push(curList[i]);
						}
					}
				}
				return rs;
			}
		};
		
		init();
		
		return that;
	};
});