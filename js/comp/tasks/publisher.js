/**
 * 微博宝典 发评论
 * @id $.common.guide.tasks
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author jiequn | jiequn@staff.sina.com.cn
 * @example
 */
$Import('common.channel.insertTopic');
STK.register('comp.tasks.publisher', function($) {
	return function(nodes, panel){
		var that = {},
			listener = $.common.channel.insertTopic;
		
		panel.bindEvent('insertTopic', 'click', function(spec){
			//$.preventDefault();
			spec.data.topic && listener.fire('insert', '#' + spec.data.topic + '#');
		});
		
		var destroy = function(){
		};
		
		that.destroy = destroy;
		
		return that;
	};
});