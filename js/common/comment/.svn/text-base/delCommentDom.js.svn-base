/**
 *  zhoujiequn || jiequn @staff.sina.com.cn
 *  qiyuheng || yuheng@staff.sina.com.cn
 *  删除Comment节点
 *  @param {Node} el
 */
STK.register('common.comment.delCommentDom',function($){
	var getStyle = $.core.dom.getStyle;
	/**
	 * 节点包装：为了在删除comment节点时，使用动画效
	 * 果，在被删除节点外层增加一个特定的div节点
	 * @param {Node} el
	 */
	function packagingEl(el){
		var height	= el.offsetHeight + getStyle(el,'marginBottom') + getStyle(el,'marginTop') ,
			div		= $.C('div');
			div.style.cssText = 'position:relative;overflow:hidden;height:'+height+'px;';
		$.core.dom.replaceNode(div, el);
		el.style.position = 'relative';
		div.appendChild(el);
		return div;
	}

	return function(spec){
		var div		= packagingEl(spec.el),
			endCb	= spec.endCb,
			ani 	= $.core.ani.tween(div, {
				'end': function() {
					$.core.dom.removeNode(div);
					(typeof endCb === 'function') && endCb();
				},
				'duration': 300,
				'animationType': 'easeoutcubic'
			});
			
		ani.play({'height' : 0},{
			'staticStyle' : 'overflow:hidden;'
		});

	};
});