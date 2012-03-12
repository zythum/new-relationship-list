/**
 * common.editor.widget.module.clickPrev
 * @id STK.common.editor.widget.module.clickPrev
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
 */
STK.register('common.editor.widget.module.clickPrev', function($){
	return function(nodes,step){
		STK.core.evt.stopEvent();

		var _pointer= nodes.cPage.getAttribute('pointer')*1;
		var _nextPointer = _pointer-step;
		var _category = $.core.dom.sizzle('[action-type = "changeCategory"]',nodes.categoryList);
		var _length = _category.length;

		if($.core.dom.hasClassName(nodes.next,'next_d')){
			$.core.dom.removeClassName(nodes.next,'next_d');
			$.core.dom.addClassName(nodes.next,'next');
		}
		if(_nextPointer < 0){


		}else{

			var _em = $.core.dom.sizzle('em',nodes.categoryList);
			var hightLight = _category.slice(_nextPointer,_pointer);
			var _emh = _em.slice(_nextPointer,_pointer);

			/*for(var i=0,l=_category.length;i<l;i++){
				$.core.dom.setStyle(_category[i],'display','none');
			}*/
			$.core.dom.setStyles(_category,'display','none');

			/*for(var i=0,l=_em.length;i<l;i++){
				$.core.dom.setStyle(_em[i],'display','none');
			}*/
			$.core.dom.setStyles(_em,'display','none');

			/*for(var i=0,l=hightLight.length;i<l;i++){
				$.core.dom.setStyle(hightLight[i],'display','');
			}*/
			$.core.dom.setStyles(hightLight,'display','');

			for(var i=0,l=hightLight.length-1;i<l;i++){
				$.core.dom.setStyle(_emh[i],'display','');
			}

			nodes.cPage.setAttribute('pointer',_nextPointer);

			if( _nextPointer == 0){
				$.core.dom.removeClassName(nodes.prev,'pre');
				$.core.dom.addClassName(nodes.prev,'pre_d');
			}
		}	
	}
});

