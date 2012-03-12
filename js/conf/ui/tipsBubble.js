/**
 * 带有(可选)箭头指向的基础弹层，由STK.module.layer衍生
 * 拥有全部STK.module.layer的函数
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('module.layer');
STK.register('ui.tipsBubble', function($){
	var template = 
		'<div node-type="outer" class="layer_tips layer_tips_version layer_tips_intro">'+
			'<div class="layer_tips_bg">'+
				'<a href="javascript:;" node-type="closeBtn" class="W_close_color"></a>'+
				'<div class="layer_tips_cont" node-type="inner"></div>'+
				'<span node-type="arrow" class="arrow_up"></span>'+
			'</div>'+
		'</div>';
		
	/**
	 * @param {String} con 弹出层内容
	 * @param {String} arrow (t,d,l,r)上下左右箭头指向，可不填
	 */
	return function(con){
		var layer, box, content, closeBtn, that, arrowEl, temp;
		var setPosition = function(pos){
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
		
		var setContent = function(cont, hasClose){
			if(typeof cont === 'string'){
				content.innerHTML = cont;
			}else{
				content.appendChild(cont);
			}
			closeBtn.style.display = hasClose ? '' : 'none'; 
			return that;
		};
		
		/**
		 * 设置箭头位置 
		 * @param {String} arrow 箭头位置 t|b|l|r
		 * @param {String} pos 箭头偏移位置 top|left|left|right
		 */
		var setArrow = function(args){
			if(arrowEl){
				arrowEl.className = args['className'] || '';
				arrowEl.style.cssText = args['style'] || '';
			}
			return that;
		};
		
		var init = function(){
			layer	= $.module.layer(template);
			box 	= layer.getOuter();
			content	= layer.getDom('inner');
			arrowEl	= layer.getDom('arrow');
			closeBtn= layer.getDom('closeBtn');
			that 	= layer;
			con && setContent(con);
			document.body.appendChild(box);
		};
		init();
		that.setPosition= setPosition;
		that.setMiddle	= setMiddle;
		that.setContent	= setContent;
		that.setArrow	= setArrow;
		return that;
	};
});