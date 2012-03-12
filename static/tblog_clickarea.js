var suds_clickAct_init = (function() {

	var _suds_clickarea_js_ver_ = "clickarea_:0.3";
	var _suds_cmp_cp_s = "";
	var _suds_cmp_cp_mp_rf = "http://beacon.sina.com.cn/b.gif";
	var _suds_cmp_cp_n = 0, _SUDS_CMP_CP_N_MAX = 3, _SUDS_CMP_CP_C_MAX = 1;
	var _SUDS_CMP_SAMPLE_PER = 1;
	var _SUDS_CMP_PAGE_ID = 0;
	var _SUDS_CMP_PAGE_WIDTH = 965;
	var _SUDS_CMP_PAGE_ALIGN = 2;
	var _SUDS_CMP_PAGE_SCROLLEFT = 0;
	var _SUDS_CMP_PAGE_SCROLLTOP = 0;

	var _SUDS_CMP_COOKIESESSION = "Apache";
	var _SUDS_CMP_COOKIEUSERID = "UNIPROU";

	var _SUDS_CMP_CLICKDOMAINROOT = "";
	var _SUDS_CMP_CLICKSESSIONID = "";
	var _SUDS_CMP_CLICKMAPUNIPROU = "";
	var _SUDS_CMP_CLICKMAPPAGEREF = window.document.referrer;
	var _SUDS_CMP_CLICKMAPPAGEURL = window.document.URL;

	var _SUDS_CMP_COOKIEAREA = "user_count";
	var _SUDS_CMP_TIMEOUTEAREA = 60;

	if ("" == _SUDS_CMP_CLICKMAPPAGEREF)
		_SUDS_CMP_CLICKMAPPAGEREF = "newpage";
	var _S_SinaKey = new Array(".sina.", ".51uc.", ".sinaapp.com");

	function getRealUrl(pUrl) {
		var ps = 0;
		ps = pUrl.indexOf("#");
		if (ps > 0) {
			return pUrl.substring(0, ps);
		} else {
			return pUrl;
		}
		;
	}

	function getSudsClickMapDomainRoot() {
		if ("" != _SUDS_CMP_CLICKDOMAINROOT)
			return _SUDS_CMP_CLICKDOMAINROOT;

		_suds_cmp_domainRoot = "";
		_suds_cmp_pageUrl = _SUDS_CMP_CLICKMAPPAGEURL;
		_suds_cmp_pageUrl = _suds_cmp_pageUrl.toLowerCase()

		pe = _suds_cmp_pageUrl.indexOf(".sina.");
		if (pe > 0) {
			_suds_cmp_domainRoot = "sina.com.cn";
		} else {
			ps = _suds_cmp_pageUrl.indexOf(".");
			if (ps > 0) {
				ps = ps + 1;
			} else {
				return "";
			}

			pe = _suds_cmp_pageUrl.indexOf("/", ps);
			if (pe < 0) {
				pe = _suds_cmp_pageUrl.length;
			}

			_suds_cmp_domainRoot = _suds_cmp_pageUrl.substring(ps, pe);
		}
		_SUDS_CMP_CLICKDOMAINROOT = _suds_cmp_domainRoot;
		return _suds_cmp_domainRoot;
	}

	function getSudsClickMapCookie(ckName) {
		var start = document.cookie.indexOf(ckName + "=");
		if (-1 == start) {
			return "";
		}
		start = document.cookie.indexOf("=", start) + 1;
		var end = document.cookie.indexOf(";", start);
		if (0 >= end) {
			end = document.cookie.length;
		}
		ckValue = document.cookie.substring(start, end);
		return ckValue;
	}

	function setSudsClickMapCookie(ckName, ckValue, expires) {
		if (ckValue != null) {
			_suds_cmp_domainRoot = getSudsClickMapDomainRoot();
			if (("undefined" == expires) || (null == expires)) {
				document.cookie = ckName + "=" + ckValue + "; domain="
						+ _suds_cmp_domainRoot + "; path=/";
			} else {
				var now = new Date();
				var time = now.getTime();
				time = time + 86400000 * expires;
				now.setTime(time);
				time = now.getTime();
				document.cookie = ckName + "=" + ckValue + "; domain="
						+ _suds_cmp_domainRoot + "; expires="
						+ now.toUTCString() + "; path=/";
			}
		}
	}

	function checkSudsClickMapSessionId() {
		ckTmp = getSudsClickMapCookie("Apache");
		if ("" == ckTmp) {
			var now = new Date();
			ckTmp = now.getTime() + Math.random();
			setSudsClickMapCookie("Apache", ckTmp);
		}
		return ckTmp;
	}

	function getSudsClickMapSessionInfo() {
		if ("" == _SUDS_CMP_CLICKSESSIONID)
			_SUDS_CMP_CLICKSESSIONID = checkSudsClickMapSessionId(_SUDS_CMP_COOKIESESSION);
		if ("" == _SUDS_CMP_CLICKMAPUNIPROU)
			_SUDS_CMP_CLICKMAPUNIPROU = getSudsClickMapCookie(_SUDS_CMP_COOKIEUSERID);
	}

	function randomSampleSudsClickAct() {
		var r_num = Math.floor(Math.random() * 1000);
		if (r_num < _SUDS_CMP_SAMPLE_PER) {
			getSudsClickMapSessionInfo();
			if (document.all) {
				document.attachEvent("onclick", sudsActLinkClick);
			} else {
				document.addEventListener("click", sudsActLinkClick, false);
			}
			sendAreaClick();
		} else {
			return 0;
		}
	}

	function sudsActLinkClick(e) {
		try {
			var o = event.srcElement;
		} catch (ex) {
			var o = e.target;
		}
		if ((o != null) && (o != document)) {

			var userArea = filterUserCount(o);
			if (userArea != null) {

				var ucTmp = getSudsClickMapCookie(_SUDS_CMP_COOKIEAREA);
				if (ucTmp != "") {
					setSudsClickMapCookie(_SUDS_CMP_COOKIEAREA, ucTmp + ","
							+ userArea.data);
				} else {
					setSudsClickMapCookie(_SUDS_CMP_COOKIEAREA, userArea.data);
				}
			}
		}
	}

	function _S_IsSinaPage() {
		var strDomain = document.location.host;
		strDomain = strDomain.toLowerCase();
		for (i = 0; i < _S_SinaKey.length; i++) {
			if (strDomain.indexOf(_S_SinaKey[i]) >= 0) {
				return true;
			}
		}
		return false;
	}

	function suds_clickAct_init(per, tm) {
		var argsLen = arguments.length;
		var reg = new RegExp("^\\d{1,4}|[1-9]\d*\.\d*|0\.\d*[1-9]\d*$");
		if (argsLen > 0) {
			_SUDS_CMP_SAMPLE_PER = arguments[0];
		}
		if (argsLen > 1) {
			_SUDS_CMP_TIMEOUTEAREA = arguments[1];
		}
		if (_S_IsSinaPage() == true) {
			randomSampleSudsClickAct();
		}
	}

	function findNode(oNode, fCallBack) {
		while (oNode.tagName.toLowerCase() != "body"
				&& oNode.tagName.toLowerCase() != "html") {
			if (fCallBack(oNode)) {
				return fCallBack(oNode);
			} else {
				oNode = oNode.parentNode;
			}
		}
	}

	function filterUserCount(oElement) {
		return findNode(oElement, function(oNode) {
			var nodeArea = oNode.getAttribute(_SUDS_CMP_COOKIEAREA);
			if (typeof nodeArea == "undefined" || !nodeArea) {
				return null;
			} else {
				return {
					'node' : oNode,
					'data' : nodeArea
				};
			}
		});
	}

	function sendAreaClick() {
		var act = getSudsClickMapCookie(_SUDS_CMP_COOKIEAREA);
		if (act != "") {
			setSudsClickMapCookie(_SUDS_CMP_COOKIEAREA, "");
			if ("" != act) {
				_S_uaTrack("tblog_areaclick", act);
			}
		}
		setTimeout(sendAreaClick, _SUDS_CMP_TIMEOUTEAREA * 1000)

	}
	return suds_clickAct_init;
})();