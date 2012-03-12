$Import('module.at');
/**
 * common.editor.plugin.at
 * @id STK.common.editor.plugin.at
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
*/
$Import('common.trans.global');
$Import('module.suggest');
$Import('kit.extra.textareaUtils');
$Import('common.channel.at');

STK.register('common.editor.plugin.at', function($){

	var TEMPLATE = ''+
	'<div style="" class="layer_menu_list">'+
		'<ul node-type="suggestWrap">'+
	// '<li class="title">想用@提到谁？</li>'+
		'</ul>'+
	'</div>';

	var items = {
		'@' : '<#et temp data>' +

				'<li class="suggest_title">想用@提到谁？</li>' +
				'<#list data as list>' +
				'<li action-type="item" ' +
				'<#if (list_index == 0)>' +
				'class="cur" ' +
				'</#if>' +
				'action-data="value=${list.screen_name}" value="${list.screen_name}"><a href="#">${list.screen_name}<#if (list.remark)>(${list.remark})</#if></a></li>' +
				'<#if (list.count)>' +
				'<span>${list.count}</span>' +
				'</#if>' +
				'</#list>' +
				'</#et>',
		'#':'<#et temp data>' +

				'<li class="suggest_title">想用什么话题？</li>' +
				'<#list data as list>' +
				'<li action-type="item" ' +
				'<#if (list_index == 0)>' +
				'class="cur" ' +
				'</#if>' +
				'action-data="value=${list.topic}" value="${list.topic}"><a href="#">${list.topic}<#if (list.count)>(${list.count})</#if></a></li>' +
				'</#list>' +
				'</#et>'};


	var suggest,at,nodeList,suggestWrap,sugg,key,suggFlag=false,textarea;
	var list;
	var transArray = {
		'@' : "followList",
		"#" : "topicList"
	};
	var oldIndex = 0;
	var textElBlur = function(){
		//$.log('blur');
		setTimeout(function(){
			$.custEvent.fire(suggest, 'close');
		},200);

	};
	var onClose = function(){
		//$.log('suggest close, suggest destroy');
		sugg.style.display = "none";
		//$.core.dom.removeNode(sugg);
		//$.custEvent.remove(suggest);
		//suggFlag = false;
		//suggest = null;
	};
	var bindSuggest = function(){
		//$.log('bindSuggest');
		$.custEvent.add(suggest, 'onIndexChange', function(event, index){
			//$.log('suggest indexChange '+index);
			setIndex(index);
		});
		//$.log('bind onSelect');
		$.custEvent.add(suggest, 'onSelect', function(event, index,textarea,flag){
			$.core.evt.stopEvent();
			//$.log('suggest onselect');
			var text = list[index].getAttribute('value');
			//$.log('insert textarea',textarea);
			text = text.replace(/\(.*\)/,""); //微号支持
			try {
				textarea.focus();
			}catch(e){}
			var cur = $.kit.extra.textareaUtils.selectionStart(textarea)*1;
			var reg = new RegExp(flag+"([a-zA-Z0-9\u4e00-\u9fa5_]{0,20})$");
			var l = textarea.value.slice(0, cur).match(reg);
			var backWord =textarea.value.slice(cur,cur+1);
			l = (l && l[1])? l[1].length: 0;

			var utils = $.kit.extra.textareaUtils;
			if (flag == "#") {
				if (typeof backWord != "undefined" && backWord != flag) {
					text = text + flag + " ";
				}
			}
			else {
				text = text + ' ';
			}
			utils.insertText(textarea,text, cur, l);
			/*为了插入表情做准备，这个需要cursorPos一个range属性，线上bug，at完成之后，插入表情，位置错误*/
			var cursorPos = utils.getCursorPos(textarea);
			//需要合并#号，通过判断最后一个是否为#来判断。
			 if (flag == "#"  && backWord == flag)
			 {
				 utils.setCursor(textarea,cursorPos+1);
				 utils.insertText(textarea," ", cursorPos+1, 0);
			 }
			cursorPos = utils.getCursorPos(textarea);
			var selValue = utils.getSelectedText(textarea);
			var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
			textarea.setAttribute('range',cursorPos + '&' + slen);
			/*表情准备结束*/
			$.custEvent.fire(suggest, 'close');
		});
		$.addEvent(nodeList.textEl,'blur',textElBlur);
		//$.log('bind onClose');
		$.custEvent.add(suggest, 'onClose',onClose);
		$.custEvent.add(suggest, 'onOpen', function(event, index){
			//$.log('editor.suggest open',suggest);
			suggestWrap.style.display = "";
			sugg.style.display = "";
			suggFlag = true;
			setTimeout(function(){$.custEvent.fire(suggest,'indexChange',0);},100);

			//$.custEvent.fire(suggest, 'onIndexChange',1);
		});
		//bindSuggest = function(){};

	};
	var bind = function(){
		$.core.evt.custEvent.add(at, 'hidden', function(type,data){
			//$.log('at hidden');
			//$.core.dom.setStyle(sugg,'display','none');
			$.custEvent.fire(suggest, 'close');
		});

		$.core.evt.custEvent.add(at, 'at', function(type,data){
			//$.log('at start',data.textarea);
			//document.body.appendChild(sugg);
			key = data.key;
			if(key.length==0){
				$.custEvent.fire(suggest, 'close');
				return;
			}
			//$.log('at at suggest=',suggFlag);
			 var flag = data.flag;
			var t = $.common.trans.global.getTrans(transArray[flag],{
				'onSuccess' : function(ret, params){
					var _html = $.core.util.easyTemplate(items[flag],ret.data);
					$.custEvent.fire(suggest, 'openSetFlag',flag);
					$.custEvent.fire(suggest, 'open',data.textarea);

					var _node = $.core.dom.builder(_html);
					var layerFragment = _node.box;
					
					suggestWrap.innerHTML = layerFragment;
					//$.log(data);
					sugg.style.cssText = ['z-index:11001;background-color:#ffffff;position:absolute;'].join('');
					$.common.channel.at.fire("open");
					$.kit.dom.layoutPos(sugg, data.textarea, {
						'pos' : 'left-top',
						'offsetX' : data.l,
						'offsetY' : data.t
					});
				},
				'onError' : function(){
					$.custEvent.fire(suggest, 'close');
				}
			}).request({q:key});

		});
	};
	var rend= function(){
		textarea = nodeList.textEl;
		//$.log('rend ',textarea);
		at = STK.module.at({'textEl':textarea,'flag':'@|#'});

	};
	var init = function(textEl){
		//$.log('init');
		sugg = STK.C('div');
		document.body.appendChild(sugg);
		//$.core.util.hideContainer.appendChild(sugg);

		//$.log(sugg.innerHTML.length);
		if(sugg.innerHTML.length == 0){
			sugg.innerHTML = TEMPLATE;
			suggestWrap = $.core.dom.sizzle('[node-type="suggestWrap"]',sugg)[0];
			sugg.style.display = "none";
		}
		//suggest=null;
		suggest = $.module.suggest({
			'textNode': textEl,
			'uiNode'  : suggestWrap,
			'actionType' : 'item',
			'actionData' : 'value',
			//表明是@还是话题的标记，默认为@，不影响线上的功能。
			'flag' :'@'
		});
		bindSuggest();
	};
	var setIndex = function(index){
		list = $.sizzle("li[class!=suggest_title]",suggestWrap);

		$.core.dom.removeClassName(list[oldIndex],'cur');
		$.core.dom.addClassName(list[index],'cur');
		oldIndex = index;
	};



	return function(editor,options){
		nodeList = editor.nodeList;
		//$.log('textarea',nodeList.textEl);
		var that={};
		that.init = function(){
			rend();
			init(nodeList.textEl);
			bind();
		};
		return that;

	};
});


