/**
 * PageLet资源管理器
 * 1.PageLet模块的注册
 * 2.PageLet模块的显示
 * 3.对PageLet模块css+js资源的加载及缓存
 * 4.对单个或所有PageLet模块的启动
 * 5.对单个或所有PageLet模块的清理
 * 6.统一启动模块
 * @id STK.core.util.pageletM
 * @author Finrila | wangzheng4@staff.sina.com.cn
 * @import STK.core.dom.ready
 * @import STK.core.util.hideContainer
 * @import STK.core.dom.getStyle
 * @import STK.core.io.scriptLoader
 * @import STK.core.func.timedChunk
 */
$Import('core.dom.ready');
$Import('core.util.hideContainer');
$Import('core.dom.getStyle');
$Import('core.io.scriptLoader');
$Import('core.func.timedChunk');
$Import('core.arr.indexOf');
$Import("core.util.getUniqueKey");
$Import("core.dom.removeNode");
$Import("core.evt.addEvent");
$Import("core.evt.removeEvent");

STK.register('core.util.pageletM', function($) {
    var JSHOST = "http://js.t.sinajs.cn/t4/";
    var CSSHOST = "http://img.t.sinajs.cn/t4/";

    if (typeof $CONFIG != "undefined") {
        JSHOST = $CONFIG.jsPath || JSHOST;
        CSSHOST = $CONFIG.cssPath || CSSHOST;
    }
    var arrIndexOf = $.core.arr.indexOf;
    //缓存
    var fileCache = {},//{url:{loaded:true, list:[]}}
 		nowFilterTarget,
		nsCache = {},
		nsThatCache = {},
		cssIDInBodyCache = {},//{cssID: {cssURL, styleID}}
		pidCache = {};//{pid:{js:{jsURL: 1},css:{cssURL: 1}}}
	
	var styleCache,//｛styleID->cssID Array[]｝
		getStyleSheetObject;
	if($.IE) {
		styleCache = {};
		
		/**
		 * 得到一个有空闲的style节点
		 * @return {Object} {
		 * 	styleID:
		 *  styleSheet:
		 * }
		 */
		getStyleSheetObject = function() {
			var styleID, styleSheet, styleElement;
			for(styleID in styleCache) {
				if(styleCache[styleID].length < 31) {
					styleElement = $.E(styleID);
					break;
				}
			}
			if(!styleElement) {
				styleID = 'style_' + $.core.util.getUniqueKey(),
				styleElement = document.createElement('style');
				styleElement.setAttribute('type', 'text/css');
				styleElement.setAttribute('id', styleID);
				document.getElementsByTagName('head')[0].appendChild(styleElement);
				styleCache[styleID] = [];
			}
			return {
				'styleID': styleID,
				'styleSheet': styleElement.styleSheet || styleElement.sheet
			};
		};
	}

	var createLinkAndCache = function(cssID, cssURL) {
		cssIDInBodyCache[cssID] = {cssURL: cssURL};
		if($.IE) {//ie下使用styleSheet addImport方法加载css
			var sheetObj = getStyleSheetObject();
			sheetObj.styleSheet.addImport(cssURL);
			styleCache[sheetObj.styleID].push(cssID);
			cssIDInBodyCache[cssID].styleID = sheetObj.styleID;
		} else {//css下载模块 非ie下
			var link = $.C('link');
			link.setAttribute('rel', 'Stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('charset', 'utf-8');
			link.setAttribute('href', cssURL);
			link.setAttribute('id', cssID);
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	};
	
	//pl依赖等待对象 pid->fn
	var noBoxPageletCheckCache = {};
	/**
	 * 检测pl是否在页面上存在，如果不存在将其设置到pl依赖等待对象
	 * 如果存在回调fn(box)
	 * @param {Object} pid
	 * @param {Object} fn 
	 */
	var checkPageletBox = function(pid, fn) {
		var box = $.E(pid);
		if(box) {
			fn(box);
			noBoxPageletCheckCache[pid] && delete noBoxPageletCheckCache[pid];
			for(var i in noBoxPageletCheckCache) {
				checkPageletBox(i, noBoxPageletCheckCache[i]);
			}
		} else {
			noBoxPageletCheckCache[pid] = fn;
		}
	};
	
	/**
	 * @param {Object} cssID
	 */
	var deleteLinkAndCache = function(cssID) {
		if($.IE) {
			var styleID = cssIDInBodyCache[cssID].styleID;
			var sheetArray = styleCache[styleID];
			var styleElement = $.E(styleID);
			if((sheetID = arrIndexOf(cssID, sheetArray)) > -1) {
				(styleElement.styleSheet || styleElement.sheet).removeImport(sheetID);
				sheetArray.splice(sheetID, 1);
			}
		} else {
			$.core.dom.removeNode($.E(cssID));
		}
		delete fileCache[cssIDInBodyCache[cssID].cssURL];
		delete cssIDInBodyCache[cssID];
	};
	
	
	
	/**
	 * 检测pid在页面上的存在性及添加新的pid到cache
	 * @param {Object} pid
	 */
	var checkPidCache = function(pid, jsArray, cssArray) {
		for(var i in pidCache) {
			if(!$.E(i)) {
				delete pidCache[i];
			}
		}
		pidCache[pid] = {
			js: {},
			css: {}
		};
		if(cssArray) {
			for(var i = 0, len = cssArray.length; i < len; ++i) {
				pidCache[pid].css[CSSHOST + cssArray[i]] = 1;
			}
		}
	};
	
	var deleteUselessLinks = function() {
		for(var cssID in cssIDInBodyCache) {
			var iUsed = false,
				cssURL = cssIDInBodyCache[cssID].cssURL;
			for(var pid in pidCache) {
				if(pidCache[pid].css[cssURL]) {
					iUsed = true;
					break;
				}
			}
			if(!iUsed) {
				deleteLinkAndCache(cssID);
			}
		}
	};
	
    /**
     * 在缓存中检查该地址是否已经下载或正在下载
     * 已经下载接回调， 正在下载加入队列 第一次下载需要启动文件下载模块
     * @param {Object} url
     * @param {Object} complete
     * @return {boolean} true/false //是否需要启动文件下载模块
     */
    var checkFileCache = function(url, complete) {
        var theFileCache = fileCache[url] || (fileCache[url] = {
            loaded: false,
            list: []
        });
        if (theFileCache.loaded) {
            complete(url);
            return false;
        }
        theFileCache.list.push(complete);
        if (theFileCache.list.length > 1) {
            return false;
        }
        return true;
    };
    
    /**
     * 从缓存方法列表中回调文件加载完成事件
     * @method callbackFileCacheList
     * @private
     * @param {String} url 文件地址
     */
    var callbackFileCacheList = function(url) {
        var cbList = fileCache[url].list;
		if (cbList) {
			for (var i = 0; i < cbList.length; i++) {
				cbList[i](url);
			}
			fileCache[url].loaded = true;
			delete fileCache[url].list;
		}
    };
    
    /**
     * css加载 超时处理30秒为超时时间
     * @method cssLoader
     * @private
     * @param {Object} spec
     * {
     * 	url: {String}  css地址
     *  load_ID: {String} 约定的css加载检测ID
     *  complete: {Function} 加载完成时的事件回调
     *  pid: {String} 该css应用的模块容器id
     * }
     */
    var cssLoader = function(spec) {
		var url = spec.url,
			load_ID = spec.load_ID,
			complete = spec.complete,
			pid = spec.pid,
			cssURL = CSSHOST + url,
			cssID = 'css_' + $.core.util.getUniqueKey();
        if (!checkFileCache(cssURL, complete)) {
			return;
		}
		
		createLinkAndCache(cssID, cssURL);
        
		var load_div = $.C('div');
        load_div.id = load_ID;
        $.core.util.hideContainer.appendChild(load_div);
		
        var _rTime = 3000;//3000*10
        var timer = function() {
            if (parseInt($.core.dom.getStyle(load_div, 'height')) == 42) {
                $.core.util.hideContainer.removeChild(load_div);
				callbackFileCacheList(cssURL);
                return;
            }
            if (--_rTime > 0) {
                setTimeout(timer, 10);
            }
            else {
                $.log(cssURL + "timeout!");
                $.core.util.hideContainer.removeChild(load_div);
				callbackFileCacheList(cssURL);
                //加载失败清除缓存
                deleteLinkAndCache(cssID);
				createLinkAndCache(cssID, cssURL);
            }
        };
        setTimeout(timer, 50);
    };
    
    /**
     * js加载 超时处理60秒为超时时间
     * @method jsLoader
     * @private
     * @param {String} url js地址
     * @param {Function} complete 加载完成时的事件回调
     */
    var jsLoader = function(url, complete) {
		var jsRUL = JSHOST + url;
        if (!checkFileCache(jsRUL, complete)) {
			return;
		}
        //js下载模块
        $.core.io.scriptLoader({
            'url': jsRUL,
            onComplete: function() {
                callbackFileCacheList(jsRUL);
            },
            onTimeout: function() {
                $.log(jsRUL + "timeout!");
                //加载失败清除缓存
                delete fileCache[jsRUL];
            }
        });
    };
    
    /**
     * 注册
     * @method register
     * @static
     * @param {Object} ns
     * @param {Object} fn
     */
    var register = function(ns, fn){
        if (!nsCache[ns]) {
            nsCache[ns] = fn;
        }
    };
    
    /**
     * 启动
     * @method start
     * @static
     * @param {String} ns 
     */
    var start = function(ns){
        if (ns) {
            if (nsCache[ns]) {
				try {
					nsThatCache[ns] || (nsThatCache[ns] = nsCache[ns]($));
				}catch(e){
					$.log(ns, e);
				}
            } else {
                $.log("start:ns=" + ns + " ,have not been registed");
            }
            return;
        }
        var nsArray = [];
        for (ns in nsCache) {
            nsArray.push(ns);
        }
        $.core.func.timedChunk(nsArray, {
            'process': function(ns){
				try {
					nsThatCache[ns] || (nsThatCache[ns] = nsCache[ns]($));
				}catch(e) {
					$.log(ns, e);
				}
            }
        });
    };
    
    /**
     * 响应管道的动态加载模块
     * pid在页面上存在或不存在并且无html
     * @method view
     * @static
     * @param {Object} opts
     * {
     * 	pid:"pl_xxx",//plc的ID属性 必选
     * 	html:"",//将要写到plc的html内容 如果不想替换原plc的内容请不要写该属性(""视为对plc的清空) 可选
     *  js:["xxx.js", "xxx.js"],//plc依赖的js文件的地址列表  可选
     *  css:["xxx.css", "xxx.css"]//plc依赖的css文件的地址列表  可选
     * }
     */
    var view = function(opts) {
		
        var cssLoadNum = 1, ns, pid, html, cssArray, jsArray, cssComplete, jsComplete;
        
		opts = opts || {};
		pid = opts.pid;
		html = opts.html;
        jsArray = opts.js ? [].concat(opts.js) : [];
		cssArray = opts.css ? [].concat(opts.css) : [];
		
		if(pid == undefined) {
			$.log("node pid["+pid+"] is undefined");
			return;
		}
		checkPidCache(pid, jsArray, cssArray);
		
        cssComplete = function() {
            if (--cssLoadNum > 0)
                return;
			
			checkPageletBox(pid, function(box) {
				//css完成 页面渲染
				(html != undefined) && (box.innerHTML = html);
				if (jsArray.length > 0) {
					jsComplete();
				}
				deleteUselessLinks();
			});
			
        };
        jsComplete = function(url) {
            if (jsArray.length > 0) {
                jsLoader(jsArray.shift(), jsComplete);
            }
            if (url && url.indexOf("/pl/") != -1) {
                var ns = url.replace(/^.*?\/(pl\/.*)\.js\??.*$/, "$1").replace(/\//g, ".");
				clear(ns);
				start(ns);
            }
        };
        if (cssArray.length > 0) {
            cssLoadNum += cssArray.length;
            for (var i = 0, cssI; (cssI = cssArray[i]); i++) {
                cssLoader({
					url: cssI,
					load_ID: "js_" + cssI.replace(/^\/?(.*)\.css\??.*$/i, "$1").replace(/\//g, "_"),
					complete: cssComplete,
					pid: pid
				});
            }
        }
        cssComplete();
		
    };
    
    /**
     * 清理
     * @method clear
     * @static
     * @param {Object} ns
     */
    var clear = function(ns) {
        if (ns) {
            if (nsThatCache[ns]) {
				$.log("destroy:"+ ns);
				try {
					nsThatCache[ns].destroy();
				} catch(e) {
					$.log(e);
				}
				delete nsThatCache[ns];
            }
            return;
        }
        for (ns in nsThatCache) {
			$.log("destroy:"+ ns);
			try {
				nsThatCache[ns] && nsThatCache[ns].destroy && nsThatCache[ns].destroy();
			} catch(e) {
				$.log(ns, e);
			}
        }
        nsThatCache = {};
    };
    
    var that = {
        register: register,
        start: start,
        view: view,
        clear: clear,
		/**
		 * 销毁
		 * @method destroy
		 * @static
		 */
		destroy: function() {
			that.clear();
			fileCache = {};
			nsThatCache = {};
			nsCache = {};
 			nowFilterTarget = undefined;
		}
    };
	$.core.dom.ready(function() {
		$.core.evt.addEvent(window, "unload", function() {
			$.core.evt.removeEvent(window, "unload", arguments.callee);
			that.destroy();
		});
	});
    return that;
});
