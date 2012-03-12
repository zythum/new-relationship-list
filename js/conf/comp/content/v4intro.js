/**
 * @author chenjian2
 * 求邀请码：v3用户向v4用户提出私信邀请码请求
 */
$Import('kit.extra.language');
$Import('common.dialog.sendMessage');
STK.register('comp.content.v4intro', function($){
    var L = $.kit.extra.language;
	var it = {};
    return function(el){
        var delegate;
        var handler = {
            init: function(){
                delegate = $.core.evt.delegatedEvent(el)
				delegate.add('postMsg', "click", function(obj){
                    $.common.dialog.sendMessage({
                        'uid': obj.data.uid || '',
                        'userName': obj.data.nickName || '',
						'content':L('#L{听说你升级了新版微博，给我一枚邀请码吧，多谢哦。}')
                    }).show();
					
                });
            },
            destroy: function(){
                delegate && delegate.destroy();
            }
        };
        it.destroy = handler.destroy;
        el && handler.init();
        return it;
    }
});
