/**
 * 用户相关的提示信息
 * 
 * @author runshi@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('common.trans.global');
$Import('common.layer.guide');
$Import('module.dialog');
$Import('kit.extra.language');

STK.register('comp.content.badgeTips', function($){
	var $L = $.kit.extra.language;
	var $T = $.core.util.templet;
	var TPL = {
		LAYER : '' + 
			'<div node-type="outer" class="layer_tips layer_tips_version layer_tips_invitekey" style="width:200px;height:100px;left:100px; top:300px;">' +
				'<div class="layer_tips_bg">' +
					'<ul>' +
						'<li node-type="inner"></li>' +
						'<li class="link_btn"><a node-type="into" class="W_btn_b" href="#" onclick="return false;"><span>#L{去看看}</span></a><a class="link" node-type="iknow">#L{知道了}</a></li>' +
					'</ul>' +
					'<span node-type="arrow"></span>' +
				'</div>' +
			'</div>',
		CONTENT : $L('#L{我是一段测试}')
	};
	var guide = $.common.layer.guide();
	
	return function(node){
		var parent = node,dialog,doms;
		that = {
			show : function(){
				var num = parent.getAttribute('num');
				
				if(!num) return;

				dialog = $.module.dialog($L(TPL.LAYER));
				doms = dialog.getDomList();	
				//doms.into[0].setAttribute('href', parent.getAttribute('href'));
				// dialog.setContent($T(TPL.CONTENT, {'NUM': num}));
				
				// $.setStyle(doms.outer[0], 'left', '-10000px');
				dialog.show();
				
				that.reLayout();
				that.bind();
			},
			hide : function(){
				dialog.hide();
			},
			iknown : function(){
				$.common.trans.global.getTrans('closetipsbar' , {
					onSuccess : that.hide
				}).request({
					'type' : 5
				});
			},
			into : function(){
				$.common.trans.global.getTrans('closetipsbar' , {
					onSuccess : function(){
						window.location.href = parent.getAttribute('href');
						try{that.hide();}catch(e){}
					}
				}).request({
					'type' : 5
				});
			},
			reLayout: function(){
				var pos = guide.getLayerPosition(parent, doms.outer[0], "left", doms.arrow[0]);
				console.log(pos);
				guide.setPosition({layer:doms.outer[0], arrow:doms.arrow[0]}, pos);
				$.setStyle(doms.outer[0], 'position', 'absolute');
				$.setStyle(doms.arrow[0], 'position', 'absolute');
			},
			bind : function(){
				$.addEvent(doms.into[0], 'click', that.into);
				$.addEvent(doms.iknow[0], 'click', that.iknown);
				$.addEvent(window, "resize", that.reLayout);
			},
			destroy : function(){
				$.removeEvent(doms.into[0], 'click', that.into);
				$.removeEvent(doms.iknow[0], 'click', that.iknown);
				$.removeEvent(window, "resize", that.reLayout);
				dialog = null,
				doms = null,
				nodes = null;
			}
		};
		that.show();
		// setTimeout(that.show, 1000);

		return that;
	}
});