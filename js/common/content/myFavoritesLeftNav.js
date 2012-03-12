/**
 *
 * @id $.common.content.myFavoritesLeftNav 收藏左侧导航
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author guoqing5@staff.sina.com.cn
 * @example
 */

$Import('kit.dom.parentElementBy');
$Import('ui.confirm');
$Import('ui.alert');
$Import('kit.dom.parentElementBy');
$Import('common.trans.favorite');
$Import('kit.extra.language');
$Import('kit.extra.textareaUtils');
$Import('common.extra.shine');
$Import('common.trans.favorite');

STK.register('common.content.myFavoritesLeftNav', function($) {
    //-------------------------------------------
        var $L = $.kit.extra.language;

        return function(node, opts) {
            opts = opts || {};
            var that = {};

            var saveDom = '<dt node-type="editTag"><a href="javascript:void(0);" class="W_btn_a">'+
						'<span action-type="cannelSaveTag">'+$L('#L{取消}')+'</span></a><a href="javascript:void(0);" class="W_btn_b"  action-type="saveTag"><span>'+$L('#L{保存}')+'</span></a>' +
                        '<input type="text" name="" value="" node-type="editTagInput" class="W_input" /></dt>';
                if(opts.narrow)
                {
                    saveDom = '<li node-type="editTag">' +
                            '<input type="text" name="" value="" node-type="editTagInput" class="W_input" />' +
                            '<a href="javascript:void(0);" class="W_btn_b"  action-type="saveTag">' +
                            '<span>' + $L('#L{保存}') + '</span></a>' +
                            '<a href="javascript:void(0);" class="W_btn_a">'
                            + '<span action-type="cannelSaveTag">' + $L('#L{取消}') + '</span></a>' +
                            '</li>'
                }
            //+++ 变量定义区 ++++++++++++++++++
            var _this = {
                conf:
                {
                    "save" :saveDom,
                    'showDom' :'<li class="current"><span> '+$L('#L{全部}')+'</span></li>'+
                                    '<li node-type="tagshow" action-type="tagshow"><a href="javascript:void(0)">'+$L('#L{微博标签}')+'</a></li>',
                    'allDom' :  '<li node-type="allTag" action-type="allTag"><a href="javascript:void(0)">'+$L('#L{全部}')+'</a></li>'+
                                    '<li class="W_vline">|</li><li class="current"><span>'+$L('#L{微博标签}')+'</span></li>',
                    "saveSucMessage" : "",
                    "delTagsMessage" : $L('#L{你确定要删除这个标签吗？}'),
                    "delTagSmallMsg" :  $L('#L{删除标签不会将对应的收藏一起删除}'),
                    "tooLong" : $L('#L{标签长度最长为6个汉字！}'),
                    "noTagMessage" : $L('#L{请输入标签！}')
                },
                DOM:{},//节点容器
                objs:{},//组件容器
                editDom : null,
                edittingTagDom : null,//编辑的dom
                selectTagDom : null,//选中的dom
                delTagDom : null,//删除的dom 开始以为只有点击才会选中。
                oldName : "",
                tagNum : 0,
                isExtend : true,
                //属性方法区
                DOM_eventFun: {
                    //修改标签的方法(代理调用)
                    editTagFunc : function(ol) {

                            $.core.evt.preventDefault();
                            _this.DOM_eventFun.hideEditDom();
                            _this.edittingTagDom = $.kit.dom.parentElementBy(ol.el, node, function (o) {
                                if (o.getAttribute('node-type') == 'myFavoritesLeftNavTag') {
                                    return true;
                                }
                            });
                            var tagInput = $.sizzle('[node-type="tagValue"]', _this.edittingTagDom);
                            var tagValue = "";
                            if (tagInput.length <= 0) {
                                throw 'common.content.myFavoritesLeftNav tag编辑输入框没有找到！';
                            }
                            else {
                                tagValue = $.decodeHTML(tagInput[0].innerHTML);
                            }
                            $.setStyle(_this.edittingTagDom, 'display', 'none');
                            _this.editTagInput.value = tagValue;
                            _this.editTagInput.cachedValue = tagValue;
							$.insertAfter(_this.editDom, _this.edittingTagDom);

                            if (_this.editDom && _this.editDom.style) {
                                $.setStyle(_this.editDom, 'display', '');
                            }
                            _this.oldName = tagValue;
                            setTimeout(function() {
                                $.kit.extra.textareaUtils.selectText(_this.editTagInput, 0, tagValue.length);
                            }, 30);

                    },
                    //删除标签的方法(代理调用)
                    delTagFunc : function(ol) {
                        //_this.DOM_eventFun.hideEditDom();//如果需要隐藏编辑框就调用该方法。去掉注释。
                        $.core.evt.preventDefault();
                        var tagDom = ol.el;
                        _this.delTagDom = $.kit.dom.parentElementBy(tagDom, node, function (o) {
                            if (o.getAttribute('node-type') == 'myFavoritesLeftNavTag') {
                                return true;
                            }
                        });
                        $.ui.confirm(_this.conf.delTagsMessage, {
                        	"textSmall":_this.conf.delTagSmallMsg,
                        	"icon":"warn",
                        	"OK":function(){
                        		_this.DOM_eventFun.enterDelTagFunc(ol);
                        	},
                        	"cancel":_this.DOM_eventFun.cannelDelTagFunc
                        });
                    },
                    //comfrim确定删除标签的方法
                    enterDelTagFunc : function(ol) {
                        //var tagInput = $.sizzle('[node-type="tagValue"]',_this.delTagDom);
                        //var _oname = tagInput[0].innerHTML;
                        var tagid = $.core.json.queryToJson(_this.delTagDom.getAttribute("action-data") || '');
                        $.common.trans.favorite.getTrans("delTag", {
                            onSuccess: function(json) {
                                _this.DOM_eventFun.delTagSuc(json, _this.delTagDom);
                            },
                            onFail: function() {
                                _this.DOM_eventFun.failDelMsg($L('#L{删除失败！}'));
                            },
                            onError: function(json) {
                                var msg = json.msg || $L('#L{删除失败！}');
                                _this.DOM_eventFun.errorDelMsg(msg);
                            }
                        }).request(
                        	/**
                        	 * Diss
                        	 */
                        	$.module.getDiss(tagid, ol.el)
                        );
                    },
                    //删除标签错误的方法
                    errorDelMsg : function(msg){
                        $.log('myFavoritesLeftNav Tag Del error');
                        $.ui.alert(msg, {"ICON":"error"});
                        _this.delTagDom = null;
                    },
                    //删除标签失败的方法
                    failDelMsg : function(msg) {
                        $.log('myFavoritesLeftNav Tag Del Fail');
                        $.ui.alert(msg, {"ICON":"error"});
                        _this.delTagDom = null;
                    },
                    //删除标签成功回调方法
                    delTagSuc : function(json, nodeDom) {
                        $.log('myFavoritesLeftNav Tag Del Success');
                        _this.tagNum = _this.tagNum - 1;
                        if (_this.selectTagDom && _this.selectTagDom === nodeDom) {
                            if (nodeDom) nodeDom.parentNode.removeChild(nodeDom);
                            window.location.href = json.data.location;
                        }
                        else {
                            window.location.reload(true);
                        }

                    },
                    //comfrim取消删除标签的方法
                    cannelDelTagFunc : function() {
                        $.log('myFavoritesLeftNav Tag Del  Cannel');
                        _this.delTagDom = null;
                    },
                    //点击标签的方法(代理调用)
                    clickTagFunc : function(ol) {
					   var length = _this.DOM["tagValue"].length;
						for(var i=0;i<length;i++)
						{
							$.removeClassName(_this.DOM["tagValue"][i],"W_spetxt");
						}
						$.addClassName(ol.el,"W_spetxt");
					   $.custEvent.fire(that,"filter",{tag:ol.data.tag_id});
                    },
                    saveTagFunc : function(ol) {
                        _this.DOM_eventFun.saveTag(ol.el);
                    },
                    //实现保存标签的方法
                    saveTag    : function(dom) {
                        var editDom = $.kit.dom.parentElementBy(dom, node, function (o) {
                            if (o.getAttribute('node-type') == 'editTag') {
                                return true;
                            }
                        });
                        var tagInput = $.sizzle('input[node-type="editTagInput"]', editDom);
                        var _tagValue = $.trim(tagInput[0].value);
                        var cachedValue = tagInput[0].cachedValue;
						if(_tagValue == cachedValue) {
							_this.DOM_eventFun.cannelSaveTagFun();
							return;							
						}
						var tagid = $.queryToJson(_this.edittingTagDom.getAttribute("action-data") || '');
                        tagid.text = _tagValue;

                        if ($.bLength(_tagValue) > 12) {
                            //$.common.extra.shine(tagInput[0]);
                            $.ui.alert(_this.conf.tooLong, {"OK":function() {

                                setTimeout(function() {
                                    $.kit.extra.textareaUtils.selectText(tagInput[0], 0, _tagValue.length);
                                }, 30);
                            }});

                            return;
                        }
                        if ($.bLength(_tagValue) == 0) {
                            $.common.extra.shine(tagInput[0]);
                            setTimeout(function() {
                                $.common.extra.shine(tagInput[0]);
                                tagInput[0].focus();
                            }, 30);
                            return;
                        }

                        $.common.trans.favorite.getTrans("updateTag", {
                            onSuccess: function(json) {
                                _this.DOM_eventFun.updateTagSuc(_tagValue, _this.edittingTagDom, json);
                            },
                            onFail: function() {
                                _this.DOM_eventFun.failSaveMsg($L('#L{保存失败！}'));
                            },
                            onError: function(json) {
                                var msg = json.msg || $L('#L{保存失败！}');
                                _this.DOM_eventFun.errorSaveMsg(msg);
                            }
                        }).request(tagid);
                    },
                    // 保存错误的错误提示。
                    errorSaveMsg : function(msg) {
                        $.log('myFavoritesLeftNav Tag Update error');
                        $.ui.alert(msg, {"ICON":"error"});
                        //_this.edittingTagDom = null;
                    },
                    // 保存失败的错误提示。
                    failSaveMsg : function(msg) {
                        $.log('myFavoritesLeftNav Tag Save Fail');
                        $.ui.alert(msg, {"ICON":"error"});
                        //_this.edittingTagDom = null;
                    },
                    //热键enter的调用方法。(热键绑定)
                    keyEnterSaveFunc : function(event, key) {
                        _this.editTagInput.blur();
                        var evt = $.core.evt.fixEvent(event);
                        var el = evt.target;
                        _this.DOM_eventFun.saveTag(el);
                    },
                    checkTag : function() {
                        var dom = $.fixEvent().target;
                        //dom.value = STK.core.str.trim(dom.value);
                        if ($.bLength(dom.value) < 12) return;
                        dom.value = $.core.str.leftB($.trim(dom.value), 12);
                        setTimeout(function() {
                            $.kit.extra.textareaUtils.setCursor(dom, dom.value.length);
                        }, 30);
                    } ,
                    //修改标签成功的方法
                    updateTagSuc : function(tagName, nodeDom, json) {
                        // $.sizzle('[node-type="tagValue"]',nodeDom)[0].innerHTML =STK.core.str.encodeHTML(tagName);
                        if (_this.selectTagDom && _this.selectTagDom === nodeDom) {
                            window.location.href = json.data.location;
                        }
                        else {
                            window.location.reload(true);
                        }
                        // _this.DOM_eventFun.hideEditDom();
                    },
                    //取消修改标签的方法(代理调用)
                    cannelSaveTagFun : function(ol) {
                        _this.DOM_eventFun.hideEditDom();
                    },
                    //显示被被编辑标签的方法。
                    hideEditDom : function() {
                        var editDom = $.sizzle("[node-type='editTag']", node);
                        if (editDom.length > 0) {
                            editDom[0].style.display = "none";
                        }
                        if (_this.edittingTagDom != null) {
                            $.setStyle(_this.edittingTagDom, 'display', '');
                            _this.edittingTagDom = null;
                        }
                    } ,
                extendTags : function(ol) {
                    if (_this.DOM.tagExtend) {
                        var extendDom =  _this.DOM.tagExtend[0];
                        $.addClassName(extendDom, _this.isExtend ? "W_moredown" : "W_moreup");
                        $.removeClassName(extendDom, _this.isExtend ? "W_moreup" : "W_moredown");
                    }
                    if (_this.DOM.taglistUL) {
                        $.setStyle(_this.DOM.taglistUL[0], "display", ( _this.isExtend ? "none" : ""));
                    }
                    _this.isExtend = (_this.isExtend ? false : true);
                    return false;
                },
                 allTags : function(ol)
                 {
                      _this.DOM_eventFun.changeTagTabs(true);

                     if (_this.DOM.myFavoritesNav)
                     {
                        $.setStyle(_this.DOM.myFavoritesNav[0], "display","none");
                     }
                     if(_this.DOM.tagList)
                     {
                         $.setStyle(_this.DOM.tagList[0], "display","none");
                     }
                      return false;
                 },
                 showByTagFunc : function(ol)
                 {
                     if (_this.DOM.myFavoritesNav)
                     {
                        $.setStyle(_this.DOM.myFavoritesNav[0], "display","");
                     }
                     if(_this.DOM.tagList)
                     {
                         $.setStyle(_this.DOM.tagList[0], "display","");
                     }
                     if (_this.DOM.taglistUL) {

                        $.setStyle(_this.DOM.taglistUL[0], "display","");
                    }
                      if (_this.DOM.tagExtend) {
                        var extendDom =  _this.DOM.tagExtend[0];
                        $.addClassName(extendDom, "W_moreup");
                        $.removeClassName(extendDom,"W_moredown");
                    }
                      _this.DOM_eventFun.changeTagTabs(false);
                     _this.isExtend = true;
                      return false;
                 },
                 changeTagTabs : function(isAll)
                 {
                     if(_this.DOM.tagSelect)
                     {
                         _this.DOM.tagSelect[0].innerHTML= ( isAll ? _this.conf. showDom : _this.conf.allDom);
                     }
                 }
                }
            };
            //----------------------------------------------

            //+++ 组件的初始化方法定义区 ++++++++++++++++++
            /**
             * 初始化方法
             * @method init
             * @private
             */
            var init = function() {

                argsCheck();
                parseDOM();
                initPlugins();
                bindDOM();
                bindCustEvt();
                bindListener();
            };
            //-------------------------------------------


            //+++ 参数的验证方法定义区 ++++++++++++++++++
            /**
             * 参数的验证方法
             * @method init
             * @private
             */
            var argsCheck = function() {
                if (!node) {
                    throw 'common.content.myFavoritesLeftNav node没有定义';
                }
            };
            //-------------------------------------------


            //+++ Dom的获取方法定义区 ++++++++++++++++++
            /**
             * Dom的获取方法
             * @method parseDOM
             * @private
             */
            var parseDOM = function() {
                //内部dom节点
                if (!node) {
                    throw 'common.content.myFavoritesLeftNav node没有定义';
                }
                _this.DOM = $.builder(node).list;
                _this.editDomList = STK.core.dom.builder(_this.conf.save);
                _this.editDom = _this.editDomList.list["editTag"][0];
                _this.editTagInput = _this.editDomList.list["editTagInput"][0];
                _this.selectTagDom = $.sizzle("[class='current']", node).length > 0 ? $.sizzle("[class='current']", node)[0] : null;
                STK.hotKey.add(_this.editTagInput, "enter", _this.DOM_eventFun.keyEnterSaveFunc);
                STK.core.evt.addEvent(_this.editTagInput, "keyup", _this.DOM_eventFun.checkTag);
                _this.tagNum = $.sizzle("[node-type='myFavoritesLeftNavTag']", node).length;
                if (!1) {
                    throw 'common.content.myFavoritesLeftNav 必需的节点不完整';
                }
            };
            //-------------------------------------------


            //+++ 模块的初始化方法定义区 ++++++++++++++++++
            /**
             * 模块的初始化方法
             * @method initPlugins
             * @private
             */
            var initPlugins = function() {
                _this.DEvent = $.core.evt.delegatedEvent(node);
				$.custEvent.define(that,["filter"]);
            };
            //-------------------------------------------


            //+++ DOM事件绑定方法定义区 ++++++++++++++++++
            /**
             * DOM事件绑定方法
             * @method bindDOM
             * @private
             */


            var bindDOM = function() {

                _this.DEvent.add("clickTag", "click", _this.DOM_eventFun.clickTagFunc);
                _this.DEvent.add("editTag", "click", _this.DOM_eventFun.editTagFunc);
                _this.DEvent.add("delTag", "click", _this.DOM_eventFun.delTagFunc);
                _this.DEvent.add("saveTag", "click", _this.DOM_eventFun.saveTagFunc);
                _this.DEvent.add("extendTag", "click", _this.DOM_eventFun.extendTags);
                 _this.DEvent.add("allTag", "click", _this.DOM_eventFun.allTags);
                 _this.DEvent.add("tagshow", "click", _this.DOM_eventFun.showByTagFunc);
                _this.DEvent.add("cannelSaveTag", "click", _this.DOM_eventFun.cannelSaveTagFun);

            };
            //-------------------------------------------


            //+++ 自定义事件绑定方法定义区 ++++++++++++++++++
            /**
             * 自定义事件绑定方法
             * @method bindCustEvt
             * @private
             */
            var bindCustEvt = function() {

            };
            //-------------------------------------------


            //+++ 广播事件绑定方法定义区 ++++++++++++++++++
            var bindListener = function() {

            };
            //-------------------------------------------


            //+++ 组件公开方法的定义区 ++++++++++++++++++
            /**
             * 组件销毁方法
             * @method destory
             */
            var destroy = function() {
                _this.DEvent.remove("clickTag", "click");
                _this.DEvent.remove("editTag", "click");
                _this.DEvent.remove("delTag", "click");
                _this.DEvent.remove("saveTag", "click");
                _this.DEvent.remove("cannelSaveTag", "click");
                 _this.DEvent.remove("allTag", "click");
                 _this.DEvent.remove("tagshow", "click");
                $.hotKey.remove(_this.editTagInput, "enter", _this.DOM_eventFun.keyEnterSaveFunc);
                $.core.evt.removeEvent(_this.editTagInput, "keyup", _this.DOM_eventFun.checkTag);
                _this.editTagInput = null;
                _this.editDom = null;
                _this.edittingTagDom = null;
                _this.selectTagDom = null;
                _this.delTagDom = null;
            };
            //-------------------------------------------


            //+++ 执行初始化 ++++++++++++++++++
        	init();
            //-------------------------------------------
            //+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
            that.destroy = destroy;
            //-------------------------------------------
            return that;

        };

});
