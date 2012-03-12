/**
 * @author wangliang3
 * 广告通用代码部署
 * 功能
 * 1、广告加载
 * 2、广告容器内部通用浮层
 */
//js参与代码部署是可以设定默认配置参数
//window['WBAD'] = window['WBAD'] || {};
//WBAD={
//	wbVersion: 'v3'
//	,uid: $CONFIG['uid'] || scope.$uid
//	,rnd: '0'
//	,jsonp: "JSONP_164GNI9952"
//};

(function(){
	//--------------api--------------------------------------------------
	var doc = document;
	var de = doc.documentElement,db = doc.body;
	var ua = navigator.userAgent.toLowerCase();
	var IE = /msie/.test(ua);
	var dom = {
		getBy: function(method, tag, root){
			tag = tag || '*';
			if (!root) { return []; }
			var nodes = [], elements = root.getElementsByTagName(tag);
			for (var i = 0, len = elements.length; i < len; ++i) {
				if (method(elements[i])) {
					nodes[nodes.length] = elements[i];
				}
			}
			return nodes;
		},
		setStyle: function(el, property, val){
            if (IE) {
                switch (property) {
                    case "opacity":
                        el.style.filter = "alpha(opacity=" + (val * 100) + ")";
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1;
                        }
                        break;
                    case "float":
                        property = "styleFloat";
                }
            }
            else {
                if (property == "float") {
                    property = "cssFloat";
                }
            }
            el.style[property] = val;
        },
		getStyle: function(el, property){
            if (IE) {
				var value = el.currentStyle ? el.currentStyle[property] : null;
                switch (property) {
                    case "opacity":
                        var val = 100;
                        try {
                            val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                        } 
                        catch (e) {
                            try {
                                val = el.filters('alpha').opacity;
                            } 
                            catch (e) {
                            }
                        }
                        return val / 100;
                    case "float":
                        property = "styleFloat";
					case 'height':
						return (value=='auto')?'0px':el.style[property];
					case 'width':
						return (value=='auto')?'0px':el.style[property];
                    default:
						var value = el.currentStyle ? el.currentStyle[property] : null;
                        return (el.style[property] || value);
                }
            }
            else {
                if (property == "float") {
                    property = "cssFloat";
                }
                try {
                    var computed = doc.defaultView.getComputedStyle(el, '');
                } 
                catch (e) {
                    traceError(e);
                }
                return el.style[property] || computed ? (computed[property]=='auto'?'0':computed[property]) : null;
            }
        },
		getScreen: function(){
            if (IE) {
				return {
					w: de.clientWidth,
					h: de.clientHeight
				}
            }
            else {
				return {
					w: window.innerWidth,
					h: window.innerHeight
				}
            }
        },
        getScroll: function(){
            var t, l, w, h;
            if (de && de.scrollTop) {
                t = de.scrollTop;
                l = de.scrollLeft;
                w = de.scrollWidth;
                h = de.scrollHeight;
            }
            else 
                if (db) {
                    t = db.scrollTop;
                    l = db.scrollLeft;
                    w = db.scrollWidth;
                    h = db.scrollHeight;
                }
            return {
                t: t,
                l: l,
                w: w,
                h: h
            };
        },
		contains: function(parent, node) {
	        if (parent === node) {
	            return false;
	
	        } else if (parent.compareDocumentPosition) {
				return ((parent.compareDocumentPosition(node) & 16) === 16);
	
	        } else if (parent.contains && node.nodeType === 1) {
				return   parent.contains(node);
	
	        }else {
				while (node = node.parentNode) {
					if (parent === node){
						return true;
					}
				}
			}
	        return false;
	    }
	};
	
	var event = {
		_isCollection : function(o) {
	        try {
	            return ( o                     && // o is something
	                     typeof o !== "string" && // o is not a string
	                     o.length              && // o is indexed
	                     !o.tagName            && // o is not an HTML element
	                     !o.alert              && // o is not a window
	                     typeof o[0] !== "undefined" );
	        } catch(ex) {
	            return false;
	        }
	    },
		_addEvent : function () {
	        if (window.addEventListener) {
	            return function(el, sType, fn) {
	                el.addEventListener(sType, fn, false);
	            };
	        } else if (window.attachEvent) {
	            return function(el, sType, fn) {
	                el.attachEvent("on" + sType, fn);
	            };
	        } else {
	            return function(){};
	        }
	    }(),
		_removeEvent : function() {
	        if (window.removeEventListener) {
	            return function (el, sType, fn) {
	                el.removeEventListener(sType, fn, false);
	            };
	        } else if (window.detachEvent) {
	            return function (el, sType, fn) {
	                el.detachEvent("on" + sType, fn);
	            };
	        } else {
	            return function(){};
	        }
	    }(),
	    _stopPropagation : function(e) {
	        if (e.stopPropagation) {
	            e.stopPropagation();
	        } else {
	            e.cancelBubble = true;
	        }
	    },
	    _preventDefault : function(e) {
	        if (e.preventDefault) {
	            e.preventDefault();
	        } else {
	            e.returnValue = false;
	        }
	    },
		on : function(el,sType,fn){
			if (this._isCollection(el)){
	            for (var i=0,len=el.length; i<len; ++i) {
	                this._addEvent(el[i],sType,fn);
	            }
	        }else{
	        	this._addEvent(el,sType,fn);
	        }
		},
		removeEvent : function(el,sType,fn){
			if (this._isCollection(el)){
	            for (var i=0,len=el.length; i<len; ++i) {
	                this._removeEvent(el[i],sType,fn);
	            }
	        }else{
	        	this._removeEvent(el,sType,fn);
	        }
		},
		getEvent : function(){
			if (window.event){
				return window.event;
			}
			var o = arguments.callee.caller;
			var e;
			var n = 0;
			while (o != null && n < 40) {
				e = o.arguments[0];
				if (e && (e.constructor == Event || e.constructor == MouseEvent || e.constructor == KeyboardEvent)) {
						return e;
				}
				n++;
				o = o.caller;
			}
			return e;
		},
		getTarget : function(e){
	        var t = e.target || e.srcElement;
	        return t;
		},
		stopEvent : function(e) {
	        this._stopPropagation(e);
	        this._preventDefault(e);
	    }
	};
	
	var core = {
		trim: function(str){
			if (typeof str !== 'string') {   throw 'trim need a string as parameter'; }
			var len = str.length;
			var s = 0;
			var reg = /(\u3000|\s|\t|\u00A0)/;
			
			while (s < len) {
				if (!reg.test(str.charAt(s))) {
					break;
				}
				s += 1;
			}
			while (len > s) {
				if (!reg.test(str.charAt(len - 1))) {
					break;
				}
				len -= 1;
			}
			return str.slice(s, len);
		},
		isArray: function(o){
			return Object.prototype.toString.call(o) === '[object Array]';
		},
		getUniqueId: function(){
			return (new Date()).getTime().toString();
		},
		getUniqueKey: function(){
			var _loadTime = core.getUniqueId();
			return _loadTime++;
		},
		removeNode: function(node){
			node && node.parentNode && node.parentNode.removeChild(node);
		},
		URL: function(sURL, args){
			var opts = core.parseParam({
				'isEncodeQuery': false,
				'isEncodeHash': false
			}, args || {});
			
			var parseURL = function(url){
				var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
				var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
				var results = parse_url.exec(url);
				var that = {};
				for (var i = 0, len = names.length; i < len; i += 1) {
					that[names[i]] = results[i] || '';
				}
				return that;
			};
			
			var that = {};
			var url_json = parseURL(sURL);
			var query_json = core.queryToJson(url_json.query);
			var hash_json = core.queryToJson(url_json.hash);
			
			that.setParam = function(sKey, sValue){
				query_json[sKey] = sValue;
				return this;
			};
			that.getParam = function(sKey){
				return query_json[sKey];
			};
			that.setParams = function(oJson){
				for (var key in oJson) {
					that.setParam(key, oJson[key]);
				}
				return this;
			};
			that.setHash = function(sKey, sValue){
				hash_json[sKey] = sValue;
				return this;
			};
			that.getHash = function(sKey){
				return hash_json[sKey];
			};
			that.valueOf = function(){
				var url = [];
				var query = core.jsonToQuery(query_json, opts.isEncodeQuery);
				var hash = core.jsonToQuery(hash_json, opts.isEncodeQuery);
				if (url_json.scheme != '') {
					url.push(url_json.scheme + ':');
					url.push(url_json.slash);
				}
				if (url_json.host != '') {
					url.push(url_json.host);
					if (url_json.port != '') {
						url.push(':');
						url.push(url_json.port);
					}
				}
				url.push('/');
				url.push(url_json.path);
				if (query != '') {
					url.push('?' + query);
				}
				if (hash != '') {
					url.push('#' + hash);
				}
				return url.join('');
			};
			return that;
		},
		merge: function(a,b){
			var buf = {};
			for (var k in a) {
				buf[k] = a[k];
			}
			for (var k in b) {
				buf[k] = b[k];
			}
			return buf;
		},
		parseParam: function(oSource, oParams, isown){
			var key, obj = {};
			oParams = oParams ||
			{};
			for (key in oSource) {
				obj[key] = oSource[key];
				if (oParams[key] != null) {
					if (isown) {// 仅复制自己
						if (oSource.hasOwnProperty[key]) {
							obj[key] = oParams[key];
						}
					}
					else {
						obj[key] = oParams[key];
					}
				}
			}
			return obj;
		},
		parse: function(oSource, oParams, isown){
			var key, obj = {};
			oParams = oParams ||
			{};
			for (key in oSource) {
				obj[key] = oSource[key];
				if (oParams[key] != null) {
					if (isown) {//仅复制自己
						if (oSource.hasOwnProperty[key]) {
							obj[key] = oParams[key];
						}
					}
					else {
						obj[key] = oParams[key];
					}
				}
			}
			return obj;
		},
		jsonToQuery: function(JSON, isEncode){
			var _fdata = function(data, isEncode){
				data = data == null ? '' : data;
				data = core.trim(data.toString());
				if (isEncode) { return encodeURIComponent(data); }
				else { return data; }
			};
			var _Qstring = [];
			if (typeof JSON == "object") {
				for (var k in JSON) {
					if (JSON[k] instanceof Array) {
						for (var i = 0, len = JSON[k].length; i < len; i++) {
							_Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode));
						}
					}
					else {
						if (typeof JSON[k] != 'function') {
							_Qstring.push(k + "=" + _fdata(JSON[k], isEncode));
						}
					}
				}
			}
			if (_Qstring.length) { return _Qstring.join("&"); }
			else { return ""; }
		},
		queryToJson: function(QS, isDecode){
			var _Qlist = core.trim(QS).split("&");
			var _json = {};
			var _fData = function(data){
				if (isDecode) { return decodeURIComponent(data); }
				else { return data; }
			};
			for (var i = 0, len = _Qlist.length; i < len; i++) {
				if (_Qlist[i]) {
					var _hsh = _Qlist[i].split("=");
					var _key = _hsh[0];
					var _value = _hsh[1];
					// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
					if (_hsh.length < 2) {
						_value = _key;
						_key = '$nullName';
					}
					// 如果缓存堆栈中没有这个数据
					if (!_json[_key]) {
						_json[_key] = _fData(_value);
					}
					// 如果堆栈中已经存在这个数据，则转换成数组存储
					else {
						if (core.isArray(_json[_key]) != true) {
							_json[_key] = [_json[_key]];
						}
						_json[_key].push(_fData(_value));
					}
				}
			}
			return _json;
		},
		scriptLoader: function(pars){
			var default_opts = {
				'url': '',
				'charset': 'UTF-8',
				'timeout': 30 * 1000,
				'args': {},
				'onComplete': function(){
				},
				'onTimeout': null,
				'isEncode': false,
				'uniqueID': null
			};
			
			var entityList = {}, js, requestTimeout;
			var opts = core.parseParam(default_opts, pars);
			
			if (opts.url == '') {   throw 'scriptLoader: url is null'; }
			
			var uniqueID = opts.uniqueID || core.getUniqueId();
			
			js = entityList[uniqueID];
			if (js != null && IE != true) {
				core.removeNode(js);
				js = null;
			}
			if (js == null) {
				js = entityList[uniqueID] = doc.createElement('script');
			}
			
			js.charset = opts.charset;
			js.id = 'scriptRequest_script_' + uniqueID;
			js.type = 'text/javascript';
			if (opts.onComplete != null) {
				if (IE) {
					js['onreadystatechange'] = function(){
						if (js.readyState.toLowerCase() == 'loaded' || js.readyState.toLowerCase() == 'complete') {
							try {
								clearTimeout(requestTimeout);
								doc.getElementsByTagName("head")[0].removeChild(js);
							} 
							catch (exp) {
							}
							opts.onComplete();
						}
					};
				}
				else {
					js['onload'] = function(){
						try {
							clearTimeout(requestTimeout);
							core.removeNode(js);
						} 
						catch (exp) {
						}
						opts.onComplete();
					};
				}
			}
			js.src = core.URL(opts.url, {
				'isEncodeQuery': opts['isEncode']
			}).setParams(opts.args).valueOf();
			doc.getElementsByTagName("head")[0].appendChild(js);
			if (opts.timeout > 0 && opts.onTimeout != null) {
				requestTimeout = setTimeout(function(){
					try {
						doc.getElementsByTagName("head")[0].removeChild(js);
					} 
					catch (exp) {
					}
					opts.onTimeout();
				}, opts.timeout);
			}
			return js;
		},
		jsonp: function(oOpts){
			var opts = core.parseParam({
				'url': '',
				'charset': 'UTF-8',
				'timeout': 30 * 1000,
				'args': {},
				'onComplete': null,
				'onTimeout': null,
				'responseName': null,
				'isEncode': false,
				'varkey': 'callback'
			}, oOpts);
			// -1为默认, 1为完成, 2为超时
			var funcStatus = -1;
			var uniqueID = opts.responseName || ('wbad_' + core.getUniqueId());
			
			opts.args[opts.varkey] = uniqueID;
			opts.args['rnd']=core.getUniqueId();
			
			var completeFunc = opts.onComplete;
			var timeoutFunc = opts.onTimeout;
			
			window[uniqueID] = function(oResult){
				if (funcStatus != 2 && completeFunc != null) {
					funcStatus = 1;
					completeFunc(oResult, oOpts.id);
				}
			};
			opts.onComplete = null;
			opts.onTimeout = function(){
				if (funcStatus != 1 && timeoutFunc != null) {
					funcStatus = 2;
					timeoutFunc();
				};
			};
			return core.scriptLoader(opts);
		},
		getEvtAttribute: function(el,key,obj){
			obj = obj||db;
			var att=el.getAttribute(key);
			while(el!=obj&&!att){
				el=el.parentNode;
				att=el.getAttribute(key);
			}
			return {
				el: el,
				value: att||''
			};
		}
	};
	/*
	 * delegatedEvent简化版
	 */
	var sdevt = function(){
		var it = {};
		var cash = {};
		
		it.add = function(key,type,fun){
			cash[type]=cash[type]||{};
			cash[type][key]=fun;
		};
		it.hash = function(type){
			return cash[type];
		};
		return it;
	}();
	/*
	 * 广告内部弹层动作
	 * 例子：<a ad_layer="width=450&height=300&index=10002&src=http://www.sina.com"  herf="?">......</a>
	 */
	var poplayer, tiger;
	var layer = {
		items: {
			bd:null,
			close:null
		},
		getWin: function(){
            var scroll = dom.getScroll(),
				winSize = dom.getScreen(),
				panel = poplayer;
			
			var pHeight = Math.max(panel.clientHeight,panel.offsetHeight,dom.getStyle(panel, 'height').replace('px', ''));
			var pWidth = Math.max(panel.clientWidth,panel.offsetWidth,dom.getStyle(panel, 'width').replace('px', ''));
			
            return {
				w: winSize.w,
				h: winSize.h,
                t: Math.round(pHeight>winSize.h?(winSize.h/5 + scroll.t):((winSize.h-pHeight)/3+scroll.t)),
                l: Math.round(pWidth>winSize.w?(winSize.w/5 + scroll.l):((winSize.w-pWidth)/2+scroll.l))
            };
		},
		setPos: function(){
			//居中显示
			var pos = layer.getWin();			
			dom.setStyle(poplayer,'top',pos.t + 'px');
			dom.setStyle(poplayer,'left',pos.l + 'px');
			return this;
		},
		bind: function(){
			event.on(layer.items.close,'click',function(e){
				poplayer.style.display = 'none'
			});
		},
		show: function(pars,el){			
			if(!pars['height']){throw 'layer height is null'};
			if(!pars['width']){throw 'layer width is null'};
			if(!pars['src']){throw 'iframe src is null'};
			//build layer and iframe
			if (!poplayer) {
				poplayer = doc.createElement('div');
				poplayer.style.cssText = 'position:absolute;padding:4px;-moz-border-radius:4px;-webkit-border-radius:4px;background:url(http://img.t.sinajs.cn/t4/style/images/common/layer_bg.png?id=1316690783305) repeat;_background:transparent;';
				//
				layer.items.hd =  doc.createElement('div');
				layer.items.hd.style.cssText = 'background:#f3f3f3;height:30px;line-height:30px;padding:0 0 0 20px;color:#595959;font-size:14px;vertical-align:middle;';
				//layer容器
				layer.items.bd = doc.createElement('div');
				layer.items.bd.style.cssText = 'border-collapse:collapse;border-spacing:0;';
				//layer
				layer.items.close = doc.createElement('span');
				layer.items.close.innerHTML = 'X';
				layer.items.close.style.cssText = 'position:absolute;right:15px;top:10px;cursor:pointer;';
				//
				poplayer.appendChild(layer.items.close);
				poplayer.appendChild(layer.items.hd);
				poplayer.appendChild(layer.items.bd);
				db.appendChild(poplayer)
				//绑定layer容器默认功能事件
				layer.bind();
			};
			//设置title
			layer.items.hd.innerHTML = pars['title']||'转发';
			//
			poplayer.style.width = pars.width+'px';
//			tiger?(tiger!=el&&layer.clear().iframe(pars)):(layer.iframe(pars));''
			layer.clear().iframe(pars);
			//set default style
			poplayer.style.zIndex = pars.index||1000;
			//设定复层显示的位置
			layer.setPos();
			//
			poplayer.style.display='';
			//
			event.on(db,'click',layer.hide);
			//cash click item
			tiger = el;
			return this;
		},
		hide: function(e){
			if (!e) {
				poplayer && (poplayer.style.display='none');
			}
			else {
				var el = event.getTarget(e);
				poplayer && !dom.contains(poplayer, el) && ((poplayer.style.display = 'none') || event.removeEvent(db, 'click', layer.hide));
			}
			return this;
		},
		clear: function(){
			layer.items.bd.innerHTML = '';
			return this;
		},
		iframe: function(pars){
			layer.items.bd.innerHTML = '<iframe id="wbad_iframe" width="'+pars.width+'" height="'+pars.height+'" allowtransparency="true" name="wbad_iframe" scrolling="no" frameborder="0"></iframe>';
			var frame = doc.getElementById('wbad_iframe');
			frame.onload = function(){
				frame.height = pars.height;
			};
			frame.src=decodeURIComponent(pars.src);
			return this;
		}
	};
	/*
	 * timer 倒数计时器
	 * 参数：
	 * 1、time 倒数计时的秒数
	 * 2、loop 设定timer的轮询频率
	 */
	var timer = function(){
		var map={
			ss: 1,
			mm: 60,
			hh: 60*60,
			dd: 60*60*24
		};
		return {
			start: function(pars,call){
				pars = pars||{};
				pars.loop = pars.loop||'ss';//设定timer的轮询频率
				call = call||function(){};
				
				var time = pars.time||0;
				var run = function(){
					call&&call({
						last: time,
						dd:Math.floor(time/map['dd']),
						hh:Math.floor(time%map['dd']/map['hh']),
						mm:Math.floor(time%map['dd']%map['hh']/map['mm']),
						ss:time%map['mm']
					});
					if(time<0) {clearInterval(interval)};				
					time-=map[pars.loop];
				};
				var interval = setInterval(run,map[pars.loop]*1000)
			}
		}
	}();

