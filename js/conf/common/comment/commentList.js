/**
 * 
 * @id $.common.comment.commentList
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author gaoyuan3@staff.sina.com.cn
 * @example
 */
//$Import('');
$Import('kit.dom.parentElementBy');
$Import('common.editor.widget.face');
$Import('kit.extra.language');
$Import('common.comment.reply');
$Import('kit.extra.language');
$Import('common.trans.comment');
$Import('common.comment.delCommentDom');
$Import('common.layer.ioError');

STK.register('common.comment.commentList', function($){

	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	
	return function(node){
		var that = {};


		//+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{},//组件容器
			//属性方法区
			msg: {
				'tips'					: $.kit.extra.language('#L{确定要删除该回复吗？}'),
				//'watermark'		: $.kit.extra.language('#L{查找评论内容或评论人}'),
				'block'				: $.kit.extra.language('#L{同时将此用户加入黑名单}')
			},
			showReply: function (opts) {
				var oCommentBox, replyBox, hasBindEditor, commentUnitDOM;
				oCommentBox = $.kit.dom.parentElementBy(opts.el, function (o) {
					if(o.tagName == 'DL') {
						return true;
					}
				});
				commentUnitDOM = $.kit.dom.parseDOM($.builder(oCommentBox).list);
				replyBox = commentUnitDOM.commentwrap;
				if(replyBox.style.display == 'none') {
					replyBox.style.display = '';
				}else{
					replyBox.style.display = 'none';
				}
				if(!hasBindEditor) {
					$.common.comment.reply(replyBox, opts.data);

					hasBindEditor = true;
				}
			},
			delComment: function(spec){
				$.common.trans.comment.getTrans('delete', {
					'onSuccess': function () {
						$.common.comment.delCommentDom({'el': spec.el});
					},
					'onError': function (data){
						$.common.layer.ioError(data.code, data);
					}
				}).request(spec.data);
			},
			confirmDelComment: function (opts) {
				var sTextComplexHtml;
				if(opts.data['block'] == '1') {
					sTextComplexHtml = 
					'<label for="block_user">'+
						'<input node-type="block_user" id="block_user" name="block_user" value="1" type="checkbox"/>'+
						_this.msg['block']+
					'</label>';
				}else{
					sTextComplexHtml = '';
				}
				var dia = $.ui.confirm(_this.msg.tips, {
					'textComplex' : sTextComplexHtml,
					'OK': function(obj){
						var isBlock = obj['block_user']?1:0;
						_this.delComment({
							'el' : opts.el,
							'data' : {
								'is_block' : isBlock,
								'cid' : opts.data.cid
							}
						});
					}
				});
			}
		};
		//----------------------------------------------



		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------


		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw 'common.comment.commentList node没有定义';
			}
		};
		//-------------------------------------------


		//+++ Dom的获取方法定义区 ++++++++++++++++++
		var parseDOM = function(){
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
			_this.event = $.core.evt.delegatedEvent(node);
			if(!1) {
				throw 'common.comment.commentList 必需的节点不完整';
			}

			
		};
		//-------------------------------------------


		//+++ 模块的初始化方法定义区 ++++++++++++++++++
		var initPlugins = function(){
			
		};
		//-------------------------------------------


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			_this.event.add('replycomment', 'click' , _this.showReply);
			_this.event.add('delComment', 'click' , _this.confirmDelComment);
			
		};
		//-------------------------------------------


		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		var bindCustEvt = function(){
			
		};
		//-------------------------------------------


		//+++ 广播事件绑定方法定义区 ++++++++++++++++++
		var bindListener = function(){
			
		};
		//-------------------------------------------


		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
			
		};
		//-------------------------------------------


		//+++ 执行初始化 ++++++++++++++++++
		init();
		//-------------------------------------------


		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		//-------------------------------------------


		return that;
	};
	
});
