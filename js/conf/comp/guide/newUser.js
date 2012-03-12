/**
 * 新用户引导
 * created by  chenjian2@staff.sina.com.cn
 */
$Import('ui.dialog');
$Import('ui.alert');
$Import('kit.extra.language');
$Import('kit.io.ajax');
$Import('common.trans.relation');
STK.register('comp.guide.newUser', function($) {
	//+++ 常量定义区 ++++++++++++++++++
	//-------------------------------------------
	return function(step) {
		var that			= {},//dialog,outer,title,inner,close,
			dialog 		= $.ui.dialog(),
			$L			= $.kit.extra.language,
			alert		= $.ui.alert;
		var style = "left: 21px;top: 71px;width: 150px;height: 148px;";
		if($.core.util.browser.MOZ){
			style = "font-size: 44px;width: 133px;height: 152px;left: -463px;top: 69px;";
		}else if($.core.util.browser.IE){
			style = "font-size: 30px;width: 152px;height: 148px;left: 25px;top: 72px;";
			if($.core.util.browser.IE6){
				style = "font-size: 30px;width: 150px;height: 149px;left: 15px;top: 72px;";
			}
		}
		var template = {
				publisher:'<div style="position: relative;cursor: pointer;zoom:1;"  node-type="clickArea" class="first_weibo_img"></div>',
				uploadImg:$L('<form action="/settings/myface_postjs" method="post" enctype="multipart/form-data" node-type="form_upload" target="Upfiler_file_iframe">\
							<div node-type="clickImgArea" class="lf '+ ($CONFIG['sex'] == 'f' ? "female" : "male")+'" >\
							<span class="onload_btn"><span class="errtxt" node-type="upload_status"></span><a class="W_btn_d" href="javascript:;"><span>#L{上传头像}</span><input node-type="file_name" name="Filedata" contenteditable="false" type="file" style="position: absolute;border: 0 none;'+ style +'opacity: 0;filter: alpha(opacity=0);cursor: pointer;border: 1px solid red;"></a></span>\
						</div><div class="rt">\
							<p>#L{上传真人头像，关注度马上提升50%}<br>#L{没有头像，你只能默默的 默默的 被朋友们忽略…}</p>\
						</div><div class="clear"></div><div class="btn"><a href="#" node-type="jump">#L{跳过}»</a></div></form><iframe src="about:blank" id="Upfiler_file_iframe" name="Upfiler_file_iframe" style="display:none"></iframe>'),
				interest:$L('<p class="sub_title">#L{你喜欢的明星，你的同学、同事、朋友都在这里，快来找找。}</p>\
							<div node-type="region" class="person_list"><ul class="list" node-type="container">\
								</ul><div class="func"><label><input action-type="followAll" type="checkbox" class="W_checkbox" name="">#L{全选}</label><span class="line">|</span>#L{已选}<span node-type="num" class="W_spetxt">0</span>#L{人}<a class="W_btn_b" href="#" action-type="followBtn"><span>#L{关注并继续}</span></a></div>\
							</div><div class="btn"><a href="#" node-type="jump">#L{跳过}»</a></div>')
						};
		var outer = dialog.getOuter();
		var title = dialog.getDom('title');	
		var inner = dialog.getDom('inner');
		var close = dialog.getDom('close');
		var statusAjax = $.kit.io.ajax({
				'url'			: '/aj/user/modifystatus',
				'method'		: 'post',
				'onComplete' : function(){},
				'onFail': function(){}
			});
		var changeStatus = function(status){
			if (!window.$CONFIG.enterprise) {
				statusAjax.request({
					uid: $CONFIG.uid,
					status: status
				});
			}
		};
		var handler = {
            init: function(){
				if (step) {
					step = step.split(',');
					handler[step.shift()]();
				}
            },
			next:function(){
				dialog && dialog.hide();
				if(step.length){
					handler[step.shift()]();
				}
			},
			suda:function(value){
				if(window.SUDA && window.SUDA.uaTrack){
					window.SUDA.uaTrack("tblog_newuser_guide_v4",value);
				}else{
					timer = setTimeout(function(){
						handler.suda(value);
					},200);
				}
			},
			publisher: function(){
				changeStatus(3);
				$.sizzle('div[class="bg"]', outer)[0].style.background = 'none';
				$.sizzle('div[class="content"]', outer)[0].style.border = 'none';
				title.style.display = 'none';
				dialog.setContent(template['publisher']);
				dialog.unsupportEsc();
				setTimeout(function(){
					var pos = $.position($.sizzle('div[class="W_main_c"]')[0]);
					dialog.show().setPosition({
						t: pos.t - 4,
						l: pos.l - 4
					});
					handler.suda("publish_display");
					var clickArea = $.sizzle('div[node-type="clickArea"]')[0];
					var textEl = $.sizzle('textarea[node-type="textEl"]')[0];
					var publishBtn = $.sizzle('[node-type="publishBtn"]')[0];
					var done = function(e){
						changeStatus(4);
						if (e) {
							$.preventDefault(e);
							var data = $.fixEvent(e).target.getAttribute("data");
							if (data) {
								handler.suda(data);
							}
						}
						$.removeEvent(inner,"click",done);
						dialog.destroy();
						textEl.focus();
						handler.suda("click_input");
						var firstpublish = function(){
							$.removeEvent(publishBtn,"click",firstpublish);
							handler.suda("publish");
						};
						$.addEvent(publishBtn,"click",firstpublish);
					};
					close.setAttribute("data","publish_close");
					$.addEvent(close,"click",done);
					$.addEvent(clickArea,"click",done);
					if ($CONFIG['isnarrow'] == '1') {
						clickArea.style.width = "600px";
					}
				},200);
			},
			uploadImg: function(){
				$.addClassName(title,'tit_load_face');
				$.addClassName(inner,'layer_face_cont');
				dialog.setContent(template['uploadImg']);
				dialog.unsupportEsc();
				dialog.show().setMiddle();
				handler.suda("upload_display");
				var jumpBtn = $.sizzle('a[node-type="jump"]',outer)[0];
				var onjump = function(e){
					if (typeof e === 'object') {
						$.preventDefault(e);
						var data = $.fixEvent(e).target.getAttribute("data");
						if (data) {
							handler.suda(data);
						}
					}
					$.removeClassName(title,'tit_load_face');
					$.removeClassName(inner,'layer_face_cont');
					$.removeEvent(close,'click',onjump);
					$.removeEvent(jumpBtn,'click',onjump);
					handler.next();
				}
				close.setAttribute("data","upload_close");
				jumpBtn.setAttribute("data","upload_skip");
				$.addEvent(close,'click',onjump);
				$.addEvent(jumpBtn,'click',onjump);
				
				var isUpload = false;
	            var element = {};
				scope = {};
				scope.addImgSuccess = function(cfg) {
	                //为1时为上传成功，否则失败。
	                if (cfg['ret'] == 1) {
						handler.suda("upload_succ");
						var version = cfg['version'];
                        element['clickImgArea'].style.background = "url(http://tp" + (($CONFIG.uid % 4) + 1) + ".sinaimg.cn/" + $CONFIG.uid + "/180/" + (version ? version : 0) + '/' + ($CONFIG.sex == '1' ? '1' : '0')+')';
                        element['clickImgArea'].innerHTML = "";
						setTimeout(onjump,2000);
	                } else {
	                    element['uploadstatus'].innerHTML = '';
	                    if (cfg) {
							if(cfg.msg){
								element['uploadstatus'].innerHTML = "<br>" + $L('#L{'+cfg.msg+'}');;
							}else{
								element['uploadstatus'].innerHTML = "<br>" + $L('#L{上传失败，请重新上传}');
							}
							
                        }
	                    element['formupload'].reset();
	                    isUpload = false;
	                }
	            };
	            element['formupload'] = $.sizzle('form[node-type="form_upload"]',outer)[0];//表单
	            element['sFilename'] = $.sizzle('input[node-type="file_name"]',outer)[0];//文件名
	            element['uploadstatus'] = $.sizzle('span[node-type="upload_status"]',outer)[0];//上传状态;
	            element['clickImgArea'] = $.sizzle('div[node-type="clickImgArea"]',outer)[0];
		        
				
				var uploadImage_event = function() {
		            if(isUpload){return;}
		            isUpload = true;
		            
					if (element['sFilename'].value == "" || element['sFilename'].value == null) {
                        element['uploadstatus'].innerHTML = "<br>" + $L('#L{请选择图片}');
                        isUpload = false;
                        return false;
                    }
                    
					if (!/\.(gif|jpg|jpeg)$/i.test(element['sFilename'].value)) {
                        element['uploadstatus'].innerHTML = $L('#L{文件格式不正确，请选择JPG或GIF图片格式}');
                        element['formupload'].reset();
                        isUpload = false;
                        return false;
                    }
                    element['uploadstatus'].innerHTML = "<br>" + $L('#L{请等待图片上传}');
		            //返回函数
		            element['formupload'].submit();
		        };
				$.addEvent(element['sFilename'], "click", function(){
					handler.suda("upload_pic");
				});
				$.addEvent(element['sFilename'], "change", uploadImage_event);		
			},
			interest: function(){
				changeStatus(2);
				$.addClassName(title,'tit_maybe');
				$.addClassName(inner,'layer_attention_choose layer_invite_attention');
				dialog.setContent(template['interest']);
				dialog.unsupportEsc();
                setTimeout(function(){
				var jumpBtn = $.sizzle('a[node-type="jump"]',outer)[0];
				var onjump = function(e){
					if (typeof e === 'object') {
						$.preventDefault(e);
						var data = $.fixEvent(e).target.getAttribute("data");
						if (data) {
							handler.suda(data);
						}
					}
					$.removeClassName(title,'tit_maybe');
					$.removeClassName(inner,'layer_attention_choose layer_invite_attention');
					$.removeEvent(close,'click',onjump);
					$.removeEvent(jumpBtn,'click',onjump);
					handler.next();
				}
				close.setAttribute("data","interested_close");
				jumpBtn.setAttribute("data","skip");
				$.addEvent(close,'click',onjump);
				$.addEvent(jumpBtn,'click',onjump);
				var region = $.sizzle('div[node-type="region"]',outer)[0];
				var num = $.sizzle('span[node-type="num"]',region)[0];
				var container = $.sizzle('ul[node-type="container"]',region)[0];
				var followAllBtn = $.sizzle('input[action-type="followAll"]', region)[0];
				var list;
				var checkNum = 0;
				var getInput = function(el){
					return el.getElementsByTagName("input")[0];
				}
				var bindDOMFuns = {
					clickFollowBtn: function(o){
						o.evt && $.preventDefault(o.evt);
						var uids = [];
						for(var i=list.length;i--;){
							var input = getInput(list[i]);
							if(input && input.checked){
								uids.push(input.getAttribute('uid'));
							}
						}
						if (uids.length) {
							$.kit.io.ajax({
								'url'			: '/aj/f/followed',
								'method'		: 'post',
								'onComplete' : function(){
									handler.suda("continue");
									onjump();
								},
								'onFail': function(){
									json && json.msg && $.ui.alert(json.msg);
								}
							}).request({'uid': uids.join(','),'refer_sort': 'new_guide','location': 'interset'});
						}
					},
					clickFollowAll: function(o){
						var checked = o.checked || o.el.checked;
						for(var i=list.length;i--;){
							var item = list[i];
							if(checked){
								item.className = "current";
							}else{
								item.className = "";
							}
							getInput(item).checked = checked;
						}
						if(checked){
							checkNum = list.length;
						}else{
							checkNum = 0;
						}
						num.innerHTML = checkNum;
					},
					clickItem: function(o){
						var el = o.el;
						var check = false;
						if(el.className == "current"){
							el.className = "";
							checkNum--;
						}else{
							el.className = "current";
							check = true;
							checkNum++;
						}
						getInput(el).checked = check;
						followAllBtn.checked = (list.length == checkNum);
						num.innerHTML = checkNum;
					}
				};
				$.common.trans.relation.getTrans("newuserguide", {
						onSuccess: function(json) {
							if (json.data && json.data.list) {
								container.innerHTML = json.data.list;
								dialog.show().setMiddle();
								list = $.sizzle('li[action-type="item"]',region);
								handler.suda("interested_display");
								followAllBtn.checked = true;
								bindDOMFuns.clickFollowAll(followAllBtn);
								
							}else{
								onjump();
							}
						},
						onFail:function(){
							onjump();
						}
				}).request({uid:$CONFIG.uid});
				dEvent	= $.core.evt.delegatedEvent(region);
				dEvent.add('followBtn', 'click', bindDOMFuns.clickFollowBtn);
				dEvent.add('followAll', 'click', bindDOMFuns.clickFollowAll);
				dEvent.add('item', 'click', bindDOMFuns.clickItem);
                },200);
				
			},
            destroy: function(){
                delegate && delegate.destroy();
            }
			
        };
		that.destroy = handler.destroy;
        step && handler.init();
		return that;
	};
});
