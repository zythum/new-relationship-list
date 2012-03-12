/**
 * 收藏标签基本操作类
 * 完成标签区块的操作及推荐标签的获取
 * @param {Object} node
 * @param {Object} opts
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
$Import('ui.dialog');
$Import('ui.alert');

$Import('kit.dom.smartInput');
STK.register("common.favorite.tagSave", function($) {
	var $L = $.kit.extra.language;
	var TAGTEMP = $L('<#et temp data>'+ 
		'<div node-type="tagOuter" class="layer_addfavor_tags">'+
		'<#if (data.tipType&&data.tipInfo)>'+
		'	<div class="succes"><span class="icon_${data.tipType}"></span>${data.tipInfo}</div>'+
		'</#if>'+
		'	<dl>'+
		'		<dt>#L{添加标签}：</dt>'+
		'		<dd><input type="text" class="W_input" node-type="tagsInput" value="${data.lastTags}"/><div class="tipbox"><p class="note1 W_textb">最多2个标签，用空格分隔</p><p class="note W_textb" style="display:none;" node-type="tagsInputTip">#L{每个标签仅限12个字符}</p></div></dd>'+
		'		<dt node-type="tagListTitle" style="display:none">#L{我的标签}：</dt>'+
		'		<dd node-type="tagList" style="display:none"></dd>'+//#L{标签加载中}...
		'	</dl>'+
		'	<div class="func"><a href="javascript:void(0);" class="W_btn_b" node-type="tagSave"><span>#L{确定}</span></a><label>&nbsp;</label></div>'+//<label><input type="checkbox" class="W_checkbox" node-type="forwardCheck"/>#L{同时转发到我的微博}</label>
		'</div>'+
		'</#et>');
	//var TAGLOADERR = $L('#L{标签加载失败}!');
	//var TAGINPUTTEXT = $L('#L{最多2个标签，用空格分隔}');
    var TAGINPUTTEXT = $L('#L{每个标签仅限12个字符}');
	var TAGDISCLASS = "W_textb";
	var tagListLoadTime = 0;
	
	/*
	var myTagList;
	*/
	var getmyTagList = function(myTags, callback) {
		if(myTags) return callback(myTags);
		
		var errorFn = function(data) {
			if(++tagListLoadTime == 3) {
				tagListLoadTime = 0;
				callback();
			} else {
				getmyTagList(myTags, callback);
			}
		};
		
		$.common.trans.favorite.getTrans("tagList", {
			onSuccess: function(data) {
				tagListLoadTime = 0;
				callback(data.data.my_tags);
			},
			onFail: errorFn,
			onError: errorFn
		}).request();
	};
	
	
	return function(opts) {
		var that = {};
		opts = $.parseParam({
			title: "",//标题
			tipType: "",//提示的样式 success/error
			tipInfo: "",//提示的内容tipType或tipInfo为空时不显示提示
			flag: "add", //add:添加标签，edit:修改标签
			mid: "",//添加和修改标签时必需的feed编号
			lastTags: "",//{Array}上一次的 如: abc ssss
			myTags: ""
		}, opts);
		
		if (!opts.mid) {
			$.log("common.favorite.tagSave: opts.mid is not defined!");
			return;
		}
		
		$.custEvent.define(that, ["success", "error", "hide"]);
		var dialog = $.ui.dialog();
		dialog.setTitle(opts.title);
		$.custEvent.add(dialog, "hide", function() {
			$.custEvent.fire(that, "hide");
		});
		if(/^(success|error)$/.test(opts.tipType)) {
			opts.tipType = (opts.tipType == "success")?'succS':'errorS';
		} else {
			opts.tipType = 'succS';
		}
		var tagHtmlList = $.builder($.core.util.easyTemplate(TAGTEMP, {
			tipType: opts.tipType,
			tipInfo: opts.tipInfo,
			lastTags: opts.lastTags
		}).toString()).list;
		
		var tagOuter = tagHtmlList["tagOuter"][0];
		var tagsInputTip = tagHtmlList["tagsInputTip"][0];
		var tagsInput = tagHtmlList["tagsInput"][0];
		var tagListTitle = tagHtmlList["tagListTitle"][0];
		var tagList = tagHtmlList["tagList"][0];
		var tagSave = tagHtmlList["tagSave"][0];
		
		var tagsInputCheck = function() {
            //熊国庆修改，重复的单词替换掉。
			var value = tagsInput.value.replace(/^\s+?/, "").replace(/(.+)\s\1\s/g, "$1"+" ").replace(/\s{2,}/g, " ");

			if(value.length > 0) {
				tagsInputTip.style.display = "none";
			} else {
				tagsInputTip.style.display = "";
			}
          // if(value ==TAGINPUTTEXT)   tagsInput.value ="";
			var tagAs = $.sizzle(">a", tagList);
			if (value == TAGINPUTTEXT) {
				for (var i = 0; i < tagAs.length; i++) {
					tagAs[i].className = "";
				}
				return;
			}
			
			var tagNames = value.split("\ ");
			tagNames = tagNames.slice(0, 2);
			var tagLength = tagNames.length;
			for(var i = 0; i < tagNames.length; i++) {
				if(!tagNames[i]) {
					tagLength--;
				}
				tagNames[i] = $.leftB(tagNames[i], 12);
			}
			tagNames = " " + (tagsInput.value = tagNames.join(" ")) + " ";
			if(tagLength >= 2) {
				for (var i = 0; i < tagAs.length; i++) {
					tagAs[i].className = TAGDISCLASS;
				}
			} else {
				for(var i = 0; i < tagAs.length; i++) {
					var tagI = tagAs[i],
						tagIName = tagI.getAttribute("action-data").replace(/^tagName=/, "");
					if(new RegExp(" "+tagIName +" ").test(tagNames)) {
						tagI.className = TAGDISCLASS;
					} else {
						tagI.className = "";
					}
				}
			}
		};

		tagsInput.value = opts.lastTags ? opts.lastTags : TAGINPUTTEXT;
		
		var tagsInputSmart = $.kit.dom.smartInput(tagsInput, {
			notice: TAGINPUTTEXT,
			needLazyInput: true,
            noticeClass :"W_input_default"
		});
		//输入获得焦点
		tagsInputSmart.on("focus", function() {
			window.setTimeout(function(){if(tagsInput.value == "") {
				tagsInputTip.style.display = "";
			} },0);
		});
		//输入失去焦点
		tagsInputSmart.on("blur", function() {
			setTimeout(function(){tagsInputCheck && tagsInputCheck();},0);
		});
		//输入时
		$.custEvent.add(tagsInputSmart, "lazyInput", tagsInputCheck);
		
		var tagListDevent = $.delegatedEvent(tagList);
		tagListDevent.add("tagItem", "click", function(obj) {
			if(obj.el.className==TAGDISCLASS) return;
			var data = obj.data;
			if (tagsInput.value == TAGINPUTTEXT) {
				tagsInput.value = "";
			}
			tagsInput.value += " " + data.tagName;
			tagsInputCheck();
		});

        var editFun = function (opts, spec){
            $.common.trans.favorite.getTrans("alter", {
				onSuccess: function(data) {
					$.custEvent.fire(that, "success", data);
					dialog.hide();
				},
				onFail: function(data) {
					$.custEvent.fire(that, "error", data);
					dialog.hide();
				},
				onError: function(data) {
					$.custEvent.fire(that, "error", data);
					//$.ui.alert(data.msg || $L('#L{保存失败}'));
					dialog.hide();
				}
			}).request(
				/**
				 * Diss
				 */
				$.module.getDiss(opts, spec.el)
			);
        };
		//点击保存时 修改和添加两种处理 成功时发出是否启动转发的标示
		var saveClickFn = function(spec) {
			if(saveClickFn.entered) return;
			saveClickFn.entered = true;
			var args, tags;
            //熊国庆添加去除重复的字符。
            tagsInput.value =tagsInput.value.replace(/(.+)\s\1$/g, "$1"+" ");
			if(opts.flag == "add") {
                //修改bug ,add by xgq
				if (tagsInput.value == TAGINPUTTEXT) {
                    if(opts.lastTags){
                    args = {
				    mid: opts.mid,
				    tags: ""
			        };
                 editFun(args, spec);
                  }
				dialog.hide();
				return;
				}
			//	transName = "addTag";
			//} else {
			//	transName = "updateTag";
			}
			var newTags = (tagsInput.value == TAGINPUTTEXT) ? "" : tagsInput.value;
			if(newTags == opts.lastTags) {
				dialog.hide();
				return;
			}
			args = {
				mid: opts.mid,
				tags: newTags
			};
			editFun(args, spec);
		};
		$.hotKey.add(tagsInput, "enter", saveClickFn);
		$.addEvent(tagSave, "click", saveClickFn);
		/**
		 * 显示
		 * @method show
		 */
		that.show = function() {
			getmyTagList(opts.myTags, function(myTags) {
				var html;
				if(myTags) {
					tagListTitle.style.display = "";
					tagList.style.display = "";
					myTags = myTags.split("\ ");
					html = [];
					for(var i = 0; i< myTags.length; i++) {
						html.push('<a href="javascript:void(0);" action-type="tagItem" action-data="tagName='+myTags[i]+'">'+myTags[i]+'</a>');
					}
					html = html.join("");
					tagList.innerHTML = html;
					tagsInputCheck();
				}
			});
			
			dialog.setContent(tagOuter);
			dialog.show();
			dialog.setMiddle();
			tagsInput.focus();
		};
		/**
		 * 隐藏
		 * @method hide
		 */
		that.hide = function() {
			dialog.hide();
		};
		/**
		 * 销毁
		 * @method destroy
		 */
		that.destroy = function() {
			$.hotKey.remove(tagsInput, "enter", saveClickFn);
			$.removeEvent(tagSave, "click", saveClickFn);
			$.custEvent.undefine(that);
			tagListDevent.destroy();
			tagsInputSmart.destroy();
			opts = tagHtmlList = tagOuter = tagsInputTip = tagsInput = tagSave = tagsInputCheck = null;
		};
		
		return that;
	};
});
