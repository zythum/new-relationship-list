/**
 * @author lianyi@staff.sina.com.cn
 * 更改按钮样式
 * changeTo方法，提供变成loading状态和变成normal状态
 * html模板
 * <a href="javascript:void(0)" class="W_btn_b btn_noloading" node-type="submit_btn">
 * 		<span><b class="loading"></b><em node-type="btnText">我是字，我是字</em></span>
 * </a>
 * 
 * 使用方法
 * 			(1) 将发布按钮由发布心情变成提交中...
 * 			var postBtn = nodes.commentBtn;
 * 			$.kit.dom.btnState({
 *				btn : postBtn,
 *				state : "loading",
 *				loadText : $L("#L{提交中...}"),
 *				commonText : $L("#L{发布心情}")						
 *			});
 * 
 *		    (2) 将发布按钮由提交中..变成发布心情.
 * 			var postBtn = nodes.commentBtn;
 * 			$.kit.dom.btnState({
 *				btn : postBtn,
 *				state : "normal",
 *				loadText : $L("#L{提交中...}"),
 *				commonText : $L("#L{发布心情}")						
 *			});
 * 
 */
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
STK.register("kit.dom.btnState" , function($) {
	/**
	 * spec说明
	 * 
	 * btn : 按钮
	 * state : loading 或 normal
	 * loadText : "提交中...",
	 * commonText : "提交"
	 */
	var changeTo = function(spec) {
		var getDom = function(dom) {
			var doms = $.kit.dom.parseDOM($.builder(dom).list);
			if(!doms['submit_btn']) {
				doms['submit_btn'] = dom;				
			}
			return doms;
		};
		var $L = $.kit.extra.language;
		spec = $.parseParam({
			btn : null,
			state : "loading",
			loadText : $L("#L{提交中...}"),
			commonText : $L("#L{提交}") 	
		} , spec);
		var doms = getDom(spec.btn);
		var state = spec.state;
		//变成loading状态
		if(state == 'loading') {
			doms['submit_btn'].className = 'W_btn_a_disable';
			doms['btnText'].innerHTML = spec.loadText;			
		} else {
		//变成普通状态
			doms['submit_btn'].className = 'W_btn_b btn_noloading';
			doms['btnText'].innerHTML = spec.commonText;
		}			
	};
	return changeTo;
});
