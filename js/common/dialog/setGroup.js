/**
 * 设置分组
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.dialog');
$Import('ui.alert');
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('common.trans.group');
$Import('ui.litePrompt');
$Import('common.group.groupListPanel');
STK.register("common.dialog.setGroup", function($){
	var MAXLENGTH = 30;
	return function(){
		var that		= {},
			$L			= $.kit.extra.language,
			dialog		= $.ui.dialog({'isHold': true}),
			alert		= $.ui.alert,
			temp		= {
				'groupBox': 
					'<div class="layer_setup_followlists follow_success" node-type="group_panel" >'+
						'<input type="hidden" node-type="uid" name="touid">'+
						'<div class="lsfl_Tit form_table_single" node-type="remarkPanel">#L{备注名称：}'+
							'<input node-type="remarkInput" type="text" value="#L{设置备注}" class="W_input" name="remark">'+
							'<div class="M_notice_del" style="display:none;"><span class="icon_del"></span>#L{备注姓名是非法的}</div>'+
						'</div>'+
						'<div class="lsfl_gTit clearfix">'+
						'<div class="left" node-type="message"></div>'+
							'<div class="right W_textb" action-type="tipsLayer"><span class="icon_askS"></span>#L{为什么要设置分组？}'+
								'<div class="layer_tips" node-type="groupTips" style="display: none;">'+
									'<ul>'+
										'<li>#L{在首页可以设定的分组查看微博} </li>'+
										'<li>#L{将已经关注的人设置分组，方便管理}</li>'+
										'<li>#L{分组信息是保密的，只有自己可见}</li>'+
									'</ul>'+
	                            '<span style="left:180px" class="arrow_up"></span>'+
								'</div>'+
							'</div>'+
						'</div>'+
						
						'<div>'+
							'<div class="W_loading" node-type="loading"><span>#L{正在加载，请稍候...}</span></div>'+
							'<div node-type="groupList"></div>'+
						'</div>'+
						
						'<div node-type="addGroupPanel">'+
							'<div class="lsfl_addNew" node-type="showBtnBox">'+
								'<a class="addnew" href="javascript:;" action-type="showBtn"><span class="ico_addinv"></span><span class="txt">#L{创建新分组}</span></a>'+
							'</div>'+
							'<div class="lsfl_creaNew form_table_single" node-type="addGroupBox" style="display:none;">'+
								'<input node-type="groupInput" type="text" value="#L{新分组}" class="W_input">'+
								'<div style="display:none;" node-type="errorTips" class="M_notice_del"><span class="icon_del"></span></div>'+
								'<a href="javascript:;" class="W_btn_a btn_noloading" action-type="addGroup" node-type="addGroup"><span><b class="loading"></b><em node-type="createBtnTxt">#L{创建}</em></span></a>'+
								'<a href="javascript:;" action-type="hideBtn">#L{取消}</a>'+
							'</div>'+
						'</div>'+

						'<div class="btn">'+
							'<a href="javascript:;" class="W_btn_b btn_noloading" action-type="submit" node-type="submit"><span><b class="loading"></b><em node-type="btnText">#L{保存}</em></span></a>'+
							'<a href="javascript:;" class="W_btn_a" action-type="cancel"><span>#L{取消}</span></a>'+
						'</div>'+
					'</div>',
					
				'checkBox': 
					'<input type="checkbox" value="{value}" name="gid" class="W_checkbox" {checked} id="group_{groupId}">'+
					'<label for="group_{groupId}">{name}</label>'
			},
			msg			= {
				'title'		: '#L{关注成功}',
				'gEmpty'	: '#L{分组名不能为空}',
				'rEmpty'	: '#L{备注名不能为空}',
				'gMaxLen'	: '#L{请不要超过16个字符}',
				'gDefVal'	: '#L{新分组}',
				'okLabel'	: '#L{设置成功}',
				'rDefVal'	: '#L{设置备注}',
				'message'	: '#L{为   <span class="W_fb">#{nickName\\}</span>  选择分组}',//change
				'repeat'	: '#L{此分组名已存在}'
			},
			status		= false, 
			groupList	= [], groupListPanel,
			nodes, dEvent, gFocusHandler, gBlurHandler, rFocusHandler, rBlurHandler, successCb, cancelCb;
		
		var reset = function(){
			nodes['remarkInput'].value		=  $L(msg['rDefVal']);
			nodes['groupInput'].value		=  $L(msg['gDefVal']);
			nodes['loading'].style.display	= '';
			nodes['groupList'].innerHTML	= '';
			nodes['showBtnBox'].style.display = '';
			nodes['addGroupBox'].style.display = 'none';
		};
		/*
		 * nodeType 是创建还是保存
		 * textNodeType 里面的文字的node-Type
		 * buttonType是提交状态还是普通状态
		 * */
		var setSubmitBtn = function(nodeType , buttonType) {
			var btnText , textNodeType;
			//创建
			if(nodeType == 'addGroup') {
				btnText = $L('#L{创建}');
				textNodeType = 'createBtnTxt';				
			} else {
			  //保存
				btnText = $L("#L{保存}");
				textNodeType = 'btnText';
			}
			if (buttonType == 'normal') {
				nodes[nodeType].className = 'W_btn_a btn_noloading';
				nodes[textNodeType].innerHTML = btnText;
			} else {
				nodes[nodeType].className = 'W_btn_a_disable';
				nodes[textNodeType].innerHTML = $L('#L{保存中...}');
			}		
		};
		var show = function(opts){
			reset();
			var args = $.parseParam({
				'uid'	: '',
				'fnick'	: '',
				'hasRemark': true,
				'groupList': [],
				'title'	: $L(msg['title']),
				'successCb': function(){},
				'cancelCb': function(){}
			}, opts);
			
			successCb = args.successCb;
			cancelCb = args.cancelCb;
			
			nodes['uid'].value = args.uid;
			if (args['hasRemark']) {
				nodes['remarkInput'].removeAttribute('disabled');
				nodes['remarkPanel'].style.display = '';
			} else {
				nodes['remarkInput'].setAttribute('disabled', 'disabled');
				nodes['remarkPanel'].style.display = 'none';
			}
			args['groupList'].length ? createGroupList(args['groupList']) : getGroupTrans.request({
				'uid': args['uid']
			});
			nodes['message'].innerHTML = $L(msg['message'], {'nickName':args.fnick});
			dialog.setTitle(args['title']);
			dialog.appendChild(nodes['group_panel']);
			dialog.show().setMiddle();
		};
		
		var hide = function(){
			dialog.hide();
			//$.core.dom.removeNode(nodes['group_panel']);
		};
		
		var groupInput = {
			'defVal': $L(msg['gDefVal']),
			'check': function(v){
				var m = '';
				if(v === '' || v === this.defVal){
					m = msg['gEmpty'];
				} else if($.core.str.bLength(v) > 16){
					m = msg['gMaxLen'];
				}
				return $L(m);
			},
			
			'checkRepeat': function(v){
				var m = '';
				for(var i=groupList.length;i--;){
					if(v === groupList[i]['gname']){
						m = msg['repeat'];
						break;
					}
				}
				return $L(m);
			},
			
			'showError': function(msg){
				nodes['errorTips'].innerHTML = '<span class="icon_del"></span>'+msg;
				nodes['errorTips'].style.display = '';
			},
			'hideError': function(){
				nodes['errorTips'].style.display = 'none';
			}
		};
		
		var remarkInput = {
			'defVal': $L(msg['rDefVal']),
			'check': function(v){
				var m = '';
				if(v === ''){
					m = msg['rEmpty'];
				} else if($.core.str.bLength(v) > 16){
					m = msg['gMaxLen'];
				}
				return $L(m);
			},
			'showError': function(msg){
			},
			'hideError': function(){
			}
		};
		
		/**
		 * 创建单个组节点
		 * @param {Object} data
		 */
		var creatGroupEl = function(data){
			var li = $.C('li');
			var t = temp['checkBox']
					.replace(/\{value\}/g, data.gid)
					.replace(/\{groupId\}/g, data.gid)
					.replace(/\{name\}/g, data.gname)
					.replace(/\{checked\}/g, data.belong ? 'checked' : '');
			li.innerHTML = t;
			return li;
		};
		
		/**
		 * 创建分组列表
		 * @param {Array} list
		 */
		var createGroupList = function(list){
			groupList = list;
			nodes['addGroupPanel'].style.display = (list.length >= 20) ? 'none' : '';
			groupListPanel = $.common.group.groupListPanel({data:list});
			nodes['groupList'].appendChild(groupListPanel.getOuter());
			nodes['loading'].style.display = 'none';
		};
		
		var ioFuns = {
			'errorCd': function(spec, parm){
				$.ui.alert(spec && spec.msg || $L('#L{保存失败！}'));
				setSubmitBtn("submit" , "normal");
			},
			
			'getGroupSuccess': function(spec, parm){
				var list = spec.data || [];
				createGroupList(list);
			},
			
			'setGroupSuccess': function(spec, parm){
				hide();
				setSubmitBtn("submit" , "normal");
				$.ui.litePrompt($L(msg['okLabel']),{'type':'succM','timeout':'500'});
				successCb(spec, parm);
			},
			
			'setGroupError': function(spec, parm){
				groupInput.showError(spec.msg);
			},
			
			'addGroupSuccess': function(spec, parm){
				setSubmitBtn("addGroup" , "normal");
				var list = spec.data,
					newGroup;
				nodes['addGroupPanel'].style.display = (list.length >= 20) ? 'none' : '';
				for(var i in list){
					if(list[i].belong === 1){
						newGroup = list[i];
						break;
					}
				}
				newGroup && groupList.push(newGroup);
				groupListPanel.add(newGroup);
				bindDOMFuns.hideAddPanel();
				nodes['groupInput'].value = $L(msg['gDefVal']);
				if(groupListPanel.length() >= 20){
					nodes['addGroupPanel'].style.display = 'none';
				}
			}
		};
		
		/**
		 * 获取分组信息
		 */
		var getGroupTrans = $.common.trans.group.getTrans('list', {
			'onSuccess': ioFuns['getGroupSuccess'],
			'onError': ioFuns['errorCd']
		});
		
		/**
		 * 单人设置分组信息
		 */
		var setGroupTrans = $.common.trans.group.getTrans('update', {
			'onSuccess': ioFuns['setGroupSuccess'],
			'onError': ioFuns['errorCd'],
			'onFail' : ioFuns['errorCd']
		});
		
		/**
		 * 批量设置分组
		 */
		var batchSetTrans =  $.common.trans.group.getTrans('batchSet', {
			'onSuccess': ioFuns['setGroupSuccess'],
			'onError': ioFuns['errorCd']
		});
		
		/**
		 * 添加新分组
		 */
		var addGroupTrans = $.common.trans.group.getTrans('add', {
			'onSuccess': ioFuns['addGroupSuccess'],
			'onError': function(spec, parm) {
				//把按钮改回来
				setSubmitBtn("addGroup" , "normal");
				//ioFuns['errorCd'](spec, parm);
				$.ui.alert(spec.msg);
			}
		});
		
		var encodeHTML = function(str){
            var tNode = document.createTextNode(str);
            var div = $.C('div');
            div.appendChild(tNode);
            var result = div.innerHTML;
            div = tNode = null;
            return result;
        };
		var bindDOMFuns	= {
			'showAddPanel': function(){
				nodes['showBtnBox'].style.display = 'none';
				nodes['addGroupBox'].style.display = '';
				nodes['groupInput'].focus();
			},
			
			'hideAddPanel': function(){
				nodes['showBtnBox'].style.display = '';
				nodes['addGroupBox'].style.display = 'none';
				groupInput.hideError();
				nodes['groupInput'].value = groupInput.defVal;
			},
			'addGroup': function(){
				var val = encodeHTML($.trim(nodes['groupInput'].value)),
					erM	= groupInput.check(val) || groupInput.checkRepeat(val);
				if(erM){
					groupInput.showError(erM);
				} else {
					groupInput.hideError();
					//将按钮改为loading
					setSubmitBtn("addGroup" , "loading");
					addGroupTrans.request({
						'name': val
					});
				}
			},
			'submit': function(){
				var val = encodeHTML($.trim(nodes['groupInput'].value)),
					erM	= groupInput.checkRepeat(val);
				if (erM) {
					groupInput.showError(erM);
					return;
				}
				var data = {};
				status = true;
				groupInput.hideError();
				groupInput.check(val) || (data.newgroup = val);
				data.type = "s";
				var gid = groupListPanel.getData();
				var arr = [];
				var remark = nodes['remarkInput'].value;
				if(remark === $L(msg['rDefVal'])){
					remark = '';
				}
				data.remark = remark;
				var uid = nodes['uid'].value; 
				data.user = uid;
				data.gid = $.jsonToStr(gid);
				
				//将按钮置为loading状态
				setSubmitBtn("submit" , "loading");
				setGroupTrans.request(data);
			},
			
			'cancel': function(){
				status = false;
				hide();
			},
			
			'inputFocus': function(input){
				return function(evt){
					var evt = $.fixEvent(evt),
						node= evt.target,
						val = node.value;
					input.hideError();
					(val === input['defVal']) && (node.value = '');
				}
			},
			
			'inputBlur': function(input){
				return function(evt){
					var evt = $.fixEvent(evt),
						node= evt.target,
						val = $.trim(node.value);
					val || (node.value = input['defVal']);
				}
			},
			
			'inputMaxLen': function(evt){
				var evt	= $.fixEvent(evt),
					node= evt.target,
					val	= node.value,
					len	= $.core.str.bLength(val);
				if(evt.keyCode=="13"){bindDOMFuns.submit();return	}
				(len > MAXLENGTH) && (node.value = $.core.str.leftB(val, MAXLENGTH));
			},
			
			'showGroupTips': function(){
				nodes['groupTips'].style.display = '';
			},
			
			'hideGroupTips': function(){
				nodes['groupTips'].style.display = 'none';
			}
		};
		
		var init = function(){
			parseDom();
			bindDom();
			bindCustEvent();
		};
		
		var bindDom = function(){
			dEvent = $.core.evt.delegatedEvent(nodes['group_panel']);
			
			gFocusHandler = bindDOMFuns.inputFocus(groupInput);
			gBlurHandler = bindDOMFuns.inputBlur(groupInput);
			
			rFocusHandler = bindDOMFuns.inputFocus(remarkInput);
			rBlurHandler = bindDOMFuns.inputBlur(remarkInput);
			
			$.addEvent(nodes['remarkInput'], 'focus', rFocusHandler);
			$.addEvent(nodes['remarkInput'], 'blur', rBlurHandler);
			$.addEvent(nodes['groupInput'], 'focus', gFocusHandler);
			$.addEvent(nodes['groupInput'], 'blur', gBlurHandler);
			$.addEvent(nodes['remarkInput'], 'keyup', bindDOMFuns.inputMaxLen);
			$.addEvent(nodes['groupInput'], 'keyup', bindDOMFuns.inputMaxLen);
			
			dEvent.add('showBtn', 'click', bindDOMFuns.showAddPanel);
			dEvent.add('hideBtn', 'click', bindDOMFuns.hideAddPanel);
			dEvent.add('addGroup', 'click', bindDOMFuns.addGroup);
			dEvent.add('submit', 'click', bindDOMFuns.submit);
			dEvent.add('cancel', 'click', bindDOMFuns.cancel);
			dEvent.add('tipsLayer', 'mouseover', bindDOMFuns.showGroupTips);
			dEvent.add('tipsLayer', 'mouseout', bindDOMFuns.hideGroupTips);

		};
		
		var bindCustEvent = function(){
			$.custEvent.add(dialog, 'hide', function(){
				status || cancelCb();
			});
		};
		
		var parseDom = function(){
			var buildDom = $.core.dom.builder($L(temp['groupBox']));
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
				
		var destroy = function(){
			$.removeEvent(nodes['remarkInput'], 'focus', rFocusHandler);
			$.removeEvent(nodes['remarkInput'], 'blur', rBlurHandler);
			$.removeEvent(nodes['groupInput'], 'focus', gFocusHandler);
			$.removeEvent(nodes['groupInput'], 'blur', gBlurHandler);
			$.removeEvent(nodes['remarkInput'], 'keyup', bindDOMFuns.inputMaxLen);
			$.removeEvent(nodes['groupInput'], 'keyup', bindDOMFuns.inputMaxLen);
			
			gFocusHandler = null;
			gBlurHandler = null;
			
			rFocusHandler = null;
			rBlurHandler = null;
			
			dEvent && dEvent.destroy();
		};
		
		init();
		
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;
		
		return that;
	}
});
