/**
 * History地址栏控制管理器
 * 1.对真实地址栏跳转的模拟
 * 2.应用html5对history的新增特性
 * 3.使用hash降级模拟跳转（做到对低级浏览器的兼容）
 * @id historyM
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */

STK.register("historyM", function($){
	if(typeof $CONFIG == "undefined" || $CONFIG["bigpipe"] != "true") {
		return;
	}
	var $browser = $.core.util.browser,
		$hideContainer = $.core.util.hideContainer;
	
	var stateChangeFns = [];
	
	var lastState, callChangeFlag = true, isHtml5State = !!history.pushState, 
		haveHashchangeEvt = ('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8);
	
	//ie6 7 下hash历史的处理 start
	var hashFrame, writeHashFrame, hashFrameChangeHash;
	if(!haveHashchangeEvt && ($browser.IE6 || $browser.IE7)) {
		(hashFrame = $.C("iframe")).style.display = "none";
		$hideContainer.appendChild(hashFrame);
		hashFrame = hashFrame.contentWindow;
		/**
		 * 通过frame产生历史
		 */
		writeHashFrame = function(URLHash) {
			URLHash = encodeURIComponent(URLHash);
			hashFrame.document.open('text/html');
			hashFrame.document.write('<html><head></head><body onload="parent.STK&&parent.STK.historyM&&parent.STK.historyM.hashFrameChangeHash&&parent.STK.historyM.hashFrameChangeHash(\'' + URLHash + '\');"></body></html>');
			hashFrame.document.close();
		};
		/**
		 * 框架页的前进后退回调
		 */	
		hashFrameChangeHash = function(hash) {
			hash = decodeURIComponent(hash);
			if(!hashFrameChangeHash.first) {
				hashFrameChangeHash.first = 1;
				return;
			}
			window.location.hash = hash;
			if(hash != "#!" + lastState) stateChange(lastState = hash.substr(2), true);
		};
	}
	//end
	
	/**
	 * state变化后的处理
	 * @param {Object} URL
	 * @param {Object} flag
	 */
	var stateChange = function(URL, flag) {
		writeHashFrame && (!flag) && writeHashFrame("#!" + URL);
		if(callChangeFlag) {
			for(var i = 0; i < stateChangeFns.length; i++) {
				try{
					stateChangeFns[i](URL);
				}catch(e){
					$.log(e);
				}
			}
		}
		callChangeFlag = true;
	};
	
	var getURL = function(oldURL) {
		var URL = $.parseURL(oldURL || window.location);
		return {
			host: URL.host,
			path: "/" + URL.path,
			query: URL.query && ("?" + URL.query),
			hash: URL.hash && ("#" + URL.hash)
		};
	};
	
	/**
	 *  解析当前页面的真实 URL地址对象（$.parseURL实例）, 兼容假写地址方法及html5的地址获取
	 */
	var parseURL = function() {
		var URL = $.parseURL(window.location);
		// 如果页面中含有伪地址
		if(/^!/.test(URL.hash)) {
			return $.parseURL("http://" + URL.host + URL.hash.substr(1));
		}
		return URL;
	};
	
	/**
	 * 设置URL
	 * @method pushState
	 * @param {String} state 要设置的完整路径不带host 如:/directory/page.php?params#hash 
	 * @param {Object} opts 
	 * {
	 *		callChange: true//是否回调hashchange方法,默认为true
	 *		,callChangeOnSame: true//当于前hash相同时是否回调hashchange方法,默认为true
	 * }
	 * @return {Object} this 
	 */
	var pushState = function(URL, opts) {
		if(!/^\//.test(URL)) {
			$.log("地址:(" + URL + ") 不为正确的路径,请使用绝对路径; 例：/directory/page.php?params#hash");
			return;
		}
		opts = $.parseParam({
			callChange: true
			,callChangeOnSame: true
		}, opts);
		callChangeFlag = opts.callChange;
		
		//html5的兼容
		if(isHtml5State) {
			URL = URL.replace(/#.*$/, '');
			if(lastState == URL) {
				if(!opts.callChangeOnSame) {
					return;
				}
			} else {
				history.pushState(null, null, lastState = URL);
			}
			stateChange(URL);
			return;
		}
		var newHash = "#!" + URL;
		URL = URL.replace(/#.*$/, '');
		if(lastState == URL) {
			if(opts.callChangeOnSame) {
				stateChange(URL);
			}
		} else {
			window.location.hash = newHash;
		}
	};
	
	/**
	 * 此函数旨在像bigpipe页的伪地址中增加location.search参数，例如
	 * 同样是执行 historyM.setQuery({'page' : '1', 'type' : null })
	 * @param {JsonObject} query 需要设置的 query 参数的哈希表
	 * 	注意，参数的值为 null，表示删除该删除，如果想设置为null这四个字符，就带上引号，当字符串传过去
	 * @param {Boolean} callChange 是否回调
	 * @example
	 * 	historyM.setQuery({
	 * 		'group_id' : 1,
	 * 		'filter_pic' : 1,
	 * 		// 设置为 null 表示将伪地址中原有的此参数移除
	 * 		'filter_video' : null	
	 * 		'page' : 2
	 * 	});
	 * @author L.Ming | liming1@staff.sina.com.cn
	 */
	var setQuery = function (query, callChange) {
		if(!query)return;
		callChange = callChange || false;
		var URL = parseURL();
		var queryParam = $.queryToJson(URL.query);
		for(var key in query) {
			if(query[key] === null){
				delete queryParam[key];
			} else {
				queryParam[key] = query[key];
			}
		}
		
		URL.query = $.jsonToQuery(queryParam);
		result = ["/", URL.path, (URL.query == "") ? "" : "?", URL.query, (URL.hash == "") ? "" : "#", URL.hash].join("");
		pushState(result, {callChange: callChange});
	};
	/**
	 * 设置平常的hash
	 * @method setPlainHash
	 * @param {String} plainHash 平常的hash内容 不能以!开头
	 * @param {boolean} leaveHistory 是否留下历史记录 默认为false
	 * @return {Object} this 
	 */
	var setPlainHash = function(plainHash, leaveHistory) {
		if(typeof plainHash == 'string' && !/^!/.test(plainHash)) {
			var oldHash = $.parseURL(window.location).hash, newHash,
				baseUrl = window.location.toString().replace(/#.*$/, '');
			if(/^!/.test(oldHash)) {
				oldHash = oldHash.replace(/#.*$/, '');
				newHash = '#' + oldHash + '#' + plainHash;
			} else {
				newHash = '#' + plainHash;
			}
			if(leaveHistory) {
				window.location.hash = newHash;
			} else {
				window.location.replace(baseUrl + newHash);
			}
		}
		return that;
	};
	
	/**
	 * 添加对popstate事件的监听 此为html5的地址事件
	 * @param {Function} fn 回调方法
	 * 回调参数为变化后的URL
	 */
	var onpopstate = function(fn) {
		fn && stateChangeFns.push(fn);
		return that;
	};
	
	//一些监听启动和初始化操作stat
	lastState = window.location.toString().replace(/^http:\/\/.*?\//, "/").replace(/#.*$/, "");
	
	//对html5的支持
	if (isHtml5State) {
		//对state的监听
		$.addEvent(window, "popstate", function() {
			//做必要的判断
			setTimeout(function() {
				var nowURL = getURL(),
					newState = nowURL.path + nowURL.query;
				if(lastState != newState) {
					stateChange(lastState = newState);
				}
			});
		});
	} else {
		var onHashchange = function() {
			var newState, nowURL = getURL();
			if(/^#!/.test(nowURL.hash)) {
				newState = nowURL.hash.substr(2).replace(/#.*$/, '');
			} else {
				newState = nowURL.path + nowURL.query;
			}
			if(lastState != newState) {
				stateChange(lastState = newState);
			}
		};
		//对hash的监听
		if(haveHashchangeEvt) {
			$.addEvent(window, "hashchange", function() {
				onHashchange();
			});
		} else {
			setInterval(function() {
				onHashchange();
			}, 200);
		}
	}
	writeHashFrame && writeHashFrame("#!" + lastState);
	//end
	
	var that = {
		parseURL: parseURL,
		getURL: getURL,
		pushState: pushState,
		setQuery: setQuery,
		setPlainHash: setPlainHash,
		//onHashChange: onpopstate,
		onpopstate: onpopstate,
		hashFrameChangeHash: hashFrameChangeHash
	};
	
	return that;
});
