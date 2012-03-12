/**
 *  tips推广位，根据dom中的start和end time分析哪几个tip显示。
 * creater: xionggq guoqing5@staff.sina.com.cn
 * Date: 11-7-21
 */
$Import("kit.dom.parseDOM");
$Import("module.imgDynamicDownload");

STK.register('comp.content.pullylist', function($) {

    return function(node) {
		var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {};
        var st=null;
		var _loops = null;
		var _addEvent = $.addEvent;
		var _removeEvent = $.removeEvent;
		var PAGEHTML = '<a  href="javascript:void(0);"><span>[n]</span></a>';
		
		var clickFunArr = [];
		
		var PAGEHTMLSeletct = '<a class="on" href="javascript:void(0);"><span>[n]</span></a>';
		//以下代码为从v3代码复制过来，逻辑太繁琐，
		//动画效果参数获取。
        var animation = {
			/*
			 * @ 匀速直线运动函数
			 * d : 每贞间隔时间
			 * h : 持续的距离
			 * v : 速度
			 */
			'speed' : function(d, h, v) {
				//总时间
				var t = Math.ceil(h / v);
				//总贞数
				var n = Math.ceil(t * 100 / d);
				//输出的轨道函数
				var orbit = [];
				var i;
				for ( i = 0; i < n; i ++) {
					orbit.push((i + 1) * h / n);
				}
				return orbit;
			}
        };
		/*
		* @ 通过样式获取节点数组。
		* el : 查找的dom节点，默认为document
		* tg : tagname 标签节点名字。
		* clz : 过滤条件，样式包含clz的节点。
		*/
		var getElementsByClass = function(el, tg, clz) {
			el = el || document;
			var rs = [];
			clz = " " + clz + " ";
			var cldr = el.getElementsByTagName(tg), len = cldr.length;
			var i;
			for (i = 0; i < len; ++ i) {
				var o = cldr[i];
				if (o.nodeType == 1) {
					var ecl = " " + o.className + " ";
					if (ecl.indexOf(clz) != -1) {
						rs[rs.length] = o;
					}
				}
			}
			return rs;
        };
       //调度列表类，每隔25毫秒执行一次。
        var timer = new function() {
            this.list = {};
            this.refNum = 0;
            this.clock = null;
            this.allpause = false;
            this.delay = 25;

            this.add = function(fun) {
                if (typeof fun != 'function') {
                    throw('The timer needs add a function as a parameters');
                }
                var key = ''
                        + (new Date()).getTime()
                        + (Math.random()) * Math.pow(10, 17);

                this.list[key] = {'fun' : fun,'pause' : false};
                if (this.refNum <= 0) {

                    this.start();
                }
                this.refNum ++;
                return key;
            };

            this.remove = function(key) {
                if (this.list[key]) {
                    delete this.list[key];
                    this.refNum --;
                }
                if (this.refNum <= 0) {
                    this.stop();
                }
            };

            this.pause = function(key) {
                if (this.list[key]) {
                    this.list[key]['pause'] = true;
                }
            };

            this.play = function(key) {
                if (this.list[key]) {
                    this.list[key]['pause'] = false;
                }
            };

            this.stop = function() {
                clearInterval(this.clock);
                this.clock = null;
            };

            this.start = function() {
                var _this = this;
                this.clock = setInterval(
					function() {
						_this.loop.apply(_this);
					},
					this.delay
				);
            };

            this.loop = function() {
				var k;
                for (k in this.list) {
                    if (!this.list[k]['pause']) {
                        this.list[k]['fun']();
                    }
                }
            };
        }();

		//主体配置函数。
        var pulleyConfig = function(element, cfg) {
        var that = {};
        var speed = 50;
        var inscroll;
        element.style.overflow = 'hidden';
        var _orbit = function(distance) {
            return animation.speed(timer.delay, distance, speed);
        };
        that.left = function(distance, endFun, moveingFun) {
            var orbit = _orbit(distance);
            var current = 0;
            inscroll = element.scrollLeft;
            $.setStyle(element,"opacity","80");
            var tk = timer.add(function() {
                if (current >= orbit.length) {
                    timer.remove(tk);
                    element.scrollLeft = inscroll + distance;
                    $.setStyle(element,"opacity","100");
                    endFun();
                    return false;
                }
                element.scrollLeft = inscroll + orbit[current];
                moveingFun(orbit[current]);
                current += 1;
            });
            return this;
        };
        that.right = function(distance, endFun, moveingFun) {
            var orbit = _orbit(distance);
            var current = 0;
            inscroll = element.scrollLeft;
           $.setStyle(element,"opacity","80");
            var tk = timer.add(function() {
                if (current >= orbit.length) {
                    timer.remove(tk);
                    element.scrollLeft = inscroll - distance;
                   $.setStyle(element,"opacity","100");
                    endFun();
                    return false;
                }
                element.scrollLeft = inscroll - orbit[current];
                moveingFun(orbit[current]);
                current += 1;
            });
            return this;
        };
        that.up = function(distance, endFun, moveingFun) {
            var orbit = _orbit(distance);
            var current = 0;
            inscroll = element.scrollTop;
           $.setStyle(element,"opacity","80");
            var tk = timer.add(function() {
                if (current >= orbit.length) {
                    timer.remove(tk);
                    element.scrollTop = inscroll + distance;
                    $.setStyle(element,"opacity","100");
                    endFun();
                    return false;
                }
                element.scrollTop = inscroll + orbit[current];
                moveingFun(orbit[current]);
                current += 1;
            });
            return this;
        };
        that.down = function(distance, endFun, moveingFun) {
            var orbit = _orbit(distance);
            var current = 0;
            inscroll = element.scrollTop;
            $.setStyle(element,"opacity","80");
            var tk = timer.add(function() {
                if (current >= orbit.length) {
                    timer.remove(tk);
                    element.scrollTop = inscroll - distance;
                    $.setStyle(element,"opacity","100");
                    endFun();
                    return false;
                }
                element.scrollTop = inscroll - orbit[current];
                moveingFun(orbit[current]);
                current += 1;
            });
            return this;
        };
        return that;
    };
   /* *
     * @param{HTMLElment}left or up
     * @param{HTMLElment}right or down
     * @param{HTMLElment}box : items的最外层容器(1 其overflow为hidden;2 其width要小于shell的width)
     * @param{HTMLElment Array}items　:滚动的元素的集合
     * @param{HTMLElment}shell :items的最内层父容器
     * @param{Number}num :决定移动步长
     * @param{Number}lens
     *
     * @param{Object}cfg:{
     *                      notloop:是否循环。（如果不循环，则只提供向左向右方法）
     *                      endRFun:function(){}, 点向右的时候结束完滚动事件
     *                      endLFun:function(){},  点向左的时候结束完滚动事件
     *                      moveRFun:function(){}, 点向右的时候滚动中事件
     *                      moveLFun:function(){}, 点向左的时候滚动中事件
     *                      allnum : integer  总个数,
     *                      isArray: 默认false ,//items如果是数组则只改items[0]是有问题的
     *                      nomouseAction: false 如果设置true则鼠标mouseout和mouseover屏蔽
     *                      isVertical :false
     *                    }
     * */
   var pulley = function(left, right, box, items, shell, num, lens, cfg) {
        var ant = pulleyConfig(box);
        lens = lens || 157;
        var marg = 0;
        var cur = 0;
        var key = true;
        var arrItem;
        var lock = false;
        var handle = cfg && cfg['isVertical'] ? "up" : "left";
        var scrollDirect = cfg && cfg['isVertical'] ? "scrollTop" : "scrollLeft";
        var loopsFunction = function() {
            if (items.length == 0) {
                return false;
            }
            if (cfg && cfg['notloop']) {
                return false;
            }
            if (lock) {
                return false;
            }
            if (!key) {
                return false;
            }
            key = false;
            if(cfg && cfg['turnTo'] && cfg['turnTo'].length>1){
                var turnTo = cfg['turnTo'];
                for (var i = 0, len = turnTo.length; i < len; i++) {
                    var obj = turnTo[i];
                    if(obj.className === "on"){
                        obj.className = "";
                        var index = i < len -1 ? (i + 1) : 0;
                        turnTo[index].className = "on";
                        break;
                    }
                }
            }
            ant[handle](lens * num, function() {
                for (var i = 0; i < num; i += 1) {
                    shell.appendChild(items[0]);
                    if (cfg && cfg['isArray']) {
                        arrItem = items.shift();
                        items.push(arrItem);
                    }
                    box[scrollDirect] = (box[scrollDirect] - lens);
                }
                key = true;
                if (cfg && typeof cfg['endRFun'] == 'function') {
                    cfg['endRFun'](items);
                }
            }, function(len) {
                if (cfg && typeof cfg['moveRFun'] == 'function') {
                    cfg['moveRFun'](len);
                }
            });
        };
        var loopsTime = (cfg && cfg['loopsTime']) || 5000;
       //_loops = setInterval(loopsFunction, loopsTime);
		/**
    	 * 清除定时器
     	* */
    	var clearPulley = function() {
        	clearInterval(_loops);
			_loops=null;
    	};
        var newLoops = function() {
            try {
                clearInterval(_loops);
                _loops = setInterval(loopsFunction, loopsTime);
            }
            catch (es) {

            }
        };
       right && _addEvent(right, 'click', function() {
            if (!key) {
                return false;
            }
            key = false;
            ant[handle](lens * num, function() {
                for (var i = 0; i < num; i += 1) {
                    shell.appendChild(items[0]);
                    if (cfg && cfg['isArray']) {
                        arrItem = items.shift();
                        items.push(arrItem);
                    }
                    box[scrollDirect] -= (lens);
                }
                key = true;
                newLoops();
                if (cfg && typeof cfg['endRFun'] == 'function') {
                    cfg['endRFun'](items);
                }
            }, function(len) {
                if (cfg && typeof cfg['moveRFun'] == 'function') {
                    cfg['moveRFun'](len);
                }
            });
            return false;
        });

       left && _addEvent(left, 'click', function() {
            if (!key) {
                return false;
            }
            key = false;
            var _handle = handle === "up" ? "down" : handle;
            ant[_handle](lens * num, function() {
                for (var i = 0; i < num; i += 1) {
                    shell.insertBefore(items[items.length - 1], items[0]);
                    if (cfg && cfg['isArray']) {
                        arrItem = items.pop();
                        items.unshift(arrItem);
                    }
                    box[scrollDirect] += (lens);
                }
                key = true;
                newLoops();
                if (cfg && typeof cfg['endLFun'] == 'function') {
                    cfg['endLFun'](items);
                }
            }, function(len) {
                if (cfg && typeof cfg['moveLFun'] == 'function') {
                    cfg['moveLFun'](len);
                }
            });
            return false;
        });
        
        if (cfg && cfg['turnTo']) {
            var turnObj = [];
            var turnTo = cfg['turnTo'];
            for (var _i = 0; _i < turnTo.length; _i++) {
                (function(index){
                    turnObj[index] = items[index];
                    clickFunArr[index] = function(){
                    	if (!key) {
                            return false;
                        }
                        var _len = Math.round(box.scrollTop / lens);
                        var cur = items.length > 2 ? 1 : 0;
                        var _current = items[cur];//当前高亮的条目
                        if (turnObj[index] === _current) 
                            return;
                        key = false;
                        var curBtn = getElementsByClass(turnTo[0].parentNode, "a", "on")[0];
                        if (curBtn) 
                            curBtn.className = "";
                        turnTo[index].className = "on";
                        _current.className = "";
                        var _num = 0, _handle = "up";
                        if (items.length == 2) {
                            _num = 1;
                            _handle = "up";
                            
                        }
                        else {
                            for (var _ind = 0; _ind < items.length; _ind++) {
                                if (turnObj[index] === items[_ind]) {
                                    if (_ind == 0) {
                                        _num = 1;
                                        _handle = "down";
                                    }
                                    else {
                                        _num = _ind - 1;
                                        _handle = "up";
                                    }
                                    break;
                                }
                            }
                        }
                        ant[_handle](lens * _num, function(){
                            for (var i = 0; i < _num; i += 1) {
                                if (_handle === "down") {
                                    shell.insertBefore(items[items.length - 1], items[0]);
                                }
                                else {
                                    shell.appendChild(items[0]);
                                }
                                if (cfg && cfg['isArray']) {
                                    arrItem = items.pop();
                                    items.unshift(arrItem);
                                }
                                var _lens = _handle === "up" ? (-lens) : (lens);
                                box[scrollDirect] += (_lens);
                            }
                            key = true;
                            newLoops();
                            if (cfg && typeof cfg['endLFun'] == 'function') {
                                cfg['endLFun'](items);
                            }
                        }, function(len){
                        });
                    };
                    _addEvent(turnTo[index], 'mouseover', clickFunArr[index]);
                    turnTo[index].onfocus = function(){
                        this.blur();
                    };
                })(_i);
            };
			
			//增加鼠标移入移出功能					
			var overOut=function(sta){
				if(st){
					 clearTimeout(st);
					 st=null;
				}
				if(sta){
					$.setStyle(_this.DOM.turn_page,"display","");
					//_this.DOM.turn_page && (_this.DOM.turn_page.style.display="");
				}else{
					st=setTimeout(function(){
						$.setStyle(_this.DOM.turn_page,"display","none");
						//_this.DOM.turn_page && (_this.DOM.turn_page.style.display="none");
					},10);
					
				}
			}
					
			box && _addEvent(box, 'mouseover', function(){
				overOut(1);
			});
			box && _addEvent(box, 'mouseout', function(){
				overOut(0);
			});
			_this.DOM.turn_page && _addEvent(_this.DOM.turn_page, 'mouseover', function(){
				overOut(1);
			});
			_this.DOM.turn_page && _addEvent(_this.DOM.turn_page, 'mouseout', function(){
				overOut(0);
			});
			
            clickFunArr.length && clickFunArr[0]();//解决初始不在第一个
        }
        if (!(cfg && cfg['nomouseAction'])) {
            _addEvent(box, function() {
                lock = true;
            }, 'mouseover');
        }
        if (!(cfg && cfg['nomouseAction'])) {
            _addEvent(box, function() {
                lock = false;
            }, 'mouseout');
        }
//        if(items.length > 2){
//            for (var i = 0; i < num; i += 1) {  //chibin modify
//                shell.insertBefore(items[items.length - 1], items[0]);
//                if (cfg && cfg['isArray']) {
//                    arrItem = items.pop();
//                    items.unshift(arrItem);
//                }
//                box[scrollDirect] += (lens);
//            }
//        }
        box[scrollDirect] -= marg;
    };

        var  clearPulley = function() {
        clearInterval(pulley._loops);
        };
        //遍历节点，去除不在显示范围的节点。
        var removeList = function() {
            if (_this.DOM.ad_container) {
                var startTime = null ,endTime = null,item = null;
                var pullChild = _this.DOM.ad_container.children;
                var length = pullChild.length;
                //$.setStyle( _this.DOM.pully_list,"height","100px");
                $.setStyles( _this.DOM.pully_list,"height","80px");
                $.setStyles( _this.DOM.pully_list,"width","540px");
                /*for(var j=0;j<length;j++)
                {
                    $.setStyle( pullChild[j],"height","100px");
                    var divdom =pullChild[j].children;
                    if(divdom.length>0)
                    {
                        $.setStyle( divdom[0],"height","100px");
                    }
                }*/
                 var serverTime = parseInt($CONFIG['servertime']);
                //var serverTime = parseInt("1311058879");
                for (var i = length; i > 0; i--) {
                    item = pullChild[i-1];
                    startTime = item.getAttribute("start_time");
                    startTime = startTime ? parseInt(startTime) : 0;
                    endTime = item.getAttribute("end_time");
                    endTime = endTime ? parseInt(endTime) : 0;
                    if ((startTime > 0 && startTime > serverTime ) || (endTime > 0 && endTime < serverTime )) {
                        _this.DOM.ad_container.removeChild(item);
                    }
                }
            }

        };
        //根据广告内容插入分页的代码。
        var insertPage = function() {
            if (_this.DOM.ad_container && _this.DOM.turn_page) {
				$.setStyle(_this.DOM.turn_page,"display","none");
                var pullChildLength = _this.DOM.ad_container.children.length;
                var arrPage = [];
                if(pullChildLength == 0)
                {
                     $.setStyle(node,"display","none");
                }
                for (var i = 0; i < pullChildLength; i++) {

                    arrPage.push(i==0 ? PAGEHTMLSeletct.replace("[n]", (i + 1)) : PAGEHTML.replace("[n]", (i + 1)));
                }
                _this.DOM.turn_page.innerHTML = pullChildLength > 1 ? arrPage.join("") : "";
            }
        };
        var set =  function(sKey, sValue, oOpts){
			var arr = [];
			var d, t;
			var cfg = $.core.obj.parseParam({
				'expire': null,
				'path': '/',
				'domain': null,
				'secure': null,
				'encode': true
			}, oOpts);

			if (cfg.encode == true) {
				sValue = escape(sValue);
			}
			arr.push(sKey + '=' + sValue);

			if (cfg.path != null) {
				arr.push('path=' + cfg.path);
			}
			if (cfg.domain != null) {
				arr.push('domain=' + cfg.domain);
			}
			if (cfg.secure != null) {
				arr.push(cfg.secure);
			}
			if (cfg.expire != null) {
				d = new Date();
				t = d.getTime() + cfg.expire *1000 ;
				d.setTime(t);
				arr.push('expires=' + d.toGMTString());
			}
			document.cookie = arr.join(';');
		};
        // 关闭按钮的事件。通过cookie保存状态将广告设置不显示。
        var closePullyList = function()
        {
                var e = $.fixEvent().target;
                var adata = e.getAttribute("action-data")||{};
                var  paramData = $.core.json.queryToJson(adata);
               var  id =paramData.id || '1d0b';
               var  second =paramData.second || '86400';
                var flag =false;
                if(paramData.flag && paramData.flag!="false")
                {
                   flag = paramData.flag;
                }
            	second = parseInt(second);
	            //var hour = (second/3600);
               // second = second/3600;
	            set((flag || "c_") + id,'1',{
				'expire': second
			});
                clearPulley();
                $.setStyle(node,"display","none");
                return false;
        };
          //+++ 变量定义区 ++++++++++++++++++
		var _this = {
			DOM:{},//节点容器
			objs:{
                "pullyList" : [],
                "selectNum" : 0 ,
                "maxNum" : 0
            },//组件容器
			DOM_eventFun: {//DOM事件行为容器
			}
			//属性方法区
		};
		//----------------------------------------------
		//+++ 参数的验证方法定义区 ++++++++++++++++++
		argsCheck = function(){
			if(!node) {
				throw new Error('node no find');
			}
			if($.trim(node.innerHTML) == ""){
				throw new Error('no tips dom');
			}
		};
		//-------------------------------------------
		//+++ Dom的获取方法定义区 ++++++++++++++++++
		parseDOM = function(){
			//内部dom节点
			_this.DOM = $.kit.dom.parseDOM($.builder(node).list);
		};
        //-------------------------------------------
        //+++ 模块的初始化方法定义区 ++++++++++++++++++
        initPlugins = function() {
			_this.iDeferLoadST = setTimeout(function() {
				$.module.imgDynamicDownload(node);

				var loopsTime = 5;
				if(_this.DOM.pully_list) {
					loopsTime = _this.DOM.pully_list.getAttribute("loops_time") ||5;
				}
				_this.loopsTime = parseInt(loopsTime) * 1000;
				//removeList();
				insertPage();

				if( _this.DOM.ad_container && _this.DOM.ad_container.children && _this.DOM.ad_container.children.length>=2){
					pulley(null, null, _this.DOM.pully_list, _this.DOM.ad_container.children, _this.DOM.ad_container, 1, 80,
					{
						"isVertical":true
						,"turnTo":_this.DOM.turn_page.children
						,"loopsTime":_this.loopsTime
					});
				}
			},1000);
        };
        //-------------------------------------------
        //+++ DOM事件绑定方法定义区 ++++++++++++++++++
        bindDOM = function() {
            if(_this.DOM.close_pullylist)
            {
                _addEvent(_this.DOM.close_pullylist,"click",closePullyList);
            }
        };
        //-------------------------------------------


        //+++ 自定义事件绑定方法定义区 ++++++++++++++++++
        bindCustEvt = function() {

        };
        //-------------------------------------------
        //+++ 广播事件绑定方法定义区 ++++++++++++++++++
        bindListener = function() {
        };
        //-------------------------------------------
        //+++ 组件销毁方法的定义区 ++++++++++++++++++
        destroy = function() {
			clearTimeout(_this.iDeferLoadST);
            if (_this) {
                $.foreach(_this.objs, function(o) {
                    if (o.destroy) {
                        o.destroy();
                    }
                });
                _this = null;
            }
            clearPulley();
            if(_this.DOM.close_pullylist)
            {
                _removeEvent(_this.DOM.close_pullylist,"click",closePullyList);
            }
        };
        //-------------------------------------------

        //+++ 组件的初始化方法定义区 ++++++++++++++++++
        init = function() {
           argsCheck();
            parseDOM();
			initPlugins();
            bindDOM();
            bindCustEvt();
            bindListener();

        };
        //-------------------------------------------
        //+++ 执行初始化 ++++++++++++++++++

		init();

        //-------------------------------------------
        //+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
        that.destroy = destroy;
        //-------------------------------------------
        return that;
    };
});