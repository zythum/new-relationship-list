/**
 * @author liusong@staff.sina.com.cn
 *
 * @history
 * ZhouJiequn @2010/05/09 lock操作存在逻辑bug,暂时取消lock动作
 */

$Import('kit.dom.parents');
$Import('ui.confirm');
$Import('ui.alert');
$Import('kit.extra.language');
$Import('kit.extra.setPlainHash');
$Import('common.channel.feed');
$Import('common.comment.inter');
$Import('kit.dom.autoHeightTextArea');
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('common.dialog.commentDialogue');
$Import('common.channel.feed');

STK.register('common.comment.comment', function($){
	var setHash = $.kit.extra.setPlainHash;
	//全局变量
	var valid = [],
		cache = {},
		alert = $.ui.alert,
		lang  = $.kit.extra.language,
		cust  = $.custEvent,
		fire  = cust.fire;
		//{'fuid':}
	//语言包
	var msg = {
		'content' : lang('#L{写点东西吧，评论内容不能为空哦。}'),
		'delete'  : lang('#L{确定要删除该回复吗}'),
		'reply'   : lang('#L{回复}'),
		'blcok'   : lang('#L{同时将此用户加入黑名单}')
	};
	//评论实例化函数
	var comment = function(wrap, data){
		var req, eId, count, cid, replyName, textarea, forward, isroot, insertFlag,editor,lock,
		check = new RegExp(['^', msg['reply'], '@([^:]*):(.*)'].join('')),
		strFuns = $.core.str;
		var isMain = data["isMain"];
		var postComment = function(opts){
//			if(lock){
//				return;
//			}
			//lock = true;
			var val = $.trim(textarea.value),
				mc = val.match(check);
			if(val=="" || (mc && $.trim(mc[2])=="")){
				alert(msg['content'])
				return;
			}
			//如果回复的昵称与回复所指的昵称不符，则清除cid
			if(!mc || !mc[1] || (mc[1] != replyName)){
				cid = replyName = null;
			}
			//添加不能点的代码
			if(opts && opts.el) {
				opts.el.className = 'W_btn_a_disable';
				$.sizzle('em[node-type="btnText"]' , opts.el)[0].innerHTML = lang("#L{提交中...}");
			} else {
				$.sizzle('[action-type="post"]' , wrap)[0].className = 'W_btn_a_disable';
				$.sizzle('em[node-type="btnText"]' , wrap)[0].innerHTML = lang("#L{提交中...}");
			}
			//var content = (mc && $.trim(mc[2])) ? mc[2] : val;
			setHash((+new Date()).toString());
			/**
			 * Diss
			 */
			req.post($.module.getDiss({
				'act' : !!mc? 'reply':'post',
				'cid' : cid,
				'content': strFuns.leftB(val, 280),
				'isroot' : (isroot && isroot.checked)?"1":"0",
				'forward': (forward && forward.checked)?"1":"0",
				'appkey' : data.appkey
			}, opts.el));
		};

		$.core.evt.hotKey.add(wrap, ["ctrl+enter"], postComment);
		//初始化事件代理
		var dEvt = $.core.evt.delegatedEvent(wrap);
		//评论
		dEvt.add('post', 'click', postComment);
		//回复
		dEvt.add('reply', 'click', function(event){
			var data, nick, text;
			if((data = event.data) && (nick = data.nick)){
				text = [msg['reply'],'@', nick, ':'].join('');
				cid = data['cid'];
				replyName = nick;
				textarea.value = text;
				setTimeout(function(){
					//设置光标至尾部
					$.kit.extra.textareaUtils.selectText(textarea,text.length,text.length)
					textarea.setAttribute('range' , text.length + '&0');
				},30)
			}
		});
		//删除
		dEvt.add('delete', 'click', function(event){
			var a = event.data['block'];
			var block = event.data['block']? ['<input node-type="block_user" id="block_user" name="block_user" value="1" type="checkbox"/><label for="block_user">',msg['blcok'],'</label>'].join(''):'';
			var cfm = $.ui.confirm(msg['delete'],{
				'OK' : function(obj){
					var isBlock = obj['block_user'];
					var data, cid;
					if((data = event.data) && (cid=data.cid)){
						req.del({
							'act' : 'delete',
							'cid' : cid,
							'is_block': isBlock ? '1':'0'
						});
					}
				},
				'textComplex': block
			})
		});
		
		
		//评论对话实例
		var commentDialogue = $.common.dialog.commentDialogue();
		//对话弹层代理事件
		dEvt.add('commentDialogue', 'click', commentDialogue.show);
		//假写频道
		$.common.channel.feed.register("reply", function(spec){
			addSuccessSwritten(spec.ret);
		});
		
		//假写
		var addSuccessSwritten = function(json){
			var ret = json.data;
			if(!ret){return false};
			cid = replyName = null;
			count += 1;
			//修改评论的dom结构，强烈建议将评论的假写交给逻辑层处理，以应付恶心的产品逻辑。
			//因为唯一不变的是产品需求是变化的。这个论据(这个只是将需要假写的数据抛给逻辑层) 添加标记
			typeof isMain == "undefined" && ret['comment'] && insertFlag && $.insertHTML(insertFlag, ret.comment, "afterend");
			fire(eId, 'count', count);
			fire(eId, 'comment', {'count' :count,'html' :ret.comment});
			if(ret['feed']){
				fire(eId, 'feed');
				$.common.channel.feed.fire("forward",{'html':ret.feed})
			}
			//更改提交按钮
			method.changeSubmitBtn();
			return true;
		};
		
		var method = {
				changeSubmitBtn : function() {
					var btnText = $.sizzle("em[node-type='btnText']" , wrap)[0];
					var btn = $.sizzle("a[action-type='post']" , wrap)[0];
					btn.className = 'W_btn_b btn_noloading';
					btnText.innerHTML = lang("#L{评论}");
				},
				//评论成功
				'add_success':function(json, data){
					if(addSuccessSwritten(json)){
						textarea.value = "";
						textarea.focus(); //焦点置入
					}
				},
				'add_fail' : function() {
					//更改提交按钮
					method.changeSubmitBtn();
				},
				'add_error' : function() {
					//更改提交按钮
					method.changeSubmitBtn();
				},
				//删除成功
				'delete_success': function(json, data){
					count = Math.max(count-1,0);
					fire(eId, 'count', count);
					var dl = $.sizzle(['dl[comment_id=',data.cid,']'].join(''),wrap)[0];
						dl && dl.parentNode.removeChild(dl);
				},
				'delete_fail' : function(json , data) {
				} ,
				//加载成功
				'smallList_success': function(json, data){
					var ret = json.data;
					if(!ret){return}
					ret['html'] && (wrap.innerHTML = ret.html);
					fire(eId, 'count', [count=(ret.count*1||0)]);
					textarea = $.sizzle('textarea',wrap)[0];
					setTimeout(function(){
						$.kit.dom.autoHeightTextArea({
							'textArea': textarea,
							'maxHeight': 9999,
							'inputListener': function(){
								var content = $.trim(textarea.value);
								if(strFuns.bLength(content)>280){
									textarea.value = strFuns.leftB(content, 280);
								}
							}
						});
					}, 25);
					forward = $.sizzle('input[name=forward]',wrap)[0];
					isroot = $.sizzle('input[name=isroot]',wrap)[0];
					insertFlag = $.sizzle("div[node-type=commentList]", wrap)[0];
					var options={
						'count':'disabled'
					};
					editor = $.common.editor.base(wrap, options);
					editor.widget($.common.editor.widget.face(),'smileyBtn');

					!!data.focus&&textarea.focus();

					textarea.select();
				}
		};
		req = $.common.comment.inter(method, data);
		eId = cust.define(req, ['count','feed',"comment"]);
		//销毁方法
		req.destroy = function(){
			editor && editor.closeWidget();
		};
		return req;
	};
	var getIns = function(wrap, data){
		var id = $.core.arr.indexOf(wrap, valid);
		if(!cache[id]){
			valid[id = valid.length] = wrap;
			cache[id] = comment(wrap, data);
		}
		return cache[id]
	};
	/**
	* common.comment.comment
	* @param {Object} event 必选参数，基于事件代理的事件
	* @param {Object} wrap  必选参数，承载评论内容的外容器
	*/
	return function(data, wrap){
		if(!data || !data.mid){
			throw "mid is not defined";
		}
		var ins = getIns(wrap, data);
		if(wrap.firstChild){
			wrap.innerHTML = "";
			wrap.style.display = "none";
		}else{
			if(data){
				data['act'] = 'list';
				ins.load(data);
				wrap.style.display = "";
			}
		}
		return ins;
	}
});
