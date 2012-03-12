/**
 * common.editor.widget.module.clickNext
 * @id STK.common.editor.widget.module.clickNext
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
 */
STK.register('common.editor.widget.module.clickNext', function($){
	return function(nodes,step){
		STK.core.evt.stopEvent();

		var _pointer= nodes.cPage.getAttribute('pointer')*1;
		var _nextPointer = _pointer+step;
		var _category = $.core.dom.sizzle('[action-type = "changeCategory"]',nodes.categoryList);
		var _length = _category.length;

		if($.core.dom.hasClassName(nodes.prev,'pre_d')){
			$.core.dom.removeClassName(nodes.prev,'pre_d');
			$.core.dom.addClassName(nodes.prev,'pre');
		}
		if(_nextPointer >= _length){

		}else{


			var _em = $.core.dom.sizzle('em',nodes.categoryList);
			var hightLight = _category.slice(_nextPointer,_nextPointer+6);
			var _emh = _em.slice(_nextPointer,_nextPointer+6);

			$.core.dom.setStyles(_category,'display','none');

			$.core.dom.setStyles(_em,'display','none');

			$.core.dom.setStyles(hightLight,'display','');
			
			for(var i=0,l=hightLight.length-1;i<l;i++){
				$.core.dom.setStyle(_emh[i],'display','');
			}
			nodes.cPage.setAttribute('pointer',_nextPointer);
			//$.log(_nextPointer);

			if(_length - _nextPointer < 6){
				$.core.dom.removeClassName(nodes.next,'next');
				$.core.dom.addClassName(nodes.next,'next_d');
			}
		}
	}
});
