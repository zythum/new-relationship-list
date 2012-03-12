/**
 * @author Runshi Wang|runshi@staff.sina.com.cn
 * 
 * 广告通用
 */
$Import('common.trans.ad');
$Import('ui.dialog');
$Import('kit.extra.merge');
$Import('common.channel.relation');
$Import('common.relation.followPrototype');
$Import('common.dialog.setGroup');
$Import('ui.confirm');

STK.register('comp.ad.jsonpAD', function($){
	var adTrans  = $.common.trans.ad,
		ioFollow = $.common.relation.followPrototype,
		groupDialog = $.common.dialog.setGroup(),
		cookie = $.core.util.cookie;
		
	var cache = {};
	
	!window["ad"] && (window["ad"] = function(sHtml, sTarget){
		$.E(sTarget).innerHTML = sHtml;
	});
	
	return function(node, opts){
		
		if(!node){
			return false;
		}
		
		var that    = {},
			handler = {},
			dEvt    = $.core.evt.delegatedEvent(node);
		
		var options = {
			ioname    : 'weibo_AD_SS',
			extra     : {},
			bind      : []
		}
		options = $.parseParam(options, opts || {});
		
		handler = {
			follow : function(spec){
				var conf = $.kit.extra.merge({
					'onSuccessCb': function(spec){
						groupDialog.show({
							'uid': spec.uid,
							'fnick': spec.fnick,
							'groupList': spec.group,
							'hasRemark': true
						});
					}
				}, spec.data || {});
				
				ioFollow.follow(conf);
			},
			popup_win : {
				create : function(){
					if(!cache.layer){
						var layer = $.ui.dialog();
						//layer.setTitle('AD');
						cache.iframe = $.C('iframe');
						layer.appendChild(cache.iframe);
						
						cache.layer = layer;
					}
					return layer;
				},
				show : function(ob){
					var conf = ob.data;
					var layer = cache.layer || 
						handler.popup_win.create({
							height : conf.height,
							width  : conf.width
						});
					var iframe = cache.iframe;
					
					$.setStyle(iframe, "height", conf.height);
					$.setStyle(iframe, "width", conf.width);
					
					iframe.src = conf.src;
					layer.show().setMiddle();
					return layer;
				}
			},
			bindDevt : function(acts){
				for(var i = 0, len = acts.length; i < len; i++){
					bindDomEvents[acts[i]]();
				}
			},
			load : function(){
				handler.bindDevt(options.bind);
				adTrans.getTrans(options.ioname).request(options.extra || {});
			},
			setContent : function(content){
				node.innerHTML = content;
				handler.bindDevt(options.bind);
			}
		};
		
		
		var bindDomEvents = {
			popup_win    : function(){
				dEvt.add("popup_win", "click", handler.popup_win.show);
			},
			follow       : function(){
				dEvt.add("follow", "click", handler.follow);
			}
		}
		
		var destroy = function(){
			that    = null,
			handler = null,
			dEvt    = null;
		}
		
		that = {
			load : handler.load,
			setContent : handler.setContent,
			destroy : destroy
		}

		handler.load();
		
		return that;
	}
});