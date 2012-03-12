/**
 * @fileoverview
 * 分组更多及下拉浮层的显示隐藏控制
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
STK.register("common.feed.groupAndSearch.groupMoreControl", function($){

	var groupMoreBtn;
	var feedGroupLayer;
	var timer;
	function groupOver() {
		clearTimeout(timer);
		timer = setTimeout(groupMoreOver , 200);
	}
	function groupOut() {
		clearTimeout(timer);
	}
	function groupMoreOver () {
		// 显示菜单
		var isHide = ($.core.dom.getStyle(feedGroupLayer, "display") == "none");
		
		var pos = $.core.dom.position(groupMoreBtn);
//		console.dir(pos);
		var css = "position: absolute; top: " + (pos.t + 28) + "px; left: " + pos.l +"px; z-index: 99;";
		
		if(isHide){
			feedGroupLayer.style.cssText = css;
		}
//		$.core.ani.tween(group_more_div, 'height', 1, 1.2, 'linear', {});
		
		// 给 BODY 绑定滑过的事件，下拉浮层消失后解除绑定
		$.core.evt.addEvent(document.body, "mousemove", hitTest);
	}

	// 碰撞检测，检测鼠标和“更多”及“下拉浮层”的碰撞
	function hitTest(){
		var ev = $.core.evt.getEvent();
		var hit1 = $.core.evt.hitTest(groupMoreBtn, ev);
		var hit2 = $.core.evt.hitTest(feedGroupLayer, ev);
		var isHit = (hit1 || hit2);
		if(!isHit){
			var isShow = ($.core.dom.getStyle(feedGroupLayer, "display") != "none");
			if(isShow){
				$.core.dom.setStyle(feedGroupLayer, "display", "none");
			}
			$.core.evt.removeEvent(document.body, "mousemove", hitTest);
		}
	}

	return {
		// 绑定到“更多”
		on: function (nodes, opts) {
		
			// 更多按钮 groupMoreBtn
			groupMoreBtn = nodes.groupMoreBtn;
			// 下拉浮层 feedGroupLayer
			feedGroupLayer = nodes.feedGroupLayer;
			
			// 给“更多”按钮绑定滑过显示下拉的事件
			if(groupMoreBtn != null){
				$.core.evt.addEvent(groupMoreBtn, "mouseover", groupOver);
				$.core.evt.addEvent(groupMoreBtn , "mouseout" , groupOut);
			}
		},
		// “更多”解除绑定
		off : function () {
			if (groupMoreBtn != null) {
				$.core.evt.removeEvent(groupMoreBtn, "mouseover", groupOver);
				$.core.evt.removeEvent(groupMoreBtn , "mouseout" , groupOut);
			}
		}
	};
});
