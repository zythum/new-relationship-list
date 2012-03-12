/**
 * @author Maze
 */
$Import('common.channel.plaze');
$Import('common.channel.slide');
$Import('common.trans.plaza');
$Import('common.plaza.choiceTemplate');

$Import('common.plaza.parseFeed');

STK.register('common.plaza.choiceFeed', function($){
	var ch_plaze = $.common.channel.plaze,
		ch_slide = $.common.channel.slide,
		io = $.common.trans.plaza,
		template = $.common.plaza.choiceTemplate,
		parseFeed= $.common.plaza.parseFeed;
		
	return function(nodes){
		var it = {},el;
		
		var handler = {
			init: function(){
				el = nodes['layer_comment'];
				//注册监听
				handler.channel();
			},
			channel: function(){
				ch_plaze.register('choiceimg_show',handler.refresh);
				ch_slide.register('view',handler.refresh);
			},
			refresh: function(data){
				data = data.data;
				//
				io.request('feedInfo', {
					'onSuccess' : function(req){
						el.innerHTML = '';
						el.innerHTML = req.data.html;
						//绑定feed基本行为
						parseFeed(el,req.data.mid);
						//评论列表
						var btn = $.sizzle('a[action-type=feed_list_comment]', el)[0];
						btn && $.fireEvent(btn, 'click');
					}
				},{
					'class': $CONFIG['class']
					,'ts'   : $CONFIG['ts']
					,'mid' : data.mid
				});
			}
		};
		
		it.destory = function(){
			
		};
		//
		handler.init();
		return it;
	};
});