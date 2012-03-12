/**
 * PageLet资源管理器
 * @id STK.plM
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */

STK.register('pageletView', function($) {
	var that = {};
    var jsPath = "http://js.t.sinajs.cn/t4/",
    	cssPath = "http://img.t.sinajs.cn/t4/",
		mJsPath, mCssPath, mMODNumber;

    if (typeof $CONFIG != "undefined") {
        jsPath = $CONFIG.jsPath || jsPath;
        cssPath = $CONFIG.cssPath || cssPath;
        mJsPath = $CONFIG.mJsPath;
        mCssPath = $CONFIG.mCssPath;
		mJsPath['MODN'] = mJsPath[2] - mJsPath[1] + 2;
		mCssPath['MODN'] = mCssPath[2] - mCssPath[1] + 2;
    }
	
	var pathCache = {},
		getPath = function(mPath, url) {
			url = url.replace(/\?.*$/, '');
			var i = 0, totalCode = 0, code, n;
			while(code = url.charCodeAt(i++)) {
			  totalCode += code;
			}
			return mPath[0].replace('{n}', (totalCode % mJsPath['MODN']) || '');
		},
		getJsPath = function(url) {
			return mJsPath ? (pathCache[url] || (pathCache[url] = getPath(mJsPath, url))) : jsPath;
		},
		getCssPath = function(url) {
			return cssPath;
			//return mCssPath ? (pathCache[url] || (pathCache[url] = getPath(mCssPath, url))) : cssPath;
		};
	
	
    var arrIndexOf = $.core.arr.indexOf;
    //缓存
    var clearTime = 0,//全页面clear的次数
		fileCache = {},//{url:{loaded:true, list:[]}}
		cssIDInBodyCache = {},//{cssID: {cssURL, styleID}}
		pidCache = {};//{pid:{js:{jsURL: 1},css:{cssURL: 1}}}
	$.historyM.onpopstate(function(URL) {
		clearTime++;
	});
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

	var createLinkAndCache = function(cssID, cssURL, cacheUrl) {
		cssIDInBodyCache[cssID] = {cssURL: cacheUrl};
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
			noBoxPageletCheckCache[pid] && delete noBoxPageletCheckCache[pid];
			fn(box);
		} else {
			noBoxPageletCheckCache[pid] = fn;
		}
	};
	
	var reCheckNoBoxPageletBoxs = function() {
		for(var i in noBoxPageletCheckCache) {
			checkPageletBox(i, noBoxPageletCheckCache[i]);
		}
	};
	
	/**
	 * @param {Object} cssID
	 */
	var deleteLinkAndCache = function(cssID) {
		if($.IE) {
			var styleID = cssIDInBodyCache[cssID].styleID , sheetID;
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
				pidCache[pid].css[cssArray[i]] = 1;
			}
		}
	};
	/**
	 * 删除没有用的css link
	 */
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
		deletePreviousElement();
	};
	
    /**
     * 在缓存中检查该地址是否已经下载或正在下载
     * 已经下载接回调， 正在下载加入队列 第一次下载需要启动文件下载模块
     * @param {Object} url
     * @param {Object} complete
     * @return {boolean} true/false //是否需要启动文件下载模块
     */
    var checkFileCache = function(url, complete) {
		if(checkPreviousInclude(url)) {
			complete(url);
            return false;
		}
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
        var cbList;
		if (fileCache[url] && (cbList = fileCache[url].list)) {
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
			cssURL = getCssPath(url) + url,
			cssID = 'css_' + $.core.util.getUniqueKey();
        if (!checkFileCache(url, complete)) {
			return;
		}
		
		createLinkAndCache(cssID, cssURL, url);
        
		var load_div = $.C('div');
        load_div.id = load_ID;
        $.core.util.hideContainer.appendChild(load_div);
		
        var _rTime = 3000;//3000*10
        var timer = function() {
            if (parseInt($.core.dom.getStyle(load_div, 'height')) == 42) {
                $.core.util.hideContainer.removeChild(load_div);
				callbackFileCacheList(url);
                return;
            }
            if (--_rTime > 0) {
                setTimeout(timer, 10);
            }
            else {
                $.log(url + "timeout!");
                $.core.util.hideContainer.removeChild(load_div);
				callbackFileCacheList(url);
                //加载失败清除缓存
                deleteLinkAndCache(cssID);
				createLinkAndCache(cssID, cssURL, url);
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
        if (!checkFileCache(url, complete)) {
			return;
		}
		var jsRUL = getJsPath(url) + url;
        //js下载模块
        $.core.io.scriptLoader({
            'url': jsRUL,
            onComplete: function() {
                callbackFileCacheList(url);
            },
            onTimeout: function() {
                $.log(url + "timeout!");
                //加载失败清除缓存
                delete fileCache[url];
            }
        });
    };
    //模块加载空闲检测start
    var pageLoaded, pageLoadList = [];
	that.onload = function(fn) {
		if(pageLoaded) {
			fn();
		} else {
			pageLoadList.push(fn);
		}
	};
	$.core.evt.addEvent(window, 'load', function() {
		$.core.evt.removeEvent(window, 'load', arguments.callee);
		pageLoaded = true;
		for(var i = 0; i < pageLoadList.length; ++i) {
			pageLoadList[i]();
		}
	});
	///////////////////
	//innerHTML分时处理
	var innerHTMLTimeChunk = (function() {
		if($.IE) {
			var list = [], running;
			var run = function() {
				if(list.length > 0) {
					running = true;
					list.shift()();
					setTimeout(run, 55);
				} else {
					running = false;
				}
			};
			
			return function(fn) {
				if(clearTime) {
					fn();
				} else {
					list.push(fn);
					if(!running) {
						run();
					}
				}
			};
		} else {
			return function(fn) {
				fn();
			};
		}
	})();
	/////////////////
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
        var cssLoadNum = 1, ns, pid, html, cssArray, jsArray, innerHTMLPageletBox, cssComplete, jsComplete, innerHTMLTimer;
        
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
		
		innerHTMLPageletBox = function() {
			checkPageletBox(pid, function(box) {
				//css完成 页面渲染
				if(html != undefined) {//如果有html需要分时inner和加载js及执行
					innerHTMLTimeChunk(function() {
						box.innerHTML = html;
						jsComplete();
						clearTime && deleteUselessLinks();
						reCheckNoBoxPageletBoxs();
					});
				} else {//当没有html时直接加载js及执行
					jsComplete();
					clearTime && deleteUselessLinks();
					reCheckNoBoxPageletBoxs();
				}
			});
		};
        cssComplete = function() {
            if (--cssLoadNum > 0)
                return;
			if(typeof innerHTMLTimer != 'undefined') {
				clearTimeout(innerHTMLTimer);
				innerHTMLPageletBox();
			}
        };
        jsComplete = function(url) {
            if (jsArray.length > 0) {
                jsLoader(jsArray.shift(), jsComplete);
            }
			
            if (url && url.indexOf("/pl/") != -1) {
                var ns = url.replace(/^.*?\/(pl\/.*)\.js\??.*$/, "$1").replace(/\//g, ".");
				
				$.pageletM.clear(ns);
				$.pageletM.start(ns);
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
		//提前显示的时机 目前5秒
		innerHTMLTimer = setTimeout(function() {
			innerHTMLTimer = undefined;
			innerHTMLPageletBox();
		}, 5000);
        cssComplete();
    };
    
	
	//预加载资源------------------------------------------------
	//elementUniqueID->{element:resource element, includes: {includeUrl: 1}}
	var previousElements = {};
	/**
	 * 检测某个地址是否在预加载资源中包含
	 * @method checkPreviousInclude
	 * @private
	 * @param {Object} url
	 */
	var checkPreviousInclude = function(url) {
		for (var elementUniqueID in previousElements) {
			if(previousElements[elementUniqueID]['includes'][url]) {
				return true;
			}
		}
	};
	/**
	 * 初始化预加载资源
	 * @method initPreviousResources
	 * @private
	 */
	var initPreviousResources = function() {
		//css start
		var links = document.getElementsByTagName('link'), includes, elementUniqueID;
		for(var i = 0; i < links.length; ++i) {
			if(includes = links[i].getAttribute('includes')) {
				elementUniqueID = $.core.dom.uniqueID(links[i]);
				includes = includes.split('|');
				var tempObj = {};
				for (var j = 0; j < includes.length; ++j) {
//					if(includes[j]) {
						tempObj[includes[j]] = 1;
//					}
				}
				previousElements[elementUniqueID] = {
					'element': links[i],
					'includes': tempObj
				};
			}
		}
		//css end
	};
	/**
	 * 删除不依赖的预加载资源
	 * @method deletePreviousElement
	 * @private
	 */
    var deletePreviousElement = function() {
		//有被使用的资源节点 elementUniqueID->true
		var fileCachedElementUniqueIDs = {}, includes, iUsed;
		
		for(var elementUniqueID in previousElements) {
			includes = previousElements[elementUniqueID]['includes'];
			for (var cssUrl in includes) {
				iUsed = false;
				for(var pid in pidCache) {
					if(pidCache[pid].css[cssUrl]) {
						iUsed = true;
						break;
					}
				}
				if(iUsed) {
					fileCachedElementUniqueIDs[elementUniqueID] = true;
					break;
				}
			}
		}
		
		//删除不依赖的
		for(var elementUniqueID in previousElements) {
			if(!fileCachedElementUniqueIDs[elementUniqueID]) {
				$.core.dom.removeNode(previousElements[elementUniqueID]['element']);
				delete previousElements[elementUniqueID];
			}
		}
	};
	initPreviousResources();
	//////////////////////////////////////////////////////////
	
	//适配
    $.pageletM.view = view;
	
	$.core.dom.ready(function() {
		$.core.evt.addEvent(window, "unload", function() {
			$.core.evt.removeEvent(window, "unload", arguments.callee);
			fileCache = cssIDInBodyCache = pidCache = styleCache = getStyleSheetObject = noBoxPageletCheckCache = previousElements = undefined;
		});
	});
    return that;
});