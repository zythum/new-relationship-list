/**
 * @author wangliang3
 * 窄版右侧 他人首页 关注状态
 */

$Import('common.relation.baseFollow');
STK.pageletM.register("pl.content.followStatus", function($){
    return $.common.relation.baseFollow($.E('pl_content_followStatus'));
});

