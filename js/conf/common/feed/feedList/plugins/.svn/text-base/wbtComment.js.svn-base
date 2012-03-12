/**
 * 微博宝典评论的插件
 * @param {Object} base baseFeedList实例
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 */
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('kit.extra.language');
$Import('common.trans.comment');
$Import('common.feed.feedList.utils');
$Import('common.feed.feedList.feedTemps');
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('common.layer.ioError');

STK.register("common.feed.feedList.plugins.wbtComment", function($) {
	
	var utils		= $.common.feed.feedList.utils,
		$uniqueID	= $.core.dom.uniqueID,
		lang		= $.kit.extra.language;
	
	return function(base, obj) {
		if (!base) { return; }
		var that	= {},
			node	= base.getNode(),
			editor	= $.common.editor.base(node, {'count':'disabled'}),
			check	= new RegExp(['^',lang('#L{回复}'),'@(.*):(.*)'].join(''));
		
		editor.widget($.common.editor.widget.face(),'smileyBtn');
		var ajax = $.common.trans.comment.getTrans('add', {
			'onSuccess': function(rs, parm){
				var tips = $.ui.litePrompt(lang('#L{评论成功}'), {
					'type':'succM',
					'timeout':1000
				});
				$.custEvent.add(tips.layer, 'hide', function(){
					$.custEvent.fire(obj, 'changeFeed');
				});
			},
			'onError': function(json){
//				rs && rs['msg'] && $.ui.alert(rs['msg']);
				$.common.layer.ioError(json.code,json);
			},
			'onFail': function(json){
//				rs && rs['msg'] && $.ui.alert(rs['msg']);
				$.common.layer.ioError(json.code,json);
			}
		});
		
		var openComment = function(spec){
			var el		= spec.el,
				repeat	= $.sizzle('div[node-type="feed_list_repeat"]', node)[0],
				closed	= repeat.style.display === 'none';
			repeat.style.display = closed ? '' : 'none';
			return utils.preventDefault();
		};
		
		var wbtSubmit = function(spec){
			var textEL = $.sizzle('textarea[node-type="textEl"]', node)[0],
				val = textEL.value;
			if(!$.trim(val)){
				$.ui.alert(lang('#L{写点东西吧，评论内容不能为空哦。}'), {
					'OK': function(){
						textEL.focus();
					}
				});
				return;
			}
			var el = spec.el,
				mid = utils.getMid(el, node),
				mc = val.match(check),
				mblogtype=spec.data.mblogtype,
				module=spec.data.module,
				forward = $.sizzle('input[name=forward]',node)[0],
				isroot = $.sizzle('input[name=isroot]',node)[0];
			ajax.request({
				'act': 'post',
				'location': $CONFIG['location'],
				'content': $.leftB(val, 280),
				'mid': mid,
				'uid': $CONFIG['uid'],
				'forward': (forward && forward.checked)?"1":"0",
				'isroot': (isroot && isroot.checked)?"1":"0",
				'mblogtype':mblogtype,
				'module':module
			});
			return utils.preventDefault();
		};
		
		base.getDEvent().add("feed_list_comment", "click", openComment);
		base.getDEvent().add("wbtSubmit", "click", wbtSubmit);
		
		that.destroy = function() {
			editor = null;
			node = null;
		};
		
		return that;
	};
	
});
