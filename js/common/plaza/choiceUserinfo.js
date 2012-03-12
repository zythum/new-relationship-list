/**
 * @author wangliang3
 */
$Import('module.getDiss');
$Import('common.channel.plaze');
$Import('common.channel.slide');
$Import('common.trans.plaza');
$Import('common.plaza.choiceTemplate');
$Import('common.relation.followPrototype');
$Import('common.dialog.setGroup');

STK.register('common.plaza.choiceUserinfo', function($){
	var ch_plaze = $.common.channel.plaze,
		ch_slide = $.common.channel.slide,
		io = $.common.trans.plaza,
		template = $.common.plaza.choiceTemplate,
		follow = $.common.relation.followPrototype,
		group = $.common.dialog.setGroup;
		
	return function(nodes){
		var it={},el,cont,loading,devt;
		
		var act = {
			follow: function(spec){
				$.preventDefault();
				
				var _el = spec.el,
					_data = spec.data;
					
				_data.onSuccessCb = function(data){
					var pd = _el.parentNode;
					pd.innerHTML = '';
					pd.appendChild($.builder(template.followed).box);
					//
					group().show({
						'uid': data.uid,
						'fnick': data.fnick,
						'groupList': data.group,
						'hasRemark': true
					});
				};
				follow.follow($.module.getDiss(_data, _el));
			}
		};
		
		var handler = {
			init: function(){
				//定义频道
				handler.channel();
				//pars
				el = nodes['layer_userinfo'];
				//loading
				loading = $.builder(template.loading).box;
				//绑定事件
				handler.bind();
			},
			channel: function(){
				ch_plaze.register('choiceimg_show',handler.refresh);
				ch_slide.register('view',handler.refresh);
			},
			refresh: function(data){
				data = data.data;
				//
				el.appendChild(loading);
				io.request('userinfo',{
					onSuccess: function(req, pars){
						el.innerHTML = req.data;
					}
				},{
					'uid_com': data.uid,
					'class': $CONFIG['class']
				});
			},
			bind: function(){
				devt = $.delegatedEvent(el);
				//注册layer代理事件
				for (var k in act) {
					devt.add(k,'click',act[k]);
				}
			},
			destory: function(){
				
			}
		}
		it.destory = handler.destory;
		//
		handler.init();
		return it;
	}
});