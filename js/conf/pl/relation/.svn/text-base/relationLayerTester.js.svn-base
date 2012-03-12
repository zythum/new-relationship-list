/**
 * @author 莳子
 */
$Import('kit.dom.parseDOM');
$Import("common.dialog.answerQuestion");

STK.pageletM.register('pl.relation.relationLayerTester', function($){
		var node = $.E("pl_relation_relationLayerTester");
		
		var buildDom = $.core.dom.builder(node);
		var nodes = $.kit.dom.parseDOM(buildDom.list);
		
		$.addEvent(nodes.answerQuestion, "click", function(){
			$.common.dialog.answerQuestion({
				"1":{
					"nickname"  : "A",
					"questions" : [
					    {id:1,question:"AQ1"},
					    {id:2,question:"AQ2"}
					]
				}
			});
		});
		
		return function(){};
});