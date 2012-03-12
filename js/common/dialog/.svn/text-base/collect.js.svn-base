/**
 * @author xp | xiongping1@staff.sina.com.cn
 * 微博采集弹层
 */
$Import("kit.extra.language");
$Import("ui.dialog");
$Import("common.trans.chosen");
$Import("kit.dom.parseDOM");
$Import("ui.litePrompt");
$Import("common.editor.base");
$Import("kit.dom.autoHeightTextArea");
$Import("kit.extra.count");
$Import("common.chosen.record");

STK.register("common.dialog.collect",function($){
	var lang = $.kit.extra.language;
	
	var trans = $.common.trans.chosen;
	var delegate = $.core.evt.delegatedEvent;
	var template = {
		'container' : lang('<div class="layer_collect">'
				+'<p class="tit W_textb" node-type="jxTip">#L{选择一个精选集}</p>'
				+'<div class="collect_kind" node-type="jxBox">'
					+'#L{加载中}...'
				+'</div>'
				+'<div class="add_group" node-type="createBox"></div>'
				+'<div class="collect_reason clearfix" node-type="reason" style="display:none">'
					+'<div style="display:none"><div node-type="num"></div></div>'
					+'<textarea class="reason W_input" node-type="textEl"></textarea>'
					+'<div node-type="widget" style="display:none"></div>'
					+'<div class="text_r clearfix">'
					  +'<div class="see_hot" node-type="showRecord" style="display:none"><a title="#L{查看热门采集记录}" href="javascript:;">#L{查看热门采集记录}</a>'
						+'<a class="W_Titarr_on" href="javascript:void(0);" node-type="recordArrow"></a>'
					  +'</div>'
					  +'<label for="syn"><input type="checkbox" id="syn" checked="checked" node-type="syn" class="W_checkbox">#L{同步到微博}</label>'
					  +'<a href="javascript:;" node-type="submit" class="W_btn_a_disable btn_noloading"><span><b class="loading"></b><em>#L{确定}</em></span></a>'
					+'</div>'
				 +'</div>'
				 +'<div class="comment_lists" node-type="recordList" style="display:none"></div>'
			  +'</div>'),
		'create' : lang('<#et cateList data>'
					+'<input type="text" node-type="jxName" name="jxName" class="W_input" value="#L{输入精选集名字}"><a class="W_moredown" href="javascript:;" action-type="toggleCate" node-type="toggleCate">#L{选择分类}<span class="more"></span></a><a class="W_btn_a_disable" href="javascript:;" node-type="createJx" action-type="create"><span>#L{创建}</span></a><a href="javascript:;" action-type="cancelCreate">#L{取消}</a>'
					+'<div class="comment" node-type="cate" style="display:none">'
						+'<div class="collect_arrow"><em class="W_arrline">◆</em><span>◆</span></div>'
						+'<p>'
							+'<#list data as list>'
							+'<#if (list_index != 0)>'
							+'<em>|</em>'
							+'</#if>'
							+'<a href="javascript:;" action-type="selCate" action-data="id=${list.id}"><span>${list.name}</span></a>'
							+'</#list>'
						+'</p>'
					 +'</div>'
					 +'</#et>'),
		'createBtn' : lang('<a href="javascript:;" action-type="showCreate"><img width="11" height="11" src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif" class="iconadd" title="#L{创建分组}">#L{创建精选集}</a>'),
		'jxTemp' : '<#et collect data>'
					+'<#list data as list>'
					+'<a href="javascript:;" action-type="selJx" action-data="jid=${list.jid}"><span>${list.jname}</span></a>'
					+'</#list>'
	 			+'</#et>'
	};
	var options = {
		'title' : lang('#L{采集此微博到你的精选集}'),
		'showCreate' : false,    //需要显示创建精选集
		'mid' : '',
		'success' : $.core.func.empty,
		'failed' : $.core.func.empty,
		'collected' : false,    //是否已经被采集
		'showRecord' : false,  //是否显示采集记录
		'category' : $CONFIG['category']
	};
	
	var MSG = {
		'createTip' : lang('#L{输入精选集名字}'),
		'collectTip' : lang('#L{请输入你的采集理由（选填）}'),
		'emptyTip' : lang('#L{采集理由不能为空}'),
		'collected' : lang('#L{该微博已经被采集}'),
		'noJxJ' : lang('#L{先创建精选集，例如“我爱旅行”，就可以采集相关微博到精选集中啦~}')
	};
	
	var editorOpt = {
		'limitNum' : 100
		,'tipText' : MSG['collectTip']
		//,'count' : false
	};
	
	MSG.overTip = lang('#L{采集理由不能超过}') + editorOpt.limitNum + lang('#L{个字}');
	
	var cache = null;
	var cate;// = $CONFIG['category']  //官方微博精选的分类
	
	return function(spec){
		var opts,dialog,builder,nodes,editor,record;
		opts = $.parseParam(options,spec);
		cate = opts.category;
		dialog = $.ui.dialog();
		dialog.setTitle(opts.title);
		builder = $.core.dom.builder(template['container']);
		nodes = $.kit.dom.parseDOM(builder.list);
		dialog.appendChild(builder.box);
		//当前选择了的精选集
		var selectedJx = null;
		var selectedJxName = null;
		//当前选择了的分类
		var selectedCate = null;
		//判断是否符合创建条件的定时
		var checkTimer = null;
		//颜色改变的定时器
		var colorChangeTimer = null;
		//精选集最大名称长度
		var maxLen = 20;
		//创建精选集的锁
		var createLock = false;
		//采集锁
		var collectLock = false;
		var eventFuns = {
			//获取精选集的数据
			'getJx' : function(oNode){
				trans.getTrans('getJxList',{
					onSuccess : function(json){
						cache = json.data;
						eventFuns.initJxHTML(oNode);
					},
					onError : function(){},
					onFail : function(){}
				}).request();
			},
			//创建精选集列表的html
			'createJxHtml' : function(data){
				return $.core.util.easyTemplate(template['jxTemp'],data).toString();
			},
			//初始化采集区域的html代码
			'initJxHTML' : function(oNode){
				if(cache !== null){  //有缓存数据
					if (cache.length == 0) { //没有创建精选集
						oNode.innerHTML = MSG['noJxJ'];
						nodes.jxTip.style.display = 'none';
						bindDOMFuns.showCreate();
					} else {
						nodes.jxTip.style.display = '';
						oNode.innerHTML = eventFuns.createJxHtml(cache);
					}
					dialog.setMiddle();
				}else{
					eventFuns.getJx(oNode);
				}
			},
			//在层上方显示提示层
			'showTip' : function(msg,dia,type){
				$.ui.litePrompt(msg,{'timeout':2000,'type':type?type:'errorM','zIndex':dia?(parseInt(dia.getOuter().style.zIndex)+1):''})
			},
			//获取内容的长度
			'getValueLen' : function(str){
				var str = str.replace(MSG['collectTip'],'');
				return $.kit.extra.count(str);
			}
		};
		var bindDOMFuns = {
			//显示精选集创建节点
			'showCreate' : function(){
				selectedCate = null;
				var initFace = function(){
					var cateStr = $.core.util.easyTemplate(template['create'],cate).toString();
					nodes.createBox.innerHTML = cateStr;
					//事件绑定
					var input = $.sizzle('[node-type="jxName"]',nodes.createBox)[0];
					var createJx = $.sizzle('[node-type="createJx"]', nodes.createBox)[0];
					$.addEvent(input,'focus',function(){
						if(!checkTimer){
							checkTimer = setInterval(bindDOMFuns.checkCreate,200)
						}
						if(input.value == MSG['createTip']){
							input.value = '';
						}
					});
					$.addEvent(input,'blur',function(){
						if(checkTimer){
							clearInterval(checkTimer);
							checkTimer = null;
						}
						if(input.value == ''){
							input.value = MSG['createTip'];
						}
					});
					$.addEvent(input,'keyup',function(){
						var val = $.trim(input.value)
						if($.bLength(val)>maxLen){
							input.value = $.leftB(val,maxLen);
						}
					})
					$.addEvent(createJx,'click', bindDOMFuns.createJx);
					input.focus();
				}
				if(!cate){
					trans.getTrans('getCate' , {
						'onSuccess' : function(json){
							cate = json.data;
							initFace();
						},
						'onError' : function(json){
							eventFuns.showTip(json.msg,dialog)
						},
						'onFail' : function(){
							eventFuns.showTip(lang('#L{系统繁忙，请稍后再试}'),dialog)
						}
					}).request();
				}else{
					initFace();
				}
			},
			//隐藏精选集创建节点
			'cancelCreate' : function(){
				nodes.createBox.innerHTML = template['createBtn'];
			},
			//显示或隐藏官方分类
			'toggleCate' : function(){
				var cateDiv = $.sizzle('div[node-type="cate"]', nodes.createBox)[0];
				cateDiv.style.display = cateDiv.style.display=='none'?'':'none'
			},
			//选择精选集
			'selJx' : function(spec){
				var list = nodes.jxBox.getElementsByTagName('A');
				bindDOMFuns.selectOne(list,spec.el,spec.data.jid,'jx');
				bindDOMFuns.checkCJ();
			},
			//选择分类
			'selCate' : function(spec){
				var cateDiv = $.sizzle('div[node-type="cate"]', nodes.createBox)[0];
				var list = cateDiv.getElementsByTagName('A');
				bindDOMFuns.selectOne(list,spec.el,spec.data.id);
				bindDOMFuns.checkCreate();
			},
			//判断是否符合创建微精选的条件
			'checkCreate' : function(){
				var createInput = $.sizzle('[node-type="jxName"]',nodes.createBox)[0];
				var createBtn = $.sizzle('[node-type="createJx"]', nodes.createBox)[0];
				var jxName = $.core.str.trim(createInput.value)
				jxName = jxName == MSG['createTip']?'':jxName
				if(!selectedCate || jxName == ''){
					createBtn.className = 'W_btn_a_disable';
					if(jxName == ''){
						return lang('#L{精选集名称不能为空噢~}');
					}else{
						return lang('#L{为你创建的精选集选择一个分类吧~}');
					}
				}
				if($.bLength(jxName)>maxLen){
					createBtn.className = 'W_btn_a_disable';
					return lang('#L{精选集名称不能超过}' + maxLen + '#L{个字符}')
				}
				createBtn.className = 'W_btn_b';
				return {
					'jname' : jxName,
					'class_id' : selectedCate
				};
			},
			//判断是否符合采集条件
			'checkCJ' : function(){
				nodes.submit.className = 'W_btn_a_disable btn_noloading';
				if(!selectedJx){  //没有选择精选集
					return lang('#L{未选择精选集}');
				}
				var words = editor.API.getWords();
				var len = eventFuns.getValueLen(words);
				if(len > editorOpt.limitNum){
					return MSG['overTip'];
				}/*else if(len == 0){
					return MSG['emptyTip'];
				}*/
				nodes.submit.className = 'W_btn_b btn_noloading';
				return {
					'mid' : opts.mid,
					'jid' : selectedJx,
					'reason' : words == MSG['collectTip'] ? '' : words
				}
			},
			//在某个列表下选择某个值
			'selectOne' : function(list,el,id,type){
				var oneName = el.innerHTML.replace(/<(.[^>]*)>/gi,'')
				for(var i=0;i<list.length;i++){
					if(list[i] == el){ //当前选择项
						el.className = 'cur';
						if (type == "jx") {
							selectedJx = id;
							selectedJxName = oneName;
							nodes.jxTip.innerHTML = lang('#L{采集到}“<a href="http://jx.weibo.com/single?jid='+id+'" target="_blank">'+oneName+lang('</a>”#L{精选集}'));
							bindDOMFuns.checkCJ();
							if(nodes.reason.style.display == 'none'){
								nodes.reason.style.display = '';
								//editor.API.focus();
							}
							//nodes.jxTip.style.color = "#F00";
							/*colorChangeTimer && clearTimeout(colorChangeTimer);
							colorChangeTimer = setTimeout(function(){
								nodes.jxTip.getElementsByTagName('A')[0].removeAttribute('style');
							}, 1000)*/
						} else {
							selectedCate = id;
							var toggleCate = $.sizzle('[node-type="toggleCate"]',nodes.createBox)[0];
							toggleCate.innerHTML = oneName + '<span class="more"></span>';
							
						}
					}else{
						list[i].className = '';
					}
				}
			},
			//创建精选集
			'createJx' : function(){
				if(createLock){
					return;
				}
				var checkResult = bindDOMFuns.checkCreate()
				if(typeof checkResult === "string"){  //不符合创建条件
					eventFuns.showTip(checkResult,dialog)
					return;
				}
				createLock = true
				trans.getTrans('createJx',{
					'onSuccess' : function(json){
						createLock = false;
						var str = '<a href="javascript:;" action-type="selJx" action-data="jid='+json.data.jid+'"><span>'+checkResult.jname+'</span></a>';
						if(nodes.jxTip.style.display == 'none'){
							nodes.jxTip.style.display = ''
						}
						(!nodes.jxBox.getElementsByTagName('A').length) && (nodes.jxBox.innerHTML = '');
						$.core.dom.insertHTML(nodes.jxBox,str);
						cache.push({
							'jid' : json.data.jid,
							'jname' : checkResult.jname
						});
						var list = nodes.jxBox.getElementsByTagName('A');
						bindDOMFuns.selectOne(list,list[list.length-1],json.data.jid,'jx');
						bindDOMFuns.cancelCreate();
						dialog.setMiddle();
					},
					'onError' : function(json){
						createLock = false;
						eventFuns.showTip(json.msg,dialog);
					},
					'onFail' : function(){
						createLock = false;
						eventFuns.showTip(lang('#L{系统错误，请稍后重试}'),dialog);
					}
				}).request(checkResult);
			},
			//确认采集
			'submit' : function(){
				if(collectLock){
					return;
				}
				var checkResult = bindDOMFuns.checkCJ()
				if(typeof checkResult === "string"){  //不符合创建条件
					eventFuns.showTip(checkResult,dialog)
					return;
				}
				collectLock = true;
				if(nodes.syn.checked){  //需要同步
					checkResult.syn = 1;
				}
				trans.getTrans('collect',{
					'onSuccess' : function(json){
						collectLock = false;
						eventFuns.showTip(lang('#L{成功采集到“}') + selectedJxName + lang('#L{”精选集}'), dialog, 'succM');
						opts.success({
							msg : json.msg
						});
						dialog.hide();
					},
					'onError' : function(json){
						collectLock = false;
						eventFuns.showTip(json.msg,dialog);
						opts.failed({
							msg : json.msg
						});
					},
					'onFail' : function(json){
						collectLock = false;
						eventFuns.showTip(lang('#L{系统错误，请稍后重试}'),dialog);
					}
				}).request(checkResult);
			},
			//显示采集记录
			'showRecord' : function(){
				if(!record){
					record = $.common.chosen.record(opts.mid,{
						'container' : nodes.recordList,
						'newDia' : false
					})
				}
				if(nodes.recordList.style.display == 'none'){  //当前为关闭状态
					nodes.recordArrow.className = 'W_Titarr_off'
					record.show();
				}else{
					nodes.recordArrow.className = 'W_Titarr_on'
					record.hide();
				}
			}
		}
		var custEvtFuns = {
			publishBtn : function(evt,data){
				bindDOMFuns.checkCJ();
			}
		}
		
		var initFace = function(){
			if(opts.showCreate){ //需要显示创建精选集
				bindDOMFuns.showCreate();
			}else{
				bindDOMFuns.cancelCreate();
			}
			if(opts.showRecord){ //需要显示采集记录
				nodes.showRecord.style.display = '';
			}
			eventFuns.initJxHTML(nodes.jxBox);
			dialog.show().setMiddle();
		}
		
		var initPlugins = function(){
			editor = $.common.editor.base(nodes.reason,editorOpt);
			$.kit.dom.autoHeightTextArea({
				textArea : nodes.textEl,
				maxHeight : 999
			});
			$.core.evt.custEvent.define(editor,'textNum');
			$.core.evt.custEvent.add(editor,'textNum',custEvtFuns.publishBtn);
		}
		
		var bindDOM = function(){
			//创建区域的事件处理
			var createBoxDelegate = delegate(nodes.createBox);
			createBoxDelegate.add('showCreate','click',bindDOMFuns.showCreate);
			createBoxDelegate.add('cancelCreate','click',bindDOMFuns.cancelCreate);
			createBoxDelegate.add('toggleCate','click', bindDOMFuns.toggleCate);
			createBoxDelegate.add('selCate','click', bindDOMFuns.selCate);
			//精选集列表的事件处理
			var jxBoxDelegate = delegate(nodes.jxBox);
			jxBoxDelegate.add('selJx','click', bindDOMFuns.selJx);
			
			$.addEvent(nodes.submit,'click', bindDOMFuns.submit);
			$.addEvent(nodes.showRecord,'click', bindDOMFuns.showRecord);
		}
		var init = (function(){
			//if(opts.collected){  //已经采集
			//	eventFuns.showTip(MSG['collected']);
			//	return;
			//}
			initFace();
			initPlugins();
			bindDOM();
		})();
		
		return dialog;
	}
});
