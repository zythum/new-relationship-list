/**
 * @author wangliang3
 */
$Import('module.imgResize');
$Import('common.channel.plaze');
$Import('common.channel.slide');
$Import('common.extra.imageURL');

STK.register('common.plaza.choiceImg', function($){
	var resize = $.module.imgResize,
		ch_plaze = $.common.channel.plaze,
		ch_slide = $.common.channel.slide,
		imageURL = $.common.extra.imageURL;
	var cash = {};
	
    return function(pars){
        var img,cont,img_cont,loading,layer,imgSize,curstyle,gbdata,img_download = false;
        var it = {},slideStates={};
		
		//
		var viewHeight = 460;
		
		var cur = {
			up: $CONFIG['cssPath'] + 'style/images/layer/arrowUp.cur',
			down: $CONFIG['cssPath'] + 'style/images/layer/arrowDown.cur'
		};
		//
		var imgDetail = {
			mouseover: function(){
				$.setStyle(img_cont, 'cursor', 'url("' + cur[imgDetail.actType()] + '"),auto');
			},
			mousewheel: function(evt){
					
				if(img.height<viewHeight){
					return ;
				}
				var mtop = parseInt($.getStyle(img,'marginTop').replace('px',''));
				var h = $.core.dom.getSize(img).height;
				mtop = mtop+evt.wheelDelta*0.2;
				if(mtop>0){
					mtop = 0;
				}else if(Math.abs(mtop)>Math.abs(viewHeight-h+15)){
					mtop = viewHeight-h+15;
				}else{
					$.stopEvent();
				}
				$.setStyle(img,'marginTop',mtop+'px');
			},
			DOMMouseScroll: function(evt){				
				if(img.height<viewHeight){
					return ;
				}				
				var mtop = parseInt($.getStyle(img,'marginTop').replace('px',''));
				var h = $.core.dom.getSize(img).height;
				mtop = mtop-evt.detail*5;
				if(mtop>0){
					mtop = 0;
				}else if(Math.abs(mtop)>Math.abs(viewHeight-h+15)){
					mtop = viewHeight-h+15;
				}else{
					$.stopEvent();
				}
				$.setStyle(img,'marginTop',mtop+'px');
			},
			click: function(){
				if(img_download){
					return;
				}
				img_download = true;
				//
				ch_plaze.fire('slide_view',[gbdata,imgDetail.actType()]);
			},
			actType: function(){
				if(slideStates){
					if(slideStates.length==1){
						return 'other';
					}
					if(slideStates.index==0){
						return 'down';
					}
					if(slideStates.index == slideStates.length){
						return 'up';
					}
				}
				var icpos = imgDetail.getContPos();
				var curpos = curpos||imgDetail.getCur();
				var layertop = layer.scrollTop;
				
				if(img.height<viewHeight){
					return curpos.y>(icpos.y+img.height/2+layertop-15)?'down':'up';
				}else{
					return curpos.y>(icpos.y+viewHeight/2+layertop-15)?'down':'up';
				}			
			},
			getContPos: function(){
				var pos = $.position(img_cont);
				return {
					x: pos.l,
					y: pos.t
				}
			},
			getCur: function(){
				var e = $.getEvent();
	            var D = document.documentElement;
	            if (e.pageX) {
	                return {
	                    x: e.pageX,
	                    y: e.pageY
	                };
	            }
	            return {
	                x: e.clientX + D.scrollLeft - D.clientLeft,
	                y: e.clientY + D.scrollTop - D.clientTop
	            };
			}
		}
		//
        var handler = {
            init: function(){
				//cash参数
				handler.getPars();
				//创建loading
				handler.build();
				//绑定事件
				handler.bind();
				//创建频道
				handler.channel();
            },
			getPars: function(){
				img = pars['img_view'];
				cont = pars['layer_center'];
				img_cont = pars['img_cont'];
				layer = pars['choice_layer']
			},
            build: function(){
				//创建loading
            	loading = $.C('img');
				loading.style.width = '70px';
				loading.style.height = '6px';
				loading.style.position = 'absolute';
				loading.style.display = 'none';
				loading.src = [$CONFIG['cssPath'],'style/images/common/big_loading.gif'].join('');
				cont.appendChild(loading);
            },
			bind: function(){
				$.addEvent(img_cont,'mousemove',imgDetail.mouseover);
				$.addEvent(img_cont,'mousewheel',imgDetail.mousewheel);
				$.addEvent(img_cont,'DOMMouseScroll',imgDetail.DOMMouseScroll);
				
				$.addEvent(img_cont,'click',imgDetail.click);
			},
			channel: function(){
				//监听频道
				ch_slide.register('view',handler.show);
				ch_plaze.register('choiceimg_show',handler.show);
				ch_plaze.register('slide_states',handler.slideStates);
			},
            show: function(data,pids){
				data = data.data;
				gbdata = data;
				//显示loading
				handler.loading();
				//
				var src = imageURL(data.pid,{size:'large'});
				
				if($.core.util.browser.IE6||$.core.util.browser.IE7){
					img.onload = function(){
						img_download = false;
						imgSize = resize(img,'440');
						//
						handler.imgReview(img,function(){
							if(parseInt(img.height)>viewHeight){
								cont.className = 'big_pic';
							}else{
								cont.className = 'big_pic small_pic';
							}
						});				
						loading.style.display = 'none';						
	                };
					img.src = src;
				}else{
					var _img = $.C('img');
	                _img.onload = function(){
						img_download = false;
						imgSize = resize(img,'440');
						//
						handler.imgReview(img,function(){
							if(parseInt(img.height)>viewHeight){
								cont.className = 'big_pic';
							}else{
								cont.className = 'big_pic small_pic';
							}
						});
						//
						img.src = src;
						loading.style.display = 'none';
						//cash img
						_img.style.display='none';
						data[data.pid]=_img;
	                };
	                _img.src = src;
				}
            },
			loading: function(){
				var top,left;
				var icpos = imgDetail.getContPos(),
					imgsize = $.core.dom.getSize(img);;
				if(img.height<viewHeight){
					top = icpos.y+imgsize.height/2-20
				}else{
					top = icpos.y+viewHeight/2
				}
				top = top==0?160:top;
				left = icpos.x+195;
				//
				loading.style.top = top+'px';
				loading.style.left = left+'px';
				loading.style.display = '';
			},
            destory: function(){
            	
            },
			imgReview: function(el,call){
				//图片显示渐变
				el.style.cssText = '';
				$.setStyle(el, 'opacity', 0);
				var opa = 0,
					bas = 10,
					g = 1.5,
					time = 70,
					interval = null;
				var interFunc = function(){
					bas *= g;
					opa += bas;
					if (opa >= 100){
						clearInterval(interval);
						$.setStyle(el, 'opacity', 100);
						call();
					}
					else{
						$.setStyle(el, 'opacity', opa/100);
					}
				};
				interval = setInterval(interFunc, time);
			},
			slideStates: function(item,sdata){
				slideStates={
					index: sdata[item.pid].index,
					length: sdata.length,
					pid: item.pid
				}
			}
        }
		//
		it.destory = handler.destory;
        //启动
        handler.init();
        
        return it;
    }
});
