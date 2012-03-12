/**
 * @fileoverview
 * 转发到微博
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
$Import("kit.extra.language");
$Import("common.editor.base");
$Import('common.editor.widget.face');
$Import('kit.dom.autoHeightTextArea');
$Import('common.extra.shine');
$Import('ui.alert');
$Import('common.channel.feed');
$Import('common.trans.forward');
$Import('common.forward.utils');
$Import('common.content.report');
$Import('kit.extra.textareaUtils');
//$Import('comp.content.userCard');
$Import("kit.extra.toFeedText");

$Import('ui.litePrompt');
$Import('common.dialog.validateCode');
$Import('common.layer.ioError');

STK.register("common.forward.toMicroblog", function ($) {
    //---常量定义区----------------------------------
    var lang = $.kit.extra.language;
    //发送请求的参数，为验证层使用。
    var postParam = null;
    //验证层对话框。
    var validateTool = $.common.dialog.validateCode();
    // HTML 模板
    var TEMPLATE = lang(''
            + '<#et userlist data>'
            + '<div node-type="toMicroblog_client" class="toMicroblog<#if (data.isDialog == true)>Layer</#if>">'
            + '<#if (data.isDialog == true)>'
            + '<div class="forward_content" node-type="content">'
            + '<#if (data.showArrow == true)>'
            + '<span class="unfold" action-type="origin_all"></span>'
            + '</#if>'
            + '${data.content}</div>'
            + '</#if>'
            + '<div class="feed_repeat">'
            + '<div class="input clearfix">'
            + '<div class="action clearfix actionControl" node-type="widget">'
            + '<span class="faces" title="#L{表情}" node-type="smileyBtn"></span>'
            + '</div>'
            + '<p class="num" node-type="num">140 #L{字}</p>'        //<span class="W_error">-40</span>
            + '<textarea name="" rows="" cols="" title="#L{转发微博}#L{内容}" node-type="textEl">${data.reason}</textarea>'
            + '<div class="action clearfix" node-type="widget">'
            + '<ul node-type="cmtopts" class="commoned_list">'
            + '<#if (data.forwardNick)>'
            + '<li node-type="forwardLi"><label><input type="checkbox" node-type="forwardInput" class="W_checkbox" />#L{同时评论给} '
            + '${data.forwardNick}'
            + '</label></li>'
            + '</#if>'
            + '<li node-type="originLi"><label><input type="checkbox" node-type="originInput" class="W_checkbox" />'
            + '<#if (data.forwardNick)>'
            + '#L{同时评论给原文作者} '
            + '<#else>'
            + '#L{同时评论给} '
            + '</#if>'
            + '${data.originNick}</label></li>'
            + '</ul>'
            + '</div>'
            + '<p class="btn"><a href="#" title="#L{转发}#L{按钮}" onclick="return false;" class="W_btn_b btn_noloading" node-type="submit"><span><b class="loading"></b><em node-type="btnText">#L{转发}</em></span></a></p>'
            + '</div>'
            + '</div>'
            + '<#if (data.isDialog == true)>'
            + '<div node-type="forward_link"></div>'
            + '</#if>'
            + '</div>');
    // 文案
    var MSG = {
        'notice' : '#L{请输入转发理由}',
        'defUpdate' : '#L{转发微博}',
        'netError' : '#L{系统繁忙}',
        'success' : '#L{转发成功}!',
        'retry' : '#L{读取失败，请}<a href="#" onclick="return false;" action-type="retry" value="retry">#L{重试}</a>',
        'off' : '#L{关闭}',
        'on' : '#L{开启}'
    };
    // 编辑器初始选项
    var options = {
        'limitNum' : 140,
        'tipText' : lang(MSG.notice)
        ,'count':'disable'
    };
    //改变按钮文字函数
    var changeBtnText = function(tNode, type) {
        if (type == 'normal') {
            tNode.innerHTML = lang('#L{转发}');
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
            throw new Error('[common.forward.toMicroblog]Required parameter client is missing');
        }
        var data = opts.data;
        var _limit = 56;
        var showArrow = false;
        var atOriginNick = data.originNick ? ("@" + data.originNick) : "";
        var _content = $.kit.extra.toFeedText(data.origin.replace(/<[^>]+>/gi, ''));	// TODO 按多少字截取啊
        data.content = _content + "";
        if ($.bLength($.core.str.decodeHTML($.kit.extra.toFeedText(_content + atOriginNick))) > _limit) {
            data.content = $.leftB(_content, _limit - $.bLength(atOriginNick)) + '...';
            showArrow = true;
        } else {
            data.content = data.origin;
        }
        atOriginNick = '<a href="/' + (data['domain'] || data['rootuid'] || data['uid']) + '" target="_blank">' + atOriginNick + '</a>:';
        data.content = atOriginNick + data.content;
        //delete by zhaobo 201105091021
        //var forwardReason = data.reason || lang(MSG.defUpdate);
        //add by zhaobo 201105091021
        var forwardReason = data.reason || "";
        var forwardNick = data.forwardNick ? ("//@" + data.forwardNick + ":") + " " : "";
        var editor,        // 编辑器对象
                doms,        // dom 集合
                conf, lock, lockReason/*=loading or error=*/,
                trans,        // 转发接口
                setDefault ,
                simpleForwardLinks,    // 简版转发链接口
                detailForwardLinks,    // 全部转发链接口
                node,        // 外容器
                status,        // 转发链开关
                currentStatus,    //
                delegate,
                isInDialog,
                isComment = false,
                loaded = false,
                clock,
                usercard,
                utils = $.common.forward.utils;
        var that = {};
        that.client = client;
        that.opts = opts.data || {};
        that.isInit = false;

        // 提交参数的 style_type
        conf = $.parseParam({
            'appkey'  : ''
            ,'styleId' : '1'
        }, that.opts);

        // 自定义事件定义
        $.custEvent.define(that, ['forward', 'hide', 'center', 'count']);
        // 提交转发
        var updateForward = function() {
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
            lock = true;
            lockReason = 'loading';
            doms.submit.className = 'W_btn_a_disable';	// 提交中状态
            changeBtnText(doms.btnText, 'loading');//改按钮字为提交中...
            var params = {};
            params.appkey = conf.appkey;
            params.mid = mid;
            params.style_type = conf.styleId;
            params.reason = content || lang(MSG.defUpdate);
            if (doms.originInput && doms.originInput.checked) {
                params.is_comment_base = '1';
            }
            if (doms.forwardInput && doms.forwardInput.checked) {
                params.is_comment = '1';
                isComment = true;
            }
            /**
             * Diss
             */
            params = $.module.getDiss(params, doms.submit);
            postParam = params;
            if (utils.checkAtNum(content) > 5) {
                $.ui.confirm(lang('#L{单条微博里面@ 太多的人，可能被其它用户投诉。如果投诉太多可能会被系统封禁。是否继续转发？}'), {
                    OK : function() {
                        trans.request(params);
                    },
                    cancel : function() {
                        lock = false;
                        lockReason = '';
                        doms.submit.className = 'W_btn_b btn_noloading';
                        //改按钮字为转发
                        changeBtnText(doms.btnText, 'normal');
                    }
                });
                return;
            }
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
        /*
         var canForward = function(evt,infos){
         var key = infos.isOver, count = editor.API.count();
         if(!key || count === 0){
         lock = false;
         lockReason = '';
         doms.submit.className = 'W_btn_b';
         if(!key){
         doms.num.innerHTML = lang('#L{还可以输入}<span>' + (options.limitNum - count) + ' </span>#L{字}');
         }
         }else{
         lock = true;
         lockReason = 'error';
         doms.submit.className = 'W_btn_a_disable';
         //doms['num'].innerHTML = '已经超过<span class="W_error">' + Math.abs(140 - count) + '</span> 字';
         }
         };
         */
        var canForward = function() {
            var count = editor.API.count();
            var diff = options.limitNum - count;
            var key = diff >= 0 ? true : false;
            if (key) {
                lock = false;
                lockReason = '';
                if (key) {
                    doms.num.innerHTML = lang('#L{还可以输入}<span>' + (diff) + '</span> #L{字}');
                }
            } else {
                lock = true;
                lockReason = 'error';
                doms['num'].innerHTML = lang('#L{已经超过}<span class="W_error">' + Math.abs(diff) + '</span> #L{字}');
            }
        }
        // 提交成功的处理
        var success = function(ret, params) {
            lock = false;
            lockReason = '';
            postParam = null;
            doms.submit.className = 'W_btn_b btn_noloading';
            //改按钮字为转发
            changeBtnText(doms.btnText, 'normal');
            try {
                ret.data.isComment = isComment;
                ret.data.isToMiniBlog = true;
                $.custEvent.fire(that, 'forward', [ret.data, params, opts.inDialog]);
                $.common.channel.feed.fire('forward', [ret.data, params, opts.inDialog]);
            } catch(exp) {
            }
            $.custEvent.fire(that, 'hide');

            $.ui.litePrompt(lang(MSG.success), {'type':'succM','timeout':'500'});
            isComment = false;
            editor.API.reset();
        };
        // 提交出错的处理
        var error = function(ret, params) {
            lock = false;
            lockReason = '';
            doms.submit.className = 'W_btn_b btn_noloading';
            //改按钮字为转发
            changeBtnText(doms.btnText, 'normal');
			//失败提示弹层
			ret.msg = ret.msg||lang(MSG.netError);
			$.common.layer.ioError(ret.code,ret);
//            $.ui.alert(ret.msg || lang(MSG.netError));
            isComment = false;
        };
        // 提交接口异常处理
        var fail = function(ret, params) {
            lock = false;
            lockReason = '';
            doms.submit.className = 'W_btn_b btn_noloading';
            //改按钮字为转发
            changeBtnText(doms.btnText, 'normal');
            $.ui.alert(lang(MSG.netError));
        };

        // 获取从接口获取转发链 HTML
        var getForwardInfo = function () {
            //var newStatus = (currentStatus == 'on') ? 'off' : 'on';
            detailForwardLinks.request({
                'mid' : mid,
                'd_expanded' : status
                ,'expanded_status' : loaded ? (currentStatus === "on" ? 1 : 2) : ""
            });
            loaded = true;
            /*if(currentStatus == 'off'){
             simpleForwardLinks.request({
             'mid' : mid,
             'd_expanded' : status
             });
             } else {
             detailForwardLinks.request({
             'mid' : mid,
             'd_expanded' : status
             //,'expanded_status' : status
             });
             }*/
        };
        // 获得转发链列表默认开关状态
        var getSwitchStatus = function () {
            status = $.core.util.storage.get("forward_link_status");
            if (status == "null") {
                status = 'off';
            }
            currentStatus = status;
        };
        // 设置转发链列表默认开关 sStatus 取值为字符串 on/off
        var setSwitchStatus = function (sStatus) {
            if (sStatus == null) {
                throw new Error('[common.forward.toMicroblog]function - setSwitchStatus required parameter sStatus is missing');
            }
            setDefault.request({
                'd_expanded' : sStatus
            });
            $.core.util.storage.set("forward_link_status", sStatus);
            status = sStatus;
        };

        /*------------lazyInit-------------*/
        // 绑定编辑器
        var parseDOM = function() {

            node = $.builder(client);
            node = $.kit.dom.parseDOM(node.list).toMicroblog_client;

            editor = $.common.editor.base(node, options);
            editor.widget($.common.editor.widget.face(), 'smileyBtn');
            doms = editor.nodeList;
            $.addEvent(doms.textEl, 'focus', function() {
                clock = setInterval(function() {
                    canForward();
                }, 200);
            });
            $.addEvent(doms.textEl, 'blur', function() {
                clearInterval(clock);
            });
			editor.API.insertText(forwardNick + $.core.str.decodeHTML($.kit.extra.toFeedText(forwardReason)));
            $.kit.dom.autoHeightTextArea({
                'textArea': doms.textEl,
                'maxHeight': 145,
                'inputListener': $.funcEmpty
            });
            if (isInDialog) {
                getForwardInfo();
            }
        };
        // 绑定事件
        var bindDOM = function() {
            $.addEvent(doms.submit, 'click', updateForward);
            $.addEvent(doms.textEl, 'keypress', ctrlUpdateForward);

            if (isInDialog) {
                // 事件代理
                delegate = $.delegatedEvent(node);
                // 原文右侧的向下箭头
                delegate.add('origin_all', 'click', function(spec) {
                    doms.content.innerHTML = atOriginNick + data.origin;
                });
                delegate.add('report', 'click', function(spec) {
                    return $.common.content.report(spec);
                });
                // 转发链默认值开关
                delegate.add('switch', 'click', function(spec) {
                    var userChoice = {
                        '1': 'on',
                        '2': 'off'
                    };
                    var choice = userChoice[spec.data.id];
                    setSwitchStatus(choice);
                    $.setStyle(spec.el, 'left', (choice == 'on') ? "23px" : "0px");
                    spec.el.setAttribute('action-data', (choice == 'on') ? 'id=2' : 'id=1');
                    spec.el.setAttribute('title', (choice == 'on') ? lang(MSG.off) : lang(MSG.on));
                });
                // 转发链信息重试
                delegate.add('retry', 'click', function(spec) {
                    getForwardInfo();
                });
                // 展开收起转发链
                delegate.add('show', 'click', function(spec) {
                    currentStatus = (spec.data.id * 1 == 1) ? 'on' : 'off';
                    getForwardInfo();
                });
            }
        };
        // 监听自定义事件
        var bindCustEvt = function() {
        };
        var forwardLinkSuccess = function(ret, params) {
            currentStatus = (currentStatus == 'on') ? 'off' : 'on';
            doms.forward_link.innerHTML = ret.data.html || '';

            //刷新显示评论状态
            if (doms.cmtopts && ret.data.permission && ret.data.permission.allowComment == 0) {
                doms.cmtopts.style.display = 'none';
                doms.cmtopts.innerHTML = '';
            }
        };
        var forwardLinkError = function() {
            doms.forward_link.innerHTML = lang(MSG.retry);
        };

        var setDefaultSuccess = function(ret, params) {
            currentStatus = (currentStatus == 'on') ? 'off' : 'on';
        };
        var setDefaultError = function() {
            $.ui.alert(lang(MSG.netError));
        };


        // 取得接口
        var bindTrans = function() {
            trans = $.common.trans.forward.getTrans('toMicroblog', {
                //'onSuccess'	: success,
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
                            //改按钮字为转发
                            changeBtnText(doms.btnText, 'normal');
                            isComment = false;
                        }
                    };
                    //加入验证码检查机制，参见$.common.dialog.validateCode

                    validateTool.validateIntercept(ret, data, bigObj);
                },
                //'onError'	: error,
                'onFail'    : fail,
                'onTimeout' : error
            });
            setDefault = $.common.trans.forward.getTrans('setDefault', {
                'onSuccess'    : setDefaultSuccess,
                'onError'    : setDefaultError,
                'onFail'    : setDefaultError
            });
            simpleForwardLinks = $.common.trans.forward.getTrans('simpleForwardLinks', {
                'onSuccess'    : forwardLinkSuccess,
                'onError'    : forwardLinkError,
                'onFail'    : forwardLinkError
            });
            detailForwardLinks = $.common.trans.forward.getTrans('detailForwardLinks', {
                'onSuccess'    : forwardLinkSuccess,
                'onError'    : forwardLinkError,
                'onFail'    : forwardLinkError
            });
        };

        var initPlugins = function() {
// 根据产品需求，转发层里不显示名片，提案见：http://issue.internal.sina.com.cn/browse/MINIBLOGBUG-20687
//			usercard = $.comp.content.userCard(node, {
//				'order': 't,b',
//				'zIndex': 10002
//			});
        };
        var lazyInit = function() {
            getSwitchStatus();
            bindTrans();
            parseDOM();
            bindDOM();
            initPlugins();
            bindCustEvt();
        };
        // 显示界面
        var show = function (isDialog) {
            if (that.isInit == false) {
                opts.data.isDialog = isDialog;
                isInDialog = isDialog;
                opts.data.showArrow = showArrow;
//				opts.data.reason = $.core.str.decodeHTML($.kit.extra.toFeedText(opts.data.reason));
//				$.log(data.allowRootComment!=="0" ,  "|",data.forwardNick, "|", data.originNick ,"|", data.forwardNick !== data.originNick);
                $.addHTML(client, $.core.util.easyTemplate(TEMPLATE, opts.data));
                if (!editor) {
                    lazyInit();
                }
                that.isInit = true;
            } else {
                node && $.setStyle(node, 'display', '');
            }
            editor.API.focus(0);
        };
        var shine = function() {
            $.common.extra.shine(editor.nodeList.textEl);
        };
        // 隐藏
        var hide = function () {
            editor.API.blur();
            if (node != null) {
                $.setStyle(node, 'display', 'none');
            }
        };
        // 销毁
        var destory = function () {
            $.removeEvent(doms.submit, 'click', updateForward);
            $.removeEvent(doms.textEl, 'keypress', ctrlUpdateForward);
            $.custEvent.undefine(that);
            delegate && delegate.remove('origin_all', 'click');
            delegate && delegate.remove('report', 'click');
            delegate && delegate.remove('switch', 'click');
            delegate && delegate.remove('retry', 'click');
            delegate && delegate.remove('show', 'click');
            delegate = null;

            validateTool && validateTool.destroy && validateTool.destroy();
            editor.closeWidget();
            clock && clearInterval(clock);
            //usercard.destroy();
            editor = null;
            doms = null;
            trans = null;
            node = null;
            for (var k in that) {
                delete that[k];
            }
            that = null;
        };

        that.show = show;
        that.hide = hide;
        that.shine = shine;
        that.destory = destory;

        return that;
    };
});
