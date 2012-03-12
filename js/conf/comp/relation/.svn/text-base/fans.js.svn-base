/**
 * 粉丝页主逻辑
 * ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.confirm');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.trans.relation');
$Import('common.relation.userList');
$Import('common.relation.userSearch');
STK.register('comp.relation.fans', function($){
	return function(node){
		var that	= {},
			$L		= $.kit.extra.language,
			nodes, userSearch, userList;
			
		var getInvite = $.common.trans.relation.getTrans('getInvite', {
			'onSuccess': function(rs, parm){
				var num = rs.data.attention;
				if (!isNaN(num) && parseInt(num, 10)) {
					nodes['invite'].innerHTML = $L('#L{有#{num\\}个未处理的关注请求}',{num:num});
				}else{
					nodes['invite'].innerHTML = $L('#L{没有尚未处理的关注请求}');
				}
				nodes['invite'].style.display = '';
			},
			'onError': function(){},
			'onFail': function(){}
		});
		
		var initPlugins = function(){
			if (nodes['search']) {
				userSearch = $.common.relation.userSearch(nodes['search'], {
					type:1,
					callback:function(key,node){
						if(typeof key !== 'string'){
							key = key.screen_name;
						}
						key = encodeURIComponent(key || "");
						if(node){
							window.location.href = node.href + '?search=' + key;
						}
					}
				});
			}
			if (nodes['userListBox']) {
				userList = $.common.relation.userList(nodes);
				$.custEvent.add(userList, "empty", function() {
					window.location.reload();
				});
			}
		};
		
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			getInvite.request();
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.relation.fans]:node is not a Node!";
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		
		var destroy = function(){
			userSearch && userSearch.destroy();
			userList && userList.destroy();
			nodes = null;
		};
		
		init();
		
		that.destroy = destroy;
		
		return that;
		
	};
});
