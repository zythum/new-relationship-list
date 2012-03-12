/**
 * 微博单条页--相关微博用户
 * @id pl.relation.relatedPersonsNav
 * @created 2011.04.22
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author yadong | yadong2@staff.sina.com.cn
 */
$Import("comp.relation.relatedPersonsNav");
STK.pageletM.register("pl.relation.relatedPersonsNav", function($){
    var opts = {};
    var node = $.E("pl_relation_relatedPersonsNav");
    var that = $.comp.relation.relatedPersonsNav(node, opts);
    return that;
});
