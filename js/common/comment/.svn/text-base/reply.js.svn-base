/**
 * Created by
 * User: yuheng || yuheng@staff.sina.com.cn
 * Date: 11-3-22
 * Time: 下午4:39
 * To change this template use File | Settings | File Templates.
 */
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('kit.extra.language');
$Import('kit.extra.setPlainHash');
$Import('common.trans.comment');
$Import('common.comment.inter');
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('kit.dom.autoHeightTextArea');

STK.register('common.comment.reply',function($){
	var $L = $.kit.extra.language,
		ajax	= $.common.trans.comment,
		setStyle = $.core.dom.setStyle,
		getStyle = $.core.dom.getStyle,
		prevent  = $.core.evt.preventDefault,
		setHash = $.kit.extra.setPlainHash;

	var cacheNodes = [];
	var cache = {};
	var msg = {
		'reply'     : $L('#L{回复}'),
		'alert'     : $L('#L{写点东西吧，评论内容不能为空哦。}'),
		'success'   : $L('#L{评论成功}'),
		'block'     : $L('#L{同时将此用户加入黑名单}')
	}
	//修复冒号的匹配
	var checkReply = new RegExp(['^',msg['reply'],'@([^:]*):'].join(''));
	
	//改变按钮文字函数
	var changeBtnText = function(tNode , type) {
		if(type == 'normal') {
			tNode.innerHTML = $L('#L{发送}');
		} else {
			tNode.innerHTML = $L('#L{提交中...}');				
		}
	};	
	var reply = function(wrap,data){
		var that = {}, editor, req,
			check, textEl, doReply, replyBtn,textBtn,
			forward, content, nick, str, mc, conf, curWords, query,isSubmit;
		//定义回复事件
		$.custEvent.define(that, ['reply']);
		var dEvent = $.core.evt.delegatedEvent(wrap);
		var method = {
			'add_success' : function(ret){
				isSubmit = 0;
				doReply.className = 'W_btn_b btn_noloading';
				changeBtnText(textBtn , "normal");
				editor.API.reset();
				editor.API.insertText(str);
				editor.API.blur();
				setStyle(wrap,'display','none');
				ret.forward = forward;
				$.custEvent.fire(that, 'reply', [ret]);
				$.ui.litePrompt(msg.success,{'type':'succM','timeout':'500'});
			},
			'add_fail' : function(ret) {
				isSubmit = 0;
				doReply.className = 'W_btn_b btn_noloading';
				changeBtnText(textBtn , "normal");
			},
			'add_error' : function(ret) {
				isSubmit = 0;
				doReply.className = 'W_btn_b btn_noloading';
				changeBtnText(textBtn , "normal");				
			}
		};

		var post_com = function(opts){
			if(isSubmit) {
				return;				
			}
			isSubmit = 1;
			$.core.evt.preventDefault();
			forward = check.checked?1:0;
			content = $.core.str.trim(textEl.value);
			mc = content.match(checkReply);

			if(content == str || content == ''){
				$.ui.alert(msg.alert, {OK:function(){
					isSubmit = 0;
				}});
			}else{
				//如果回复的昵称与回复所指的昵称不符，则清除cid
				if(!mc || !mc[1] || (mc[1] != nick)){
					data.cid = nick = null;
				}
//				content = (mc && $.trim(mc[2])) ? mc[2] : val;
				content = $.leftB(content,280);
				data.content = content;
				/**
				 * Diss
				 */
				conf = $.module.getDiss($.kit.extra.merge(data, {
					'act' : 'reply',
					'content': content,
					'forward': forward,
					'isroot' : 0
				}), opts.el);
				if(opts && opts.el) {
					opts.el.className = 'W_btn_a_disable';					
				} else {
					doReply && (doReply.className = 'W_btn_a_disable') ;
				}
				changeBtnText(textBtn , "loading");
				setHash((+new Date()).toString());
				req = $.common.comment.inter(method,conf);
				req.post(conf);
			}
		};

		check = $.sizzle('[node-type="forward"]',wrap)[0];
		textEl = $.sizzle('[node-type="textEl"]',wrap)[0];
		doReply = $.sizzle('[action-type="doReply"]',wrap)[0];
		textBtn = $.sizzle('[node-type="btnText"]',wrap)[0];
		
		doReply.setAttribute('action-data',query);

		nick = data.content;
		str = [msg.reply,'@',nick,':'].join('');
		
		editor = $.common.editor.base(wrap, {count:'disable'});
		editor.widget($.common.editor.widget.face(),'smileyBtn');
		curWords = editor.API.getWords();

		if(curWords == ''){
			editor.API.insertText(str);
		}else{
			editor.API.insertText('');
		}

		dEvent.add('doReply', 'click', post_com);
		$.core.evt.hotKey.add(wrap, ["ctrl+enter"], post_com);
		
		$.kit.dom.autoHeightTextArea({
			'textArea': textEl,
			'maxHeight': 9999,
			'inputListener': function(){
				var content = $.trim(textEl.value);
				if($.bLength(content)>280){
					textEl.value = $.leftB(content, 280);
				}
			}
		});

		that.focus = function(){
			editor.API.insertText('');
		};

		return that;
	};

	var getIns = function(wrap, data){
		var id = $.core.arr.indexOf(wrap, cacheNodes);
		if(!cache[id]){
			cacheNodes[id = cacheNodes.length] = wrap;
			cache[id] = reply(wrap, data);
		}
		return cache[id];
	};
	
	return function(wrap,data){
		if(!data || !data.mid){
			$.log("common/comment/reply.js-------mid is not defined");
		}

		return getIns(wrap, data);
	}
});
