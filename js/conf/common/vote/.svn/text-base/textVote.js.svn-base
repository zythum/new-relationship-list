/**
 * 投票功能，定义一条投票的类，初始化max如果为1，为单选投票。
 * @param {Object} opts.max 最多可以选择的数字。
 *                            opts.poll_id 单挑投票feed的id。
 *  node    一条投票的dom节点。
 * @author bigbone|guoqing5@staff.sina.com.cn
 * @example
 */
$Import('kit.dom.parseDOM');
$Import('common.trans.vote');
$Import('kit.extra.language');
$Import('ui.tipAlert');
$Import('ui.alert');
$Import('common.extra.shine');
$Import('kit.dom.parentElementBy');
$Import('common.trans.vote');
STK.register("common.vote.textVote", function($) {
        //+++ 常量定义区 ++++++++++++++++++
        //-------------------------------------------
        return function(node,opts){

             var $L = $.kit.extra.language;
            var argsCheck, parseDOM, initPlugins, bindDOM, bindCustEvt, bindListener, destroy, init, that = {};
             opts =  $.parseParam({
                 'max':0, //最多可以选择数
                 'poll_id':0    //单条投票的id。
             },opts);
            var checkFlag = true,codesrc= null;
           var tempVoteHtml = node.innerHTML;
            // 验证码的dom结构
            var VOTEHTML ={
                                      "code":'<div node-type="vote_code" class="proving">' +
                                              '<input type="text" class="W_input" node-type="vote_code_input">' +
                                              '<img node-type="vote_img_code" alt='+ $L('#L{看不清，换一个}') + 'action-type="vote_refresh_code" src="[n]" width="75" height="24" alt="">' +
                                              '<p class="W_spetxt"  node-type="vote_code_Error" style="display:none;">' +
                                              '<span class="icon_del"></span>'+$L('#L{验证码错误，请重新输入}')+'</p></div>'
            };
            //+++ 变量定义区 ++++++++++++++++++
            var _this = {
                DOM:{},//节点容器
                objs:{},//组件容器
                 "tipText":{
                     "noSelectedErroe":$L('#L{没有选择选项，请选择投票。}'),
                     "fastMessage" : $L('#L{投的太快啦，请休息会吧}')
                 },
                 anonymousCheck: false,
                 share : true,
                _vote : false,
				selectRadio : null,
                selectLi :null,
                DOM_eventFun: {//DOM事件行为容器
                        select_vote : function(ol)
                        {
                             var el = ol.el;
                            var id = ol.data.index;
                            var checkel = $.sizzle('[node-type="voteCheckbox"]',el)[0];
                            //如果灰显则不可以点击选中。
                            if(!checkel || checkel.disabled)  return;
                            $.preventDefault();
							 if(opts.max >1) //多选投票。
                            {
                            setTimeout(function(){checkel.checked = checkel._checked = !checkel._checked;
                            if(checkel.checked)
                            {
                                _this.objs.checkedIds.push(id);
                                $.addClassName(el,"select");
                            }
                            else {
                                     var _index  =$.arrIndexOf(id,_this.objs.checkedIds);
                                    if( _index!= -1)  _this.objs.checkedIds.splice(_index,1);
                                    $.removeClassName(el,"select");
                                }//灰显和高亮投票按钮。
							_this.DOM_eventFun._selectVoteFun();
                            });
                            }
                            else if(opts.max==1) //单选的操作，单选为radio
                            {
                                 if(_this.selectRadio) { _this.selectRadio.checked= false;}
                                if( _this.selectLi) {  $.removeClassName( _this.selectLi,"select");}
                                 _this.objs.checkedIds=[];
                                 _this.objs.checkedIds.push(id);

                                setTimeout(function(){//解决ie的问题。
                                    checkel.checked = true;
                                 _this.selectRadio  = checkel;
                                 _this.selectLi = el;
                                 $.addClassName(el,"select");
                                $.removeClassName(_this.DOM.vote,"W_btn_d_disable");
                                },0);
                            }
                            else {
                                 //其他情况报错。
                                throw new Error("error data of votefeed to pass!");
                            }
                            return false;
                        },  //选择单条的方法代理调用该方法.
                          _selectVoteFun : function()
                        {
                                var num = opts.max;
                               if( _this.objs.checkedIds.length== 0) //没有选中任何项
                                {
                                    $.addClassName(_this.DOM.vote,"W_btn_d_disable");
                                }
                                else{
                                   $.removeClassName(_this.DOM.vote,"W_btn_d_disable");
                                    if(_this.objs.checkedIds.length >= num  ){
                                    //多于最大可选择数。大于最大选项将其他的按钮置成不可用
                                        _this.DOM_eventFun._unableCheckbox();
                                     }
                                     else{
                                          _this.DOM_eventFun._enableCheckkbox();
                                     }
                            }
                        } , //不能选择单条投票。设置其他投票选项不可选中。
                         _unableCheckbox : function()
                        {
                             checkFlag = false;
                             $.addClassName(_this.DOM.feed_vote_list,"selected");
                               $.foreach(_this.DOM.voteCheckbox,function(v,i){
                                   var parentLi = $.kit.dom.parentElementBy(v, node, function (o) {
						            if(o.getAttribute('action-type') == 'selectVote') {
							            return true;
						                }
					                });
                                   var index = $.core.json.queryToJson(parentLi.getAttribute("action-data")).index;
                                   if($.inArray( index,_this.objs.checkedIds))
                                   {
                                      return;
                                   }
                                 v.disabled  =  true;
                               });

                        }, //清除不可选中的状态，
                        _enableCheckkbox : function()
                        {
                               if(checkFlag)  return;
                              $.removeClassName(_this.DOM.feed_vote_list,"selected");
                              $.foreach(_this.DOM.voteCheckbox,function(v,i){
                                      v.disabled  =  false;
                               });
                             checkFlag = true;
                        }, //投票的主体函数
                        voteFunc : function()
                        {
                            if(opts.poll_id==0)
                            {
                                 throw new Error('votefeed no poll_id;');
                            }
                             var ids ={
                                poll_id : opts.poll_id ,
                                item_id:  _this.objs.checkedIds.join(","),
                                anonymous : _this.anonymousCheck ? 1 :0,
                                share : _this.share ? 1 :0
                            };
                            if(_this.DOM.codeInput)  {//有验证码的情况需要输入验证码。
                               var  codeValue  = _this.DOM.codeInput.value;
                                ids.secode =codeValue;
                            }
                            _this._vote= true;
                            //发起投票的请求。
                           $.common.trans.vote.getTrans("join",{
                            onSuccess: function(json) {
                                 $.custEvent.fire(that,"success");
                                 _this._vote= false;
                               node.innerHTML=json.data.html;
                               _this.DOM_eventFun. _destoryCode();
                            },
							onFail: function() {
                                 _this._vote= false;
                                $.custEvent.fire(that,"error");
                                $.removeClassName(_this.DOM.vote,"W_btn_d_disable");
                                $.ui.alert($L('#L{找不到接口!}'),{ICON:"error"});
							},
							onError: function(json) {
                                 _this._vote= false;
                                $.custEvent.fire(that,"error");
                                switch(json.code)
                                {
                                case "100024" :
                                {
                                    //需要输入验证码  生成验证码，保存验证码的请求地址。
                                    codesrc = json.data.url;
                                    _this.DOM_eventFun._checkCodeHtml();
                                      break;
                                }
                               case "100025" :
                               {  //验证码错误 ,.重新输入验证码，刷新验证码
                                  if(_this.DOM.codeError) $.setStyle(_this.DOM.codeError,"display","");
                                  _this.DOM_eventFun._refreshCode();
                                   _this.DOM_eventFun._refreshInput();
                                   $.addClassName(_this.DOM.vote,"W_btn_d_disable");
                                  setTimeout(function(){$.setStyle(_this.DOM.codeError,"display","none");},3000);
                                   break;
                                }
                                case "100026" :{ // 反垃圾规则被阻止。弹出提示。刷新验证码
                                    _this.DOM_eventFun. _destoryCode();
                                    _this.DOM_eventFun._showErrorAlert(json);
                                    // _this.DOM_eventFun._refreshCode();
                                    // _this.DOM_eventFun._refreshInput();
                                     break;
                                }
                                default : //错误情况
                                {
                                   node.innerHTML=json.data.html;
                                   _this.DOM_eventFun. _destoryCode();
                                }
                                }
						    }
					        }).request(ids);
                        },
                        vote : function(ol)
                        {    //投票按钮可用，
                            if( _this._vote ||  $.hasClassName(_this.DOM.vote,"W_btn_d_disable")) return;
                            //获取匿名和发微博的状态。
                            _this.anonymousCheck = _this.DOM.anonymousCheck.checked;
                             _this.share = _this.DOM.share.checked;
                              if(_this.DOM_eventFun.checkVote() && _this.objs.checkedIds.length<=opts.max)
                              {
                                    $.addClassName(_this.DOM.vote,"W_btn_d_disable");
                                  if(_this.DOM.codeInput && $.trim(_this.DOM.codeInput.value)==""){
                                       //$.ui.alert($L('#L{请输入验证码!}'),{ICON:"error"});
                                      $.common.extra.shine(_this.DOM.codeInput);
                                         return;
                                  }
                                  _this.DOM_eventFun.voteFunc();
                              }
                        },
                        // 生成验证码的代码 ，如果有就复用，改变imgsrc的地址，没有就添加html。
                        _checkCodeHtml : function()
                        {
                            if(!_this.DOM.codeInput){  //没有验证码输入框，将验证码的输入框dom加到投票项的下面
                            //分析验证码的html页面。
                                var strcodeDom = VOTEHTML.code.replace("[n]",_this.DOM_eventFun._getCodeUrl(codesrc));
                               _this._codeDom = $.builder(strcodeDom).list.vote_code[0];
                                $.insertAfter( _this._codeDom,_this.DOM.feed_vote_list);
                                var  domArr = $.builder(node).list;
                               _this.DOM.codeInput = domArr.vote_code_input[0];
                               _this.DOM.codeError  =domArr.vote_code_Error[0];
                                _this.DOM.codeImg  =domArr.vote_img_code[0];
                               $.addEvent( _this.DOM.codeInput,"keyup",_this.DOM_eventFun._codeInputBlur);
                                setTimeout(function(){ _this.DOM.codeInput.focus();},0);
                            }
                            else //刷新验证码
                            {
                                _this.DOM_eventFun._refreshCode();
                                _this.DOM_eventFun._refreshInput();
                            }
                        }, //清楚验证码输入的内容，
                        _refreshInput :function()
                        {
                            if(_this.DOM.codeInput)  {
                                        _this.DOM.codeInput.value ="";
                                       setTimeout(function(){ _this.DOM.codeInput.focus();},0);
                                    }
                        }, // 刷新验证码
                        _refreshCode : function()
                        {

                               if (_this.DOM. codeImg)
                               {
                                   _this.DOM. codeImg.setAttribute("src",_this.DOM_eventFun._getCodeUrl(codesrc));
                               }
                        },
                        refreshCode : function(ol){
                            _this.DOM_eventFun._refreshCode();
                        },//验证码输入事件，将投票按钮变成可用。
                         _codeInputBlur : function()
                         {
                             _this.DOM.codeInput.value.length>0 ?  $.removeClassName(_this.DOM.vote,"W_btn_d_disable") :  $.addClassName(_this.DOM.vote,"W_btn_d_disable");

                         }, //判断是否选中投票项。
                        checkVote : function()
                        {
                          return !( _this.objs.checkedIds.length==0);
                        },
                        //重新投票的方法。
                        reVote : function(ol)
                        {
                            node.innerHTML = tempVoteHtml;
                            //重新解析node置相关的状态。防止内存泄露。
                             _this.anonymousCheck = false;
                               codesrc = null;
                             _this.share = true;
                             _this.vote = false;
                            _this.selectRadio =null;
                            _this.selectLi =null;
                            _this.DOM.codeInput = null;
                            _this.objs.checkedIds=[];
                             parseDOM();
                        },
                        // 简单信息 相互切换
                        smart_info : function(ol)
                        {
                             if(_this.DOM.vote_smallInfo) $.setStyle(_this.DOM.vote_smallInfo,'display','');
                             if(_this.DOM.vote_bigInfo) $.setStyle(_this.DOM.vote_bigInfo,'display','none');
                        },
                         //详细信息  相互切换
                        detail_info : function(ol)
                        {
                              if(_this.DOM.vote_smallInfo)   $.setStyle(_this.DOM.vote_smallInfo,'display','none');
                              if(_this.DOM.vote_bigInfo)    $.setStyle(_this.DOM.vote_bigInfo,'display','');
                        },//显示提示对话框
                        _showErrorAlert : function(json)
                        {
                            //定义初始化tipalert 显示在投票的按钮位置。
                            if( _this.objs. tipAlert){ _this.objs. tipAlert.destroy(); _this.objs. tipAlert = null;}
                            _this.objs. tipAlert = $.ui.tipAlert(
                            {
                                showCallback:function() {},
                                type : "warn",
                                msg : (json.msg ||  _this.tipText.fastMessage)+"!"
                            });
					        _this.objs.tipAlert.setLayerXY(_this.DOM.vote);
                             _this.objs. tipAlert.aniShow();
                             $.addClassName(_this.DOM.vote,"W_btn_d_disable");
                           setTimeout(function(){
                                if( _this.objs. tipAlert)
                                {
                                    _this.objs.tipAlert.destroy();
                                    _this.objs.tipAlert = null;
                                }
                            },3000);
                        },
                        _destoryCode : function()
                        {
                            if( _this._codeDom) {_this._codeDom.parentNode.removeChild( _this._codeDom); _this._codeDom = null;}
                            if( _this.DOM.codeInput) $.removeEvent( _this.DOM.codeInput,"keyup",_this.DOM_eventFun._codeInputBlur);
							_this.DOM.codeInput =null;
                            _this.DOM.codeError  =null;
                            _this.DOM.codeimg = null;
                        },
                        _getCodeUrl : function(url)
                        {
                            if(url.indexOf("?") != -1)
                            {
                                return url+"&ts="+(new Date()).getTime();
                            }
                            else  return  url+"?ts="+(new Date()).getTime();
                        }

                }
                //属性方法区
            };
            //----------------------------------------------
            //+++ 参数的验证方法定义区 ++++++++++++++++++
            argsCheck = function(){
                if(!node) {
                    throw new Error(' no votefeed node');
                }
            };
            //-------------------------------------------
            //+++ Dom的获取方法定义区 ++++++++++++++++++
            parseDOM = function(){
                //内部dom节点
                _this.DOM = $.kit.dom.parseDOM($.builder(node).list);
            };
            //-------------------------------------------
            //+++ 模块的初始化方法定义区 ++++++++++++++++++
            initPlugins = function(){
              _this.objs.checkedIds=[];
              _this.DEvent = $.core.evt.delegatedEvent(node);
                $.custEvent.define(that,["error","success"]);
            };
            //-------------------------------------------
            //+++ DOM事件绑定方法定义区 ++++++++++++++++++
            bindDOM = function(){
				_this.DEvent.add("selectVote","click",_this.DOM_eventFun.select_vote);
                _this.DEvent.add("vote","click",_this.DOM_eventFun.vote);
                _this.DEvent.add("revote","click",_this.DOM_eventFun.reVote);
                _this.DEvent.add("vote_toSmallInfo","click",_this.DOM_eventFun.smart_info);
                _this.DEvent.add("vote_toBigInfo","click",_this.DOM_eventFun.detail_info);
                 _this.DEvent.add("vote_refresh_code","click",_this.DOM_eventFun.refreshCode);
            };
            //-------------------------------------------

            //+++ 自定义事件绑定方法定义区 ++++++++++++++++++
            bindCustEvt = function(){

            };
            //-------------------------------------------

            //+++ 广播事件绑定方法定义区 ++++++++++++++++++
            bindListener = function(){

            };
            //-------------------------------------------

            //+++ 组件销毁方法的定义区 ++++++++++++++++++
            destroy = function(){
                _this.DEvent.remove("selectVote","click");
               _this.DEvent.remove("vote","click");
               _this.DEvent.remove("revote","click");
               _this.DEvent.remove("vote_toSmallInfo","click");
               _this.DEvent.remove("vote_toBigInfo","click");
                _this.DEvent.remove("vote_refresh_code","click");
                if( _this.objs.tipAlert){ _this.objs.tipAlert.destroy(); _this.objs.tipAlert = null;}
               _this.objs.checkedIds = null;
               _this.DOM_eventFun._destoryCode();
               _this.DOM = null;
               _this.anonymousCheck = null;
               _this.share = null;
                $.custEvent.undefine(that);
            };
            //-------------------------------------------
            //+++ 组件的初始化方法定义区 ++++++++++++++++++
            init = function(){
                argsCheck();
                parseDOM();
                initPlugins();
                bindDOM();
                bindCustEvt();
                bindListener();
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