//	timer.start({time:10},function(data){
//		console.info('dd:'+data.dd+' hh:'+data.hh+' mm:'+data.mm+' ss:'+data.ss);
//	});
	/*
	 * ---------业务相关代码--------------------------------------------------
	 */
	//外部js参数配置及默认创建广告外部句柄
	var gb_args = window['WBAD']||{}
	window['WBAD']=window['WBAD']||{};
	//
	var cash = {}, isLoad = false;
		cash.ids=[];
	//本地逻辑依赖且不需要传给广告服务器的属性白名单，传参过滤使用
	var gb_pars = {id:'id',url:'url',src:'src',height:'height',width:'width'};
	/*
	 *数据提交格式,例子，多个参数可以使用&key=value的方式拼接，type和url为依赖属性一定要有
	 * type=trans&url=http://ta.sass.sina.com.cn/front/deliver&psId=PDPS000000028369 
	 */
	var trans = {		
		get: function(data,call){
			isLoad = true;		
			/*老广告不支持动态的回调函数名，使用固定的ad作为回调函数入口*/
			//data['responseName'] = 'ad';
			/*WBAD用户预声明需要传递给广告服务器的参数*/
			/*dom pars*/
			var args = {};
			for(var key in data){
				!gb_pars[key]&&(args[key]=decodeURIComponent(data[key]));
			}
			/*js init pars*/
			data['args'] = core.merge(args,gb_args);
			data.onComplete = function(html, id){
				isLoad = false;
				cash[id].innerHTML = html;
				call&&call();
			};
			data.onTimeout = function(){
				isLoad = false;
				call&&call();
			};
			core.jsonp(data);
		},
		queue :function(){
			var id = cash.ids.pop();
			if(id){	
				trans.get(core.queryToJson(cash[id].getAttribute('ad-data')),function(){
					trans.queue();
					bind(cash[id]);
				});
			}
		},
		add: function(el){
			var att = el.getAttribute('ad-data');
			var data = core.queryToJson(att||'');
			if (data['id']) {
				//cash dom
				cash[data.id] = el;
				cash.ids.push(data.id);
				!isLoad&&trans.queue();
			}
		}
	};
	/* 
	 * 广告内部默认控件处理代码
	 */
	var comp = {
		//默认加载执行
		init: {
			timer: function(el,data){
				/*
				 * html 套用方式,例子
				 * <a ad_comp="type=timer&stime=1319904000000&etime=1319904000000" href="#"><em>9</em>小时<em>36</em>分钟</a>
				 */
				var st = new Date(parseInt(data.stime)),
					et = new Date(parseInt(data.etime));
					//st = 1319904000000;
					//et = 1321004000000;
				if ((et-st)>0) {
					timer.start({
						time: Math.floor((et-st)/1000)
					}, function(data){
						var html = '';
						if(data.dd>0){
							html = '<em>'+data.dd+'</em>天<em>'+data.hh+'</em>小时<em>'
						}else{
							html = '<em>'+data.hh+'</em>小时<em>'+data.mm+'</em>分钟'
						}
						el.innerHTML = html;
					});
				}else{
					el.innerHTML = '<em>0</em>小时<em>0</em>分钟';
				}
			}
		},
		//点击触发执行
		click: {
			trans: function(el,data){
				/*
				 * html 套用方式,例子
				 * <a id="12345678" ad_comp="type=trans&cid=12345678&value=1&key=2" target="_blank" href="#"><em>9</em>小时<em>36</em>分钟</a>
				 * cid: 返回html回写的容器的id
				 */
				//点击广告提交数据到后台
				if(!data['url']){
					return ;
				}
				
				var args = {};
				for(var key in data){
					!gb_pars[key]&&(args[key]=data[key]);
				}
				//默认uid为必传参数，防作弊用
				if(!args['uid']&&WBAD['uid']){
					args['uid'] = WBAD['uid'];
				}			
				/*js init pars*/
				data['args'] = args;
				//
				data.onComplete = function(html){
					if(data['cid']){
						var cont = document.getElementById(data['cid']);
						cont&&(cont.innerHTML = html);
					}
				};
				data.onTimeout = function(){
				};
				core.jsonp(data);
			},
			layer: function(el,data){
				var e = event.getEvent();
				event.stopEvent(e);
				//check layer pars
				layer.show(data,el);
				//点击行为提交后台统计日志
				comp.click.trans(el,data);
			},
			like: function(el,data){
				var e = event.getEvent();
				event.stopEvent(e);
				el.style.display='none';
				comp.click.trans(el,data);
			},
			jump: function(el,data){
				if (WBAD['uid']) {
					var href = el.href;
					if(/\?/.test(href)){
						if(/(\?|\&)uid=([^&]+)/.test(href)){	
					        href.replace(/(\?|\&)uid=([^&]+)/,'$1uid='+WBAD['uid'])
					    }else{
					        href = href + '&uid=' +WBAD['uid']
					    }
					}else{
						href = href + '?uid=' +WBAD['uid']
					}
					el.href = href;
				}
			}
		}
	};
	/*
	 * 广告容器内部绑定事件
	 * ad_comp： dom自定义属性
	 * ad_comp -- type: 广告内部组件格式
	 */
	var bind = function(obj){
		//sdevt 注册动作
		var acts = ['layer','trans','like','jump'];
		for(var i=0,len=acts.length;i<len;i++){
			sdevt.add(acts[i],'click',comp.click[acts[i]]);
		}
		//layer event
		event.on(obj,'click',function(e){
			var el = event.getTarget(e);
			var tag=core.getEvtAttribute(el,'ad-comp',obj);
			var data = core.queryToJson(tag.value);
			if(data.type){
				var acts = data.type.split('|');
				var func = sdevt.hash('click');
				//防止广告吐错数据引起js执行异常引起页面报错
				try{
					for(var i=0,len=acts.length;i<len;i++){
						func[acts[i]]&&func[acts[i]](tag.el,data);
					}
				}catch(e){}
			}
		});
		//默认加载控件初始化
		dom.getBy(function(el){
			var tag=core.getEvtAttribute(el,'ad-comp',obj);
			var data = core.queryToJson(tag.value);
			var type = data.type;
			type&&comp.init[type]&&comp.init[type](el,data);
		},'',obj);
	};
	//act
	var webad = {
		start: function(){
			dom.getBy(function(el){
				var data = core.queryToJson(el.getAttribute('ad-data')||'');
				if (data['id']) {
					//cash dom
					cash[data.id] = el;
					cash.ids.push(data.id);
				}
			}, 'div', db);
			//get ad
			trans.queue();
		}
		
	};
	//----------------外部调用函数--------------------------------------------------
	window['WBAD']['add'] = trans.add;
	window['WBAD']['hideLayer'] = layer.hide;
	//----------------启动广告加载--------------------------------------------------
	webad.start();
})();

//后加载页面模块，js手动调用加载广告方式
//setTimeout(function(){
//	var html = '<div id="ad_48" ad-data="id=ad_48&url=http://ta.sass.sina.com.cn/front/deliver&psId=PDPS000000028369&wbVersion=v3&key=111113"></div>'
//	document.getElementById('ads_123').innerHTML = html;
//	WBAD.add(document.getElementById('ad_48'));
//},10000);


