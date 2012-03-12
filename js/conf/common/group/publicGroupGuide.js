/**
 * 分组引导
 */
$Import('kit.extra.language');
$Import('module.mask');
$Import('module.layer');
$Import('module.mask');

STK.register('common.group.publicGroupGuide',function($){
	var firstgroup = $CONFIG['group'][0];
	if(firstgroup){
		firstgroup = '/'+ $CONFIG['uid'] +'/follow?gid='+firstgroup.gid;
	}else{
		firstgroup = '/'+ $CONFIG['uid'] +'/follow?t=1&ignoreg=1';
	}
	
	var TEMP = 
		'<div node-type="outer" style="top:1800px;left:50px;z-index:10001" class="lsfl_tip">'+
			'<a href="javascript:;" action-type="close" class="close" title="#L{关闭}"></a>'+
			'<a href="'+ firstgroup +'" node-type="inner" action-type="oldBtn" target="publicGroup" class="a1" title="#L{公开已有分组}"></a>'+
			'<a href="javascript:;" action-type="newBtn" class="a2" title="#L{创建新分组}"></a>'+
		'</div>';
	
	var $L = $.kit.extra.language;
	
	return function(){
		var that = {},
			box, dEvent, addG, layer;
		
		var setMiddle = function(){
			var win = $.core.util.winSize();
			var dia = layer.getSize(true);
			box.style.top	= $.core.util.scrollPos()['top'] + (win.height - dia.h)/2 + 'px';
			box.style.left	= (win.width - dia.w)/2 + 'px';
			return that;
		};
		
		var hide = function(){
			layer.hide();
			new Image().src = '/aj/bubble/closebubble?bubbletype=10';
		};
		/**
		 * 设置箭头位置 
		 * @param {String} arrow 箭头位置 t|b|l|r
		 * @param {String} pos 箭头偏移位置 top|left|left|right
		 */

		var init = function(){
			layer	= $.module.layer($L(TEMP));
			box 	= layer.getOuter();
			dEvent	= $.delegatedEvent(box);
			document.body.appendChild(box);
			
			dEvent.add('close', 'click', function(){
				hide();
				$.preventDefault();
			});
			
			dEvent.add('newBtn', 'click', function(){
				hide();
				addG = addG || $.common.dialog.addGroup();
				addG.show({publish:true,OK:function(data){
					window.location.href = "/" + $CONFIG['uid'] + "/follow?gid=" + data.gid;
				}});
			});
			
			dEvent.add('oldBtn', 'click', function(){
				hide();
			});
			
			$.custEvent.add(layer, 'show', function(){
				$.module.mask.showUnderNode(box);
			});
			
			$.custEvent.add(layer, 'hide', function(){
				$.module.mask.back();
				setMiddle();
			});
		};
		
		init();
		
		var destroy = function(){
			dEvent.destroy();
		};
		that.show = layer.show;
		that.hide = hide;
		that.setMiddle = setMiddle;
		that.destroy = destroy;
		return that;
	};
});