/**
 * common.editor.widget.module.changePage
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
 */
STK.register('common.editor.widget.module.changePage', function($){
	return function(opts){
		var domList = opts.domList;
		var pageList = opts.pageList;
		var step = opts.step;
		var curPage = opts.curPage;
		var pointer = (curPage-1)*step;
		var max = domList.length;
		$.core.dom.setStyles(domList,'display','none');

		for(var i=pointer,l=(pointer+step>max)?max:pointer+step;i<l;i++){
			$.core.dom.setStyle(domList[i],'display','');
		}
		for(var i=0,l=pageList.length;i<l;i++){
			if($.core.dom.hasClassName(pageList[i],'current')){
				$.core.dom.removeClassName(pageList[i],'current');
				$.core.dom.addClassName(pageList[curPage-1],'current');
				break;
			}
		}
	}
});
