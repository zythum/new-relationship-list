/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 求关注
 */
$Import('ui.alert');
$Import('ui.confirm');
$Import('ui.dialog');
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('kit.dom.smartInput');
$Import('common.trans.relation');
STK.register('common.dialog.inviteFollow', function($){
	var temp =
		'<#et begFollow data>'+
		'<div class="layer_invite_question" node-type="begFollowPanel">'+
			'<input type="hidden" name="fuid" value="${data.uid}">'+
			'<#if (data.questionList&&data.questionList.length)>'+
			'<div class="inqueBg">'+
				'<p class="question_title">#L{答对}&nbsp;${data.name}&nbsp;#L{的问题，即可发送邀请：}</p>'+
				'<dl class="clearfix">'+
					'<dt>#L{提问：}</dt>'+
					'<dd>'+
						'<select name="qid" class="htc_select" node-type="questionList">'+
							'<#list data.questionList as list>'+
							'<option value="${list.question}">${list.question_text}</option>'+
							'</#list>'+
						'</select>'+
					'</dd>'+
					'<dt><span class="W_spetxt">*</span>#L{回答：}</dt>'+
					'<dd class="form_table_single">'+
						'<input node-type="answer" type="text" value="#L{在这里填写答案}" class="W_input" name="answer">'+
						'<div class="M_notice_del" node-type="answer_error" style="display:none;"></div>'+
					'</dd>'+
				'</dl>'+
			'</div>'+
			'</#if>'+
			'<dl class="inqueBgNo clearfix">'+
				'<dt><span class="W_spetxt">*</span>#L{说点什么吧：}</dt>'+
				'<dd class="additional form_table_single"><textarea node-type="content" class="W_input" cols="" rows="" name="content">#L{介绍一下自己吧}</textarea>'+
					'<div class="M_notice_del" style="display:none;" node-type="content_error"></div>'+
				'</dd>'+
			'</dl>'+
			'<div class="btn"><a href="javascript:;" node-type="submit" class="W_btn_b"><span>#L{提交}</span></a><a node-type="cancel" href="javascript:;" class="W_btn_a"><span>#L{路过}</span></a></div>'+
		'</div>'+
		'</#et>';
	var $L			= $.kit.extra.language,
		msg			= {
			'answer': '#L{在这里填写答案}',
			'content': '#L{介绍一下自己吧}',
			'success': '#L{邀请发送成功！}',
			'ans_error': '#L{请输入答案哦。}',
			'con_error': '#L{请输入你想说的话。}'
		},
		errorTemp	= '<span class="icon_del"></span><span class="txt">{error}</span>';
	/**
	 * 
	 * @param {Object} spec { name, uid, questionList }
	 */
	return function(spec){
		var dialog, nodes;
		
		var showError = function(type, msg, code){
			var el = nodes[type+'_error'];
			if (el) {
				el.innerHTML = errorTemp.replace(/\{error\}/, msg);
				el.style.display = '';
			} else {
				if(code && code === "100060"){
                    msg &&
                    $.ui.confirm(msg, {
						icon:'warn',
                        OKText: $L("#L{立刻绑定}"),
                        OK: function(){
                        	window.location.href = "http://account.weibo.com/settings/mobile";
                        }
                    });
				}else{
					msg && $.ui.alert(msg);
				}
			}
		};
		
		var hideError = function(type){
			var el = nodes[type+'_error'];
			el.style.display = 'none';
		};
		
		var answerTrans = $.common.trans.relation.getTrans('answer', {
			'onSuccess': function(spec, parm){
				dialog.hide();
				$.ui.litePrompt($L(msg['success']),{'type':'succM','timeout':'500'});
			},
			'onError': function(spec, parm){
				var type = spec.data.key;
				showError(type, spec.msg, spec.code);
			}
		});
		
		var getVal = function(val, def){
			val = $.trim(val || '');
			if(val === $L(def)){
				val = '';
			}
			return val;
		};
		
		var bindDomFuns = {
			'submit': function(){
				//var conf = $.htmlToJson(nodes['begFollowPanel']);
				var conf = {
					'fuid': spec['uid']
				};
			//debugger;
			/*
				if(conf.answer !== undefined){
					conf.answer = getVal(conf.answer, msg['answer']);
					if (!conf.answer) {
						showError('answer', $L(msg['ans_error']));
						return;
					}
				}
				
				if(conf.content !== undefined){
					conf.content = getVal(conf.content, msg['content']);
					if (!conf.content) {
						showError('content', $L(msg['con_error']));
						return;
					}
				}
			*/
				if(nodes['answer']){
					conf.answer = getVal(nodes['answer'].value, msg['answer']);
					if (!conf.answer) {
						showError('answer', $L(msg['ans_error']));
						return;
					}
				}
				if(nodes['content']){
					conf.content = getVal(nodes['content'].value, msg['content']);
					if (!conf.content) {
						showError('content', $L(msg['con_error']));
						return;
					}
				}
				if(nodes['questionList']) {
					conf.qid = nodes['questionList'].value;					
				}
				answerTrans.request(conf);
				$.preventDefault();
			},
			'cancel': function(spec){
				dialog.hide();
			},
			'focus': function(type){
				return function(){
					hideError(type);
				}
			}
		};
		
		var bindDom = function(){
			$.core.evt.hotKey.add(nodes['content'], ['ctrl+enter', 'enter'], function(){bindDomFuns.submit()});
			$.addEvent(nodes['answer'], 'focus', bindDomFuns.focus('answer'));
			$.addEvent(nodes['content'], 'focus', bindDomFuns.focus('content'));
			$.addEvent(nodes['submit'], 'click', bindDomFuns.submit);
			$.addEvent(nodes['cancel'], 'click', bindDomFuns.cancel);
		};
		
		var initPlugins = function(){
			nodes['answer'] && $.kit.dom.smartInput(nodes['answer'], {
				'notice' : $L(msg['answer']),
				'noticeStyle' : 'color:#E0E0E0',
				'maxLength': 20
			});
			
			$.kit.dom.smartInput(nodes['content'], {
				'notice' : $L(msg['content']),
				'noticeStyle' : 'color:#E0E0E0',
				'maxLength': 280
			});
		};
		
		var parseDOM = function(){
			var html	= $.core.util.easyTemplate($L(temp), spec).toString();
			var dom		= $.core.dom.builder(html);
			nodes = $.kit.dom.parseDOM(dom.list);
			dialog = $.ui.dialog();
			dialog.setTitle($L('#L{邀请}') + spec.name + $L('#L{关注我}'));
			dialog.appendChild(nodes['begFollowPanel']);
		};
		
		var init = function(){
			parseDOM();
			bindDom();
			initPlugins();
			dialog.show().setMiddle();
		};
		
		init();
	}
});
