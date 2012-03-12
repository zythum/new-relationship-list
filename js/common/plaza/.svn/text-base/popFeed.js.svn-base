/**
 * @author liusong@staff.sina.com.cn
 */
$Import('module.dialog');
$Import('module.rotateImage');
$Import('module.mask');
$Import('common.trans.plaza');
$Import('kit.extra.language');
$Import('common.plaza.parseFeed');
$Import('kit.dom.fix');
$Import('common.plaza.imageFeedForward');

STK.register('common.plaza.popFeed', function($){
	
	var  lang = $.kit.extra.language
		,ie6 = $.core.util.browser.IE6
		,bottom = 20
		,barHeight = 40
		,dragable
		,winH
		,winW
		,loading
		,clock
		,invalidate
		,cooldown
		,flag
		,point
		,inited
		,fix
		,dom
		,dEvt
		,outer
		,left
		,right
		,ltop
		,prev
		,next
		,hBtn
		,feed
		,hFlag
		,big
		,mask
		,loader
		,panel;
	
	var templete = ['<div node-type="view_layer_outer" class="layer_boutique_new"  style="z-index:10001">'
		,'  <div node-type="mask" class="mask"></div>'
		,'	<div node-type="view_layer_right" class="right_comment">'
		,'		<div class="feed_lists" node-type="feed">'
		,'		</div>'
		,'	</div>'
		,'  <a href="#" node-type="view_split" action-type="view_split" onclick="return false;" class="pop_arrow"><em class="gt"></em></a>'
		,'	<div node-type="view_layer_left" action-type="close" class="boutique_pic">'
		,'		<div class="cls_bar" node-type="view_layer_top"><a href="#" onclick="return false;" title="',lang('#L{关闭}'),'" class="cls_btn" action-type="close"></a></div>'
		,'		<div class="pic_body">'
		,'			<p class="top_bar" action-type="tool"><a href="#" onclick="return false;"  suda-data="key=plaza_image_forward&value=pop_left" class="trans" node-type="forward" action-type="feed_image_list">',lang('#L{转发}'),'</a><a href="#" onclick="return false;" action-type="big" node-type="big" class="show_big">',lang('#L{查看大图}'),'</a><i class="W_vline" class="turn_right">|</i><a href="#" onclick="return false;" action-type="left" class="turn_left">',lang('#L{向左转}'),'</a><i class="W_vline">|</i><a href="#" onclick="return false;" action-type="right" class="turn_right">',lang('#L{向右转}'),'</a></p>'
		,'		<div node-type="view_layer_panel" action-type="next"  suda-data="key=plaza_chosen_image_open&value=plaza_chosen_image_open" class="big_pic" style="text-align:center"></div><a href="#" node-type="prev"  suda-data="key=plaza_chosen_image_open&value=plaza_chosen_image_open" action-type="prev" title="',lang('#L{上一张}'),'" onclick="return false;" class="arrow left_arrow"></a><a href="#" node-type="next"  suda-data="key=plaza_chosen_image_open&value=plaza_chosen_image_open" title="',lang('#L{下一张}'),'" action-type="next" onclick="return false;" class="arrow right_arrow"></a>'
		,'		</div>'
		,'	</div>'
		,'</div>'].join('');
		
	//指针管理
	var pointer = {
		'grab' : function(){
			left.style.cursor = 'default';
			panel.style.cursor = 'pointer';
		}
		,'grabing' : function(){
			panel.style.cursor = 'move';
			left.style.cursor = 'move';
		}
	};
	//按键管理
	var keyAccess = {
		//left
		'37' : function(){
			$.fireEvent(prev, 'click');
		}
		//right
		,'39' : function(){
			$.fireEvent(next, 'click');
		}
		,'27' : function(){
			destroy();
		}
		//up
		,'38': function(evt){
			scrollUtils.action(panel, -1)
		}
		//down
		,'40': function(){
			scrollUtils.action(panel, 1)
		}
	};
	//拖拽管理
	var dragUtils = {
		'start':function(evt, pos){
			cooldown = new Date();
			flag = pos.clientY;
			point = panel.scrollTop;
			pointer.grabing();
			if ($.IE && (panel.setCapture !== undefined)) {
				panel.setCapture();
			}
		}
		,'end':function(){
			pointer.grab();
			if ($.IE && (panel.setCapture !== undefined)) {
				panel.releaseCapture();
			}
		}
		,'ing':function(evt, pos){
			panel.scrollTop = point - (pos.clientY - flag);
		}
	};
	//滚动管理
	var scrollUtils = {
		'entity': function(evt){
			var node = $.fixEvent(evt).target;
			if($.contains(left, node)||(left === node)){
				node = panel;
			}else if($.contains(right, node)||(right === node)){
				node = right;
			}
			return node
		}
		,'action': function(node, detail){
			node.scrollTop+= detail > 0? 20: -20;
		}
		,'mousewheel' : function(evt){
			scrollUtils.action(scrollUtils.entity(evt), -evt.wheelDelta)
			$.stopEvent();
		}
		,'DOMMouseScroll': function(evt){
			scrollUtils.action(scrollUtils.entity(evt), evt.detail)
		}
	};
	//重绘管理
	var rander = {
		'getImg' : function(){
			var img = $.E('rimg');
			img && (img.style.paddingBottom = '0px');
			return $.sizzle('[id=rimg]',panel)[0];
		}
		,'isInner' : function(){
			var h = rander.getImgHeight();
			return !!((h + barHeight + bottom) < winH)
		}
		,'getImgHeight': function(){
			var img = rander.getImg();
			return ((img||{'offsetHeight': 200}).offsetHeight);
		}
		,'getPanelHeight':function(){
			return rander.isInner()? (rander.getImgHeight() + bottom): (winH - bottom - barHeight);
		}
		,'getLeftTop': function(){
			return (rander.isInner()? (winH - rander.getPanelHeight())/2: 20);
		}
		,'img': function(){
			var img = rander.getImg();
			!rander.isInner() && img && (img.style.paddingBottom = bottom + 'px');
		}
		,'nav': function(){
			prev.style.top = next.style.top = ((winH-55)/2 - rander.getLeftTop()) + 'px';
		}
		,'vertical': function(){
			ltop.style.height = rander.getLeftTop() + 'px';
		}
		,'panel': function(){
			panel.style.height = rander.getPanelHeight() + 'px';
			rander.img();
		}
		,'left' : function(){
			rander.vertical();
			rander.nav();
			rander.panel();
		}
		,'layer' : function(){
			//init outer
			$.setStyle(outer, 'width', winW + 'px');
			$.setStyle(outer, 'height', winH + 'px');
			//init right
			$.setStyle(right, 'height', winH + 'px');
			$.setStyle(left,  'height', winH + 'px');
		}
		,'draw' : function(){
			var pageSize = $.winSize()
			winW = pageSize.width
			winH = pageSize.height;
			rander.layer();
			rander.left();
			pointer.grab();
		}
		,'button': function(oNode, className, bVisible){
			if(!bVisible){
				oNode.setAttribute('action-data','');
				className && (oNode.className = className);
			}else{
				className && (oNode.className = className);
			}
		}
		,'overflow'  : function(value){
			if($.IE){
				document.documentElement.style.overflowY = value;
				document.documentElement.style.overflowX = 'hidden';
				window.scrollTo(0, $.scrollPos().top);
			}else{
				document.body.style.overflowY = value;
			}
		}
		,'hidden' : function(){
			fix.destroy();
			outer.style.display = 'none';
		}
	};
	//查看大图
	var popBigImage = function(info){
		if(!invalidate){return}
		if((info = info.data) && info.url){
			window.open(info.url);
		}
		return false;
	};
	var rotateComplete = function(){
		rander.panel()
	}
	//向左转
	var rotateLeft = function(){
		if(!invalidate){return}
		$.module.rotateImage.rotateLeft('rimg',null,rotateComplete,440);
		return false;
	};
	//向右转
	var rotateRight = function(){
		if(!invalidate){return}
		$.module.rotateImage.rotateRight('rimg',null,rotateComplete,440)
		return false;
	};
	//右侧feed开合
	var hiddFeed = function(){
		if(!hFlag){
			left.style.marginRight = '0px';
			right.style.display = 'none';
			$.sizzle('em',hBtn)[0].className = "lt";
			hFlag = 1;
		}else{
			left.style.marginRight = '350px';
			right.style.display = '';
			$.sizzle('em',hBtn)[0].className = "gt";
			hFlag = null;
		}
		return false;
	}
	//按键处理
	var onKeyUp = function(event){
		var target = $.fixEvent(event).target;
		if(target.tagName == "TEXTAREA" && target.value!=""){return}
		if(/^(37|39|32|27)$/.test(event.keyCode) && event.type=="keypress"){return}
		var method = keyAccess[event.keyCode];
		cooldown = new Date();
		if(method){
			method(event);
			$.stopEvent();
		}
	};
	//下一条
	var goNext = function(oEvent){		
		if(oEvent.data.mid && ((new Date() - cooldown)<200)){
			request(oEvent.data.mid)
		}
		return false;
	};
	//上一条
	var goPrev = function(oEvent){
		if(oEvent.data.mid){
			request(oEvent.data.mid)
		}
		return false;
	};
	//阻止关闭事件产生
	var tool = function(){
		return false
	}
	//图片显示动画
	var animation = function(node, bVisible, func){
		clearInterval(clock);
		var img = $.E('rimg');
		var queue = [1, 0.9, 0.8, 0.7, 0.6];
		if(bVisible){queue.reverse()}
		if(node){
			clock = setInterval(function(){
				if(queue.length){
					var o = queue.shift();
					$.setStyle(node, 'opacity', o)
					return;
				}
				clearInterval(clock);
				func && func();
			},50);
		}
	};
	//显示加载状态
	var showLoading = function(){
		invalidate = 0;
		panel.scrollTop = 0;
		rander.button(prev, 'arrow left_disable', false);
		rander.button(next, 'arrow right_disable', false);
		rander.button(panel, '', false);
		rander.button(forward, '', false);
		if(!loading){
			loading = new Image();
			loading.style.width = '70px';
			loading.style.height = '6px';
			loading.src = [$CONFIG['cssPath'],'style/images/common/big_loading.gif'].join('');
			loading.style.position = 'absolute';
			loading.style.left = '185px';
		}
		loading.style.paddingTop = (panel.offsetHeight - 43)/2 + 'px';
		panel.appendChild(loading);
		feed.innerHTML = '';
	};
	//显示转发
	var showForward = function(oEvent){
		if(!invalidate){return false};
		var data = oEvent.data;
		$.foreach(['originNick','forwardNick','origin','reason'], function(k){
			if(data[k]){
				data[k] = decodeURIComponent(data[k]);
			}
		});
		$.common.plaza.imageFeedForward(oEvent.el, oEvent.data);
		return false;
	};
	//回收加载成功函数
	var gcLoader = function(){
		if(loader){
			loader.onload = null;
		}
	};
	//内容加载成功
	var onSuccess = function(json){
		if(json && json.code && json.code == "100000" && json.data){
			if (!inited) { return }
			gcLoader();
			loader = new Image()
			var data = json.data
				,mid = data.mid;
			$.setStyle(loader, 'opacity', 0.5);
			
			var showFeed = function(){
				if(data.prev) {
					if($CONFIG['picData'] && ($CONFIG['picData']['data'][0]['mid']!=mid)){
						prev.setAttribute('action-data','mid=' + data.prev);
						rander.button(prev, 'arrow left_arrow', true);
					}
				}
				if(data.next) {
					next.setAttribute('action-data','mid=' + data.next);
					panel.setAttribute('action-data', 'mid=' + data.next);
					rander.button(next, 'arrow right_arrow', true);
				}
				if(data.actiondata){
					forward.setAttribute('action-data', data.actiondata);
				}
				if(data.url){
					big.setAttribute('action-data', 'url=' + data.url);
				}
				if(data.html && data.mid){
					feed.innerHTML = data.html;
					$.common.plaza.parseFeed(feed, data.mid);
					var btn = $.sizzle('a[action-type=feed_list_comment]', feed)[0];
					btn && $.fireEvent(btn, 'click');
				}
				invalidate = 1;
			}
			loader.onload = function(){
				if(inited){
					loader.id = 'rimg';
					loading.parentNode.removeChild(loading);
					loader.width = loader.width;
					loader.height = loader.height;
					loader.setAttribute('suda-data', 'key=plaza_chosen_image_open&value=plaza_chosen_image_open');
					panel.innerHTML = '';
					panel.appendChild(loader);
					animation(loader, true, showFeed);
					rander.draw();
				}
				gcLoader();
			}
			loader.src = json.data.url;
		}
	};
	
	var trans = $.common.trans.plaza.getTrans('feedInfo', {
		'onSuccess' : onSuccess
	});
	
	var request = function(mid){
		showLoading();
		setTimeout(function(){
			trans.request({
				 'class': $CONFIG['class']
				,'ts'   : $CONFIG['ts']
				,'mid' : mid
			});
		},100)
	};
	//初始化变量
	var initParam = function(){
		dom      = $.builder(templete);
		outer    = dom.list['view_layer_outer'][0];
		left     = dom.list['view_layer_left'][0];
		panel    = dom.list['view_layer_panel'][0];
		right    = dom.list['view_layer_right'][0];
		ltop     = dom.list['view_layer_top'][0];
		next     = dom.list['next'][0];
		prev     = dom.list['prev'][0];
		feed     = dom.list['feed'][0];
		big      = dom.list['big'][0];
		mask     = dom.list['mask'][0];
		forward  = dom.list['forward'][0];
		hBtn     = dom.list['view_split'][0];
		fix      = $.kit.dom.fix(outer, 'lt');
		dEvt     = $.delegatedEvent(outer);
		dragable = $.drag(left, {'actObj' : left});
	};
	
	var removeEvent = function(){
		dEvt.destroy();
		$.custEvent.remove(left, 'dragStart', dragUtils.start);
		$.custEvent.remove(left, 'draging', dragUtils.ing);
		$.custEvent.remove(left, 'dragEnd', dragUtils.end);
		$.removeEvent(document, 'keyup', onKeyUp);
		$.removeEvent(document, 'keypress', onKeyUp);
		$.removeEvent(outer, 'mousewheel', scrollUtils.mousewheel);
		$.removeEvent(outer, 'DOMMouseScroll', scrollUtils.DOMMouseScroll);
		$.removeEvent(window, 'resize', rander.draw);
	};
	var bindEvent = function(){
		dEvt.add('left' , 'click', rotateLeft);
		dEvt.add('right', 'click', rotateRight);
		dEvt.add('prev' , 'click', goPrev);
		dEvt.add('next' , 'click', goNext);
		dEvt.add('big'  , 'click', popBigImage);
		dEvt.add('close', 'click', destroy)
		dEvt.add('view_split', 'click', hiddFeed);
		dEvt.add('tool', 'click', tool);
		dEvt.add('feed_image_list', 'click', showForward);
		$.addEvent(document, 'keyup', onKeyUp);
		$.addEvent(document, 'keypress', onKeyUp);
		$.custEvent.add(left, 'dragStart', dragUtils.start);
		$.custEvent.add(left, 'draging', dragUtils.ing);
		$.custEvent.add(left, 'dragEnd', dragUtils.end);
		$.addEvent(outer, 'mousewheel', scrollUtils.mousewheel);
		$.addEvent(outer, 'DOMMouseScroll', scrollUtils.DOMMouseScroll);
		$.addEvent(window, 'resize', rander.draw);
	};

	var init = function(){
		if (inited) { return} 
		initParam();
		rander.draw();
		bindEvent();
		document.body.appendChild(outer);
		inited = 1;
	};
	
	var destroy = function(){
		if((new Date() - cooldown)<200){
			clearInterval(clock);
			right.innerHTML = "";
			gcLoader();
			removeEvent();
			fix.destroy();
			dragable.destroy();
			$.removeNode(outer);
			rander.overflow('auto');
			dom = outer = left = panel = right = next = prev = fix = dEvt = dragable = inited = feed = forward = big = mask = hBtn = loading = ltop = null;
			$.stopEvent();
		}
	};
	
	return function(mid){
		rander.overflow('hidden');
		init();
		fix.setFixed(true);
		request(mid)
	}
});