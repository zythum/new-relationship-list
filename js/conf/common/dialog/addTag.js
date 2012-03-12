/**
 * feed标签基本操作类
 * @param {Object} node
 * @param {Object} opts
 * @author  guoqing5@staff.sina.com.cn
 */
$Import('ui.dialog');
$Import('ui.alert');
//$Import('ui.confirm');
$Import('kit.dom.smartInput');
$Import('common.trans.feed');
$Import('common.channel.feed');

STK.register("common.dialog.addTag", function($) {
	var $L = $.kit.extra.language;

	var TAGTEMP = $L('<#et temp data>' +
			'<div node-type="tagOuter" class="layer_addfavor_tags">' +
			'	<dl>' +
			'		<dt node-type="tagListTitle" style="display:none">#L{我的标签}：</dt>' +
			'		<dd node-type="tagList" style="display:none"></dd>' + //#L{标签加载中}...
			'	</dl><dl>' +
			'		<dt>#L{添加标签}：</dt>' +
			'		<dd><input type="text" class="W_input" node-type="tagsInput" value="${data.lastTags}"/><div class="tipbox"><p class="note1 W_textb">#L{最多5个标签，用空格分隔}</p><p class="note W_textb" style="display:none;" node-type="tagsInputTip">#L{每个标签仅限14个字符}</p></div></dd>' +
			'	</dl>' +
			'	<div class="func"><a href="javascript:void(0);" class="W_btn_b" node-type="tagSave"><span>#L{确定}</span></a><label>&nbsp;</label></div>' + //<label><input type="checkbox" class="W_checkbox" node-type="forwardCheck"/>#L{同时转发到我的微博}</label>
			'</div>' +
			'</#et>');

	var TAGINPUTTEXT = $L('#L{每个标签仅限14个字符}');
	var TAGDISCLASS = "W_textb";
	var tagListLoadTime = 0,opts;

	/*
	 var myTagList;
	 */
	var getmyTagList = function(myTags, callback) {
		if (myTags) return callback(myTags);

		var errorFn = function(data) {
			if (++tagListLoadTime == 3) {
				tagListLoadTime = 0;
				callback();
			} else {
				getmyTagList(myTags, callback);
			}
		};
		$.common.trans.feed.getTrans("feedTagList", {
			onSuccess: function(data) {
				tagListLoadTime = 0;
				callback(data.data.tags);
			},
			onFail: errorFn,
			onError: errorFn
		}).request();
	};


	return function(dialgOpts) {
		var that = {};
		opts = $.parseParam({
			title: "",//标题
			tipType: "",//提示的样式 success/error
			//tipInfo: "",//提示的内容tipType或tipInfo为空时不显示提示
			flag: "add", //add:添加标签，edit:修改标签
			mid: "",//添加和修改标签时必需的feed编号
			lastTags: "",//{Array}上一次的 如: abc ssss
			myTags: ""
		}, dialgOpts);

		if (!opts.mid) {
			$.log("common.dialog.addTag: opts.mid is not defined!");
			return;
		}

		var init = function(dialgOpts) {
			opts = $.parseParam({
				title: "",//标题
				tipType: "",//提示的样式 success/error
				//tipInfo: "",//提示的内容tipType或tipInfo为空时不显示提示
				flag: "add", //add:添加标签，edit:修改标签
				mid: "",//添加和修改标签时必需的feed编号
				lastTags: "",//{Array}上一次的 如: abc ssss
				myTags: ""
			}, dialgOpts);
			if (/^(success|error)$/.test(opts.tipType)) {
				opts.tipType = (opts.tipType == "success") ? 'succS' : 'errorS';
			} else {
				opts.tipType = 'succS';
			}
			dialog.setTitle(opts.title);
		};

		$.custEvent.define(that, ["success", "error", "hide"]);
		var dialog = $.ui.dialog({
			isHold : true	
		});
		dialog.setTitle(opts.title);
		$.custEvent.add(dialog, "hide", function() {
			$.custEvent.fire(that, "hide");
		});
		if (/^(success|error)$/.test(opts.tipType)) {
			opts.tipType = (opts.tipType == "success") ? 'succS' : 'errorS';
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

		var deleteSame = function(str) {
			var arrStr = $.trim(str).split(/ +/);
			arrStr = $.core.arr.clear(arrStr);
			var isEndEmpty = (str.charAt(str.length - 1) == " ");
			arrStr = $.unique(arrStr);
			var result = {
				isEndEmpty : isEndEmpty,
				value : (arrStr.join(" ") + ( isEndEmpty ? " " : ""))
			};
			return result;
		};
		var tagsInputCheck = function() {
			//var value = tagsInput.value.replace(/^\s+?/, "").replace(/(.+)\s*\1\s/g, "$1" + " ").replace(/\s{2,}/g, " ");
			var result = deleteSame(tagsInput.value);
			var value = result.value;
			if (value.length > 0) {
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
			var tagNames = $.trim(value).split(/ +/);
			tagNames = tagNames.slice(0, 5);
			var tagLength = tagNames.length;
			for (var i = 0; i < tagNames.length; i++) {
				if (!tagNames[i]) {
					tagLength--;
				}
				tagNames[i] = $.leftB(tagNames[i], 14);
			}
			tagNames = " " + (tagsInput.value = tagNames.join(" ") + (result.isEndEmpty ? ' ' : '')) + " ";
			if (tagLength >= 5) {
				for (var i = 0; i < tagAs.length; i++) {
					tagAs[i].className = TAGDISCLASS;
				}
			} else {
				for (var i = 0; i < tagAs.length; i++) {
					var tagI = tagAs[i],
							tagIName = tagI.getAttribute("action-data").replace(/^tagName=/, "");
					if (new RegExp(" " + tagIName + " ").test(tagNames)) {
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
			window.setTimeout(function() {
				if (tagsInput.value == "") {
					tagsInputTip.style.display = "";
				}
			}, 0);
		});
		//输入失去焦点
		tagsInputSmart.on("blur", function() {
			setTimeout(function() {
				tagsInputCheck && tagsInputCheck();
			}, 0);
		});
		//输入时
		$.custEvent.add(tagsInputSmart, "lazyInput", tagsInputCheck);

		var tagListDevent = $.delegatedEvent(tagList);
		tagListDevent.add("tagItem", "click", function(obj) {
			if (obj.el.className == TAGDISCLASS) return;
			var data = obj.data;
			var svalue = tagsInput.value;
			if (tagsInput.value == TAGINPUTTEXT) {
				svalue = "";
			}
			tagsInput.value = svalue + " " + data.tagName;
			tagsInputCheck();
		});

		var editFun = function (args, spec) {
			var svalue = tagsInput.value;
			if (tagsInput.value == TAGINPUTTEXT) {
				svalue = "";
			}
			if(svalue != '' && /[^a-zA-Z0-9\u4e00-\u9fa5\s\u3000\-_]+/.test(svalue)) {
				$.ui.alert($L('#L{微博标签仅支持中英文、数字、"_"或减号}'));
				return;
			}
			var sendRequest = function() {
				dialog.hide();
				$.common.trans.feed.getTrans("feedTagUpdate", {
					onSuccess: function(data) {
						$.common.channel.feed.fire("feedTagUpdate", {'res':opts.lastTags, 'now':data.data.tags});
						$.custEvent.fire(that, "success", data);
						dialog.hide();
					},
					onFail: function(data) {
						$.custEvent.fire(that, "error", data);
						$.ui.alert(data.msg || $L('#L{更新失败}'));
						dialog.hide();
					},
					onError: function(data) {
						$.custEvent.fire(that, "error", data);
						$.ui.alert(data.msg|| $L('#L{更新失败}'));
						dialog.hide();
					}
				}).request($.module.getDiss({
					'mid'  : args.mid,
					"tags" : svalue
				}));
			};
			/*if(false) {
				$.ui.confirm($L('#L{你确定要删除这个微博标签吗？}') , {
					textSmall : $L('#L{刪除微博標簽不會將對應的微博一起刪除}'),
					OK : sendRequest
				});	
			*/
			//} else {
				sendRequest();	
			//}
		};
		//点击保存时 修改和添加两种处理 成功时发出是否启动转发的标示
		var saveClickFn = function(spec) {

			//if (saveClickFn.entered) return;
			//saveClickFn.entered = true;

			var args, tags;
			tagsInput.value = tagsInput.value.replace(/(.+)\s\1$/g, "$1" + " ");
			if (opts.flag == "add") {
				//修改bug ,add by xgq
				if (tagsInput.value == TAGINPUTTEXT) {
					if (opts.lastTags) {
						args = {
							mid: opts.mid,
							tags: ""
						};
						editFun(args, spec);
					}
					dialog.hide();
					return;
				}
			}
			var newTags = (tagsInput.value == TAGINPUTTEXT) ? "" : tagsInput.value;
			if (newTags == opts.lastTags) {
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
		 *
		 * 显示
		 * @method show
		 */
		that.show = function(opts) {
			init(opts);
			getmyTagList(opts.myTags, function(myTags) {
				var html = [];
				if (myTags) {
					var myTagsArr = myTags.split(/\ +/);
					for (var i = 0; i < myTagsArr.length; i++) {
						html.push('<a href="javascript:void(0);" action-type="tagItem" action-data="tagName=' + myTagsArr[i] + '">' + myTagsArr[i] + '</a>');
					}
					if (i > 0) {
						tagListTitle.style.display = "";
						tagList.style.display = "";
					}
					else {
						tagListTitle.style.display = "none";
						tagList.style.display = "none";
					}

					html = html.join("");
					tagList.innerHTML = html;
					tagsInput.focus();
					tagsInputCheck();
				}

			});
			tagsInput.value = opts.lastTags ? opts.lastTags : TAGINPUTTEXT;
			dialog.setContent(tagOuter);
			dialog.show();
			dialog.setMiddle();

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
