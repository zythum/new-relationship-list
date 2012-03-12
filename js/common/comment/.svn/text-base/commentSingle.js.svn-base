/**
 * @author zhaobo@staff.sina.com.cn
 */

$Import('ui.confirm');
$Import('ui.alert');
$Import('kit.extra.language');
$Import('kit.extra.setPlainHash');
$Import('common.channel.feed');
$Import('common.comment.inter');
$Import('kit.dom.autoHeightTextArea');
$Import('common.editor.base');
$Import('common.editor.widget.face');

STK.register('common.comment.commentSingle', function($){
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
	//改变按钮文字函数
	var changeBtnText = function(tNode , type) {
		if(type == 'normal') {
			tNode.innerHTML = lang('#L{评论}');
		} else {
			tNode.innerHTML = lang('#L{提交中...}');				
		}
	};
	//评论实例化函数
	var comment = function(wrap, data, initData){
		var req, eId, count, cid, replyName, textarea, forward, isroot, insertFlag,editor,lock,
			check = new RegExp(['^',msg['reply'],'@(.*):(.*)'].join('')),
			strFuns = $.core.str,submitBtn,submitTxt;
			
		var postComment = function(opts){
			if(!submitBtn) {
				submitBtn = $.sizzle("[action-type='post']" , wrap)[0];
				submitTxt = $.sizzle("[node-type='btnText']" , wrap)[0];
			}
			if(lock){
				return;
			}
			lock = true;
			var val = $.trim(textarea.value),
				mc = val.match(check);
			if(val=="" || (mc && $.trim(mc[2])=="")){
				alert(msg['content']);
				lock = false;
				return;
			}
			//如果回复的昵称与回复所指的昵称不符，则清除cid
			if(!mc || !mc[1] || (mc[1] != replyName)){
				cid = replyName = null;
			}
			//更改按钮状态
			if(submitBtn) {
				changeBtnText(submitTxt , "loading");
				submitBtn.className = 'W_btn_a_disable';				
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
				'forward': (forward && forward.checked)?"1":"0"
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
		var parseDom = function(json){
			var ret = json.data;
			if(!ret){return}
			ret['html'] && (wrap.innerHTML = ret.html);
			ret.count  = ret.count || wrap.getAttribute("count");
			try {
				fire(eId, 'count', [count = (ret.count * 1 || 0)]);
			} catch(e) {
				$.log("ERR", e.message)
			}
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
			//insertFlag = $.sizzle("div[node-type=feed_list]", wrap)[0];
			if(json.allowForward === "0" && forward) forward.parentNode.style.display = "none";
			if(json.allowRootComment === "0" && isroot) isroot.parentNode.style.display = "none";
			var options={
				'count':'disabled'
			};
			editor = $.common.editor.base(wrap, options);
			editor.widget($.common.editor.widget.face(),'smileyBtn');
		};
		var failFunc = function(){
			lock = false;
		};
		var addFailFunc = function() {
			lock = false;
			//更改按钮状态
			if(submitBtn) {
				changeBtnText(submitTxt , "normal");
				submitBtn.className = 'W_btn_b btn_noloading';				
			}		
		};
		var method = {
				//评论成功
				'add_success':function(json, data){
					//更改按钮状态
					if(submitBtn) {
						changeBtnText(submitTxt , "normal");
						submitBtn.className = 'W_btn_b btn_noloading';				
					}
					lock = false;
					var ret = json.data;
					if(!ret){return}
					cid = replyName = null;
					count+=1;
					textarea.value = "";
					ret['comment'] && fire(eId, 'comment', {'html' :ret.comment,'count' :count});
					forward && (forward.checked = false);
					isroot && (isroot.checked = false);
					//delete by xionggq
					//ret['comment'] && insertFlag && $.insertHTML(insertFlag, ret.comment, "afterbegin");
					fire(eId, 'count', count);
					if(data.forward === "1") {
						fire(eId, 'forward');
					}
					if(ret['feed']){
						fire(eId, 'feed');
						$.common.channel.feed.fire("forward",{'html':ret.feed})
					}
					lock = false;
				},
				//删除成功
				'delete_success': function(json, data){
					count = Math.max(count-1,0);
					fire(eId, 'count', count);
					var dl = $.sizzle(['dl[comment_id=',data.cid,']'].join(''),wrap)[0];
						dl && dl.parentNode.removeChild(dl);
				},
				'add_fail' : addFailFunc,
				'add_error' : addFailFunc,
				'delete_fail' : failFunc,
				'delete_error' : failFunc,
				'smallList_fail' : failFunc,
				'smallList_error' : failFunc,
				//加载成功
				'smallList_success': parseDom
		};
		req = $.common.comment.inter(method, data);
		eId = cust.define(req, ['count','feed', 'comment', 'forward']);
		//销毁方法
		req.destroy = function(){editor.closeWidget()};
		req.focus = function(){editor.API.focus(0);};
		req.shine = function(){$.common.extra.shine(editor.nodeList.textEl);};
		//parseDom({data:{}});
		window.setTimeout(function(){initData.data = {};parseDom(initData);if(initData.needFocus)editor.API.focus(0);}, 200);
		return req;
	};
	var getIns = function(wrap, data, initData){
		var id = $.core.arr.indexOf(wrap, valid);
		if(!cache[id]){
			valid[id = valid.length] = wrap;
			cache[id] = comment(wrap, data, initData);
		}
		return cache[id]
	};
	/**
	* common.comment.comment
	* @param {Object} event 必选参数，基于事件代理的事件
	* @param {Object} wrap  必选参数，承载评论内容的外容器
	*/
	return function(data, wrap, initData){
		if(!data || !data.mid){
			throw "mid is not defined";
		}
		var ins = getIns(wrap, data, initData);
		/*if(wrap.firstChild){
			wrap.innerHTML = "";
			wrap.style.display = "none";
		}else{
			if(data){
				data['act'] = 'list';
				ins.load(data);
				wrap.style.display = "";
			}
		}*/
		return ins;
	}
});
