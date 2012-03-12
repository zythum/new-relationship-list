/**
 * 公开分组引导层
 */
$Import('common.group.publicGroupGuide');

STK.register('comp.relation.publicGroupGuide',function($){
	var imgsrc = $CONFIG['imgPath'] + 'style/images/layer/followlists_tip.png';
	return function(node){
		var that = {}, dia;
		
		if($.isNode(node)){
			var img = new Image();
			img.onload = function(){
				dia = $.common.group.publicGroupGuide();
				dia.show();
				dia.setMiddle();
			};
			img.src = imgsrc;
		}
		
		var destroy = function(){
			dia && dia.destroy();
		};
		
		that.destroy = destroy;
		return that;
	};
});