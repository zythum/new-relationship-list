/**
 * 投票发布层
 * 
 * @id STK.common.bubble.vote
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */
$Import('ui.bubble');
$Import('ui.tipAlert');
$Import('module.layer');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('kit.extra.merge');
$Import('kit.dom.parentElementBy');
$Import('kit.dom.lastChild');
$Import('common.trans.editor');
$Import('common.extra.imgUploadCode');
$Import('common.extra.imageURL');
$Import('common.trans.vote');
$Import('common.feed.groupAndSearch.include.calendar');
$Import('common.extra.shine');
$Import('module.editorPlugin.tab');
$Import('module.uploadPic');

STK.register('common.bubble.vote', function($){
	
	var $L = $.kit.extra.language;
	var $T = $.core.util.templet;
	
	var createOptions = function(start, end, precursor, prefix, suffix){
		if(start > end)	return '';
		var str = [];
		if(!prefix) prefix = '';
		if(!suffix) suffix = '';
		for(var i=start; i<=end; i++){
			var n = i;
			if(!!precursor) n = n < 10 ? '0' + n : '' + n;
			str.push('<option value="' + n + '">' + prefix + n + suffix + '</option>');
		}
		return str.join('');
	}
	
	var getDateDetail = function(type){
		var d = new Date();
		var dl;
		switch(type){
			case 'Y':
				dl = d.getFullYear();
				break;
			case 'M':
				dl = d.getMonth() + 1;
				if(dl < 10) dl = '0' + dl;
				break;
			case 'D':
				dl = d.getDate();
				if(dl < 10) dl = '0' + dl;
				break;
			case 'H':
				dl = d.getHours();
				if(dl < 10) dl = '0' + dl;
				break;
			case 'I':
				dl = d.getMinutes();
				if(dl < 10) dl = '0' + dl;
				break;
			case 'S':
				dl = d.getSeconds();
				if(dl < 10) dl = '0' + dl;
				break;
			default:
				dl = d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
				break;
		}
		return dl;
	};
	
	var dateFormat = function(timestamp){
		var date = timestamp ? new Date(timestamp) : new Date();
		
		var _f = {
			year  : date.getFullYear(),
			month : date.getMonth() + 1,
			day   : date.getDate()
		};
		
		if(_f.month < 10) _f.month = '0' + _f.month;
		if(_f.day < 10) _f.day = '0' + _f.day;
		
		return _f.year + '-' + _f.month + '-' + _f.day;
	};
	
	var randomCode = function(){
		var code = '' + Math.random()
		return code.replace(/^0\./, "s_");
	};
	var TEMP = {
		FRAME : '' +
			'<div node-type="vote" class="feed_vote">' +
				'<div class="tab"><p><a class="current W_texta" node-type="tabSelect" href="#" onclick="return false;">#L{发起文字投票}</a><a node-type="tabSelect" href="#" onclick="return false;">#L{发起图片投票}</a></p></div>' +				'<div class="layer_vote">' +
					'<dl>' +
						'<dt>#L{创建标题}：<p node-type="titleTips"><em class="W_textb">#L{标题最多25字}</em></p></dt>' +
						'<dd class="vote_text"><input node-type="title" type="text" name="title" class="W_input" /></dd>' +
						'<dt>#L{投票选项}：<p node-type="itemsTips"><em class="W_textb">#L{至少2项,每项最多20字}</em></p></dt>' +
					'</dl>' +
					//选项列表
					'<dl node-type="items"></dl>' +
					'<dl>' +
						'<dd><a href="#" onclick="return false;" node-type="addItems"><span class="ico_addinv"></span><span class="txt">#L{添加选项}</span></a></dd>' +
						'<dt>#L{单选/多选}：<select name="num" node-type="num"><option value="1">#L{单选}</option></select></dt>' +
					'</dl>' +
					'<dl>' +
						'<dt><a node-type="advancedBtn" class="W_moredown" href="#" onclick="return false;"><span class="txt">#L{高级设置}</span><span class="more"></span></a></dt>' +
					'</dl>' +
					'<dl node-type="advanced">' +
						'<dd>截止时间：<span class="date"><select node-type="deadline"><option value="1 week">#L{一周}</option><option value="1 month">#L{一个月}</option><option value=".5 year">#L{半年}</option><option value="1 year">#L{一年}</option><option value="modify">#L{自定义}</option></select></span>' +
							'<p style="display:none;" node-type="modify"><input name="date" type="text" node-type="date_select" class="date_select" readonly /><span class="date"><select name="hours">' + createOptions(0,23,1) + '</select>#L{时}</span><span class="date"><select name="minutes">' + createOptions(0,59,1) + '</select>#L{分}</span></p>' +
						'</dd>' +
						'<dd>#L{投票结果}：<span node-type="voteResult"><label for="vote_visibility_0"><input id="vote_visibility_0" value="0" type="radio" name="visibility" class="W_radio" checked="checked" />#L{投票后可见}</label><label for="vote_visibility_1"><input id="vote_visibility_1" value="1" type="radio" name="visibility" class="W_radio" />#L{任何人可见}</label></dd>' +
						'<dt>#L{投票说明}：' +
							'<div style="display:none" node-type="pictureArea">' +
								'<form node-type="pictureForm" id="vote_picture_upload" name="vote_picture_upload" target="upload_target" enctype="multipart/form-data" method="POST" action=""><p class="img_update"><a href="#" onclick="return false;"><span></span>#L{插入图片}</a><em node-type="fileBtn"><input action-type="picuploadinput" type="file" name="pic1" /></em></p></form>' +
								'<p class="W_loading"><span>#L{上传中...}<a action-type="cancel" href="#" onclick="return false">#L{取消}</a></span></p>' +
								'<p class="W_spetxt"><span class="icon_del"></span><em node-type="updateImageTips"></em></p>' +
								'<p class="img_updated"><span></span><em node-type="picturePreview"></em> <a action-type="cancel" href="#" onclick="return false;">#L{删除}</a></p>' +
							'</div>' +
						'</dt>' +
						'<dd><textarea node-type="info" class="introduce"></textarea></dd>' +
					'</dl>' +
					//验证码
					'<dl node-type="secodeArea" style="display:none;">' +
						'<dd class="proving">' +
							'<input node-type="secode" type="text" class="W_input" name="secode">' +
							$L('<img action-type="secodeImg" node-type="secodeImg" width="75" height="24" title="#L{看不清，换一个}" alt="#L{看不清，换一个}" />') +
							'<p node-type="secodeTips"></p>' +
						'</dd>' +
					'</dl>' +
					'<dl>' +
						'<dd><a node-type="submitBtn" href="#" onclick="return false;" class="W_btn_b"><span>#L{发起}</span></a><div node-type="submitTips"><em class="W_textb">#L{发起后可增加，不可删除或修改选项}</em></div></dd>' +
					'</dl>' +
				'</div>' +
			'</div>',
		ITEM : '<dd><span class="num">#{NUMBER}</span><input class="W_input" type="text" action-type="item" /><a action-type="removeItem" class="W_close_color" href="#" onclick="return false;"></a></dd>',
		ITEM_PIC : '' +
			'<dd class="options_pic">' +
				'<span class="num">#{NUMBER}</span>' +
				'<div class="option_pic">' +
					'<div class="pic"><img node-type="pic" height="50" width="50" src="' + $CONFIG['imgPath'] + 'style/images/index/update_pic.png" /><span style="visibility:hidden" node-type="ruTips">' + $L("#L{重新上传}") + '</span><form node-type="form" enctype="multipart/form-data" method="POST"><input name="pic1" node-type="fileBtn" type="file" /></form></div>' +
					'<div class="option"><input class="W_input" type="text" action-type="item" /><a action-type="removeItem" href="#" onclick="return false;" class="W_close_color"></a><p class="W_spetxt" node-type="tips"></p></div>' +
				'</div>' +
			'</dd>',
		ITEM_PIC_UPLOADING : $CONFIG['imgPath'] + 'style/images/index/vote_img_loading.png',
		EDITOR : $L('#L{我发起了一个投票}【#{TITLE}】，#L{地址} #{SHORTURL}'),
		ADVANCED : {
			PICUPLOADINPUT : '<input action-type="picuploadinput" type="file" name="pic1" />',
			PICUPLOADTHUMBFRAME : '' +
				'<div node-type="outer" class="W_layer"><div class="bg"><table border="0" cellspacing="0" cellpadding="0"><tr><td><div node-type="inner" class="content" style="padding:5px;">' +
		        '</div></td></tr></table><div class="arrow arrow_t"></div></div></div>',
	    	PICUPLOADTHUMBNAIL : '<img src="#{URL}" />'
		},
	    TITLE : {
	    	DEFAULT : $L('<em class="W_textb">#L{标题最多25字}</em>'),
	   		SUCCESS : $L('<em class="W_textb">#L{标题最多25字}</em><span class="icon_succ"></span>'),
	    	EMPTY   : $L('<span class="icon_del"></span><em class="W_spetxt">#L{标题不能为空}</em>')
	    },
	    ITEMS : {
	    	DEFAULT : $L('<em class="W_textb">#L{至少2项,每项最多20字}</em>'),
	    	LESS    : $L('<span class="icon_del"></span><em class="W_spetxt">#L{选项太少啦，至少两项哦。}</em>')
	    },
	    SUBMIT : {
	    	DEFAULT : $L('<em class="W_textb">#L{发起后不可删除或修改选项}</em>'),
	    	ERROR   : '<span class="icon_del"></span><em class="W_spetxt">#{MESSAGE}</em>',
	    	ING     : $L('<p class="W_loading"><span>#L{正在提交}</span></p>'),
	    	SUCCESS : $L('#L{投票发起成功}&nbsp;')
	    },
	    SECODE : {
	    	DEFAULT : $L('<em class="W_textb">#L{请输入验证码}</em>'),
	    	EMPTY   : $L('<span class="icon_del"></span><em class="W_spetxt">#L{验证码不能为空}</em>'),
	    	ERROR   : $L('<span class="icon_del"></span><em class="W_spetxt">#L{验证码错误，请重新输入}</em>')
	    },
	    PICTUREUPLOAD : {
	    	ERRORSIZE : $L("#L{请上传5M以内的JPG、GIF、PNG图片。}")
	    }
	}
	
	var that = {},
		lsner = {},
		outer,
		nodes,
		formData,
		bub,
		pictureThumbnail, //?
		dEvt = {},
		lastDeadline = '1 week',
		deadline = {},
		itemCount = 0,
		advanced_shown = false, //高级标识
		onSubmit = false,
		itemCountActive = 0,
		needSecode = false,
		secodeImhUrl = null,
		msgTip,
		pollCategory,
		isShown = false;
		
	var tabIndexConfig = ['normal', 'picture'];
	
	var __itemArea;
	
	var options = {
		itemMin       : 5,  //必须的数量(不可删除的项)
		itemMax       : 10, //最多
		defaultItem   : 5,  //默认数量
		addItemStep   : 1,  //每次添加的数量
		itemMaxLen    : 20, //byte length
		titleMaxLen   : 25, //byte length
		maintain      : 365,//保持天数
		itemMinActive : 2   //至少两项有效
	}
	
	var vote = {
		init : function(){
			vote.bind();
			pictureArea.init();
		},
		changeTab : function(type){
			vote.stopLsn();
			
			needSecode = false;
			onSubmit = false;
			advanced_shown = false;
			itemCount = 0;
			__itemArea = vote[type]();
			
			vote.resetTitle();
			vote.resetDeadline();
			vote.resetVoteResult();
			vote.clearItems();
			vote.itemsNum();
			vote.hideCalendar();
			vote.hideAdvanced();
			vote.startLsn();
			
			switch(type){
				case 0:
				case 'default':
					options.itemMax = 20;
					pictureArea.enable();
					break;
				case 1:
				case 'picture':
					options.itemMax = 15;
					pictureArea.disable();
					break;
				default:
					options.itemMax = 20;
					pictureArea.enable();
					break;
			}
			
			vote.addItems(options.defaultItem);
			
			nodes.itemsTips.innerHTML = '';
			nodes.titleTips.innerHTML = '';
			nodes.secodeTips.innerHTML = '';
			nodes.submitTips.innerHTML = '';
			
			setTimeout(function(){
				nodes.title.focus();
			}, 0);
		},
		/**
		 * 绑定事件
		 */
		bind : function(){
			$.module.editorPlugin.tab(outer, {
				'evtType' : 'click',
				'tNodes' : nodes.tabSelect,
				'className' : 'current W_texta',
				'cb' : function(ret){
					vote.changeTab(tabIndexConfig[ret.idx]);
				}
			});
			
			dEvt.items = $.core.evt.delegatedEvent(nodes.items);
			dEvt.secode = $.core.evt.delegatedEvent(nodes.secodeArea);
			
			dEvt.items.add('removeItem', 'click', vote.removeItem);
			dEvt.items.add('item', 'click', function(){
				nodes.itemsTips.innerHTML = TEMP.ITEMS.DEFAULT;
			});
			
			dEvt.secode.add('secodeImg', 'click', vote.secodeReflush);
			
			$.addEvent(nodes.addItems, "click", vote.addItemStep);
			$.addEvent(nodes.advancedBtn, "click", vote.toggleAdvanced);
			$.addEvent(nodes.deadline, "change", vote.toggleDeadline);
			$.addEvent(nodes.date_select, "click", vote.showCalendar);
			$.addEvent(nodes.submitBtn, "click", vote.submit);
			$.addEvent(nodes.info, "click", vote.showInfo);
			$.addEvent(nodes.info, "blur", vote.hideInfo);
			$.addEvent(nodes.title, "keyup", vote.getTitle);
			$.addEvent(nodes.secode, "keyup", vote.getSecode);
		},
		startLsn : function(){
			lsner.flushNum = window.setInterval(vote.itemsReflushStatus, 500);
		},
		stopLsn : function(){
			for(var i in lsner)
				window.clearInterval(lsner[i]);
		},
		/**
		 * 获取弹层
		 */
		getBub : function(){
			return bub;
		},
		/**
		 * 弹层隐藏
		 */
		hide : function(){
			//peijian chorme下清除dom结构快过冒泡，日期选择器没有消失，下一次还会出现
			//通过延时来完成整体页面冒泡后关闭投票层
			setTimeout(bub.hide, 10);
			isShown = false;
			$.custEvent.remove(that, 'hide');
		},
		/**
		 * 弹层显示
		 */
		show : function(){
			bub.show();
		},
		/**
		 * 获取选项数量
		 */
		itemsNum : function(){
			itemCount = $.sizzle("dd", nodes.items).length;
		},
		/**
		 * 选项编号刷新
		 */
		itemsReMark : function(){
			var items = $.sizzle("dd", nodes.items);
			for(var i=0;i<itemCount;i++){
				items[i].firstChild.innerHTML = (i + 1) + ".";
			}
		},
		/**
		 * 添加选项
		 */
		addItems : function(num){
			__itemArea.addItems(num);
			
			vote.removeItemsBtn.autoToggle();
			vote.addItemsBtn.autoToggle();
		},
		/**
		 * 添加选项（按设置），初始化时使用
		 */
		addItemStep : function(){
			vote.addItems(options.addItemStep);
		},
		/**
		 * 清空选项
		 */
		clearItems:function(){
			nodes.items.innerHTML = '';
		},
		//添加按钮
		addItemsBtn : {
			show : function(){
				nodes.addItems.style.display = '';
			},
			hide : function(){
				nodes.addItems.style.display = 'none';
			},
			autoToggle : function(){
				if(itemCount < options.itemMax){
					vote.addItemsBtn.show();
				} else {
					vote.addItemsBtn.hide();
				}
			}
		},
		/**
		 * 移除选项
		 */
		removeItem : function(ob){
			setTimeout(function(){
				vote.itemsNum();
				__itemArea.removeItem(ob.el);
				vote.itemsReMark();
				vote.removeItemsBtn.autoToggle();
				vote.addItemsBtn.autoToggle();
			}, 0);
		},
		/**
		 * 移除选项按钮列表显示
		 */
		removeItemsBtn : {
			get : function(){
				return $.sizzle('a[action-type="removeItem"]', nodes.items);
			},
			show : function(){
				var btns = vote.removeItemsBtn.get();
				if(btns.length > 0){
					for(var i in btns){
						btns[i].style.display = '';
					}
				}
			},
			hide : function(){
				var btns = vote.removeItemsBtn.get();
				if(btns.length > 0){
					for(var i in btns){
						btns[i].style.display = 'none';
					}
				}
			},
			autoToggle : function(){
				if(itemCount > options.itemMin){
					vote.removeItemsBtn.show();
				} else {
					vote.removeItemsBtn.hide();
				}
			}
		},
		/**
		 * 获取标题
		 */
		getTitle : function(){
			var value = $.core.str.trim(nodes.title.value);
			if(value == ''){
				nodes.titleTips.innerHTML = TEMP.TITLE.DEFAULT;
			} else {
				if( value.length >= options.titleMaxLen )
					value = value.slice(0, options.titleMaxLen);
				nodes.titleTips.innerHTML = TEMP.TITLE.SUCCESS;
			}
			
			if(nodes.title.value != value)
				nodes.title.value = value;
				
			return value;
		},
		resetTitle : function(){
			nodes.title.value = '';
			vote.getTitle();
		},
		itemsFormat : function(){
			var items = $.sizzle('input[action-type="item"]', nodes.items);
			if(items && items.length > 0){
				var value;
				for(var i in items){
					value = items[i].value;
					value = $.core.str.trim(value).replace(/,/, '').slice(0, options.itemMaxLen);				
					items[i].value != value && (items[i].value = value);
				}
			}
		},
		/**
		 * 获取列表项的值
		 */
		itemsReflushStatus : function(){
		//getItems : function(){
			vote.itemsFormat();
			
			var data = __itemArea.getItemsData();
			
			if(itemCountActive != data.length){
				vote.flushNum(data.length);
				itemCountActive = data.length;
			}
		},
		getItemsFormData : function(){
			vote.itemsFormat();
			var data = __itemArea.getItemsFormData();
			return data;
		},
		/**
		 * 获取可见参数
		 */
		getVoteResult : function(){
			var radios = $.sizzle("[name=visibility]", nodes.vote);
			for(var i in radios)
				if(radios[i].checked == true)
					return radios[i].value;
			return 0;
		},
		resetVoteResult : function(){
			$.sizzle("[name=visibility]", nodes.vote)[0].checked = true;
		},
		/**
		 * 获取截止时间
		 */
		getDeadline : function(){
			var deadline = nodes.deadline.value;
			var data = {};
			data.hh = getDateDetail("H");
			data.mm = getDateDetail("I");

			switch(deadline){
				case '1 week':
					data.date = dateFormat( (Math.round(+new Date()/1000) + (7 * 86400)) * 1000);
					break;
				case '1 month':
					data.date = dateFormat( (Math.round(+new Date()/1000) + (30 * 86400)) * 1000);
					break;
				case '.5 year':
					data.date = dateFormat( (Math.round(+new Date()/1000) + (182 * 86400)) * 1000);
					break;
				case '1 year':
					data.date = dateFormat( (Math.round(+new Date()/1000) + (365 * 86400)) * 1000);
					break;
				default:
					data.date = $.sizzle('[name=date]', nodes.modify)[0].value;
					data.hh = $.sizzle('[name=hours]', nodes.modify)[0].value;
					data.mm = $.sizzle('[name=minutes]', nodes.modify)[0].value;
					break;	
			}
			return data;
		},
		/**
		 * 获取验证码并提示
		 */
		getSecode : function(){
			var secode = $.core.str.trim(nodes.secode.value);
			if(secode == ''){
				nodes.secodeTips.innerHTML = TEMP.SECODE.DEFAULT;
				//$.core.dom.addClassName(nodes.submitBtn, 'W_btn_b_disable');
				return false;
			} else {
				//$.core.dom.removeClassName(nodes.submitBtn, 'W_btn_b_disable');
				nodes.secodeTips.innerHTML = '';
				return secode;
			}
		},
		secodeReflush : function(){
			if(needSecode){
				nodes.secodeArea.style.display = '';
				nodes.secodeImg.src = secodeImhUrl + "&ts="  + new Date().getTime();
				nodes.secodeTips.innerHTML = TEMP.SECODE.DEFAULT;
				nodes.secode.value = '';
				nodes.secode.focus();
				//$.core.dom.addClassName(nodes.submitBtn, 'W_btn_b_disable');
			} else {
				nodes.secodeArea.style.display = 'none';
			}
		},
		/**
		 * 刷新选择数列表
		 */
		flushNum : function(num){
			nodes.num.innerHTML = '';
			var option;
			
			option = $.C('option');
			option.value = '1';
			option.innerHTML = '单选';
			nodes.num.appendChild(option);
			
			if(num >= 2){
				for(var i=2;i<=num;i++){
					option = $.C('option');
					option.value = i;
					option.innerHTML = '最多选 ' + i + ' 项';
					nodes.num.appendChild(option);
				}
			}
		},
		/**
		 * 显示高级设置
		 */
		showAdvanced : function(){
			nodes.advancedBtn.className = 'W_moreup';
			nodes.advanced.style.display = '';
			advanced_shown = true;
		},
		/**
		 * 隐藏高级设置
		 */
		hideAdvanced : function(){
			nodes.advancedBtn.className = 'W_moredown';
			nodes.advanced.style.display = 'none';
			vote.hideCalendar();
			advanced_shown = false;
		},
		/**
		 * 高级设置切换显示
		 */
		toggleAdvanced : function(){
			if(advanced_shown){
				vote.hideAdvanced();
			} else {
				vote.showAdvanced();
			}
		},
		/**
		 * 显示时间选择器
		 */
		showCalendar : function(){
			new $.common.feed.groupAndSearch.include.calendar(nodes.date_select.value, {
				source : nodes.date_select,
				start  : deadline.startDate,
				end    : deadline.endDate,
				currentDate : deadline.currentDate,
				hidePastMonth : true
			});
		},
		hideCalendar : function(){
			var calendar = $.sizzle('[node-type="calendar"]', document.body);
			if(calendar && calendar[0]){
				calendar[0].style.display = 'none';
			}
		},
		/**
		 * 存储最后选择的日期
		 */
		lastDeadline : function(){
			if(lastDeadline != nodes.deadline.value && nodes.deadline.value != 'modify'){
				lastDeadline = nodes.deadline.value;
			}
		},
		/**
		 * 显示自定义时间区域
		 */
		showDeadline : function(){
			
			deadline.startDate = dateFormat();
			deadline.endDate = dateFormat( (Math.round(+new Date()/1000) + (options.maintain * 86400)) * 1000);
 			
			switch(lastDeadline){
				case '1 week':
					deadline.currentDate = dateFormat( (Math.round(+new Date()/1000) + (7 * 86400)) * 1000);
					break;
				case '1 month':
					deadline.currentDate = dateFormat( (Math.round(+new Date()/1000) + (30 * 86400)) * 1000);
					break;
				case '.5 year':
					deadline.currentDate = dateFormat( (Math.round(+new Date()/1000) + (182 * 86400)) * 1000);
					break;
				case '1 year':
					deadline.currentDate = dateFormat( (Math.round(+new Date()/1000) + (365 * 86400)) * 1000);
					break;
				default:
					deadline.currentDate = dateFormat( (Math.round(+new Date()/1000) + (7 * 86400)) * 1000);
					break;	
			}
			
			nodes.date_select.value = deadline.currentDate;
			$.sizzle('[name=hours]', nodes.modify)[0].value = getDateDetail("H");
			$.sizzle('[name=minutes]', nodes.modify)[0].value = getDateDetail("I");
			
			nodes.modify.style.display = '';
		},
		/**
		 * 隐藏自定义日期
		 */
		hideDeadline : function(){
			nodes.modify.style.display = 'none';
		},
		/**
		 * 自定义日期切换
		 */
		toggleDeadline : function(){
			vote.lastDeadline();
			if(nodes.deadline.value == 'modify')
				vote.showDeadline();
			else
				vote.hideDeadline();
		},
		//重置结束时间
		resetDeadline : function(){
			vote.hideDeadline();
			lastDeadline = '1 week';
			nodes.deadline.value = $.sizzle('option', nodes.deadline)[0].value;
		},
		/**
		 * 展开备注
		 */
		showInfo : function(){
			nodes.info.style.height = '100px';
			infoFocus = true;
		},
		/**
		 * 收起备注
		 */
		hideInfo : function(){
			nodes.info.value = $.core.str.trim(nodes.info.value);
			if(nodes.info.value == ''){
				nodes.info.style.height = '';
			}
		},
		/**
		 * title，投票名称
		 * pid（预留），
		 * info（投票描述），
		 * vote_result 投票类型，1 任何人可见 0 投票后可见 
		 * num ，是否单选，0是当选，其他是多选
		 * date 投票结束日期
		 * hh 投票结束小时
		 * mm 投票结束分钟
		 * items 投票选项，用逗号分隔
		 */
		getFormData : function(){
			
			var returns = true; //检验用
			
			var Data = vote.getDeadline();
			
			var title = vote.getTitle();
			if(!title){
				nodes.titleTips.innerHTML = TEMP.TITLE.EMPTY;
				if(returns){
					$.core.util.scrollTo(nodes.titleTips,{step:10});
					nodes.title.focus();
					$.common.extra.shine(nodes.title);
				}
				returns &= false;
			}
			
			var items = vote.getItemsFormData();
			if(!items){
				nodes.itemsTips.innerHTML = TEMP.ITEMS.LESS;
				if(returns){
					$.core.util.scrollTo(nodes.titleTips,{step:10});
				}
				returns &= false;
			}
			
			if(needSecode){
				var secode = vote.getSecode();
				if(!secode){
					nodes.secodeTips.innerHTML = TEMP.SECODE.EMPTY;
					if(returns){
						nodes.secode.focus();
						$.common.extra.shine(nodes.secode);
					}
					returns &= false;
				}
				Data.secode = secode;
			}
			
			if(!returns) return;
			
			Data.title = title;
			Data.items = items;
			Data.vote_result = vote.getVoteResult();
			Data.num = nodes.num.value;
			Data.pid = pictureArea.getPid();
			Data.info = $.core.str.trim(nodes.info.value);
			Data.poll_category = poll_category;
			
			return Data;
		},
		/**
		 * 提交
		 */
		submit : function(){
			
			if(onSubmit) return;
			onSubmit = true;
			
			formData = vote.getFormData();
			if(!formData){
				onSubmit = false;
				return;
			}
			
			nodes.submitTips.innerHTML = TEMP.SUBMIT.ING;
			$.common.trans.vote.getTrans("add", {
				'onComplete'  : vote.handle
			}).request(formData);
		},
		/**
		 * 提交返回
		 */
		handle : function(ret){
			nodes.submitTips.innerHTML = '';
			if(ret.code == '100000'){
				msgTip = $.ui.tipAlert({msg:TEMP.SUBMIT.SUCCESS});
				msgTip.setLayerXY(nodes.submitBtn);
				msgTip.aniShow();
				window.setTimeout(function(){
					msgTip.anihide();
					msgTip = null;
					$.custEvent.fire(that, 'insert', $T(TEMP.EDITOR, {TITLE : formData.title, SHORTURL : ret.data.short_url}));
					onSubmit = false;
				}, 1200);
			} else {
				if(ret.code == '100024') { //需要验证码
					needSecode = true;
					secodeImhUrl = ret.data.url;
					onSubmit = false;
				} else if(ret.code == '100025') { //验证码输入错误
					nodes.secodeTips.innerHTML = TEMP.SECODE.ERROR;
					$.common.extra.shine(nodes.secode);
					onSubmit = false;
				} else if(ret.code == '100026') { //反垃圾系统返回的错误提示
					needSecode = false;
					msgTip = $.ui.tipAlert({msg:ret.msg + '&nbsp;'});
					msgTip.setLayerXY(nodes.submitBtn);
					msgTip.aniShow();
					window.setTimeout(function(){
						msgTip.anihide();
						msgTip = null;
						onSubmit = false;
					}, 3000);
				} else if(ret.code == '100030'){
					nodes.itemsTips.innerHTML = $T(TEMP.SUBMIT.ERROR, {MESSAGE : ret.msg});
					onSubmit = false;
				} else {
					nodes.submitTips.innerHTML = $T(TEMP.SUBMIT.ERROR, {MESSAGE : ret.msg});
					onSubmit = false;
				}
				vote.secodeReflush(); //验证码刷新
			}
		}
	}

	vote.normal = (function(){
		return function(){
			poll_category = 0;
			var that = {
				addItems : function(num){
					if(options.itemMax <= itemCount + num){
						num = options.itemMax - itemCount;
					}
					if(num > 0){
						for(var i = 0; i < num; i++){
							nodes.items.appendChild(
								$.core.dom.builder($T(TEMP.ITEM, {NUMBER: itemCount++ + 1 + "."})).box.firstChild
							);
							//$.addEvent($.sizzle('input', nTmp)[0], "blur", vote.getItems);
						}
						setTimeout(function(){
							$.sizzle('input', nodes.items).pop().focus();
						}, 0);
					}
				},
				removeItem : function(currentEl){
					$.core.dom.removeNode( currentEl.parentNode );
					itemCount--;
				},
				getItemsData : function(){
					var data = [];
					var items = $.sizzle('input[action-type="item"]', nodes.items);
					var value;
					for(var i in items){
						value = items[i].value;
						!!value && data.push(value)
					}
					return data;
				},
				getItemsFormData : function(){
					var data = that.getItemsData();
					if(data.length >= options.itemMinActive){
						return data.join(',');
					}
					return '';
				},
				destroy : function(){
					
				}
			};
			
			return that;
		}
	})();
	
	vote.picture = (function(){
		return function(){
			poll_category = 1;
			var uploading = 0;
			var that = {
				addItems : function(num){
					if(options.itemMax <= itemCount + num){
						num = options.itemMax - itemCount;
					}
					if(num > 0){
						var el, box, dom;
						for(var i = 0; i < num; i++){
							el = $.core.dom.builder($T(TEMP.ITEM_PIC, {NUMBER: itemCount++ + 1 + "."}));
							box = el.box.firstChild;
							dom = $.kit.dom.parseDOM(el.list);
							nodes.items.appendChild(box);
							$.module.uploadPic(box, {
								start : (function(o){
									return function(){
										o.pic.setAttribute('last', o.pic.getAttribute('src'));
										o.pic.setAttribute('src', TEMP.ITEM_PIC_UPLOADING);
										$.setStyle(o.ruTips, 'visibility', 'hidden');
										uploading ++;
										//that.canBeClose();
									}
								})(dom),
								err : null,
								complete : (function(o){
									return function(opts){
										if(opts["pid"]){
											o.pic.setAttribute('src', $.common.extra.imageURL(opts.pid, {size:'square'}));
											o.pic.setAttribute('pid', opts.pid);
											o.tips.innerHTML = '';
										} else if (opts["ret"] && opts["ret"] < 0) {
											o.pic.setAttribute('src', o.pic.getAttribute('last'));
											if(opts.ret == "-4" || opts.ret == "-9" || opts.ret == "-10")
												o.tips.innerHTML = TEMP.PICTUREUPLOAD.ERRORSIZE;
											else
												o.tips.innerHTML = $.common.extra.imgUploadCode(opts.ret);
										}
										$.setStyle(o.ruTips, 'visibility', 'visible');
										uploading --;
										//that.canBeClose();
									}
								})(dom)
							});
						}
						setTimeout(function(){
							$.sizzle('input', nodes.items).pop().focus();
						}, 0);
					}
				},
				removeItem : function(currentEl){
					//if(uploading > 0 ) return;
					var el = $.kit.dom.parentElementBy(currentEl, nodes.items, function(e){
						if(e.nodeName.toLowerCase() == 'dd') return true;
					});
					$.core.dom.removeNode( el );
					itemCount--;
				},
				getItemsData : function(){
					var data = [];
					var items = $.sizzle('.option_pic', nodes.items);
					var content, pid, itemContent;
					for(var i in items){
						itemContent = {};
						pid = $.sizzle('img[node-type="pic"]', items[i])[0].getAttribute("pid");
						content = $.sizzle('input[action-type="item"]', items[i])[0].value;
						pid && (itemContent["pid"] = pid);
						content && (itemContent["content"] = content);
						(pid || content) && (data = data.concat([itemContent]));
					}
					return data;
				},
				getItemsFormData : function(){
					var data = that.getItemsData();
					if(data.length >= options.itemMinActive){
						return $.core.json.jsonToStr(data);
					}
					return '';
				},
				canBeClose : function(){
					if(uploading > 0){
						bub.stopBoxClose();
					} else {
						bub.startBoxClose();
					}
				},
				destroy : function(){
					
				}
			};
			
			return that;
		}
	})();
	
	
	/**
	 * 图片部分
	 */
	pictureArea = {
		img : {},
		pictureInUploading : false,
		init : function(){
			var _tp = $.sizzle("p", nodes.pictureArea);
			nodes.pictureAreaItems = {
				upload     : _tp[0],
				uploading  : _tp[1],
				uploadfail : _tp[2],
				uploaded   : _tp[3]
			}
			pictureArea.bind();
		},
		enable : function(){
			pictureArea.show.upload();
			nodes.pictureArea.style.display = '';
		},
		disable : function(){
			nodes.pictureArea.style.display = 'none';
			pictureArea.stopUpload();
			pictureArea.hideAll();
		},
		hideAll : function(){
			for(var index in nodes.pictureAreaItems){
				nodes.pictureAreaItems[index].style.display = 'none';
			}
		},
		show : {
			upload : function(){
				pictureArea.img = {};
				pictureArea.hideAll();
				nodes.pictureAreaItems.upload.style.display = '';
			},
			uploading : function(){
				pictureArea.hideAll();
				nodes.pictureAreaItems.uploading.style.display = '';
			},
			uploadfail : function(){
				pictureArea.hideAll();
				nodes.pictureAreaItems.upload.style.display = '';
				nodes.pictureAreaItems.uploadfail.style.display = '';
			},
			uploaded : function(){
				pictureArea.hideAll();
				nodes.pictureAreaItems.uploaded.style.display = '';
			}
		},
		startUpload : function(){
			pictureArea.pictureInUploading = true;
			bub.stopBoxClose();
			pictureArea.show.uploading();
		},
		upload : function() {
			
			if(pictureArea.pictureInUploading) return;
			pictureArea.img.name = $.core.str.trim($.sizzle("input", nodes.fileBtn)[0].value);
			if (pictureArea.img.name === '') return;
			
			var imgNamePath = pictureArea.img.name.split('\\');
			if(imgNamePath.length > 1){
				pictureArea.img.name = imgNamePath[imgNamePath.length - 1];
			}
			imgNamePath = null;
			
			pictureArea.startUpload();
			$.core.io.ijax({
				'url' : 'http://picupload.service.weibo.com/interface/pic_upload.php',
				'form' : $.E('vote_picture_upload'),
				'abaurl' : 'http://' + document.domain + '/aj/static/upimgback.html',
				'abakey' : 'cb',
				'onComplete' : pictureArea.uploadHandle,
				'onTimeout' : pictureArea.uploadHandle,
				'args' : {
					'marks' : 1,
					'app' : 'miniblog',
					's' : 'rdxt',
					'nick' : '@' + $CONFIG['nick'],
					'logo' : 1,
					'url' : "vote.weibo.com"
				}
			});
		},
		uploadHandle : function(opts){
			if(opts && opts['ret'] && opts['ret'] >= 0){
				pictureArea.uploadSuccess(opts);
			} else {
				if(opts && opts['ret'] && opts["ret"] < 0 ){
					if(opts.ret == "-4" || opts.ret == "-9" || opts.ret == "-10")
						nodes.updateImageTips.innerHTML = TEMP.PICTUREUPLOAD.ERRORSIZE;
					else
						nodes.updateImageTips.innerHTML = $.common.extra.imgUploadCode(opts.ret);
				}
				pictureArea.uploadFailed();
			}
		},
		stopUpload : function(){
			bub.startBoxClose();
			$.removeEvent($.sizzle("input", nodes.fileBtn)[0], 'change', pictureArea.upload);
			nodes.fileBtn.innerHTML = '';
			setTimeout(function(){
				nodes.fileBtn.innerHTML = TEMP.ADVANCED.PICUPLOADINPUT;
				$.addEvent($.sizzle("input", nodes.fileBtn)[0], 'change', pictureArea.upload);
				pictureArea.pictureInUploading = false;
			}, 0);
		},
		uploadFailed : function(){
			pictureArea.stopUpload();
			pictureArea.show.uploadfail();
		},
		uploadSuccess : function(opts){
			pictureArea.stopUpload();
			pictureArea.img.pid = opts.pid;
			pictureArea.img.url = $.common.extra.imageURL(pictureArea.img.pid);
			var imgName = pictureArea.img.name.split(".");
			var extName = imgName.pop();
			imgName = $.core.str.leftB(imgName.join("."), 20) + '....' + extName;
			nodes.picturePreview.innerHTML = imgName;
			pictureArea.show.uploaded();
		},
		getPid : function(){
			return pictureArea.img['pid'] ? pictureArea.img['pid'] : '';
		},
		viewThumbnail : function(evt){
			if(!pictureThumbnail){
				pictureThumbnail = $.module.layer(TEMP.ADVANCED.PICUPLOADTHUMBFRAME);
				nodes.vote.appendChild(pictureThumbnail.getOuter());
			}
			var outer = pictureThumbnail.getOuter();
			
			var position = $.core.dom.position(nodes.picturePreview);
			var size = $.core.dom.getSize(nodes.picturePreview);

			$.core.dom.setXY(outer, {
				t : position.t + size.height + 3,
				l : position.l - 5
			});
			
			pictureThumbnail.html($T(TEMP.ADVANCED.PICUPLOADTHUMBNAIL, {URL:pictureArea.img.url}));
			pictureThumbnail.show();
		},
		closeThumbnail : function(){
			pictureThumbnail.hide();
		},
		bind : function(){
			dEvt.pictureUploadfail = $.core.evt.delegatedEvent(nodes.pictureArea);
			dEvt.pictureUploadfail.add('cancel', 'click', function(){
				pictureArea.stopUpload();
				pictureArea.show.upload();
			});
			dEvt.pictureUploadfail.add('picuploadinput', 'click', function(){
				nodes.pictureAreaItems.uploadfail.style.display = "none";
			});
			$.addEvent($.sizzle("input", nodes.fileBtn)[0], 'change', pictureArea.upload);
			$.addEvent(nodes.picturePreview, 'mouseover', pictureArea.viewThumbnail);
			$.addEvent(nodes.picturePreview, 'mouseout', pictureArea.closeThumbnail);
		}
	}
	
	var destroy = function(){
		vote.stopLsn();
		that = null;
		vote = null;
		pictureArea = null;
	}
		
	var bind = function(){
		$.custEvent.define(that, 'hide');
		$.custEvent.add(that, 'hide', vote.hide);
		
		$.custEvent.add(bub, 'hide', function(){
			nodes["calendar"] && $.setStyle(nodes.calendar, 'display', 'none');
			$.custEvent.remove(bub, 'hide', arguments.callee);
			custEvt.destroy();
		});
	}
	
	that.destroy = destroy;
	
	return function(node, opts){
		
		var init = function(){
			outer = node;
			options = $.parseParam(options, opts);
			nodes = $.kit.dom.parseDOM($.core.dom.builder($L(TEMP.FRAME)).list);
			bub = $.ui.bubble();
			!isShown && bind();
			vote.init();
			vote.changeTab('normal');
			bub.setContent(nodes.vote);
			bub.setLayout(node, {'offsetX':-29, 'offsetY':5});
			bub.show();
			
			isShown = true;
		}
		
		init();
		
		that.layer = bub;		
		return that;
	}
});
