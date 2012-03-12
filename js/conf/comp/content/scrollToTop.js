/**
 * 返回顶部功能
 * @id comp.content.scrollToTop
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 * 2011-7-11 Pjan | peijian@staff.sina.com.cn
 * 增加快捷键返回顶部
 */

STK.register('comp.content.scrollToTop', function($) {

	return function(node, opts) {
		if(node == null){
			$.log('[comp.content.scrollToTop]: scrollToTop need a node[id=base_scrollToTop] in BODY.');
			return {
				destroy : $.funcEmpty
			};
		}
		var lastScrollTime;
		var delay;
		var timer, bodyHeight, container;

		// 判断是否支持 fixed 定位
		var isFixedDisable = ($.getStyle(node, "position") != "fixed");

		// 显示或者隐藏“返回顶部”
		function showController(){
			var scrollPos = $.scrollPos();
			var topX = scrollPos.top;
			var winSize, top;
			if(topX > 0){
				$.setStyle(node, "visibility", "visible");
				if(isFixedDisable){ // 如果不支持 fixed 定位，就每次都给 top 属性赋值，特别针对 IE6
					winSize = $.winSize().height;
					top = topX + winSize - 190;
					$.setStyle(node, "top", top);
				}
			} else {
				$.setStyle(node, "visibility", "hidden");
			}
		}
		
		//绑定快捷键返回顶部
		$.hotKey.add(document.documentElement , ['t'] , scrollToTop , {'disableInInput' : true});
		
		// 减少频繁滚动的高峰计算，如果 onscroll 事件在 500 毫秒内被重复触发，则重新计时
		function deleyListen () {
			if(lastScrollTime != null){
				if(new Date().getTime() - lastScrollTime < 500){
					clearTimeout(delay);
					delay = null;
				}
			}
			lastScrollTime = new Date().getTime();
			delay = setTimeout(showController, 100);
		}
		
		// 滚动到顶部
		function scrollToTop(){
			document.body.scrollIntoView();
			return false;
		}
		
		// Modified by L.Ming 解决页面长度突然变小很多的时候，返回顶部仍然停留在页面最下方，中间出现大段空白的BUG
		// 因为仅 IE6 下是 position=absolute 定位，所以仅在 IE6 下通过定时器去轮询页面高度是否变化
		// 获取页面主容器
		container = $.sizzle('.W_main', document.body);
		function heightWatch(){
			if(container == ""){return;}
			var domHeight = $.core.dom.getSize(container[0]).height;
			if(bodyHeight != null && bodyHeight != domHeight){
				var top = parseInt($.getStyle(node, "top"));
				var winHeight = $.winSize().height;
				if(top > domHeight){
					$.setStyle(node, "top", domHeight - 25);
				}
				if(winHeight >= domHeight){
					$.setStyle(node, "visibility", "hidden");
				} else {
					showController();
				}
			}
			bodyHeight = domHeight;
		}
		
		//使用定时器来监听页面高度的变化，重定位返回全部的位置
		// Modified by L.Ming 所有浏览器都使用定时器来监听页面高度的变化
		timer = setInterval(heightWatch, 200);
		
		$.addEvent(window, "scroll", deleyListen);
		$.addEvent(node, "click", scrollToTop);
		deleyListen();
		
		var that = {			
			'destroy' : function () {
				$.removeEvent(window, "scroll", deleyListen);
				$.removeEvent(node, "onclick", scrollToTop);
				$.hotKey.remove(document.documentElement , ['t'] , scrollToTop , {type : 'keyup'});
				if(timer != null){
					clearInterval(timer);
					timer = null;
				}
			}
		};
		return that;
	};

});