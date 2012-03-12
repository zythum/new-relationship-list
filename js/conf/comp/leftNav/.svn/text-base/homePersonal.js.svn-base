/**
 * 导航个人信息，微博、粉丝、关注动态更新
 */
$Import('common.channel.feed');
$Import('common.channel.relation');
$Import("common.channel.topTip");
STK.register('comp.leftNav.homePersonal', function($){
    return function(node){
        var it = {}, nodes;
        var channels = {
            feedChannel: $.common.channel.feed,
            relationChannel: $.common.channel.relation,
            topTip: $.common.channel.topTip
        };
        
        var getNum = function(type){
            return parseInt(nodes[type].innerHTML, 10) || 0;
        }
        
        var parseDOM = function(){
            var ls = $.core.dom.builder(node);
            nodes = $.kit.dom.parseDOM(ls.list);
            nodes['items'] = $.core.dom.sizzle('a[action-type=leftNavItem]', node);
        };
        
        //event chanel
        var bindListenerFuns = {
            /**
             * 更新显示数
             */
            updateNum: function(type, aNum){
                return function(){
                    nodes[type].innerHTML = getNum(type) + aNum;
                };
            },
            updateAtNum: function(rt){
            
                var types = ["atcmt", "atme"], num = 0, nodeName, i;
                
                for (i in types) {
                    nodeName = types[i];
                    if (nodes[nodeName]) {
                        num = parseInt(rt[nodeName]);
                        
                        if (num >= 100) {
                            num = '99+';
                        }
                        else 
                            if (num <= 0) {
                                num = false;
                            }
                            else {
                                num += '';
                            }
                        
                        if (num) {
                            $.core.dom.setStyle(nodes[nodeName].parentNode, 'display', '');
                            nodes[nodeName].innerHTML = num;
                        }
                        else {
                            $.core.dom.setStyle(nodes[nodeName].parentNode, 'display', 'none');
                            nodes[nodeName].innerHTML = 0;
                        }
                    }
                }
                
                num = null, nodeName = null, i = null, types = null;
            }
        };
        
        var bindListener = function(){
            channels["feedChannel"].register('forward', function(args){
                args.isToMiniBlog && bindListenerFuns.updateNum('weibo', 1)();
            });
            channels["feedChannel"].register('publish', bindListenerFuns.updateNum('weibo', 1));
            channels["feedChannel"].register('delete', bindListenerFuns.updateNum('weibo', -1));
            channels["relationChannel"].register('follow', bindListenerFuns.updateNum('follow', 1));
            channels["relationChannel"].register('unFollow', bindListenerFuns.updateNum('follow', -1));
            channels["relationChannel"].register('removeFans', bindListenerFuns.updateNum('fans', -1));
            channels["topTip"].register('refresh', bindListenerFuns.updateAtNum);
        };
        
        var init = function(){
            parseDOM();
            bindListener();
        };
        
        init();
        
        it.destroy = function(){
        
        };
        
        return it;
        
    }
});
