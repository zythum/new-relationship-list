/**
 * 屏蔽窗口
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.dialog');
$Import('ui.alert');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.trans.feed');
STK.register('common.dialog.shieldDialog', function($){
	var temp =
		'<#et shield data>'+
		'<div class="layer_point" node-type="shieldPanel">'+
			'<input type="hidden" name="id" value="${data.mid}">'+
			'<dl class="point clearfix">'+
				'<dt><span class="icon_questionM"></span></dt>'+
				'<dd>'+
				'<p class="W_texta">#L{屏蔽这条@我的微博吗？}</p>'+
				'<p class="W_textb replycb">'+
					'<label>'+
					'<input type="checkbox" name="follow_up" value="1" node-type="checkbox">'+
					'#L{同时不再接收含这条原文并}<span>@</span>#L{我的微博}</label>'+
				'</p>'+
				'<p class="con_reply" node-type="content" style="display:none;">${data.content}</p>'+
				'</dd>'+
			'</dl>'+
			'<div class="btn"><a node-type="submit" class="W_btn_b" href="javascript:;"><span>#L{确定}</span></a>'+
			'<a node-type="cancel" class="W_btn_a" href="javascript:;"><span>#L{取消}</span></a></div>'+
			'</div>'+
		'</#et>';
	var $L			= $.kit.extra.language;
	
	return function(spec){
		var conf = $.parseParam({
			'mid'      : '',
			'content'  : '',
			'OK'       : function(){}
		}, spec || {});
		var dialog, nodes;
		
		var atMeShield = $.common.trans.feed.getTrans('atMeShield', {
			'onSuccess': function(rs, parm){
				try {
					conf.OK();
					dialog.hide();
				}catch(e){console.log(e);}
			},
			'onError': function(rs, parm){
				$.ui.alert(rs.msg);
			}
		});
		
		var bindDomFuns = {
			'submit': function(){
				var conf = $.htmlToJson(nodes['shieldPanel']);
				atMeShield.request(conf);
			},
			'cancel': function(){
				dialog.hide();
			},
			'checkbox': function(){
				nodes['content'].style.display = nodes['content'].style.display == 'none' ? '' : 'none';
			}
		};
		
		var bindDom = function(){
			$.addEvent(nodes['checkbox'], 'click', bindDomFuns.checkbox);
			$.addEvent(nodes['submit'], 'click', bindDomFuns.submit);
			$.addEvent(nodes['cancel'], 'click', bindDomFuns.cancel);
		};
		
		var parseDOM = function(){
			var html	= $.core.util.easyTemplate($L(temp), spec).toString();
			var dom		= $.core.dom.builder(html);
			nodes = $.kit.dom.parseDOM(dom.list),
			dialog = $.ui.dialog();
			dialog.setTitle($L('#L{提示}'));
			dialog.appendChild(nodes['shieldPanel']);
		};
		
		var init = function(){
			parseDOM();
			bindDom();
			dialog.show().setMiddle();
		};
		
		init();
	}
});