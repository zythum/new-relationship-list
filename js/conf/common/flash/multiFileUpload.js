/**
 * @author wangliang3
 */
$import("kit.extra.swfobject");
$Import('common.extra.imageURL');

STK.register("common.flash.multiFileUpload", function($){
	var path = $CONFIG['jsPath'] + 'home/static/swf/',
		upserver = 'http://picupload.service.weibo.com/interface/pic_upload.php?app=miniblog&s=json&data=1';

    return function(pars){
		var conf = {
			id: pars.id,
			service: encodeURIComponent(pars.service||upserver),
//			swf: path+'MultiFileUpload.swf',
//			exp_swf: path+'img/expressInstall.swf',
			swf: path+'MultiFileUpload.swf?version='+$CONFIG['version'],
			exp_swf: path+'img/expressInstall.swf?version='+$CONFIG['version'],
			h: '50px',
			w: '100px',
			version: '10.0.0',
			channel: pars.id + '_channel',
			type: '*.png;*.jpg;*.gif;*.jpeg;'
		};
		var it = {};
		//
		var flashvars = {
			service: conf.service,
			maxFileSize: pars['size']||5242880,
	        maxFileNum: pars['number']||5,
			jsHandler: 'STK.core.util.listener.fire',
			channel: conf.channel,
			initFun: 'init',
			uploadingFun: 'uploading',
			uploadedFun: 'uploaded',
			errorFun: 'error'
	    };
		
		var params = {
			menu: "false",
			scale: "noScale",
			allowFullscreen: "false",
			allowScriptAccess: "always",
			bgcolor: "#FFFFFF",
			//解决ie6、7下点击不能用的问题。
			wmode: "opaque"//window、opaque、transparent
		};
		//
		var swfAct = {
			init: function(data){
				pars.init&&pars.init(it,data);
			},
			uploading: function(data){
				pars.uploading&&pars.uploading(it,data);
			},
			uploaded: function(data){
				pars.uploaded&&pars.uploaded(it,data);
			},
			error: function(data){
				pars.error&&pars.error(it,data);
			}
		};
		
		var handler = {
			init: function(){
				//绑定dom，生成flash
				handler.build();
				//
				handler.bind();
			},
			build: function(){
//				console.log(conf.swf);
//				console.log(conf.id);
//				console.log(conf.w);
//				console.log(conf.h);
//				console.log(conf.version);
//				console.log(conf.exp_swf);
//				console.log(conf.flashvars);
//				console.log(conf.params);
				
				$.kit.extra.swfobject.embedSWF(conf.swf, conf.id, conf.w, conf.h, conf.version, conf.exp_swf, flashvars,params);	
			},
			bind: function(){
				for (var key in swfAct) {
					swfAct[key]&&!handler.checkAction(conf.channel, key)&&STK.core.util.listener.register(conf.channel, key, swfAct[key]);
				}
			},
			checkAction: function(channel,type){
				var list = STK.core.util.listener.list();
				return !!(list[channel]&&list[channel][type]);
			},
			destroy: function(){
				
			}
		};
		//
		handler.init();
		//外抛函数
		it.imgUrl = $.common.extra.imageURL;
		it.destroy = handler.destroy;
        return it;
        
    }
});
