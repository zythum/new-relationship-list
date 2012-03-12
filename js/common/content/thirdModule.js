/**
 * @author wangliang3
 * 右侧模块第三方组件通用行为
 */
$Import('common.trans.thirdModule');
$Import('ui.confirm');
$Import('kit.extra.language');

STK.register('common.content.thirdModule', function($){
	var _io = $.common.trans.thirdModule,
		_cnfirm = $.ui.confirm,
		_lan = $.kit.extra.language;
	
	return function(node){
		var devt = $.delegatedEvent(node);
		
		var it={};
		it.init = function(pars){
			//注册动作
			devt.add('btn_hide','click',it.hide);
		};
		it.io = function(data){
			_io.request('proxy',{
				onSuccess: function(){
					node.style.display = 'none';
				}
			},data);
		};
		it.hide = function(pars){
			$.preventDefault();
			//
			_cnfirm(_lan('#L{确定要隐藏这个功能吗？}'),{
				OK: function(){
					it.io(pars.data);		
				}
			});
				
		};
		it.destory = function(){
			devt.destory();
		};
		//init start
		it.init();
		
		return it;
	}
});