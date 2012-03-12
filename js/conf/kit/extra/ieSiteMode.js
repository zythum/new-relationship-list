/**
 * @author wangliang3
 */
STK.register('kit.extra.ieSiteMode', function($){
    var it = {};
    
    //	var hasExternal = window.external&&window.external.msSiteModeClearIconOverlay;
    
    it.setIcon = function(src, title){
        try {
            it.clearIcon();
            src = src || $CONFIG['imgPath'] + 'style/images/common/favicon/newMsg.ico';
//            src = 'http://img.t.sinajs.cn/t35/style/images/common/favicon/newMsg.ico';
            title = title || '新微博';
            window.external.msSiteModeSetIconOverlay(src, title);
        } catch (e) {
        };
    };
    it.clearIcon = function(){
        try {
            window.external.msSiteModeClearIconOverlay();
        } catch (e) {
        }
    };
    return it;
});
