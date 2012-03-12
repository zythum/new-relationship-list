/**
 * @fileoverview
 * 转发到微群
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 * L.Ming @2011.06.08 提交接口补提图片ID这个参数
 */
$Import('common.forward.utils');
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('common.dialog.validateCode');

STK.register("common.forward.toMicrogroup", function ($) {
    //---常量定义区----------------------------------
    var lang = $.kit.extra.language;
    //发送请求的参数，为验证层使用。
    var postParam = null;
    //验证层对话框。
    var validateTool = $.common.dialog.validateCode();
    // 编辑器初始选项
    var options = {
        'limitNum' : 140
        ,'count':'disable'
    };
    // HTML 模板
    var TEMPLATE = lang(''
            + '<#et userlist data>'
            + '<div node-type="toMicrogroup_client" action-type="client_click" class="toMicrogroup<#if (data.isDialog == true)>Layer</#if>">'
            + '<dl class="${data.className} clearfix">'
            + '<dt>#L{选择微群：}</dt>'
            + '<dd node-type="grouplist">#L{微群信息加载中…}</dd>'
            + '<dt>#L{内　　容：}</dt>'
            + '<dd>'
            + '<div class="feed_repeat">'
            + '<div class="input clearfix">'
            + '<div class="action clearfix actionControl" node-type="widget">'
            + '<span class="faces" title="#L{表情}" node-type="smileyBtn"></span>'
							//+ '<span class="img" title="#L{图片}" node-type="picBtn"></span>'
            + '</div>'
            + '<p class="num" node-type="num">#L{还可输入} ' + options.limitNum + ' #L{字}</p>'
            + '<textarea name="" rows="" cols="" title="#L{转发到}#L{微群}#L{内容}" node-type="textEl">#L{转发微博}：'
            + '<#if (data.forwardNick)>'
            + '//@${data.forwardNick}:${data.reason}'
            + '</#if>'
            + '<#if (data.originNick)>'
            + ' - //@${data.originNick}:${data.origin}'
            + '</#if>'
            + '<#if (data.allowForward==="0")>'
            + ' - //${data.origin}'
            + '</#if>'
            + '<#if (data.url)>'
            + ' - #L{原文地址：}${data.url}'
            + '</#if>'
            + '</textarea>'
            + '<p class="btn"><a href="#" title="#L{转发}#L{按钮}" onclick="return false;" class="W_btn_b btn_noloading" node-type="submit"><span><b class="loading"></b><em node-type="btnText">#L{发送}</em></span></a></p>'
            + '<div class="M_notice_del" node-type="errMsg" style="display:none;">'
            + '<span class="icon_del"></span><span class="txt" node-type="errText">#{请选择一个微群}</span></div>'
            + '</div>'
            + '</div>'
            + '</dd>'
            + '</dl>'
            + '</div>');
    var GROUPLIST = lang(''
            + '<#et userlist data>'
            + '<div class="select_group" action-type="group_select">'
            + '<a href="#" onclick="return false;" class="W_moredown"><span class="more"></span></a>'
            + '<span node-type="group_name" class="group_name">#L{选择一个微群}</span>'
            + '<input node-type="group_value" type="hidden" value="" />'
            + '<ul class="group_list"  node-type="group_list" style="${data.height}display: none;">'
            + '<#list data.group as list>'
            + '<li action-type="option_item" action-data="id=${list.gid}&name=${list.g_name}&logo=${list.g_logo}">'
            + '<a href="#" onclick="return false;"><img height="15" width="15" alt="" src="${list.g_logo}'
            + '">${list.g_name}</a></li>'
            + '</#list>'
            + '</ul>'
            + '</div>'
            );
    var PICPREVIEW = lang(''
            + '<#et userlist data>'
            + '<div node-type="forward_pic_preview" class="W_layer">'
            + '<div class="bg">'
            + '<table cellspacing="0" cellpadding="0" border="0">'
            + '<tbody><tr>'
            + '<td><div class="content">'
            + '<div style="width:190px;" class="layer_send_pic">'
            + '<div class="laPic_tit">${data.picName}.jpg<span class="right">'
            + '<a href="#" onclick="return false;" node-type="delele_forward_picture">#L{删除}</a>'
            + '</span></div>'
            + '<div class="laPic_Pic"><img src="${data.picUrl}" style="display:inline-block; visibility: visible;"></div>'
            + '</div>'
            + '</div></td>'
            + '</tr></tbody></table>'
            + '<div class="arrow arrow_t"></div>'
            + '</div>'
            + '</div>');


    // 文案
    var MSG = {
        'notice' : '#L{请输入转发理由}',
        'defUpdate' : '#L{转发微博}',
        'netError' : '#L{系统繁忙}',
        'success' : '#L{转发成功}!',
        'loading' : '#L{微群信息加载中…}',
        'retry' : '#L{加载失败，点击}<a href="javascript:void(0);" action-type="retry">#L{重试}</a>',
        'off' : '#L{关闭}',
        'on' : '#L{开启}'
    };
    //改变按钮文字函数
    var changeBtnText = function(tNode, type) {
        if (type == 'normal') {
            tNode.innerHTML = lang('#L{发送}');
        } else {
            tNode.innerHTML = lang('#L{提交中...}');
        }
    };
    /**
     *
     * @param {Object} client    外容器，这里是 dialog.inner
     * @param {Object} mid        微博ID
     * @param {Object} opts        选项
     */
    return function(client, mid, opts) {
        if (client == null || mid == null) {
            throw new Error('[common.forward.toMicrogroup]Required parameter client is missing');
        }
//		var data = opts.data;
//		var forwardReason = data.reason || lang(MSG.defUpdate);
        var editor,        // 编辑器对象
                doms,        // dom 集合
                conf, lock, lockReason/*=loading or error=*/,
                trans,        // 转发接口
                microgroupTrans,    // 微群列表接口
                node,        // 外容器
                delegate,
                _defaultWords,
                isInDialog,
                clock,
                utils = $.common.forward.utils,
                picture_id,
                groupList,
				isItemClick;
//			imageUploadHandler;	// 上传图片层的句柄
        var that = {};
        that.client = client;
        that.opts = opts || {};
        that.isInit = false;

        // 自定义事件定义
        $.custEvent.define(that, ['forward', 'hide', 'center']);
        // 提交转发
        var updateForward = function() {
            if (doms.group_value == null) {
                $.ui.alert(lang("#L{请选择一个微群}"));
//				doms.errMsg.style.display = "";
                return;
            }
//			var extraInfo = editor.API.getExtra();
            if (lock) {
                if (lockReason === 'error') {
                    $.common.extra.shine(doms.textEl);
                }
                return;
            }
            var content = $.trim(editor.API.getWords() || '');
            if (content === lang(MSG.notice)) {
                content = '';
            }
            if (content === "") {
                $.common.extra.shine(doms.textEl);
                return;
            }

            lock = true;
            lockReason = 'loading';
            doms.submit.className = 'W_btn_a_disable';	// 提交中状态
            changeBtnText(doms.btnText, 'loading');//改按钮字为提交中...

            var params = {};
            params.appkey = that.opts.data.appkey;
            params.mid = mid;
            params.gid = doms.group_value.value;
            if (picture_id != null) {
                params.pic_id = picture_id;
            }
            params.content = content || lang(MSG.defUpdate);
            /**
             * Diss
             */
            params = $.module.getDiss(params, doms.submit);
            postParam = params;
            /*
			if (utils.checkAtNum(content) > 5) {
                $.ui.confirm(lang('#L{单条微博里面@ 太多的人，可能被其它用户投诉。如果投诉太多可能会被系统封禁。是否继续转发？}'), {
                    OK : function() {
                        trans.request(params);
                    },
                    cancel : function() {
                        lock = false;
                        lockReason = '';
                        doms.submit.className = 'W_btn_b btn_noloading';
                        changeBtnText(doms.btnText, 'normal');//改按钮字为提交中...
                    }
                });
                return;
            }
			*/
            trans.request(params);
        };
        // Ctrl + Enter 处理
        var ctrlUpdateForward = function(e) {
            if ((e.keyCode === 13 || e.keyCode === 10) && e.ctrlKey) {
                editor.API.blur();
                updateForward();
            }
        };
        // 判断是否能转发
        var canForward = function() {
            var count = editor.API.count();
            var diff = options.limitNum - count;
            var key = diff >= 0 ? true : false;
            if (key) {
                lock = false;
                lockReason = '';
                // 长度大于1正常显示，否则显示灰色按钮
                /*if(count>0){
                 doms.submit.className = 'W_btn_b';
                 }else{
                 doms.submit.className = 'W_btn_a_disable';
                 lock = true;
                 }*/
                if (key) {
                    doms.num.innerHTML = lang('#L{还可以输入}<span>' + (diff) + '</span> #L{字}');
                }
            } else {
                lock = true;
                lockReason = 'error';
                doms['num'].innerHTML = lang('#L{已经超过}<span class="W_error">' + Math.abs(diff) + '</span> #L{字}');
            }
        };

        // 提交成功的处理
        var success = function(ret, params) {
            lock = false;
            lockReason = '';
            doms.submit.className = 'W_btn_b btn_noloading';
            //更改文字为转发
            changeBtnText(doms.btnText, 'normal');
            try {
                $.custEvent.fire(that, 'forward', [ret.data, params, opts.inDialog]);
                $.common.channel.feed.fire('forward', [ret.data, params, opts.inDialog]);
            } catch(exp) {
            }
            $.custEvent.fire(that, 'hide');
            $.ui.litePrompt(lang(MSG.success), {'type':'succM','timeout':'500'});
            editor.API.reset();
        };
        // 提交出错的处理
        var error = function(ret, params) {
            lock = false;
            lockReason = '';
            doms.submit.className = 'W_btn_b btn_noloading';
            //更改文字为转发
            changeBtnText(doms.btnText, 'normal');
            $.ui.alert(ret.msg || lang(MSG.netError));
//			doms.errMsg.style.display = "";
        };
        // 提交接口异常处理
        var fail = function(ret, params) {
            lock = false;
            lockReason = '';
            doms.submit.className = 'W_btn_b btn_noloading';
            //更改文字为转发
            changeBtnText(doms.btnText, 'normal');
            $.ui.alert(lang(MSG.netError));
//			doms.errMsg.style.display = "";
        };

        // 读取微群列表成功
        var microgroupListSuccess = function (ret, params) {
            if (ret.data.length == 0) {
                doms.grouplist.innerHTML = lang('<div class="noGroupText">#L{很抱歉，你还没有加入微群} <a target="_blank" href="http://q.weibo.com/profile/' + $CONFIG['uid'] + '">#L{看看有趣的微群}</a></div>');
            } else {
                groupList = ret.data;
                var html = $.core.util.easyTemplate(GROUPLIST, {
                    'group' : ret.data,
                    'height' : (ret.data.length < 8) ? "height:auto;" : ""
                });
                doms.grouplist.innerHTML = html;
                var nodes = $.kit.dom.parseDOM($.builder(doms.grouplist).list);

                doms.group_name = nodes.group_name;
                doms.group_value = nodes.group_value;
                doms.group_list = nodes.group_list;

                $.setStyle(doms.group_list, 'z-index', '10002');

                delegate.add('option_item', 'click', bindDomFuns.hideGroup);
                delegate.add('group_select', 'click', bindDomFuns.showGroup);
            }
        };
        // 读取微群列表失败
        var microgroupListFailure = function (ret, params) {
            doms.grouplist.innerHTML = lang(MSG.retry);
        };

        /*------------lazyInit-------------*/
        // 绑定编辑器
        var parseDOM = function() {

            node = $.builder(client);
            node = $.kit.dom.parseDOM(node.list).toMicrogroup_client;

            editor = $.common.editor.base(node, options);
            editor.widget($.common.editor.widget.face(), 'smileyBtn');
//			editor.API.insertText(forwardReason);
            doms = editor.nodeList;
            $.addEvent(doms.textEl, 'focus', function() {
                clock = setInterval(function() {
                    canForward();
                }, 200);
            });
            $.addEvent(doms.textEl, 'blur', function() {
                clearInterval(clock);
            });
            $.kit.dom.autoHeightTextArea({
                'textArea': doms.textEl,
                'maxHeight': 145,
                'inputListener': $.funcEmpty
            });
            delegate = $.delegatedEvent(node);
        };
        // 绑定事件
        var bindDOM = function() {
            $.addEvent(doms.submit, 'click', updateForward);
            $.addEvent(doms.textEl, 'keypress', ctrlUpdateForward);
            delegate.add('retry', 'click', function(spec) {
                doms.grouplist.innerHTML = lang(MSG.loading);
                microgroupTrans.request({});
                return utils.preventDefault(spec.evt);
            });
        };
        // 监听自定义事件
        var bindCustEvt = function() {
        };

        // 取得接口
        var bindTrans = function() {
            trans = $.common.trans.forward.getTrans('toMicrogroup', {
                //'onSuccess'	: success,
                //'onError'	: error,
                'onComplete' :function(ret, data) {
                    var bigObj = {
                        'onSuccess' : success,
                        'onError' : error,
                        'requestAjax' : trans,
                        'param' : postParam,
                        'onRelease' : function() {
                            lock = false;
                            lockReason = '';
                            doms.submit.className = 'W_btn_b btn_noloading';
                            //更改文字为转发
                            changeBtnText(doms.btnText, 'normal');
                        }
                    };
                    //加入验证码检查机制，参见$.common.dialog.validateCode
                    validateTool.validateIntercept(ret, data, bigObj);
                },
                'onFail'    : fail,
                'onTimeout' : error
            });
            microgroupTrans = $.common.trans.forward.getTrans('microgroupList', {
                'onSuccess'    : microgroupListSuccess,
                'onError'    : microgroupListFailure,
                'onFail'    : microgroupListFailure
            });
        };

        var bindDomFuns = {
            //显示列表
            showGroup  : function(spec) {
				if(isItemClick) {
					isItemClick = 0;
					return;					
				}
				if (doms.group_list.getAttribute('open') != "on") {
                    $.setStyle(doms.group_list, 'display', '');
                    doms.group_list.setAttribute('open', 'on');
					$.addEvent(document, 'click', bindDomFuns.hideGroup);
                } else  {
                    $.setStyle(doms.group_list, 'display', 'none');
                    doms.group_list.setAttribute('open', 'off');
                }
				$.stopEvent(spec.evt);
            },
            //隐藏列表
            hideGroup : function(spec) {
					var gname;
	                if (spec != null && spec.data) {
	                    doms.group_value.value = spec.data.id;
	                    for (var i = 0, len = groupList.length; i < len; i ++) {
	                        if (groupList[i].gid == spec.data.id) {
	                            gname = groupList[i].g_name;
								break;
	                        }
	                    }
	                    doms.group_name.innerHTML = '<img height="15" width="15" src="' + spec.data.logo + '" alt="">' + (gname || "");
						isItemClick = 1;
	                } else {
						isItemClick = 0;
					}
	                $.setStyle(doms.group_list, 'display', 'none');
	                doms.group_list.setAttribute('open', 'off');
	                $.removeEvent(document, 'click', bindDomFuns.hideGroup);
					$.stopEvent(spec.evt);										
            }
        };

        var lazyInit = function() {
            bindTrans();
            parseDOM();
            bindDOM();
            bindCustEvt();
        };
        // 显示界面
        var show = function (isDialog) {
            if (that.isInit == false) {
                opts.data.className = isDialog ? 'layer_forward_group' : 'forward__letter';
                isInDialog = isInDialog;
                opts.data.isDialog = isDialog;
                $.addHTML(client, $.core.util.easyTemplate(TEMPLATE, opts.data));

                if (!editor) {            // 初始化编辑器
                    lazyInit();
                }
                microgroupTrans.request({});	// 获取渲染微群列表
                that.isInit = true;
                _defaultWords = editor.API.getWords();
            } else {
                node && $.setStyle(node, 'display', '');
                //doms && doms.group_list && $.setStyle(doms.group_list, 'display', '');
            }
            //为啥注释掉了捏？李明童鞋
            editor.API.focus(0);

            /* L.Ming 2011.06.20 转发到微群图片仍保留线上规则：
             * 1、去除转发的同时编辑、上传图片功能。
             * 2、凡是原文带图片的微博，转发时，把图片隐藏掉，成功转发后，在微群中显示出原图。
             // 根据是否带了图片进来，决定是直接显示图片预览层，还是直接初始化上传图片按钮
             imageUploadHandler = $.common.editor.widget.image();
             if(opts.data.pid){
             editor.widget(imageUploadHandler, 'picBtn', {pid:opts.data.pid});
             } else {
             editor.widget(imageUploadHandler, 'picBtn');
             }
             */
            if (opts.data.pid) {
                picture_id = opts.data.pid;
            }
        };
        // 隐藏
        var hide = function () {
            editor.API.blur();
            if (node != null) {
                $.setStyle(node, 'display', 'none');
            }
            // 隐藏图片预览层
//			imageUploadHandler.hide();
        };
        //reset
        var reset = function() {
            try {
                //editor.API.reset();
                //editor.API.insertText(_defaultWords);
            } catch(e) {
                $.log("ERR:", e.message);
            }
        };
        // 销毁
        var destory = function () {
//			imageUploadHandler.hide();
            $.removeEvent(doms.submit, 'click', updateForward);
            $.removeEvent(doms.textEl, 'keypress', ctrlUpdateForward);
            $.custEvent.undefine(that);
            delegate && delegate.remove('option_item', 'click');
            delegate && delegate.remove('group_select', 'click');
            delegate && delegate.remove('retry', 'click');
            $.core.evt.removeEvent(document, 'click', bindDomFuns.hideGroup);
            delegate = null;
            validateTool && validateTool.destroy && validateTool.destroy();
            editor.closeWidget();
            clock && clearInterval(clock);
            editor = null;
            doms = null;
            trans = null;
            microgroupTrans = null;
            node = null;
            for (k in that) {
                delete that[k];
            }
            that = null;
        };

        that.show = show;
        that.hide = hide;
        that.destory = destory;
        that.reset = reset;

        return that;
    };
});
