/**
 * @author wangliang3
 */
$Import('common.channel.slide');
$Import('kit.extra.language');
$Import('module.imgResize');

STK.register('common.plaza.slide', function($){
    var language = $.kit.extra.language, 
		resize = $.module.imgResize, 
		channel = $.common.channel.slide, 
		easyTemplate = $.core.util.easyTemplate;
    /*
     * @method slide 图片滑动
     * @param id{String or Object} 外层容器
     */
    return function(el, pars){
        var it = {}, cash = {},pids=[],nodes={}, devt, conf, ani, cont, panel, num=0, isLoading = false;
        //action-type
        var act = {
            click: {
                prev: function(data){
					$.preventDefault();
                    channel.fire('prev', [data]);
                },
                next: function(data){
					$.preventDefault();					
                    channel.fire('next', [data]);
                },
                view: function(data){
					$.preventDefault();
					moving.loop();
                    channel.fire('view', [data]);
                }
            },
			mousedown: {
				prev: function(data){
					$.preventDefault();
					moving.clear();
					moving.height('prev');
                },
                next: function(data){
					$.preventDefault();
					moving.clear();
					moving.height('next');
				}
			},
			mouseup: {
				prev: function(data){
					$.preventDefault();
					moving.clear();
					handler.refreshCss();
                },
                next: function(data){
					$.preventDefault();
					moving.clear();
					handler.refreshCss();
				}
			}
        };
       
		//滑动效果
		var slideLoop,csize,psize;
		var moving = {
			conf: {
				prev: -20,
				next: 20
			},
			//水平移动
			width: function(type){
				var func = function(){
					moving.loop();
					panel.scrollTop += moving.conf[type];
				};
				slideLoop = setInterval(func, 20);
			},
			//纵向移动
			height: function(type){
				var func = function(){
					moving.loop();
					panel.scrollTop += moving.conf[type];					
				};
				slideLoop = setInterval(func, 30);
			},
			clear: function(){
				slideLoop && clearInterval(slideLoop);
				slideLoop = null;
			},
			loop: function(pos){
				csize = $.core.dom.getSize(cont);
				psize = $.core.dom.getSize(panel);
				if(!isLoading&&(csize.height-panel.scrollTop)< psize.height*1.5){
					isLoading = true;
					channel.fire('loop');
					setTimeout(function(){isLoading=false;},1000);
				}
			},
			mousewheel: function(e){
				$.stopEvent();
				csize = $.core.dom.getSize(cont);
				psize = $.core.dom.getSize(panel);
				
				panel.scrollTop += -e.wheelDelta*2;
				
				if((csize.height-panel.scrollTop)< psize.height*1.5){
					channel.fire('loop');
				}
			},
			DOMMouseScroll: function(e){
				$.stopEvent();
				csize = $.core.dom.getSize(cont);
				psize = $.core.dom.getSize(panel);
				
				panel.scrollTop += e.detail*15;
				
				if((csize.height-panel.scrollTop)< psize.height*1.5){
					channel.fire('loop');
				}
			}
		};
        //
        var handler = {
            init: function(){
                //验证入参
                handler.pars();
                //生成及绑定UI
                handler.build();
                //事件注册
                handler.bind();
                //注册监听
				handler.channel();
            },
            pars: function(){
                el = (typeof el === 'string') ? $.E(el) : el;
                //
                conf = $.parseParam({
                    el: el,//图片容器，默认为入口的obj
                    itemHeight: 84,
					itemWidth: 114,		
                    fui: '',//frame ui框架模板
                    iui: '',//item ui模板
                    cont: null,//item外层容器
                    style: {}//外部导入样式
                }, pars);
				//
				conf.style['btn_disable'] = conf.style['btn_disable']||'disable';
            },
            build: function(){
                //创建silde控件框架
				var bds = $.builder(conf.fui);
				el.appendChild(bds.box);
				cont = bds.list['cont'][0];
				panel = bds.list['panel'][0];
				for(var k in bds.list){
					nodes[k] = bds.list[k][0];
				}
            },
			channel: function(){
				
				
			},			
            bind: function(){
                devt = $.delegatedEvent(el);
                //click fire event
                for (var key in act['click']) {
                    devt.add(key, 'click', act['click'][key]);
                }
				//control default action event
				for(var key in act['mousedown']){
					devt.add(key, 'mousedown', act['mousedown'][key]);
				}
				for(var key in act['mouseup']){
					devt.add(key, 'mouseup', act['mouseup'][key]);
				}
				//鼠标中轴
				$.addEvent(panel, 'mousewheel', moving.mousewheel);
				$.addEvent(panel, 'DOMMouseScroll', moving.DOMMouseScroll);
            },
            destory: function(){
                devt.destory();
            },
            addItem: function(data, iui){
                var ui = iui || conf.iui;
				var html = easyTemplate(ui, data).toString();        
                var bd = $.builder(html);
                cont.appendChild(bd.box);
				//rebuild data
				data['list'] = {};
				for(var k in bd.list){
					data['list'][k] = bd.list[k][0];
				}
				data['list']['index'] = num;
				//cash data
				cash[data.pid] = data.list;
				cash['length'] = num;
				pids.push(data.pid);
				//laod img
				handler.printImg(data['list']['img'],data.src);
				//
				num++;
            },
			printImg: function(img,src){
				if(!img||!src){
					return;
				}
				return (function(){
					var _img = $.C('img');
					_img.onload = function(){
						resize(_img,conf.itemWidth,conf.itemHeight);
						img.height = _img.height;
						img.width = _img.width;
						img.src = src;
					};
					_img.src = src;
					//
				})(img,src)
			},
			refreshCss: function(){
				var csize = $.core.dom.getSize(nodes['cont']),
					psize = $.core.dom.getSize(nodes['panel']);
				if(panel.scrollTop==0){
					$.core.dom.addClassName(nodes['prev'],conf.style['btn_disable']);
				}else{
					$.core.dom.removeClassName(nodes['prev'],conf.style['btn_disable']);
				}
				if(panel.scrollTop==(csize.height-psize.height)){
					$.core.dom.addClassName(nodes['next'],conf.style['btn_disable']);
				}else{
					$.core.dom.removeClassName(nodes['next'],conf.style['btn_disable']);
				}
			},
			moveto: function(pid){
				var nodes = cash[pid];
				var sw = (nodes['index']-1)*100
				panel.scrollTop = sw<0?0:sw;
			}
        };
        //外抛函数
		it.data = cash;
        it.destory = handler.destory;
        it.addItem = handler.addItem;
		it.moveto = handler.moveto;
        it.refreshCss = handler.refreshCss;
        //启动
        handler.init();
        
        return it;
        
    }
});
