/**
 * 评论对话(层)
 * @author Runshi Wang|runshi@staff.sina.com.cn
 */

$Import('common.trans.comment');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('kit.dom.firstChild');
$Import('common.comment.reply');
$Import('common.channel.feed');

STK.register('common.dialog.commentDialogue', function($){
	
	var $L = $.kit.extra.language;
	
	var TEMP = {
		TITLE : $L('#L{查看对话}'),
		FRAME : $L('' +
			'<div class="detail layer_comments_list">' +
				//'<div class="W_tips_top">#L{你可以像浏览短信一样查看回复记录。}</div>' +
				'<div node-type="more" class="more_list W_linkb"></div>' +
				'<div node-type="repeat_list" class="feed_list"></div>' +
			'</div>'
		),
		MOREAREA : {
			LOADING : $L('<div class="W_loading"><span>&nbsp;#L{加载中...}</span></div>'),
			DELETEED : $L('#L{回复记录中部分评论已被原作者删除。}'),
			RETRY : $L('#L{加载失败，请}<a action-type="older" href="javascript:void(0)" onclick="return false;">#L{重试}</a>#L{。}'),
			DEFAULT : $L('<a action-type="older" href="javascript:void(0)" onclick="return false;"><span class="more_arrow">&laquo;</span>#L{查看更早的评论}</a>')
		}
	};
	
	var trans = $.common.trans.comment;
	var dialog = $.ui.dialog({'isHold' : true});
	
	
	return function(){
		var that,
			ccid,
			type,
			dEvt,
			nodes,
			isInit = false,
			is_more = true,
			onloading = false,
			replys = [];
		
		//初始化
		var init = function(){
			dialog.setTitle(TEMP.TITLE);
			dialog.setContent(TEMP.FRAME);
			var inner = dialog.getInner();
			nodes = $.kit.dom.parseDOM($.builder(inner).list);
			nodes.outer = dialog.getOuter();
			nodes.inner = inner;
			
			bind();
			isInit = true;
		};
		
		//绑定事件
		var bind = function(){
			dEvt = $.core.evt.delegatedEvent(nodes.outer);
			dEvt.add('older', 'click', that.getDialogueList);
			dEvt.add('replycomment', 'click', replyHandle.show);
			
			$.custEvent.add(dialog, 'hide', that.reset);
		};
		
		//回复系方法
		var replyHandle = {
			show : function(opts) {
				var el = opts.el, node, status, ins;

				while (el.tagName.toLowerCase() != 'dl') {
					el = el.parentNode;
				}
				node = $.sizzle('[node-type="commentwrap"]', el)[0];

				var reply = opts.el;
				status = reply.getAttribute('status');
				if ($.core.dom.getStyle(node, 'display') != 'none' && status == 'true') {
					reply.setAttribute('status', 'false');
					$.core.dom.setStyle(node, 'display', 'none');
				} else {
					reply.setAttribute('status', 'true');
					$.core.dom.setStyle(node, 'display', '');
					if (ins) {
						ins.focus();
					}
				}
				if (!status) {
					ins = $.common.comment.reply(node, opts.data);
					replyHandle.funcs.add(ins);
				}

				return $.preventDefault(opts.evt);
			},
			//代理，触发频道
			reply : function(obj, ret){
				$.common.channel.feed.fire('reply', {'obj':obj, 'ret':ret});
				//replyHandle.newDialogue(ret.data.content);
			},
			//层上假写
			newDialogue: function(content){
				$.core.dom.insertHTML(nodes.repeat_list, content, 'beforeend');
			},
			funcs : {
				add : function(replyObj) {
					var ins = replyHandle.funcs.get(replyObj);
					if (!replys[ins]) {
						replys.push(replyObj);
						$.custEvent.add(replyObj, 'reply', replyHandle.reply);
					}
				},
				remove : function(ins) {
					if (replys[ins]) {
						$.custEvent.remove(ins);
						replys[ins] = null;
						delete replys[ins];
					}
				},
				get : function(replyObj) {
					var ret, isIn = false;
					for (var i = 0; i < replys.length; i++) {
						var obj = replys[i];
						if (obj == replyObj) {
							ret = i;
							isIn = true;
							break;
						}
					}
					return ret;
				},
				destroy : function() {
					for (var i = 0; i < replys.length; i++) {
						replyHandle.funcs.remove(i);
					}
				}
			}
		}
		
		that = {
			show: function(spec){
				!isInit && init(); //第一次显示时初始化
				is_more = true;
				ccid = spec.data['cid'];
				type = spec.data['type'] || 'small';
				that.display();
				that.getDialogueList();
			},
			//获取下一次请求的起始gid
			getCid: function(){
				var cid = false,
					timeLine = $.kit.dom.firstChild(nodes.repeat_list);
					
				if(timeLine){
					var cid = timeLine.getAttribute('cid');
				}
				
				//更多区域控制
				if(cid){
					ccid = cid;
					that.moreArea.show();
				} else {
					that.moreArea.hide();
				}
			},
			//获取评论对话列表
			getDialogueList: function(){
				var param = {'cid':ccid, 'type':type};
				is_more && (param.is_more = 1);
				
				if(!onloading){ 
					that.loading.start();
					trans.getTrans('dialogue', {
						'onComplete': function(ret){
							that.loading.end();
							if(ret.code == '100000'){
								ret['data'] && ret.data['html'] && that.addContent(ret.data.html);
								is_more = false;
								that.getCid();
								that.moreArea.setContent(ret.msg ? ret.msg : TEMP.MOREAREA.DEFAULT);
							} else if(ret.code == '100001'){
								that.moreArea.setContent(TEMP.MOREAREA.RETRY);
								that.moreArea.show();
							} else if(ret.code == '100011'){
								that.moreArea.setContent(TEMP.MOREAREA.DELETEED);
								that.moreArea.show();
							}
						}
					}).request(param);
				}
			},
			//读取状态
			loading : {
				start : function(){
					onloading = true;
					that.moreArea.setContent(TEMP.MOREAREA.LOADING);
				},
				end : function(){
					onloading = false;
					that.moreArea.setContent(TEMP.MOREAREA.DEFAULT);
				}
			},
			//添加内容
			addContent: function(content){
				$.core.dom.insertHTML(nodes.repeat_list, content, 'afterbegin');
			},
			//"更多"区域
			moreArea : {
				show : function(){
					$.setStyle(nodes.more, 'display', '');
					//dialog.setMiddle();
				},
				hide : function(){
					$.setStyle(nodes.more, 'display', 'none');
					//dialog.setMiddle();
				},
				setContent: function(content){
					nodes.more.innerHTML = content;
				}
			},
			//显示
			display: function(){
				that.clear();
				dialog.show();
				dialog.setMiddle();
				$.setStyle(nodes.outer, 'top', parseInt($.getStyle(nodes.outer, 'top')) - 30 + 'px');
			},
			//清空列表内容
			clear : function(){
				nodes.repeat_list.innerHTML = '';
			},
			//重置层状态
			reset: function(){
				is_more = true;
				that.moreArea.show();
				that.clear();
				replyHandle.funcs.destroy();
			},
			destroy: function(){
				that = null, replyHandle = null;
				replyHandle.funcs.destroy();
			}
		}
		return that;
	}
});