/**
 * @author chenjian2
 * 顶部黄签条
 */
$Import('common.trans.global');
STK.register('comp.content.topTip', function($){
	var it = {};
    return function(node){
        var delegate;
        var handler = {
            init: function(){
                delegate = $.core.evt.delegatedEvent(node)
				delegate.add('close', "click", function(spec){
                    var data = spec['data'] || {};
                    node.style.display = "none";
					$.common.trans.global.request('closetipsbar' , {
						onSuccess : $.funcEmpty,
						onError : $.funcEmpty,
						onFail : $.funcEmpty
					},data);
                });
            },
            destroy: function(){}
        };
        it.destroy = handler.destroy;
        node && handler.init();
        return it;
    }
});
