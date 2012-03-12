/**
 * 模板管理
 * @author 非反革命|zhaobo@staff.sina.com.cn
 * @example
 * @history
 *  2011.08.23	zhaobo	自定义模板增加距离顶部选项下拉菜单。REQ-8140
 *
 * todo 如果有时间应该对css进行简化，并且不是用link的方式。直接在style节点内覆盖之前样式。
 * 这样可以是页面非常流畅。之前用的link一个css地址的方式网速慢的话页面非常难看。
 */
$Import('kit.extra.language');
$Import('common.trans.custTmpl');
$Import('module.uploadPic');
$Import('common.skin.colorBox');

STK.register("common.skin.custTmpl", function($) {
    var lang = $.kit.extra.language,
            trans = $.common.trans.custTmpl,
            $easyTemplate = $.core.util.easyTemplate,
		    getStyle = $.core.dom.getStyle,
		    setStyle = $.core.dom.setStyle,
            clone = $.core.json.clone,
            removeNode = $.core.dom.removeNode,
            imageURL = $.common.extra.imageURL,
            MINWIDTH = 950,
		    sHTML, dHTML;
    var TEMPLATE = lang('<#et temp data>' +
            '<div class="setup_template" node-type="custTmplContainer">' +
            '<div node-type="tmplControlPanel"></div>' +
            '<div node-type="diyControlPanel"></div>' +
            '<p class="btn">' +
            '<a class="W_btn_b" action-type="save" href="#"><span>#L{保存}</span></a>' +
            '<a class="W_btn_a" href="#" action-type="cancel"><span>#L{取消}</span></a>' +
            '</p>' +
            '</div>' +
            '</#et>');

    return function(opts) {
        var that = {},
		diySkinInited = false,
		        dialogOuter;

        $.custEvent.define(that, ['load', 'hide']);


        var util = {
	        /**
	         * 设置当前样式
	         * @param currClass 需设置的样式
	         * @param el 当前节点
	         * @param container 所在容器
	         *  @Return {Boolean} 返回是否切换了样式
	         */
            setCurrent : function(currClass, el, container) {
                var _curr = $.sizzle(".current", container);
                var isCurr = false;
                for (var i = 0; i < _curr.length; i++) {
                    if (_curr[i] === el) isCurr = true;
                    !isCurr && $.core.dom.removeClassName(_curr[i], "current");
                }
                !isCurr && $.core.dom.addClassName(el, "current");
                return !isCurr;
            }
        };
	    var custStyle = $.E("custom_style");
	    /**
	     *  设置自定义模板样式。
	     * @param obj
	     * @param key
	     * @param value
	     */
	    setStyle = function(obj, key, value){
		    $.log("delete setStyle");

//			$.core.dom.removeNode(custStyle);
		    if(!$.E("custom_style")){
				custStyle = $.C("style");
				custStyle.setAttribute("type", "text/css");
				custStyle.id = "custom_style";
		    }
		    document.getElementsByTagName("head")[0].appendChild(custStyle);
		    var colorObj =  _this.skinFuns.getCustColorObj();

		    var cssArr = [];
		    cssArr.push("@import '"+$CONFIG['cssPath'] +"skin/public/base.css?version="+$CONFIG['version']+"';");

		    if(obj && key && value){
			    cssArr.push("@import '"+$CONFIG['cssPath'] +"skin/diy/"+(_this._tempSkin.scheme || $CONFIG["scheme"] || "diy006") +"/skin.css?version="+$CONFIG['version']+"';");
			    $.log("*********url**************2", "@import '"+$CONFIG['cssPath'] +"skin/diy/"+(_this._tempSkin.scheme || $CONFIG["scheme"] || "diy006") +"/skin.css?version="+$CONFIG['version']+"';");
			    cssArr.push(key+":"+value);
			    cssArr.push("html body{");
		    }else if(_this._diyDom){
			    var rendData = _this.DiyStyleFun.getDiyControlPanelData(_this._diyDom);
			    if(rendData.scheme)cssArr.push("@import '"+$CONFIG['cssPath'] +"skin/diy/"+rendData.scheme +"/skin.css?version="+$CONFIG['version']+"';");
			    $.log("*********url**************3", "@import '"+$CONFIG['cssPath'] +"skin/diy/"+rendData.scheme +"/skin.css?version="+$CONFIG['version']+"';");
			    cssArr.push("html body{");
			    _this._tempSkin.pid = rendData.pid;
			    _this._tempSkin.position = rendData.position;
			    _this._tempSkin.useBg = rendData.useBg ? "1" : "0";
			    _this._tempSkin.lock = rendData.lock ? "1" : "0";
			    _this._tempSkin.repeat = rendData.repeat ? "1" : "0";
			    if(rendData.useBg){
				    cssArr.push("background-image:"+"url("+ (rendData.pid?imageURL(rendData.pid, {size:"large"}):"") +");");
				    cssArr.push("background-attachment:"+(rendData.lock?"fixed":"scroll")+";");
				    var position = rendData.position;
				    switch(parseInt(position)){
					    case 0:
						    position =  "left";
						    break;
					    case 1:
						    position =  "center";
						    break;
					    case 2:
						    position =  "right";
						    break;
					    default:
						    position =  "center";
				    }
				    position +=" 0";
				    cssArr.push("background-position:"+ position+";");
				    cssArr.push("background-repeat:"+(rendData.repeat ? "repeat" : "no-repeat")+";");
			    }else{
				    cssArr.push("background-image:"+"none");
			    }

		    }
		    cssArr.push("}");
			//modify by zhaobo 201108231050  req-8140
		    //delete
		    //cssArr.push(".W_main{padding:52px 0 0;}");
		    //add
		    cssArr.push("html .W_main"+(_this.isNarrow ? "_narrow" : "")+"{padding:"+ _this._tempSkin.topHeight+"px 0 0;}");
		    cssArr.push("html .W_miniblog {background-image:none;}");
		    if(colorObj){
			    if(colorObj['page_bg'])cssArr.push("html body{background-color:"+colorObj['page_bg']+";}");
			    if(colorObj['content_bg'])cssArr.push("html .W_main #plc_main, .W_main #plc_profile{background-color:"+colorObj['content_bg']+";}");
			    if(colorObj['main_char'])cssArr.push("html body, html body .W_texta,html body a.W_texta {color:"+colorObj['main_char']+";}");
			    if(colorObj['main_link'])cssArr.push("html a,.W_linka a,html body a.W_linka,html body a.W_gotop,html body .W_gotop span {color:"+colorObj['main_link']+";}a.W_moredown .more, a.W_moredown:hover .more {border-top-color:"+colorObj['main_link']+";} a.W_moreup .more, a.W_moreup:hover .more {border-bottom-color:"+colorObj['main_link']+";}");
			    if(colorObj['minor_link'])cssArr.push("html body .W_linkb a,html body a.W_linkb {color:"+colorObj['minor_link']+";} .W_linkb a.W_moredown .more, .W_linkb a.W_moredown:hover .more {	border-top-color:"+colorObj['minor_link']+";} .W_linkb a.W_moreup .more, .W_linkb a.W_moreup:hover .more {border-bottom-color:"+colorObj['minor_link']+";}");
			    if(colorObj['border'] && _this._tempSkin.colors_type == "1"){

//			    if(colorObj['border']){
			        var _border = colorObj['border'];
//			    if(_this.custColor && _this.custColor["border"]){
//				    var _border = _this.custColor['border'];
				    cssArr.push("html .W_main_bg { background:url("+$CONFIG["imgPath"]+"skin/diy/images/"+_border+"_repeat_bg_y.png?id="+$CONFIG['version']+") repeat-y left 0; _background:url("+$CONFIG["imgPath"]+"skin/diy/images/"+_border+"_repeat_bg_y.gif?id="+$CONFIG['version']+") repeat-y left 0; }");
				    cssArr.push("html .W_main_narrow_bg{ background:url("+$CONFIG["imgPath"]+"skin/diy/images/"+_border+"_repeat_bg_y.png?id="+$CONFIG['version']+") repeat-y right 0; _background:url("+$CONFIG["imgPath"]+"skin/diy/images/"+_border+"_repeat_bg_y.gif?id="+$CONFIG['version']+") repeat-y right 0; }");
			    }
			    if(colorObj['content_bg']){
				    var num_content_bg = colorObj['content_bg'].replace("#", "");
				    var rgbColor = "";
				    if(colorObj['content_bg_rgb']){
					    rgbColor = colorObj['content_bg_rgb'].replace(/rgb\((.*)\)/, "$1");
				    }
				    cssArr.push("html .B_index .W_main_narrow .custom_content_bg, .B_my_profile .W_main_narrow .custom_content_bg, .B_my_profile_other .W_main_narrow .custom_content_bg,.B_my_profile_other .W_main_narrow .suggested_follows{ background-color:"+colorObj['content_bg']+"; } .B_index .W_main_narrow #pl_content_publisherTop, .B_my_profile .W_main_narrow .perAll_info, .B_my_profile_other .W_main_narrow .perAll_info{ background:-moz-linear-gradient(top, rgba("+rgbColor+", 0.7), rgba("+rgbColor+", 1)); background:-webkit-gradient(linear, 0 0, 0 100%, from(rgba("+rgbColor+", 0.7)), to(rgba("+rgbColor+", 1))); background:none\9; filter:progid:DXImageTransform.Microsoft.gradient(startcolorstr=#88"+num_content_bg+",endcolorstr=#ff"+num_content_bg+",gradientType=0); }");
				    cssArr.push("html .W_main #plc_main{filter:progid:DXImageTransform.Microsoft.gradient(startcolorstr=#ef"+num_content_bg+", endcolorstr=#ef"+num_content_bg+", gradientType=0); _filter:none;background-color: rgba("+rgbColor+", 0.96);} ");
			    }
		    }
		    var cssText = cssArr.join("\n");
		    if(custStyle.styleSheet){
			    custStyle.styleSheet.cssText = cssText;
		    }else{
//			    custStyle.appendChild(document.createTextNode(cssText));
			    custStyle.innerHTML = cssText;
		    }
	    };
        var _this = {
            DOM:{},//节点容器
            objs:{},//组件容器
            anonymousCheck: false,
	        custColor : {},
            share : true,
	        isNarrow : $CONFIG['isnarrow'] == '1',
            _vote : false,
	        //控制面板
            controlPanel : null,
            _tempList : null,
	        //临时对象，用于保存当前操作并未保存的属性。
	        _tempSkin : {},
	        //临时对象，记录一些比较重要的操作步骤
	        _locus : {},
	        //轨迹对象的相应的函数
	        locus : {
		        add : function(key, data, replace){
                    if(_this._tmplCache[key] && !replace) return;
                    _this._locus[key] = data;
			        return _this._locus;
                },
                get : function(key){
                    return _this._locus[key];
                },
		        each : function(fun){
			        for (var key in _this._locus) {
				        fun.apply(this, [key, _this._locus[key]]);
			        }
			        return _this._locus;
		        },
		        remove : function(key){
			        _this._locus[key] = null;
			        delete _this._locus[key];
                    return _this._locus;
                },
                clear : function(){
                    for (var key in _this._locus) {
                        _this._locus[key] = null;
                        delete _this._locus[key];
                    }
                }
	        },
	        //默认皮肤属性
            DefaultSkin : {
	            skinId : $CONFIG["skin"],
	            pid :$CONFIG["background"],
	            //bg : imageURL($CONFIG["background"], {size : "large"}),
	            scheme : $CONFIG["scheme"],
	            position : "1",
	            //add by zhaobo 201108231050  req-8140
				topHeight : 20,
	            useBg : false,
	            lock : false,
	            repeat : false
            },
	        //模板缓存
            _tmplCache : {},
	        //是否启用缓存
            _useCache : true,
	        //模板缓存相应的函数
            TmplCacheFun : {
                set : function(key, data){
                    if(!_this._useCache || _this._tmplCache[key]) return;
                    _this._tmplCache[key] = data;
                },
                get : function(key){
                    return _this._tmplCache[key];
                },
                clear : function(){
                    for (var key in _this._tmplCache) {
                        _this._tmplCache[key] = null;
                        delete _this._tmplCache[key];
                    }
                }

            },
	        //上传相应函数
	        uploadFuns : {
		        start : function(){
			        _this._diyDom["upload_div"].style.display = "none";
			        _this._diyDom["reUpload"].style.display = "none";
					_this._diyDom["uploadAid"].style.display = "";
					$.core.dom.addClassName(_this._diyDom["uploadMSG"].parentNode, "W_loading");
					_this._diyDom["uploadMSG"].innerHTML = lang('#L{正在上传}...');
		        },
		        errFunc : function(msg){
			        _this.locus.add("upload", "err");
			        _this._diyDom["upload_div"].style.display = "none";
					_this._diyDom["uploadAid"].style.display = "";
			        _this._diyDom["reUpload"].style.display = "";
			        $.core.dom.removeClassName(_this._diyDom["uploadMSG"].parentNode, "W_loading");
			        _this._diyDom["uploadMSG"].innerHTML = msg;
		        },
		        complete : function(json){
			        _this._diyDom["upload_div"].style.display = "none";
			        _this._diyDom["reUpload"].style.display = "";
					_this._diyDom["uploadAid"].style.display = "";
			        _this._diyDom["uploadMSG"].innerHTML = lang("#L{上传成功！}");
			        _this._tempSkin.pid = json.pid;
//			        $CONFIG["background"] = json.pid;
			        $.core.dom.removeClassName(_this._diyDom["uploadMSG"].parentNode, "W_loading");
			        _this._diyDom["upload_pic"].innerHTML = '<img width="100" src='+imageURL(json.pid, {size:"thumbnail"})+'/>';
			        _this._diyDom["use_bg"].checked = true;
			        var img = new Image();
			        img.src = imageURL(json.pid, {size:"large"});
			        $.core.util.hideContainer.appendChild(img);
			        img.onload = function() {
				        _this._diyDom["repeat_bg"].checked = (this.width <= MINWIDTH);
				        _this._diyDom["alignment"].options[1].selected = "selected";
				        _this.DiyStyleFun.setBg(json.pid, true);
				        this.onload = null;
				        $.core.dom.removeNode(this);
			        };
			        _this.locus.add("upload", json.pid);

		        },
		        err : function(){
			        _this.uploadFuns.errFunc(lang("#L{上传失败！请上传5M以内的JPG、GIF、PNG图片。}"));
		        },
		        timeout : function(){
			        _this.uploadFuns.errFunc(lang("#L{上传图片超时}！"));
		        }
	        },
            DiyStyleFun : {
	            //获取diy的配置数据
	            getDiyControlPanelData : function(_dom){
		            var img = $.sizzle("img", _dom["upload_pic"])[0];
		            var _scheme = $.sizzle(".current", _dom["diy_list"])[0];
		            if(_scheme)_scheme = $.core.json.queryToJson(_scheme.getAttribute("action-data")).scheme;
		            //add by zhaobo 201108231050  req-8140
		            var topHeightOption = _dom["top_height"];
		            var _topHeight = !topHeightOption ? 20 : parseInt(topHeightOption.options[topHeightOption.selectedIndex].innerHTML);
		            _topHeight+=34;
		            var alignmentOption = _dom["alignment"];
		            var _als = $.sizzle("input:checked", alignmentOption);
		            var _alignment;
		            if(_als.length>0) {
			            _alignment = $.core.json.queryToJson(_als[0].getAttribute("action-data")).position;
		            }else{
			            _alignment = !alignmentOption ? 0 : alignmentOption.options[alignmentOption.selectedIndex].value;
		            }
		            return {
			            skinId : $CONFIG["skin"],
						//bg : (img && img.src.replace("thmubnail", "large")) || _this.DefaultSkin.bg || "",
						pid : _this._tempSkin.pid || $CONFIG["background"] || "",
			            //add by zhaobo 201108231050  req-8140
			            topHeight : _topHeight,
						useBg : _dom["use_bg"].checked,
						lock : _dom["lock_bg"].checked,
						repeat : _dom["repeat_bg"].checked,
			            scheme : _scheme ||$CONFIG["scheme"],
						position : _alignment
					};
	            },
	            //获取默认样式
	            getDefaultStyles : function(){
					return {
						skinId : $CONFIG["skin"],
			            pid : $CONFIG["background"],
						//add by zhaobo 201108231050  req-8140
						topHeight : getStyle(document.body, "backgroundPosition"),
						useBg : true,
			            //bg : getStyle(document.body, "backgroundImage").replace("url(", "").replace(")", ""),
						position : getStyle(document.body, "backgroundPosition"),
						lock : getStyle(document.body, "backgroundAttachment"),
						repeat : getStyle(document.body, "backgroundRepeat")
		            };
	            },

	            /**
	             * 设置diy的所有样式
	             * @param {object} styles 样式对象
	             */
	            setDiyStyles : function(styles) {
					_this.DiyStyleFun.setBg(styles.pid, styles.useBg);
					_this.DiyStyleFun.setAligin(styles.position);
					_this.DiyStyleFun.setBgLock(styles.lock);
					_this.DiyStyleFun.setBgRepeat(styles.repeat);
				},

	            /**
	             *  设置背景
	             * @param url 图片id
	             * @param bSet 是否使用背景
	             */
                setBg : function(url, bSet) {
	                url = typeof url == "undefined" ? "" : url;
	                url = imageURL(url, {size:"large"});
	                url =bSet ? (url == "url()" ? "" : "url("+url+")") : "url()";
	                $.log("URL:", url);
	                if(_this._diyDom){
						_this._diyDom["lock_bg"].disabled = !bSet;
						_this._diyDom["repeat_bg"].disabled = !bSet;
		                /*var positions = _this._diyDom["alignment"].options[_this._diyDom["alignment"].selectedIndex].value;
						for (var i = 0; i < positions.length; i++) {
							var _item = positions[i];
							_item.disabled = !bSet;
						}*/
		                _this._diyDom["alignment"].disabled = !bSet;
	                }
	                setStyle();
	                //_this._tempSkin.bg = url.replace(/.*\/(.*?)\..*?$/, "$1");
	                _this._tempSkin.useBg = bSet ? "1" : "0";
                },
	            /**
	             *  设置锁定背景
	             * @param {boolean} _lock 是否锁定
	             */
                setBgLock : function(_lock) {
	                _this._tempSkin.lock =  _lock ? "1" : "0";
	                $.log("_lock:", _lock);
	                _lock = _lock == undefined  ? "" : (_lock ? "fixed" : "scroll");
	                setStyle();
                },
	            /**
	             * 设置背景平铺
	             * @param {boolean} repeat 是否平铺
	             */
                setBgRepeat : function(repeat) {
	                if(typeof repeat == "boolean"){
		                repeat = repeat ? "repeat" : "no-repeat";
	                }
	                $.log("repeat:", repeat);
	                setStyle();
	                _this._tempSkin.repeat =  repeat === "repeat" ? "1" : "0";
                },
	            /**
	             * 设置背景位置
	             * @param {number} position  0-左， 1-中， 2-右
	             */
                setAligin : function(position) {
	                position = position == undefined  ? "" : position;
	                _this._tempSkin.position = position;
	                setStyle();

                },
	             //add by zhaobo 201108231050  req-8140
	            setTopHeight : function(topHeight){
		            topHeight = topHeight == undefined  ? "" : topHeight;
	                _this._tempSkin.topHeight = topHeight;
		            $.log("topHeight:", topHeight);
	                setStyle();
	            },
	            /**
	             * 设置配色方案
	             * @param {Element} or {string} dom节点，或者配色方案id字符串
	             */
                setScheme : function(el, notReFresh) {
	                var data;
	                if(typeof el == "string"){

		                data = {el : $.sizzle('[action-data="scheme='+el+'"]', _this._diyDom["diy_list"])[0],scheme : el};
	                }else{
						var _scheme = $.sizzle(".current", el)[0];
						if(!_scheme) _scheme = $.sizzle("a", el)[0];
						data = $.core.json.queryToJson(_scheme.getAttribute("action-data"));
	                }
                    _this.DOM_eventFun.useScheme({el : _scheme, data : data}, true, notReFresh);
                }
            },
	        skinFuns : {
		        //取消配色方案高亮状态
		        cancelHilightScheme:function(){
			        if(_this._diyDom && _this._diyDom["diy_list"]){
				        var listDom = _this._diyDom["diy_list"];
				        var list  = $.sizzle('[action-type="useScheme"]', listDom);
				        $.foreach(list, function(el){
					        $.removeClassName(el, "current");
				        });
			        }
		        },
		        /**
		         * 获取自定义颜色对象
		         * @Return {object}
		         */
		        getCustColorObj : function(){
			        if(!_this._diyDom) return;
			        var _listDom = _this._diyDom["cust_color_list"];
			        if(!_listDom) return {};
			        var returnObj = {};
			        var _list = $.sizzle("li", _listDom);
			        $.foreach(_list, function(el){
				        var data = $.queryToJson(el.getAttribute("action-data"));
				        if(data.pos === "content_bg"){
					        var span = $.sizzle("span", el)[0];
					        returnObj["content_bg_rgb"] = span.style.backgroundColor;
				        }
				        returnObj[data.pos] = data.color;
			        });
			        return returnObj;
		        },
		        /**
		         * 根据数据对象将颜色填充
		         * @param {Object} data 颜色数据对象
		         */
		        setCustColorObj : function(data){
			        var _data = data;
			        delete _data.scheme;
			        for(var i in _data){
				        var span = $.sizzle("span", _this._diyDom["cust_"+i])[0];
				        span.style.backgroundColor = _data[i];
				        var li = span.parentNode;
				        li.setAttribute("action-data", $.jsonToQuery({'pos':i, 'color':_data[i]}));
			        }
		        },
		        // 设置当前皮肤
		        setCurrentSkin : function(){
					if(_this._tempSkin && !_this._tempSkin.skinId){
						return;
					}
					var curr = $.sizzle(".current", $.sizzle('[node-type="templete_list"]', _this.controlPanel)[0])[0];
					curr && $.core.dom.removeClassName(curr, "current");
			        var list = $.sizzle("a", $.sizzle('[node-type="templete_list"]', _this.controlPanel)[0]);
					for (var i = 0; i < list.length; i++) {
						var item = list[i];
						if(_this._tempSkin.skinId == $.core.json.queryToJson(item.getAttribute("action-data")).skinId){
							$.core.dom.addClassName(item, "current");
							break;
						}
					}

		        }
	        },
	        //接口相应函数
            TransFun : {
	            //获取接口字符串。
                getInnerHtml : function(data, _init){
                    var isDiy = data.type === "1";
	                var _page = data.page || "";
	                if(_page === "1") _page = "";
	                var key = data.cate+_page ;
                    var cache = _this.TmplCacheFun.get(key);
	                //是否在缓存中存在。如果存在则不请求。
                    if(cache){
	                     _this.diyControlPanel.style.display = isDiy ? "" : "none";
						_this.controlPanel.style.display = isDiy ? "none" : "";
	                     if(isDiy){
                                _this.diyList = $.sizzle('[node-type="diy_list"]', _this.diyControlPanel)[0];
								changeSkin("diy");
	                     }else{
		                     _this.controlPanel.innerHTML = cache;
							 _this.skinFuns.setCurrentSkin();
	                     }
                        return;
                    }
	                //请求接口
                    trans.getTrans(("templist"), {
                        onSuccess: function(json) {
                            var _innerHTML = json.data.html;
                            _this.TmplCacheFun.set(key, _innerHTML);
	                         _this.diyControlPanel.style.display = isDiy ? "" : "none";
							_this.controlPanel.style.display = isDiy ? "none" : "";
                            if(isDiy){
	                            _this.diyControlPanel.innerHTML = _innerHTML;
                                _this.diyList = $.sizzle('[node-type="diy_list"]', _this.diyControlPanel)[0];
								changeSkin("diy",  _this.locus.get("skinId") !=="diy");
                            }else{
	                            _this.controlPanel.innerHTML = _innerHTML;
                                if(_init){
                                    if(isDiy){
                                        sHTML = _innerHTML;
                                    }else{
                                        dHTML = _innerHTML;
                                    }

	                                if(data.skinId) {
		                                _this.locus.add("skinId", data.skinId);
		                                _this._tempSkin.skinId = data.skinId;
		                                $.log("SKING:", _this._tempSkin);
	                                }
                                    $.custEvent.fire(that, 'load', [data.skinId, json.data.skin_name||""]);
                                }else{
	                                _this.skinFuns.setCurrentSkin();
                                }
                            }
                        },
                        onFail: function() {
                        },
                        onError: function(data) {
                        }
                    }).request(data);
                }
            },

	        //add by zhaobo 201109201728 REQ-8847
	        loadProvColorPicker : function(){
		        //加载自定义颜色模块
//		        $.core.io.scriptLoader({
//			        'url' : "http://js.t.sinajs.cn/t4/home/js/content/colorBox.js",
//			        'onComplete' : function() {
				_this.colorPicker = $.common.skin.colorBox(undefined, "STK.common.skin.colorPickerCallBack");
				$.common.channel.colorPick.register("setting", _this.listenerFun.settingCustColor);
//		            }
//		        });
	        },
	        //事件广播函数
	        listenerFun: {
		        /**
		         * 设置颜色
		         * @param {string}/{number} colorHex
		         * @param {string}colorStyle
		         */
		        settingCustColor : function(colorHex, colorStyle){
			        var custList = _this._diyDom["cust_color_list"];
			        if(!custList) return;
			        $.log(colorStyle);
			        var curr = $.sizzle('[node-type="cust_'+colorStyle+'"] > span', custList)[0];
			        if(curr) {
				        curr.style.backgroundColor = "#"+colorHex;
				        curr.parentNode.setAttribute("action-data", "pos="+colorStyle+"&color=#"+colorHex);
			        }
			        if(colorStyle === "content_bg"){
				        _this.custColor["content_bg_rgb"] = curr.style.backgroundColor;
			        }
			        _this.custColor[colorStyle] = "#"+colorHex;
			        _this.skinFuns.cancelHilightScheme();
			        _this._tempSkin.colors_type = "1";
			        setStyle();
		        }
	        },

            DOM_eventFun: {//DOM事件行为容器
	            /**
	             * 使用官方模板
	             * @param obj {object}
	             * @param force 是否强制请求。
	             */
                useTmpl : function(obj, force) {
                    var el = obj.el;
	                if(_this._lock) {
		                //$.ui.alert(lang("#L{正在加载css，请稍后再试...}"));
		                cssAbort();
		                //return ;
	                }
                    _this._tempList = $.sizzle('[node-type="templete_list"]', _this.controlPanel)[0];
                    if (util.setCurrent("current", el, _this._tempList) || force){
	                    _this._tempSkin.tmplPid = obj.data.picid;
	                    _this._tempSkin.skinName = obj.data.skinname;
	                    _this.DOM_eventFun.switchCss(true);
	                    _this._tempSkin.skinId = obj.data.skinId;
	                    _this.locus.add("skinId", obj.data.skinId);
	                    var callback = function(){
		                    $.log("custStyle:", custStyle);
							removeNode(custStyle);
						};
	                    changeSkin(obj.data.skinId, undefined, callback);
                    }
                    $.preventDefault();
                    return false;
                },
	            /**
	             * 使用配色方案
	             * @param obj
	             * @param force {boolean} 是否强制请求。
	             */
                useScheme : function(obj, force, notReFresh) {
	                if(_this._lock) cssAbort();
                    var el = obj.el;
                    if (!force && !util.setCurrent("current", el, _this.diyList)) {
                        return;
                    }
                    var scheme =  obj.data.scheme;
	                _this.custColor = {};
	                _this._lock = true;
                    var url = "diy/"+scheme+(_this.isNarrow ?  "/skin_narrow.css" : "/skin.css");
                    var cacheId = "diy_" + scheme;
                    url = $CONFIG['cssPath'] + 'skin/' + url;
                    var oTrans = $.E("skin_transformers1");
                    oTrans && (oTrans.id = "skin_transformers_temp1");
                    var load_id = "js_skin_" + cacheId+"_skin";
	                _this._tempSkin.scheme = scheme;
	                $.log(123, "setCustColorObj", scheme, notReFresh);
	                if(!notReFresh){
		                _this._tempSkin.colors_type = "";
		                _this.skinFuns.setCustColorObj(obj.data);
	                }
                    cssLoader(url, cacheId, load_id, function(url, loaded, _tmout) {
	                    _this._lock = false;
	                    _this.locus.add("scheme", scheme);

						var _trans = $.E("skin_transformers_temp1");
						_trans && removeNode(_trans);
	                    setStyle(obj);
                        /*if (loaded && oTrans) {
                            oTrans.id = "skin_transformers1";
                            oTrans.href = url;
                        } else {
                            var _trans = $.E("skin_transformers_temp1");
                            _trans && $.core.dom.removeNode(_trans);
                        }*/
                    }, "skin_transformers1");
	                if(obj.evt)$.preventDefault();
                    return false;
                },
	            /**
	             * 切换类型。
	             * @param obj
	             */
                switchType : function(obj) {
	                _this.locus.add("switchType", obj.data.type||obj.data.cate);
                    if(!$.core.dom.hasClassName(obj.el, "current"))_this.TransFun.getInnerHtml(obj.data);
                    $.preventDefault();
                    return false;
                },
	            /**
	             * 切换css
	             * @param isDiy 是否是自定义模板
	             */
	            switchCss : function(isDiy){
					var id = "skin_transformers" + (isDiy ? "1" : "");
					var link = $.E(id);
					if(link) {
						link.href = "";
						//link.href = isDiy ? " " :($CONFIG['cssPath'] + 'skin/diy/skin.css?version='+$CONFIG['version']);
					}
	            },
	            /**
	             * 设置背景位置
	             * @param obj
	             */
                alignment : function(obj) {
	                var position;
	                if(obj.data && obj.data.position){
		                position = obj.data.position;
	                }else{
						var el = _this._diyDom["alignment"];
						position = el.options[el.selectedIndex].value;
	                }
	                _this.locus.add("position", position);
                    _this.DiyStyleFun.setAligin(position);
                    return false;
                },
	            //add by zhaobo 201108231050  req-8140
	            setTopHeight : function() {
		            $.log(this);
		            var el = _this._diyDom["top_height"];
		            var _topHeight = parseInt(el.options[el.selectedIndex].innerHTML);
		            _topHeight += 34;
		            _this.locus.add("topHeight", _topHeight);
		            _this.DiyStyleFun.setTopHeight(_topHeight);
		            return false;
	            },
	            /**
	             * 设置背景
	             * @param obj
	             */
                useBackground : function(obj) {
	                $.log("useBackground:", obj);
	                var img = $.sizzle("img", _this._diyDom["upload_pic"])[0];
	                //var url = imageURL($CONFIG["background"], {size:"thumbnail"});
	                var pid = _this._tempSkin.pid || $CONFIG["background"] || "";
	                _this.locus.add("useBg", obj.el.checked);
	                _this.locus.add("pid", pid);
                    _this.DiyStyleFun.setBg(pid, obj.el.checked);
                    return false;
                },
	            /**
	             * 锁定（解除锁定）背景
	             * @param obj
	             */
                lockBackground : function(obj) {
	                _this.locus.add("lock", obj.el.checked);
                    _this.DiyStyleFun.setBgLock(obj.el.checked);
                    return false;
                },
	            /**
	             * 是否平铺背景
	             * @param obj
	             */
                repeatBackground : function(obj) {
	                _this.locus.add("reapeat", obj.el.checked);
                    _this.DiyStyleFun.setBgRepeat(obj.el.checked ? "repeat" : "no-repeat");
                    return false;
                },
	            /**
	             * 上传图片隐藏input跟随鼠标函数
	             * @param obj
	             */
	            uploadPic : function(obj) {
		            var evt = $.fixEvent(obj.evt);
					var el = obj.el;
		            if(!_this._diyDom) return ;
					var actEl = _this._diyDom["upload_dom"];
					var pos = $.core.dom.position(el);
		            var outSide = $.core.dom.position(dialogOuter);
					var sPos = $.scrollPos();
					var mouseY = sPos.top  + evt.clientY;
					var mouseX = sPos.left + evt.clientX;
		            //$.log(typeof sPos.top , typeof outSide.top, sPos.left - outSide.left, outSide, sPos);
					var inputOffX = parseInt(actEl.offsetWidth / 2),inputOffY = parseInt(actEl.offsetHeight / 2);
					var offY = mouseY - pos.t;
					var offX = mouseX - pos.l;

		            actEl.style.left = (offX - inputOffX+(pos.l - outSide.l))+"px";
		            actEl.style.top = (offY - inputOffY + (pos.t - outSide.t))+"px";
                    return false;
                },
	            /**
	             * 重新上传
	             * @param obj
	             */
	            reUpload : function(obj) {
					_this._diyDom["upload_div"].style.display = "";
					_this._diyDom["uploadAid"].style.display = "none";
                    return false;
                },
	            //add by zhaobo 201109201728 REQ-8847
	            /**
	             * 自定义颜色
	             * @param {object}obj
	             */
	            custColor : function(obj){
		            if(!_this.colorPicker) return;
		            var data = obj.data;
		            var el = obj.el;
		            $.log("custColor", data.color, data.pos);
		            var pos = $.position(el);
		            var size = $.core.dom.getSize(el);
		            var left = pos.l + size.width;
		            var top = pos.t + size.height;
					_this.colorPicker.show([left, top] , data.color, data.pos, el);
	            },
	            /**
	             * 边框颜色
	             * @param obj
	             */
	            borderColor : function(obj){
		            var el = obj.el;
		            if(!_this.provColorPicker){
			            _this.provColorPicker = $.common.skin.provColorPicker({target:obj.el});
			            $.custEvent.add(_this.provColorPicker, "selected", function(a, c, h){
							_this.custColor['border'] = c;
				            var span = $.sizzle("span", el)[0];
				            if(span) {
//					            span.style.backgroundColor = "#"+h;
					            span.style.backgroundColor = c;
					            span.parentNode.setAttribute("action-data", "pos=border&color="+c);
				            }
				            _this.skinFuns.cancelHilightScheme();
				            _this._tempSkin.colors_type = "1";
				            setStyle({setBorder:true});
						});
		            }
		            var pos = $.position(el);
		            if(_this.provColorPicker.getDisplayStatus()) return;
		            _this.provColorPicker.show([pos.l, pos.t]);
	            },
	            /**
	             * 保存函数
	             */
                save : function() {
					$.log(_this._tempSkin);
	                if(_this._tempSkin.skinId === "diy") {
		                delete _this._tempSkin.skinId;
		                //_this._tempSkin.bg = imageURL($CONFIG["background"], {size:"large"});//_this._tempSkin.bg.replace("thumbnail", "large");
		                if(typeof _this._tempSkin.lock === "boolean")_this._tempSkin.lock = _this._tempSkin.lock ? "1" : "0";
						if(typeof _this._tempSkin.repeat === "boolean")_this._tempSkin.repeat = _this._tempSkin.repeat ? "1" : "0";
						if(typeof _this._tempSkin.useBg === "boolean")_this._tempSkin.useBg = _this._tempSkin.useBg ? "1" : "0";
		                var colorArr = [];
						for(var i in _this.custColor){
							if(i !== "content_bg_rgb")colorArr.push("\""+i+"\""+":\""+_this.custColor[i]+"\"");
						}
						if(colorArr.length>0){
							_this._tempSkin.color = "{"+colorArr.join(",")+"}";
						}
	                }
	                var requestData = clone(_this._tempSkin);
					if(requestData.skinId == "") {
						requestData.skinId = window.$CONFIG && window.$CONFIG.skin || '';
					}
	                trans.getTrans("save", {
		                onSuccess : function(json){
			                if(_this._tempSkin.skinId){
				                $CONFIG["skin"] = _this._tempSkin.skinId;
			                }else{
				                $CONFIG["skin"] = "diy";
				                $CONFIG["background"] = _this._tempSkin.pid || "";
				                $CONFIG["scheme"] = _this._tempSkin.scheme;
			                }
			                _this.saved = true;
							//data":{"skinId":"skin030","skin_picid":"6b888227jw1dlwoerodepj","skin_name":"\u5922\u5e7b"}}
							if(json.data.skinid != json.data.old_skinid) {
								if(json.data.skinid) {
									_this._tempSkin.skinId = json.data.skinid;
								}
								if(json.data.skin_picid) {
									_this._tempSkin.tmplPid = json.data.skin_picid;
								}
								if(json.data.skin_name) {
									_this._tempSkin.skinName = json.data.skin_name;
								}
							}
							
							$.custEvent.fire(that, 'hide', [_this._tempSkin.skinName, _this._tempSkin.skinId, _this._tempSkin.tmplPid]);
		                },
                        onFail: function() {
	                        $.log("fail");
                        },
                        onError: function(data) {
	                        $.log("err");
                        }
	                }).request(requestData);

                    $.preventDefault();
                    return false;
                },
	            //取消按钮函数
                cancel : function() {
                    $.custEvent.fire(that, 'hide', ["cancel"]);
                    $.preventDefault();
                    return false;
                }

            }
        };

	    //文件缓存
        var fileCache = {};

        var checkFileCache = function(url, complete) {
            var _fileObj = fileCache[url] || (fileCache[url] = {
                loaded: false,
                list: []
            });
            if (_fileObj.loaded) {
                complete(url, true);
                return false;
            }
            _fileObj.list.push(complete);
            return _fileObj.list.length <= 1;

        };
        var callbackFileCacheList = function(url, _tmout) {
            var cbList = fileCache[url].list;
            for (var i = 0; i < cbList.length; i++) {
                cbList[i](url, false, _tmout);
            }
            fileCache[url].loaded = true;
            delete fileCache[url].list;
        };
        var createLink = function() {
            var link = $.C("link");
            link.setAttribute("rel", "Stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("charset", "utf-8");
            return link;
        };
        /**
         * css加载 超时处理30秒为超时时间
         * @method cssLoader
         * @private
         * @param {String} url css地址
         * @param {String} load_ID 约定的css加载检测ID
         * @param {Function} complete 加载完成时的事件回调
         */
        var cssLoader = function(url, cacheId, load_ID, complete, tId) {
	         //css下载模块
            var link = createLink();
	        _this.requestUrl = url + "?version="+$CONFIG['version'];
            link.setAttribute("href", _this.requestUrl);
	        $.log("linkId", tId);
            link.id = tId || "skin_transformers";
	        //modify by zhaobo 201108231050  req-8140 fix begin
	        var customStyle = $.E("custom_style");
	        if(customStyle){
		        $.insertBefore(link, customStyle);
//		        if($.core.util.browser.IE6){
//			        setStyle();
//		        }
	        }else{
		        document.getElementsByTagName("head")[0].appendChild(link);
	        }
	        //modify by zhaobo 201108231050  req-8140 fix end
            /*if (!checkFileCache(url, complete)){
	            _this._lock = false;
                return;
            }*/

            var load_div = $.C("div");
            load_div.id = load_ID;
            $.core.util.hideContainer.appendChild(load_div);
            var _rTime = 3000;//3000*10
            var timer = function() {
	            //$.log("TIME", _rTime);
                if (parseInt($.core.dom.getStyle(load_div, "height")) == 42) {
                    $.core.util.hideContainer.removeChild(load_div);
	                _this.requestUrl = "";
//                    callbackFileCacheList(url);
	                complete(url);
                    return;
                }
                if (--_rTime <= 0 || _this.abort) {
	                $.log(url + "timeout!");
	                _this._lock = false;
                    $.core.util.hideContainer.removeChild(load_div);
	                _this.requestUrl = "";
	                _this.abort = false;
//	                callbackFileCacheList(url, true);
	                complete(url, false,  true);
                    //加载失败清除缓存
                    delete fileCache[url];
                }
                else {
	                setTimeout(timer, 10);
                }
            };
            setTimeout(timer, 50);
        };
	    var cssAbort = function(skinId){
		    var oLink = $.sizzle('link:[href="'+_this.requestUrl+'"]', document.head)[0];
			if(!oLink) return false;
		    var id = oLink.id;
		    $.log("id:", id);
		    var tempId = "skin_transformers_temp"+(id === "skin_transformers" ? "" : "1");
		    var temp = $.E(tempId);
		    if(temp) $.core.dom.removeNode(temp);
		    $.core.dom.removeNode(oLink);
		    var link = createLink();
            link.id = id;
            document.getElementsByTagName("head")[0].appendChild(link);
		    /*$.core.dom.removeNode(oLink);
		    var id = oLink.id;
		    var link = createLink();
            //link.setAttribute("href", url+"?version="+$CONFIG['version']);
            link.id = id;
            document.getElementsByTagName("head")[0].appendChild(link);*/
//		    _this._lock = false;
		    _this.abort = true;
		    //delete fileCache[_this.requestUrl];
	    };
	    //更换皮肤
        var changeSkin = function(_skinId, refreshCss, _callback) {
	        if(_this._lock) cssAbort(_skinId);

            var url = _skinId.replace("_", "") + ((_this.isNarrow && _skinId !="diy") ? "/skin_narrow.css" : "/skin.css");
	        $.log("*********url**************1", url);
	        $.log($CONFIG["skin"] == _skinId && _skinId =="diy" && !_this.locus.get("changeSkin"));
	        if(_skinId == "diy") _this._tempSkin.skinId = "diy";
	        if(url === "diy/skin.css" && $.core.util.browser.IE6){
		        _callback && _callback();
		        initDiySkin();
		        return;
	        }
            var cacheId = _skinId + "_skin";
            var oTrans = $.E("skin_transformers");
            oTrans && (oTrans.id = "skin_transformers_temp");
            var load_id = "js_skin_" + url.replace(/^\/?(.*)\.css$/i, "$1").replace(/\//g, "_");
            url = $CONFIG['cssPath'] + 'skin/' + url;
	        if( $CONFIG["skin"] == _skinId && _skinId =="diy" && !_this.locus.get("changeSkin")) {
		        //_this._tempSkin.skinId = _skinId;
		         oTrans && (oTrans.id = "skin_transformers");
		        var notload = true;
		        _this._lock = true;
		        if(typeof refreshCss != "undefined") notload = !refreshCss;
		        initDiySkin(notload);
		        return;
	        }
	        _this._lock = true;
	        $.log("lock");
            cssLoader(url, cacheId, load_id, function(url, loaded, _tmout) {
	            $.log("unlock");
	            _this._lock = false;
	            //_this._tempSkin.skinId = _skinId;
				//setStyle(document.body, "background-image", "url()");
//	            $.core.dom.removeNode(custStyle);
	            !_tmout && _callback && _callback();
	            var _trans = $.E("skin_transformers_temp");
				_trans && removeNode(_trans);

                /*if (loaded && oTrans) {
                    oTrans.id = "skin_transformers";
                    oTrans.href = url;
                } else {
                    var _trans = $.E("skin_transformers_temp");
                    _trans && $.core.dom.removeNode(_trans);
                }*/
                if (_skinId === "diy") {
                    initDiySkin();
                }
            }, undefined);


        };
	    /**
	     * 初始化自定义皮肤及相应属性
	     * @param notLoad 不需加载配色方案
	     */
        var initDiySkin = function(notLoad) {
	        _this._lock = false;
	        var link, id = "skin_transformers1";
	        _this.locus.add("skinId", "diy");
	        if (diySkinInited) {
		        link = $.E(id);
		        link && $.core.dom.removeNode(link);
		        link = createLink();
		        link.id = id;
		        document.getElementsByTagName("head")[0].appendChild(link);
//		        _this.DiyStyleFun.setDiyStyles(_this.DiyStyleFun.getDiyControlPanelData(_this._diyDom));

		        _this.DiyStyleFun.setScheme(_this._tempSkin.scheme || _this._diyDom["diy_list"], true);
//		        setStyle();
		        _this._tempSkin.skinId = "diy";

	        } else {
		        var _node = _this.diyControlPanel;
		        var _dom = $.kit.dom.parseDOM($.builder(_node).list);
		        _this._diyDom = _dom;
		        var img = $.sizzle("img", _dom["upload_pic"])[0];
		        if (_dom['uploadAid'])_dom['uploadAid'].style.display = img ? "" : "none";
		        _dom['upload_div'].style.display = img ? "none" : "";

		        _this._tempSkin = _this.DiyStyleFun.getDiyControlPanelData(_dom);
		        _this._tempSkin.skinId = "diy";
		        _this._tempSkin.colors_type = $CONFIG["colors_type"];
		        _this.DefaultSkin = $.core.obj.parseParam(_this.DefaultSkin, clone(_this._tempSkin));
		        link = createLink();
		        $.log("notload", notLoad);
		        //add by zhaobo 201108231050  req-8140
		         $.core.evt.addEvent(_dom["top_height"], "change", _this.DOM_eventFun.setTopHeight);
		        if(_dom["alignment"].nodeName.toLowerCase() === "select"){
			        $.core.evt.addEvent(_dom["alignment"], "change", _this.DOM_eventFun.alignment);
		        }
		        link.id = id;
		        if (!notLoad) {
			        _this.DiyStyleFun.setScheme($CONFIG["scheme"] || _dom["diy_list"], true);
			        //_this.DiyStyleFun.setDiyStyles(_this._tempSkin);
		        }
		        $.module.uploadPic(_node, _this.uploadFuns);
		        diySkinInited = true;
	        }
//	        _this.DOM_eventFun.switchCss();
        };
        //+++ 参数的验证方法定义区 ++++++++++++++++++
        var argsCheck = function() {

        };
        //-------------------------------------------


        //+++ Dom的获取方法定义区 ++++++++++++++++++
        var parseDOM = function() {
            //内部dom节点
            _this.DOM = $.builder($easyTemplate(TEMPLATE).toString());
            _this.controlPanel = _this.DOM.list.tmplControlPanel[0];
	        _this.diyControlPanel = _this.DOM.list.diyControlPanel[0];
	        _this.container = _this.DOM.list.custTmplContainer[0];
            _this.DEvent = $.core.evt.delegatedEvent(_this.container);
	        var param = $.parseParam({
		        cate : "cate001",
		        skinId : ""
	        }, opts);

            if (!sHTML) {
                _this.TransFun.getInnerHtml(param, true);
            } else {
                _this.controlPanel.innerHTML = sHTML;
            }
	        _this.locus.add("skinId", $CONFIG["skin"]);
        };
        //-------------------------------------------


        //+++ 模块的初始化方法定义区 ++++++++++++++++++
        var initPlugins = function() {
	        _this.DefaultSkin = _this.DiyStyleFun.getDefaultStyles();
	        _this._tempSkin = clone(_this.DefaultSkin);
	        _this.loadProvColorPicker();
        };
        //-------------------------------------------


        //+++ DOM事件绑定方法定义区 ++++++++++++++++++
        var bindDOM = function() {
            _this.DEvent.add("useTmpl", "click", _this.DOM_eventFun.useTmpl);
            _this.DEvent.add("useScheme", "click", _this.DOM_eventFun.useScheme);
            _this.DEvent.add("switchType", "click", _this.DOM_eventFun.switchType);
            _this.DEvent.add("alignment", "click", _this.DOM_eventFun.alignment);
            _this.DEvent.add("use_bg", "click", _this.DOM_eventFun.useBackground);
            _this.DEvent.add("lock_bg", "click", _this.DOM_eventFun.lockBackground);
            _this.DEvent.add("repeat_bg", "click", _this.DOM_eventFun.repeatBackground);
            _this.DEvent.add("upload_pic", "mousemove", _this.DOM_eventFun.uploadPic);
            _this.DEvent.add("reUpload", "click", _this.DOM_eventFun.reUpload);
            _this.DEvent.add("cust_color", "click", _this.DOM_eventFun.custColor);
            _this.DEvent.add("border_color", "click", _this.DOM_eventFun.borderColor);
            _this.DEvent.add("save", "click", _this.DOM_eventFun.save);
            _this.DEvent.add("cancel", "click", _this.DOM_eventFun.cancel);
        };
        //-------------------------------------------


        //+++ 自定义事件绑定方法定义区 ++++++++++++++++++
        var bindCustEvt = function() {

        };
        //-------------------------------------------


        //+++ 广播事件绑定方法定义区 ++++++++++++++++++
        var bindListener = function() {

        };
        //-------------------------------------------


        //+++ 组件销毁方法的定义区 ++++++++++++++++++
        var destroy = function() {
            _this.DEvent.remove("useTmpl", "click");
            _this.DEvent.remove("useScheme", "click");
            _this.DEvent.remove("switchType", "click");
            _this.DEvent.remove("alignment", "click");
            _this.DEvent.remove("use_bg", "click");
            _this.DEvent.remove("lock_bg", "click");
            _this.DEvent.remove("repeat_bg", "click");
            _this.DEvent.remove("save", "click");
            _this.DEvent.remove("cancel", "click");
            _this.TmplCacheFun.clear();
            _this.DOM = null;
	        sHTML = dHTML = null;
        };


        var init = function() {
            argsCheck();
            parseDOM();
            initPlugins();
            bindDOM();
            bindCustEvt();
            bindListener();

        };
        init();
	    /*if(opts.skinId){
		    if(_this._tempSkin.skinId === opts.skinId) return;

		    changeSkin(opts.skinId);
		    //_this.DOM_eventFun.save();
	    }*/
        that.getDom = function() {
            return _this.DOM.box;
        };

        that.destroy = destroy;
        that.hide = function(){
	        _this.locus.clear();
	        $.log("cust hide");
        };
	    //是否有变化
	    function isChange(){
		    var arr = [];
		    _this.locus.each(function(key, val){
			    if(key!=="switchType") arr.push({key : val});
		    });
		    return arr.length>0;
	    }
	    //传入外部dom对象
	    that.setOuter = function(outer){
		    dialogOuter = outer;
	    };
	    //保存函数
	    that.save = function(){
		    $.core.evt.fireEvent($.sizzle('[action-type="save"]', _this.container)[0], "click");
		    $.log("saveBtn:", $.sizzle('[action-type="save"]', _this.container));
	    };
	    //是否可以关闭
	    that.canClose = function(){
		    if(!_this.saved){
			    if(isChange()) {
		             $.ui.confirm(lang("#L{您设置的皮肤还没有保存，确认关闭吗？}"), {
			             icon : "warn",
			             OK : function() {
				            $.custEvent.fire(that, 'hide', ["force"]);
//				             window.location.reload();
				            if(window.location.href.match(/skinId|setskin/)){
					            setTimeout(function(){window.location.href = window.location.href.split("?")[0];}, 10);
				            }else{
					            window.location.reload();
				            }
			             }
		             });
			        return false;
	             }
			    if(window.location.href.match(/setskin/)){
					setTimeout(function(){window.location.href = window.location.href.split("?")[0];}, 10);
				}
		    	return true;
            }
		    return true;
	    };
        that.getDomList = function() {
            return _this.DOM.list;
        };
        return that;
    }
});
