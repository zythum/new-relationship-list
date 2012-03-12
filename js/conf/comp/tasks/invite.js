/**
 * 微博宝典 邀请
 * @id $.common.guide.tasks
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author jiequn | jiequn@staff.sina.com.cn
 * @example
 */
$Import('ui.alert');
$Import('comp.tasks.copy');
$Import('kit.extra.language');
$Import('common.trans.tasks');
STK.register('comp.tasks.invite', function($) {
	var trim=$.core.str.trim;
	var addEvent=$.core.evt.addEvent;
	var confirm=$.ui.confirm;
	return function(nodes, panel){
		var that = {},
			$L = $.kit.extra.language;
		var defVl=nodes['tel'].value;
		var setCurrent = function(spec){
			var navItems = nodes['navItem'], data, temp;
			for (var i = navItems.length; i--;) {
				data = $.queryToJson(navItems[i].getAttribute('action-data'));
				temp = spec.el === navItems[i];
				navItems[i].className = temp ? 'current' : '';
				nodes[data.panel].style.display = temp ? '' : 'none';
			}
		};
		
		var ajax = $.common.trans.tasks.getTrans('inviteByTel', {
			'onSuccess': function(rs, parm){
				$.ui.alert($L('#L{发送成功！}'), {'icon': 'success'});
			},
			'onError': function(rs, parm){
				if(rs.code=='100041'){
					confirm(rs.msg,{
						'OK' : function(){
							window.open('http://account.weibo.com/settings/mobile','_blank');
						},
						'OKText' : $L('#L{立即绑定}'),
						'cancelText' : $L('#L{以后再说}')
					});
				}else{
					rs && rs['msg'] && $.ui.alert(rs['msg']);
				}
				
			},
			'onFail': function(rs, parm){
				rs && rs['msg'] && $.ui.alert(rs['msg']);
			}
		});
		
		panel.bindEvent('inviteNav', 'click', function(spec){
			setCurrent(spec);
		});
		
		panel.bindEvent('copy', 'click', function(spec){
			$.comp.tasks.copy({
				'text': nodes['link'].value
			});
			$.preventDefault();
		});
		addEvent(nodes['link'],'focus',function(){
			setTimeout(function(){nodes['link'].select()},10);
		});
		addEvent(nodes['tel'],'focus',function(){
			if(trim(nodes['tel'].value)==defVl){
				nodes['tel'].value="";
			}
		});
		addEvent(nodes['tel'],'blur',function(){
			if(!trim(nodes['tel'].value)){
				nodes['tel'].value=defVl;
			}
		});
		panel.bindEvent('submit', 'click', function(spec){
			var str = trim(nodes['tel'].value);
			var patt=/^1[3|5|8]\d{9}$/;

			if(!patt.test(str)){
				$.ui.alert($L('#L{请输入正确的手机号码}'), {
					'icon': 'error',
					'OK': function(){
						nodes['tel'].focus();
					}
				});
				return;
			}
			ajax.request({ 'tel': str });
			$.preventDefault();
		});
		
		var destroy = function(){
			nodes = null;
		};
		
		that.destroy = destroy;
		
		return that;
	};
});