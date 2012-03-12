/**
 * 微博宝典 发评论
 * @id $.common.guide.tasks
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author jiequn | jiequn@staff.sina.com.cn
 * @example
 */
$Import('common.trans.tasks');
$Import('common.feed.feedList.tasksFeed');
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('kit.dom.autoHeightTextArea');
STK.register('comp.tasks.comment', function($) {
	return function(nodes, panel){
		var that = {},
			editor;
		$.custEvent.define(that, 'changeFeed');
		
		var ajax = $.common.trans.tasks.getTrans('changeFeed', {
			'onSuccess': function(rs, parm){
				panel.stopLoading();
				nodes['feedBox'].innerHTML = rs.data.html;
				nodes['comm_title'].innerHTML=rs.data.title;
				editor = $.common.editor.base(nodes['feedBox'], {'count':'disabled'});
				editor.widget($.common.editor.widget.face(),'smileyBtn');
				$.kit.dom.autoHeightTextArea({
					'textArea': $.sizzle('textarea[node-type="textEl"]', nodes['feedBox'])[0],
					'maxHeight': 100
				});
			},
			'onFail': function(){}
		});
		
		$.custEvent.add(that, 'changeFeed', function(){
			panel.loading();
			ajax.request();
		});
		
		panel.bindEvent('change', 'click', function(spec){
			$.preventDefault();
			$.custEvent.fire(that, 'changeFeed');
		});
		
		$.common.feed.feedList.tasksFeed(nodes['feedBox'], that);
		$.kit.dom.autoHeightTextArea({
			'textArea': nodes['textEl'],
			'maxHeight': 100
		});
		var destroy = function(){
			nodes = null;
			ajax = null;
		};
		
		that.destroy = destroy;
		
		return that;
	};
});