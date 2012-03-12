/**
 * 带有(可选)箭头指向的基础弹层，由STK.module.layer衍生
 * 拥有全部STK.module.layer的函数
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('module.layer');
STK.register('ui.bubbleLayer', function($){
	var template = 
		'<div class="W_layer" node-type="outer" style="display:none;">'+
			'<div class="bg"><div class="effect">'+
				'<table cellspacing="0" cellpadding="0" border="0">'+
					'<tbody><tr><td>'+
						'<div class="content clearfix" node-type="inner"></div>'+
					'</td></tr></tbody>'+
				'</table>'+
				'<div node-type="arrow" class="#{arrow_type}"></div>'+
			'</div></div>'+
		'</div>';
	/**
	 * @param {String} con 弹出层内容
	 * @param {String} arrow (t,d,l,r)上下左右箭头指向，可不填
	 */
	return function(con, arrow){
		var layer, box, content, that, arrowEl, temp;
		var getArrowClassName = function(arrow){
			arrow	= arrow ? 'arrow arrow_' + arrow:'';
			return arrow;
		}
		var setPostion = function(pos){
			box.style.top = pos['t'] + 'px';
			box.style.left = pos['l'] + 'px';
			return that;
		};
		
		var setMiddle = function(){
			var win = $.core.util.winSize();
			var dia = layer.getSize(true);
			box.style.top	= $.core.util.scrollPos()['top'] + (win.height - dia.h)/2 + 'px';
			box.style.left	= (win.width - dia.w)/2 + 'px';
			return that;
		};
		
		var setContent = function(cont){
			if(typeof cont === 'string'){
				content.innerHTML = cont;
			}else{
				content.appendChild(cont);
			}
			return that;
		};
		
		/**
		 * 设置箭头位置 
		 * @param {String} arrow 箭头位置 t|b|l|r
		 * @param {String} pos 箭头偏移位置 top|left|left|right
		 */
		var setArrow = function(arrow, pos){
			var cssText = '';//默认清除
			if ((arrow === 't' || arrow === 'b')) {
				if (pos === 'right') {
					cssText = 'left:auto;right:30px;';
				} else if (pos === 'center') {
					cssText = 'left:auto;right:'+ (box.offsetWidth/2 - 8) +'px;';
				}
			} else if ((arrow === 'l' || arrow === 'r') && pos === 'bottom') {
				cssText = 'top:auto;bottom:20px;';
			}
			arrowEl.className = getArrowClassName(arrow);
			arrowEl.style.cssText = cssText;
			return that;
		};
		
		var setArrowPos = function(arrow){
			arrow = getArrowClassName(arrow);
			arrowEl.className = arrow;
			return that;
		};
		var init = function(){
			arrow	= getArrowClassName(arrow);
			temp	= template.replace(/\#\{arrow_type\}/g, arrow);
			layer	= $.module.layer(temp);
			box 	= layer.getOuter();
			content	= layer.getDom('inner');
			arrowEl	= layer.getDom('arrow');
			that 	= layer;
			con && setContent(con);
			document.body.appendChild(box);
		};
		init();
		that.setPostion	= setPostion;
		that.setMiddle	= setMiddle;
		that.setContent	= setContent;
		that.setArrow	= setArrow;
		return that;
	};
});