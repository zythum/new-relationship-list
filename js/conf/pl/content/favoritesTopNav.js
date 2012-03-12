/**
 * 收藏最多的微博
 * @id pl.content.favoritesTopNav
 * @create 2011.04.18
 * @author yadong | yadong2@staff.sina.com.cn
 * @return {Object} 实例
 */
$Import('comp.content.favoritesTopNav');
STK.pageletM.register("pl.content.favoritesTopNav", function($){
    var opts = {};
    var node = $.E("pl_content_favoritesTopNav");
    var that = $.comp.content.favoritesTopNav(node, opts);
    return that;
});
