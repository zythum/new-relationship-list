/**
 * 公开分组
 * ChenJian | chenjian2@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('common.relation.userList');
$Import("common.trans.relation");
$Import("common.dialog.inviteFollow");
STK.register('comp.relation.groupMember', function($){
	return function(node){
		var that	= {},
			nodes, userList;
		var dEvent;
		var ioFollow= $.common.relation.followPrototype;
		
		var initPlugins = function(){
			if (nodes['userListBox']) {
				userList = $.common.relation.userList(nodes);
			}else{
				dEvent	= $.delegatedEvent(node);
			}
		};
		
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.relation.groupMember]:node is not a Node!";
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		
		var bindDOM = function(){
			if (!nodes['userListBox']) {
				var quesTrans = $.common.trans.relation.getTrans('questions', {
					'onSuccess': function(spec, parm){
						$.common.dialog.inviteFollow({
							'name': $CONFIG['onick'],
							'uid': $CONFIG['oid'],
							'questionList': spec.data
						});
					},
					'onError': function(spec, parm){
						$.ui.alert(spec.msg);
					}
				});
				dEvent = $.delegatedEvent(node);
				dEvent.add('inviteFollow', 'click', function(){
					quesTrans.request({'uid': $CONFIG['oid']});
				});
				dEvent.add('follow', 'click', function(spec){
					var conf = $.parseParam({
						'uid': '',
						'fnick': '',
						'f': 1,
						'onSuccessCb': function(rs){
							window.location.reload();
						}
					}, spec.data || {});
					ioFollow.follow(conf);
				});
			}
		}
		
		var destroy = function(){
			userList && userList.destroy();
			nodes = null;
		};
		
		node && init();
		
		that.destroy = destroy;
		
		return that;
		
	};
});
