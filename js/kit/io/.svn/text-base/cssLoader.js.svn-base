/**
 * author zhangjinlong | jinlong1@staff.sina.com.cn		pageletM移植过来的测试版
 * 
 * css加载 超时处理30秒为超时时间
 * @id STK.kit.io.cssLoader
 * @param {String} url css地址
 * @param {String} load_ID 约定的css加载检测ID
 * @param {Function} complete 加载完成时的事件回调
 * 
 * @example
 * STK.kit.io.cssLoader('style/css/module/layer/layer_verifycode.css,'_layer_verifycode',function(){});
 * modified by lianyi
 * 添加第四个参数，使loadCss可以不接受版本号
 */

STK.register('kit.io.cssLoader', function($){
	var version = '';
	var CSSHOST = "http://img.t.sinajs.cn/t4/";
	var POOL = "http://timg.sjs.sinajs.cn/t4/";
	if (typeof $CONFIG != "undefined") {
        CSSHOST = $CONFIG.cssPath || CSSHOST;
		version = $CONFIG['version'] || '';
    }
	
	//缓存
    var fileCache = {};//{url:{loaded:true, list:[]}}
	return function(url, load_ID, complete , giveVersion , notCdn){
		giveVersion = giveVersion || version;
		complete = complete || function(){};
		
	    /**
	     * 在缓存中检查该地址是否已经下载或正在下载
	     * 已经下载接回调， 正在下载加入队列 第一次下载需要启动文件下载模块
	     * @param {Object} url
	     * @param {Object} complete
	     * @return {boolean} true/false //是否需要启动文件下载模块
	     */
	    var checkFileCache = function(url, complete) {
	        var _fileObj = fileCache[url] || (fileCache[url] = {
	            loaded: false,
	            list: []
	        });
	        if (_fileObj.loaded) {
	            complete(url);
	            return false;
	        }
	        _fileObj.list.push(complete);
	        if (_fileObj.list.length > 1) {
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
	    var callbackFileCacheList = function(url){
	        var cbList = fileCache[url].list;
	        for (var i = 0; i < cbList.length; i++) {
	            cbList[i](url);
	        }
	        fileCache[url].loaded = true;
	        delete fileCache[url].list;
	    };
		
		
        if (!checkFileCache(url, complete)) 
            return;
        var fullUrl;
		if(notCdn) {
			fullUrl = POOL + url;
		} else {
			fullUrl = CSSHOST + url + '?version=' + giveVersion;
		}
		
        //css下载模块
		var link = $.C("link");
		link.setAttribute("rel", "Stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("charset", "utf-8");
		link.setAttribute("href", fullUrl);
		//link.setAttribute("id", "link_" + load_ID);
		
		document.getElementsByTagName("head")[0].appendChild(link);
        
		var load_div = $.C("div");
        load_div.id = load_ID;
        $.core.util.hideContainer.appendChild(load_div);
		
        var _rTime = 3000;//3000*10
        var timer = function() {
            if (parseInt($.core.dom.getStyle(load_div, "height")) == 42) {
                $.core.util.hideContainer.removeChild(load_div);
				callbackFileCacheList(url);
                return;
            }
            if (--_rTime > 0) {
                setTimeout(timer, 10);
            }
            else {
				//callbackFileCacheList(url);
                $.log(url + "timeout!");
                $.core.util.hideContainer.removeChild(load_div);
                //加载失败清除缓存
                delete fileCache[url];
            }
        };
        setTimeout(timer, 50);
	};
});
